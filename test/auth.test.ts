import { describe, expect, it, vi } from 'vitest';
import { StellarDS, StellarDsError, type TokenSet } from '../src/index.js';
import { json, mockFetch, ok, type Call } from './helpers.js';

const tokenResponse = (n: number, expiresIn = 3600) =>
  json({ access_token: `access-${n}`, refresh_token: `refresh-${n}`, expires_in: expiresIn, token_type: 'Bearer' });

const isTokenCall = (c: Call) => c.url.pathname === '/v1/oauth/token';

function oauthClient(fetch: (input: string, init?: RequestInit) => Promise<Response>, extra: Record<string, unknown> = {}) {
  const seen: TokenSet[] = [];
  const client = new StellarDS({
    baseUrl: 'https://api.test',
    project: 'p1',
    fetch,
    oauth: { clientId: 'cid', clientSecret: 'sec ret', refreshToken: 'refresh-0', redirectUri: 'https://app.test/cb?x=1', ...extra },
    onTokens: (t) => {
      seen.push(t);
    },
  });
  return { client, seen };
}

describe('OAuth refresh', () => {
  it('refreshes before the first call when there is no access token, form-encoded', async () => {
    const m = mockFetch((c) => (isTokenCall(c) ? tokenResponse(1) : ok([])));
    const { client, seen } = oauthClient(m.fetch);
    await client.tables.list();
    expect(m.calls).toHaveLength(2);
    const tokenCall = m.calls[0]!;
    expect(tokenCall.method).toBe('POST');
    expect(tokenCall.headers['content-type']).toBe('application/x-www-form-urlencoded');
    expect(tokenCall.headers.authorization).toBeUndefined();
    const form = new URLSearchParams(tokenCall.rawBody as string);
    expect(form.get('grant_type')).toBe('refresh_token');
    expect(form.get('client_id')).toBe('cid');
    expect(form.get('client_secret')).toBe('sec ret');
    expect(form.get('refresh_token')).toBe('refresh-0');
    expect(m.calls[1]!.headers.authorization).toBe('Bearer access-1');
    expect(seen).toHaveLength(1);
    expect(seen[0]!.accessToken).toBe('access-1');
    expect(seen[0]!.refreshToken).toBe('refresh-1');
    expect(seen[0]!.expiresAt.getTime()).toBeGreaterThan(Date.now() + 3500_000);
  });

  it('uses a given access token until it is about to expire', async () => {
    const m = mockFetch((c) => (isTokenCall(c) ? tokenResponse(1) : ok([])));
    const { client } = oauthClient(m.fetch, { accessToken: 'old', expiresAt: Date.now() + 10 * 60_000 });
    await client.tables.list();
    expect(m.calls).toHaveLength(1);
    expect(m.calls[0]!.headers.authorization).toBe('Bearer old');

    const m2 = mockFetch((c) => (isTokenCall(c) ? tokenResponse(2) : ok([])));
    const { client: c2 } = oauthClient(m2.fetch, { accessToken: 'old', expiresAt: Date.now() + 30_000 });
    await c2.tables.list();
    expect(m2.calls.map((c) => c.url.pathname)).toEqual(['/v1/oauth/token', '/v1/schema/table']);
    expect(m2.calls[1]!.headers.authorization).toBe('Bearer access-2');
  });

  it('refreshes once on a 401 and retries the request once', async () => {
    const m = mockFetch((c) => {
      if (isTokenCall(c)) return tokenResponse(1);
      return c.headers.authorization === 'Bearer stale' ? new Response('', { status: 401 }) : ok([{ id: 1 }]);
    });
    const { client } = oauthClient(m.fetch, { accessToken: 'stale' });
    expect(await client.tables.list()).toEqual([{ id: 1 }]);
    expect(m.calls.map((c) => c.headers.authorization ?? 'token')).toEqual(['Bearer stale', 'token', 'Bearer access-1']);
  });

  it('does not loop when the retried request is still 401', async () => {
    const m = mockFetch((c) => (isTokenCall(c) ? tokenResponse(1) : new Response('', { status: 401 })));
    const { client } = oauthClient(m.fetch, { accessToken: 'stale' });
    const err = await client.tables.list().catch((e) => e);
    expect(err.status).toBe(401);
    expect(m.calls).toHaveLength(3);
  });

  it('shares one refresh between concurrent requests', async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const m = mockFetch(async (c) => {
      if (isTokenCall(c)) {
        await gate;
        return tokenResponse(1);
      }
      return ok([]);
    });
    const { client, seen } = oauthClient(m.fetch);
    const all = Promise.all([client.tables.list(), client.records.query(1), client.webhooks.list()]);
    await new Promise((r) => setTimeout(r, 5));
    release();
    await all;
    expect(m.calls.filter(isTokenCall)).toHaveLength(1);
    expect(seen).toHaveLength(1);
    expect(m.calls.filter((c) => !isTokenCall(c)).every((c) => c.headers.authorization === 'Bearer access-1')).toBe(true);
  });

  it('shares one refresh when concurrent requests all get 401', async () => {
    const m = mockFetch(async (c) => {
      if (isTokenCall(c)) {
        await new Promise((r) => setTimeout(r, 5));
        return tokenResponse(1);
      }
      return c.headers.authorization === 'Bearer stale' ? new Response('', { status: 401 }) : ok([]);
    });
    const { client } = oauthClient(m.fetch, { accessToken: 'stale' });
    await Promise.all([client.tables.list(), client.tables.list(), client.tables.list()]);
    expect(m.calls.filter(isTokenCall)).toHaveLength(1);
  });

  it('turns a failed refresh into an auth error', async () => {
    const m = mockFetch(() => json('Invalid refresh token, you have been logged out of the service!', 400));
    const { client } = oauthClient(m.fetch);
    const err = await client.tables.list().catch((e) => e);
    expect(err).toBeInstanceOf(StellarDsError);
    expect(err.kind).toBe('auth');
    expect(err.status).toBe(400);
    expect(err.message).toContain('logged out');
  });

  it('a throwing onTokens does not fail the request', async () => {
    const m = mockFetch((c) => (isTokenCall(c) ? tokenResponse(1) : ok([])));
    const client = new StellarDS({
      baseUrl: 'https://api.test',
      project: 'p1',
      fetch: m.fetch,
      oauth: { clientId: 'cid', clientSecret: 's', refreshToken: 'r' },
      onTokens: () => {
        throw new Error('disk full');
      },
    });
    await expect(client.tables.list()).resolves.toEqual([]);
  });

  it('a static token gets no refresh on 401', async () => {
    const m = mockFetch(() => new Response('', { status: 401 }));
    const client = new StellarDS({ accessToken: 't', project: 'p', fetch: m.fetch });
    const err = await client.tables.list().catch((e) => e);
    expect(err.status).toBe(401);
    expect(m.calls).toHaveLength(1);
  });
});

