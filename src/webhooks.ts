import { StellarDsError } from './errors.js';
import type { RecordData, WebhookEvent } from './types.js';

/** The header carrying the signature: `t=<unix seconds>,v1=<hex>[,v1=<hex>...]`. */
export const SIGNATURE_HEADER = 'StellarDS-Signature';
/** The header carrying the event id. Deliveries can repeat: deduplicate on it. */
export const EVENT_ID_HEADER = 'StellarDS-Event-Id';
/** Deliveries whose timestamp is further than this from now are refused (possible replays). */
export const DEFAULT_TOLERANCE_SECONDS = 300;

export interface VerifyWebhookOptions {
  /** The raw request body exactly as received: a string, or the bytes (do not parse and re-serialize it). */
  payload: string | Uint8Array | ArrayBuffer;
  /** The value of the StellarDS-Signature header. */
  header: string | null | undefined;
  /** The webhook secret (`whsec_...`), or several (for example the old and new one around a rotation). */
  secret: string | readonly string[];
  /** Maximum age of the timestamp in seconds (default 300). */
  toleranceSeconds?: number;
  /** The current time, for tests. */
  now?: Date | number;
}

const encoder = new TextEncoder();

interface SubtleLike {
  importKey(format: 'raw', key: BufferSource, algorithm: HmacImportParams, extractable: boolean, usages: KeyUsage[]): Promise<CryptoKey>;
  sign(algorithm: 'HMAC', key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
}

let subtlePromise: Promise<SubtleLike> | undefined;

/** WebCrypto: the global one in browsers, edge runtimes and Node 19+; node:crypto's on Node 18. */
function getSubtle(): Promise<SubtleLike> {
  const subtle = (globalThis as { crypto?: { subtle?: SubtleLike } }).crypto?.subtle;
  if (subtle) return Promise.resolve(subtle);
  if (!subtlePromise) {
    // A computed specifier keeps bundlers from trying to resolve this in browser builds.
    const specifier = ['node', 'crypto'].join(':');
    subtlePromise = (import(/* @vite-ignore */ /* webpackIgnore: true */ specifier) as Promise<{ webcrypto?: { subtle?: SubtleLike } }>)
      .then((m) => {
        if (!m.webcrypto?.subtle) throw new Error('no webcrypto');
        return m.webcrypto.subtle;
      })
      .catch((e) => {
        subtlePromise = undefined;
        throw new StellarDsError('WebCrypto (crypto.subtle) is not available in this runtime', { kind: 'config', cause: e });
      });
  }
  return subtlePromise;
}

function parseHeader(header: string): { timestamp: number | undefined; signatures: Uint8Array[] } {
  let timestamp: number | undefined;
  const signatures: Uint8Array[] = [];
  for (const rawPart of header.split(',')) {
    const part = rawPart.trim();
    const eq = part.indexOf('=');
    if (eq <= 0) continue;
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1);
    if (key === 't' && /^\d+$/.test(value)) {
      timestamp = Number(value);
    } else if (key === 'v1' && /^[0-9a-fA-F]{64}$/.test(value)) {
      const bytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) bytes[i] = parseInt(value.slice(i * 2, i * 2 + 2), 16);
      signatures.push(bytes);
    }
  }
  return { timestamp, signatures };
}

/** Compares two byte arrays in time that depends only on their length. */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= (a[i] as number) ^ (b[i] as number);
  return diff === 0;
}

function payloadBytes(payload: string | Uint8Array | ArrayBuffer): Uint8Array {
  if (typeof payload === 'string') return encoder.encode(payload);
  return payload instanceof Uint8Array ? payload : new Uint8Array(payload);
}

/**
 * Checks that a webhook delivery really comes from StellarDS: the timestamp is recent and one of the `v1`
 * signatures is the HMAC-SHA256 of `"<t>.<raw body>"` keyed with one of the secrets. Works in Node 18+, browsers,
 * Deno, Bun and edge runtimes (WebCrypto), so it is async.
 *
 * ```ts
 * const ok = await verifyWebhookSignature({ payload: rawBody, header: req.headers['stellards-signature'], secret });
 * ```
 */
export async function verifyWebhookSignature(options: VerifyWebhookOptions): Promise<boolean> {
  const { header } = options;
  const secrets = (typeof options.secret === 'string' ? [options.secret] : [...options.secret]).filter((s) => !!s);
  if (!header || secrets.length === 0) return false;

  const { timestamp, signatures } = parseHeader(header);
  if (timestamp === undefined || signatures.length === 0) return false;

  const nowMs = options.now === undefined ? Date.now() : typeof options.now === 'number' ? options.now : options.now.getTime();
  const tolerance = options.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
  if (Math.abs(nowMs / 1000 - timestamp) > tolerance) return false;

  const body = payloadBytes(options.payload);
  const prefix = encoder.encode(`${timestamp}.`);
  const signed = new Uint8Array(prefix.length + body.length);
  signed.set(prefix, 0);
  signed.set(body, prefix.length);

  const subtle = await getSubtle();
  let matched = false;
  for (const secret of secrets) {
    const key = await subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const expected = new Uint8Array(await subtle.sign('HMAC', key, signed));
    // Check every signature without stopping early.
    for (const signature of signatures) matched = constantTimeEqual(signature, expected) || matched;
  }
  return matched;
}

/**
 * Verifies a delivery and parses its body. Throws a `StellarDsError` (kind `auth`, status 401) when the signature
 * does not check out.
 */
export async function constructWebhookEvent<TRecord = RecordData>(options: VerifyWebhookOptions): Promise<WebhookEvent<TRecord>> {
  if (!(await verifyWebhookSignature(options))) {
    throw new StellarDsError('Invalid webhook signature', { kind: 'auth', status: 401 });
  }
  const text = typeof options.payload === 'string' ? options.payload : new TextDecoder().decode(payloadBytes(options.payload));
  try {
    return JSON.parse(text) as WebhookEvent<TRecord>;
  } catch (e) {
    throw new StellarDsError('The webhook body is not JSON', { kind: 'parse', rawBody: text, cause: e });
  }
}
