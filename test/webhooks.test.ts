import { createHmac } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { StellarDsError, constructWebhookEvent, verifyWebhookSignature } from '../src/index.js';

// Signatures are computed here with node:crypto's createHmac, independently of the SDK's WebCrypto code.
const secret = 'whsec_test_5b7d4e8a9c217d4e5f6a8b90';
const otherSecret = 'whsec_rotated_0000000000000000000000';
const body = '{"id":"evt_01","type":"record.created","createdAt":"2026-10-29T10:00:00Z","project":"p","table":{"id":7,"name":"Orders"},"actor":{"userId":"u"},"data":{"record":{"id":1,"name":"Zoë €"}}}';
const t = 1_800_000_000;
const now = t * 1000 + 30_000;
const sign = (s: string, ts = t, payload = body) => createHmac('sha256', Buffer.from(s, 'utf8')).update(`${ts}.${payload}`, 'utf8').digest('hex');

describe('verifyWebhookSignature', () => {
  it('matches a fixed vector', async () => {
    // HMAC-SHA256(key = "whsec_abc", message = '1700000000.{"id":"evt_1"}'), precomputed.
    const header = 't=1700000000,v1=79f159714a0d01d9505691104b38e71f0dbb0d4bdeef387b113d07b870f50db3';
    expect(await verifyWebhookSignature({ payload: '{"id":"evt_1"}', header, secret: 'whsec_abc', now: 1_700_000_000_000 })).toBe(true);
  });

  it('accepts a valid signature (string and bytes payload)', async () => {
    const header = `t=${t},v1=${sign(secret)}`;
    expect(await verifyWebhookSignature({ payload: body, header, secret, now })).toBe(true);
    expect(await verifyWebhookSignature({ payload: new TextEncoder().encode(body), header, secret, now })).toBe(true);
    expect(await verifyWebhookSignature({ payload: new TextEncoder().encode(body).buffer as ArrayBuffer, header, secret, now })).toBe(true);
  });

  it('rejects a tampered body or signature', async () => {
    const header = `t=${t},v1=${sign(secret)}`;
    expect(await verifyWebhookSignature({ payload: body.replace('Zoë', 'Zoe'), header, secret, now })).toBe(false);
    const flipped = sign(secret).replace(/^./, (c) => (c === '0' ? '1' : '0'));
    expect(await verifyWebhookSignature({ payload: body, header: `t=${t},v1=${flipped}`, secret, now })).toBe(false);
    expect(await verifyWebhookSignature({ payload: body, header: `t=${t + 1},v1=${sign(secret)}`, secret, now })).toBe(false);
    expect(await verifyWebhookSignature({ payload: body, header, secret: otherSecret, now })).toBe(false);
  });

  it('rejects expired and future timestamps, with a configurable tolerance', async () => {
    const old = t - 301;
    const header = `t=${old},v1=${sign(secret, old)}`;
    expect(await verifyWebhookSignature({ payload: body, header, secret, now: t * 1000 })).toBe(false);
    expect(await verifyWebhookSignature({ payload: body, header, secret, now: t * 1000, toleranceSeconds: 600 })).toBe(true);
    const future = t + 400;
    expect(await verifyWebhookSignature({ payload: body, header: `t=${future},v1=${sign(secret, future)}`, secret, now: t * 1000 })).toBe(false);
  });

  it('accepts any of several v1 signatures during a rotation', async () => {
    const header = `t=${t},v1=${sign(otherSecret)},v1=${sign(secret)}`;
    expect(await verifyWebhookSignature({ payload: body, header, secret, now })).toBe(true);
    expect(await verifyWebhookSignature({ payload: body, header, secret: otherSecret, now })).toBe(true);
    // The receiver can also hold several secrets.
    expect(await verifyWebhookSignature({ payload: body, header: `t=${t},v1=${sign(secret)}`, secret: ['whsec_x', secret], now })).toBe(true);
  });

  it('rejects malformed headers', async () => {
    for (const header of [undefined, null, '', 'garbage', `v1=${sign(secret)}`, `t=${t}`, `t=abc,v1=${sign(secret)}`, `t=${t},v1=zz`, `t=${t},v0=${sign(secret)}`]) {
      expect(await verifyWebhookSignature({ payload: body, header, secret, now })).toBe(false);
    }
    expect(await verifyWebhookSignature({ payload: body, header: `t=${t},v1=${sign(secret)}`, secret: '', now })).toBe(false);
  });

  it('falls back to node:crypto when there is no global crypto (Node 18)', async () => {
    vi.stubGlobal('crypto', undefined);
    try {
      expect(globalThis.crypto).toBeUndefined();
      expect(await verifyWebhookSignature({ payload: body, header: `t=${t},v1=${sign(secret)}`, secret, now })).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('tolerates spaces and uppercase hex', async () => {
    const header = ` t=${t} , v1=${sign(secret).toUpperCase()} `;
    expect(await verifyWebhookSignature({ payload: body, header, secret, now })).toBe(true);
  });
});

describe('constructWebhookEvent', () => {
  it('returns the parsed event when valid', async () => {
    const event = await constructWebhookEvent<{ id: number; name: string }>({ payload: body, header: `t=${t},v1=${sign(secret)}`, secret, now });
    expect(event.type).toBe('record.created');
    expect(event.data.record?.name).toBe('Zoë €');
  });

  it('throws a 401 StellarDsError when invalid', async () => {
    const err = await constructWebhookEvent({ payload: body, header: `t=${t},v1=${'0'.repeat(64)}`, secret, now }).catch((e) => e);
    expect(err).toBeInstanceOf(StellarDsError);
    expect(err.status).toBe(401);
  });
});
