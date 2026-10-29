import type { ServiceMessage } from './types.js';

/**
 * What went wrong:
 * - `http`: the server answered with a non-2xx status.
 * - `api`: the server answered 2xx but the envelope said `isSuccess: false`.
 * - `network`: the request never got an answer (DNS, connection refused, CORS, ...).
 * - `timeout`: the request took longer than `timeoutMs`.
 * - `auth`: no usable credentials (no token configured, or the OAuth refresh failed).
 * - `config`: the SDK was called incorrectly (for example no project id).
 * - `parse`: a 2xx response body could not be read as JSON.
 */
export type StellarDsErrorKind = 'http' | 'api' | 'network' | 'timeout' | 'auth' | 'config' | 'parse';

export interface StellarDsErrorInit {
  kind: StellarDsErrorKind;
  status?: number;
  messages?: ServiceMessage[];
  body?: unknown;
  rawBody?: string;
  retryAfter?: number;
  cause?: unknown;
}

/** Thrown by every SDK call that fails. Never logged by the SDK itself. */
export class StellarDsError extends Error {
  override readonly name = 'StellarDsError';
  readonly kind: StellarDsErrorKind;
  /** The HTTP status, or 0 when there was no response. */
  readonly status: number;
  /** The `messages` of the StellarDS envelope, when there was one. */
  readonly messages: ServiceMessage[];
  /** The parsed response body (JSON value, or the text when it was not JSON). */
  readonly body: unknown;
  /** The response body exactly as received. */
  readonly rawBody: string | undefined;
  /** Seconds to wait before retrying, from the Retry-After header of a 429. */
  readonly retryAfter: number | undefined;

  constructor(message: string, init: StellarDsErrorInit) {
    super(message, init.cause === undefined ? undefined : { cause: init.cause });
    this.kind = init.kind;
    this.status = init.status ?? 0;
    this.messages = init.messages ?? [];
    this.body = init.body;
    this.rawBody = init.rawBody;
    this.retryAfter = init.retryAfter;
  }

  /** The first message code from the server, if any (for example `"NotFound"`). */
  get code(): string | undefined {
    return this.messages.find((m) => m.code)?.code ?? undefined;
  }
}

export function isStellarDsError(value: unknown): value is StellarDsError {
  return value instanceof StellarDsError;
}