describe('authorization-code helpers', () => {
  it('builds the authorize URL with encoded redirect_uri and state', () => {
    const { client } = oauthClient(mockFetch(() => ok(null)).fetch);
    const url = new URL(client.oauth.authorizeUrl({ state: 'a b&c' }));
    expect(url.origin + url.pathname).toBe('https://stellards.io/oauth');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('client_id')).toBe('cid');
    expect(url.searchParams.get('redirect_uri')).toBe('https://app.test/cb?x=1');
    expect(url.searchParams.get('state')).toBe('a b&c');
    expect(client.oauth.authorizeUrl()).toContain('redirect_uri=https%3A%2F%2Fapp.test%2Fcb%3Fx%3D1');
  });

  it('honours a custom authorize URL', () => {
    const c = new StellarDS({ fetch: async () => ok(null), authorizeUrl: 'https://auth.test/oauth' });
    expect(c.oauth.authorizeUrl({ clientId: 'x', redirectUri: 'https://r' })).toMatch(/^https:\/\/auth\.test\/oauth\?response_type=code/);
  });

  it('exchanges a code and signs the client in', async () => {
    const m = mockFetch((c) => (isTokenCall(c) ? tokenResponse(7) : ok({ username: 'u', email: 'e' })));
    const { client, seen } = oauthClient(m.fetch, { refreshToken: undefined });
    const tokens = await client.oauth.exchangeCode({ code: 'the-code' });
    expect(tokens.accessToken).toBe('access-7');
    const form = new URLSearchParams(m.calls[0]!.rawBody as string);
    expect(Object.fromEntries(form)).toEqual({
      grant_type: 'authorization_code',
      client_id: 'cid',
      client_secret: 'sec ret',
      redirect_uri: 'https://app.test/cb?x=1',
      code: 'the-code',
    });
    expect(seen).toHaveLength(1);
    await client.users.me();
    expect(m.calls[1]!.headers.authorization).toBe('Bearer access-7');
    expect(client.getTokens().refreshToken).toBe('refresh-7');
  });

  it('revokes the refresh token with a JSON body', async () => {
    const m = mockFetch(() => new Response('', { status: 200 }));
    const { client } = oauthClient(m.fetch);
    await client.oauth.revoke();
    expect(m.calls[0]!.url.pathname).toBe('/v1/oauth/revoke');
    expect(m.calls[0]!.body).toEqual({ refresh_token: 'refresh-0', client_id: 'cid', client_secret: 'sec ret' });
  });

  it('setAccessToken replaces the token', async () => {
    const m = mockFetch(() => ok([]));
    const c = new StellarDS({ accessToken: 'a', project: 'p', fetch: m.fetch });
    c.setAccessToken('b');
    await c.tables.list();
    expect(m.calls[0]!.headers.authorization).toBe('Bearer b');
  });

  it('refresh() refreshes on demand', async () => {
    vi.useRealTimers();
    const m = mockFetch(() => tokenResponse(3));
    const { client } = oauthClient(m.fetch, { accessToken: 'x' });
    const t = await client.oauth.refresh();
    expect(t.accessToken).toBe('access-3');
  });
});
