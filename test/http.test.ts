import { describe, expect, it, vi } from 'vitest';
import { StellarDS, StellarDsError } from '../src/index.js';
import { client, json, mockFetch, ok, type Call } from './helpers.js';

describe('envelope and errors', () => {
  it('unwraps data and sends the bearer token', async () => {
    const m = mockFetch(() => ok([{ id: 1, name: 'Orders', isMultitenant: false }]));
    const tables = await client(m.fetch).tables.list();
    expect(tables).toEqual([{ id: 1, name: 'Orders', isMultitenant: false }]);
    expect(m.calls[0]!.headers.authorization).toBe('Bearer tok');
    expect(m.calls[0]!.url.href).toBe('https://api.test/v1/schema/table?project=p1');
  });

  it('throws StellarDsError with status, messages and body on non-2xx', async () => {
    const body = { isSuccess: false, messages: [{ code: 'NotFound', message: 'Table: 9', type: 30 }] };
    const m = mockFetch(() => json(body, 404));
    const err = await client(m.fetch).tables.get(9).catch((e) => e);
    expect(err).toBeInstanceOf(StellarDsError);
    expect(err.kind).toBe('http');
    expect(err.status).toBe(404);
    expect(err.code).toBe('NotFound');
    expect(err.messages[0].message).toBe('Table: 9');
    expect(err.body).toEqual(body);
    expect(err.rawBody).toBe(JSON.stringify(body));
  });

  it('throws on isSuccess=false even with status 200', async () => {
    const m = mockFetch(() => json({ isSuccess: false, messages: [{ message: 'You can only undo the last transaction', type: 30 }] }));
    const err = await client(m.fetch).audit.rollback('t1').catch((e) => e);
    expect(err.kind).toBe('api');
    expect(err.status).toBe(200);
    expect(err.message).toContain('only undo the last');
  });

  it('handles non-JSON error pages and plain string errors', async () => {
    const m = mockFetch(
      () => new Response('<html>Bad gateway</html>', { status: 502, headers: { 'content-type': 'text/html' } }),
      () => json('Client Id not found', 400),
    );
    const c = client(m.fetch);
    const e1 = await c.tables.list().catch((e) => e);
    expect(e1.status).toBe(502);
    expect(e1.rawBody).toContain('Bad gateway');
    const e2 = await c.tables.list().catch((e) => e);
    expect(e2.messages[0].message).toBe('Client Id not found');
  });

  it('reads ProblemDetails validation errors', async () => {
    const m = mockFetch(() =>
      json({ title: 'One or more validation errors occurred.', errors: { Name: ['The Name field is required.'] } }, 400),
    );
    const err = await client(m.fetch).tables.create({ name: '', isMultitenant: false }).catch((e) => e);
    expect(err.messages).toEqual([{ code: 'Name', message: 'The Name field is required.', type: 30 }]);
  });

  it('handles empty bodies (204 and empty 200)', async () => {
    const m = mockFetch(
      () => new Response(null, { status: 204 }),
      () => new Response('', { status: 200 }),
    );
    const c = client(m.fetch);
    await expect(c.tables.delete(1)).resolves.toBeUndefined();
    await expect(c.records.clear(1)).resolves.toBeUndefined();
  });

  it('throws a parse error when a 2xx body is not JSON', async () => {
    const m = mockFetch(() => new Response('<html>maintenance</html>', { status: 200 }));
    const err = await client(m.fetch).tables.list().catch((e) => e);
    expect(err.kind).toBe('parse');
  });

  it('reports Retry-After on 429', async () => {
    const m = mockFetch(
      () => new Response('Too many requests. Please try again later.', { status: 429, headers: { 'retry-after': '12' } }),
    );
    const err = await client(m.fetch).tables.list().catch((e) => e);
    expect(err.status).toBe(429);
    expect(err.retryAfter).toBe(12);
    expect(err.message).toContain('Too many requests');
  });

  it('wraps network failures', async () => {
    const err = await client(async () => {
      throw new TypeError('fetch failed');
    })
      .tables.list()
      .catch((e) => e);
    expect(err).toBeInstanceOf(StellarDsError);
    expect(err.kind).toBe('network');
    expect(err.status).toBe(0);
  });

  it('throws a config error when no project is known', async () => {
    const m = mockFetch(() => ok([]));
    const c = new StellarDS({ accessToken: 't', fetch: m.fetch });
    const err = await c.tables.list().catch((e) => e);
    expect(err.kind).toBe('config');
    expect(m.calls).toHaveLength(0);
    await c.tables.list({ project: 'other' });
    expect(m.calls[0]!.url.searchParams.get('project')).toBe('other');
  });

  it('withProject shares the connection', async () => {
    const m = mockFetch(() => ok([]));
    await client(m.fetch).withProject('p2').tables.list();
    expect(m.calls[0]!.url.searchParams.get('project')).toBe('p2');
    expect(m.calls[0]!.headers.authorization).toBe('Bearer tok');
  });

  it('ping needs no token and returns pong', async () => {
    const m = mockFetch(() => json('pong'));
    expect(await client(m.fetch).ping()).toBe('pong');
    expect(m.calls[0]!.headers.authorization).toBeUndefined();
  });

  it('strips a trailing slash from baseUrl and sends custom headers', async () => {
    const m = mockFetch(() => ok([]));
    await client(m.fetch, { baseUrl: 'https://x.test/', headers: { 'X-App': 'demo' } }).projects.list();
    expect(m.calls[0]!.url.href).toBe('https://x.test/v1/schema/project');
    expect(m.calls[0]!.headers['x-app']).toBe('demo');
  });
});

describe('timeouts and cancellation', () => {
  const hanging = (call: Call) =>
    new Promise<Response>((_, reject) => {
      call.signal?.addEventListener('abort', () => reject(call.signal?.reason ?? new Error('aborted')));
    });

  it('times out with kind=timeout', async () => {
    const m = mockFetch(hanging);
    const err = await client(m.fetch, { timeoutMs: 20 }).tables.list().catch((e) => e);
    expect(err).toBeInstanceOf(StellarDsError);
    expect(err.kind).toBe('timeout');
  });

  it('per-call timeout overrides the client one', async () => {
    const m = mockFetch(hanging);
    const err = await client(m.fetch, { timeoutMs: 60_000 }).tables.list({ timeoutMs: 10 }).catch((e) => e);
    expect(err.kind).toBe('timeout');
  });

  it('rejects with the abort reason when the signal aborts', async () => {
    const m = mockFetch(hanging);
    const controller = new AbortController();
    const promise = client(m.fetch).records.query(1, {}, { signal: controller.signal });
    await Promise.resolve();
    controller.abort();
    const err = await promise.catch((e) => e);
    expect(err).not.toBeInstanceOf(StellarDsError);
    expect(err.name).toBe('AbortError');
  });

  it('does not call fetch when the signal is already aborted', async () => {
    const m = mockFetch(() => ok([]));
    const err = await client(m.fetch).tables.list({ signal: AbortSignal.abort() }).catch((e) => e);
    expect(err.name).toBe('AbortError');
    expect(m.calls).toHaveLength(0);
  });

  it('clears the timer after success', async () => {
    vi.useFakeTimers();
    try {
      const m = mockFetch(() => ok([]));
      await client(m.fetch).tables.list();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
