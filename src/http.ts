import { StellarDsError } from './errors.js';
import { serializeJson } from './fieldTypes.js';
import type { ServiceMessage, TokenResponse } from './types.js';

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** Options every call accepts as its last argument. */
export interface RequestOptions {
  /** Cancels the request. The promise then rejects with the signal's reason (an `AbortError`). */
  signal?: AbortSignal;
  /** Overrides the client's `timeoutMs` for this call; 0 disables the timeout. */
  timeoutMs?: number;
}

/** Options of calls that act inside a project. */
export interface ProjectRequestOptions extends RequestOptions {
  /** The project id; defaults to the client's `project` option. */
  project?: string;
}

/** The tokens of an OAuth session, as passed to `onTokens`. */
export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  /** When the access token stops working (the server already keeps 30 seconds of margin). */
  expiresAt: Date;
  tokenType: string;
}

export interface OAuthCredentials {
  clientId: string;
  clientSecret: string;
  /** A refresh token from an earlier sign-in. Leave out when you will call `oauth.exchangeCode` first. */
  refreshToken?: string;
  /** A still valid access token from an earlier session, to skip the first refresh. */
  accessToken?: string;
  /** When `accessToken` expires (Date or epoch milliseconds). Without it the token is used until a 401. */
  expiresAt?: Date | number;
  /** The redirect URI registered on the client; the default for `oauth.authorizeUrl` and `oauth.exchangeCode`. */
  redirectUri?: string;
}

type QueryValue = string | number | boolean | bigint | Date | null | undefined;

export interface HttpRequest extends RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  query?: Record<string, QueryValue>;
  json?: unknown;
  form?: Record<string, string | undefined>;
  formData?: FormData;
  /** `envelope` (default): unwrap `{ data, isSuccess, messages }`. `json`: plain JSON. `blob`: binary. */
  expect?: 'envelope' | 'json' | 'blob';
  /** Send the bearer token (default true). */
  auth?: boolean;
}

export interface HttpResult<T> {
  data: T;
  count: number | undefined;
  messages: ServiceMessage[];
  status: number;
}

interface RawResponse {
  status: number;
  ok: boolean;
  headers: Headers;
  text?: string;
  blob?: Blob;
}

/** Refresh this long before the access token expires. */
const REFRESH_MARGIN_MS = 60_000;

export class TokenManager {
  private accessToken: string | undefined;
  private refreshToken: string | undefined;
  private expiresAt: number | undefined;
  private refreshing: Promise<string> | undefined;

  constructor(
    private readonly http: HttpClient,
    readonly oauth: OAuthCredentials | undefined,
    accessToken: string | undefined,
    private readonly onTokens: ((tokens: TokenSet) => void | Promise<void>) | undefined,
  ) {
    this.accessToken = oauth?.accessToken ?? accessToken;
    this.refreshToken = oauth?.refreshToken;
    const exp = oauth?.expiresAt;
    this.expiresAt = exp === undefined ? undefined : exp instanceof Date ? exp.getTime() : exp;
  }

  get canRefresh(): boolean {
    return !!this.oauth && !!this.refreshToken;
  }

  get current(): { accessToken?: string; refreshToken?: string; expiresAt?: Date } {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresAt: this.expiresAt === undefined ? undefined : new Date(this.expiresAt),
    };
  }

  setAccessToken(token: string | undefined, expiresAt?: Date | number) {
    this.accessToken = token;
    this.expiresAt = expiresAt === undefined ? undefined : expiresAt instanceof Date ? expiresAt.getTime() : expiresAt;
  }

  /** The token to send now, refreshing first when it is missing or about to expire. */
  async get(): Promise<string | undefined> {
    if (this.canRefresh) {
      const expiring = this.expiresAt !== undefined && this.expiresAt - Date.now() < REFRESH_MARGIN_MS;
      if (!this.accessToken || expiring) return this.refresh();
    }
    return this.accessToken;
  }

  /** Called after a 401: refresh once (shared with concurrent callers) unless someone already did. */
  async afterUnauthorized(failedToken: string | undefined): Promise<string | undefined> {
    if (!this.canRefresh) return undefined;
    if (this.refreshing) return this.refreshing;
    if (this.accessToken && this.accessToken !== failedToken) return this.accessToken;
    return this.refresh();
  }

  /** Refreshes now; concurrent callers share one request. */
  refresh(): Promise<string> {
    if (!this.refreshing) {
      this.refreshing = this.doRefresh().finally(() => {
        this.refreshing = undefined;
      });
    }
    return this.refreshing;
  }

  private async doRefresh(): Promise<string> {
    const oauth = this.oauth;
    if (!oauth || !this.refreshToken) {
      throw new StellarDsError('No refresh token available', { kind: 'auth' });
    }
    let response: TokenResponse;
    try {
      response = await requestToken(this.http, {
        grant_type: 'refresh_token',
        client_id: oauth.clientId,
        client_secret: oauth.clientSecret,
        refresh_token: this.refreshToken,
      });
    } catch (e) {
      if (e instanceof StellarDsError && e.kind === 'http') {
        throw new StellarDsError(`Refreshing the access token failed: ${e.message}`, {
          kind: 'auth',
          status: e.status,
          messages: e.messages,
          body: e.body,
          rawBody: e.rawBody,
          cause: e,
        });
      }
      throw e;
    }
    await this.store(response);
    return response.access_token;
  }

  /** Stores tokens from the token endpoint and reports them to `onTokens`. */
  async store(response: TokenResponse): Promise<TokenSet> {
    const tokens = toTokenSet(response);
    this.accessToken = tokens.accessToken;
    if (tokens.refreshToken) this.refreshToken = tokens.refreshToken;
    this.expiresAt = tokens.expiresAt.getTime();
    const merged: TokenSet = { ...tokens, refreshToken: this.refreshToken ?? '' };
    if (this.onTokens) {
      try {
        await this.onTokens(merged);
      } catch {
        // A failing persistence callback must not fail the API call that triggered the refresh.
      }
    }
    return merged;
  }
}

export function toTokenSet(response: TokenResponse): TokenSet {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresAt: new Date(Date.now() + Math.max(0, Number(response.expires_in) || 0) * 1000),
    tokenType: response.token_type || 'Bearer',
  };
}

export async function requestToken(
  http: HttpClient,
  form: Record<string, string | undefined>,
  options?: RequestOptions,
): Promise<TokenResponse> {
  const result = await http.send<TokenResponse>({
    method: 'POST',
    path: '/v1/oauth/token',
    form,
    expect: 'json',
    auth: false,
    signal: options?.signal,
    timeoutMs: options?.timeoutMs,
  });
  const token = result.data;
  if (!token || typeof token !== 'object' || typeof token.access_token !== 'string') {
    throw new StellarDsError('The token endpoint returned no access token', { kind: 'parse', status: result.status, body: token });
  }
  return token;
}

export interface HttpClientOptions {
  baseUrl: string;
  fetch: FetchLike;
  timeoutMs: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  tokens: TokenManager | undefined;

  constructor(private readonly options: HttpClientOptions) {}

  get baseUrl(): string {
    return this.options.baseUrl;
  }

  url(path: string, query?: Record<string, QueryValue>): string {
    let url = this.options.baseUrl + path;
    if (query) {
      const parts: string[] = [];
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        const text = value instanceof Date ? value.toISOString() : String(value);
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(text)}`);
      }
      if (parts.length) url += (url.includes('?') ? '&' : '?') + parts.join('&');
    }
    return url;
  }

  async send<T>(req: HttpRequest): Promise<HttpResult<T>> {
    const useAuth = req.auth !== false;
    let token = useAuth ? await this.tokens?.get() : undefined;
    let raw = await this.fetchOnce(req, token);
    if (raw.status === 401 && useAuth && this.tokens?.canRefresh) {
      const fresh = await this.tokens.afterUnauthorized(token);
      if (fresh) {
        token = fresh;
        raw = await this.fetchOnce(req, token);
      }
    }
    return handleResponse<T>(raw, req.expect ?? 'envelope');
  }

  private async fetchOnce(req: HttpRequest, token: string | undefined): Promise<RawResponse> {
    const headers: Record<string, string> = { Accept: 'application/json', ...this.options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    let body: BodyInit | undefined;
    if (req.formData) {
      body = req.formData;
    } else if (req.form) {
      const parts: string[] = [];
      for (const [k, v] of Object.entries(req.form)) {
        if (v !== undefined) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
      }
      body = parts.join('&');
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (req.json !== undefined) {
      body = serializeJson(req.json);
      headers['Content-Type'] = 'application/json';
    }

    const userSignal = req.signal;
    if (userSignal?.aborted) throw abortReason(userSignal);
    const controller = new AbortController();
    const onAbort = () => controller.abort(userSignal?.reason);
    userSignal?.addEventListener('abort', onAbort, { once: true });
    const timeoutMs = req.timeoutMs ?? this.options.timeoutMs;
    let timedOut = false;
    const timer =
      timeoutMs > 0
        ? setTimeout(() => {
            timedOut = true;
            controller.abort();
          }, timeoutMs)
        : undefined;

    try {
      const response = await this.options.fetch(this.url(req.path, req.query), {
        method: req.method,
        headers,
        body,
        signal: controller.signal,
      });
      const raw: RawResponse = { status: response.status, ok: response.ok, headers: response.headers };
      if (req.expect === 'blob' && response.ok) {
        const buffer = await response.arrayBuffer();
        raw.blob = new Blob([buffer], { type: response.headers.get('content-type') ?? 'application/octet-stream' });
      } else {
        raw.text = await response.text();
      }
      return raw;
    } catch (e) {
      if (timedOut) {
        throw new StellarDsError(`Request timed out after ${timeoutMs} ms: ${req.method} ${req.path}`, { kind: 'timeout', cause: e });
      }
      if (userSignal?.aborted) throw abortReason(userSignal);
      if (e instanceof StellarDsError) throw e;
      throw new StellarDsError(`Network error on ${req.method} ${req.path}: ${(e as Error)?.message ?? String(e)}`, {
        kind: 'network',
        cause: e,
      });
    } finally {
      if (timer !== undefined) clearTimeout(timer);
      userSignal?.removeEventListener('abort', onAbort);
    }
  }
}

function abortReason(signal: AbortSignal): unknown {
  if (signal.reason !== undefined) return signal.reason;
  const error = new Error('This operation was aborted');
  error.name = 'AbortError';
  return error;
}

function handleResponse<T>(raw: RawResponse, expect: 'envelope' | 'json' | 'blob'): HttpResult<T> {
  if (raw.blob) return { data: raw.blob as T, count: undefined, messages: [], status: raw.status };

  const text = raw.text ?? '';
  let parsed: unknown = undefined;
  let isJson = false;
  if (text.trim() !== '') {
    try {
      parsed = JSON.parse(text);
      isJson = true;
    } catch {
      parsed = text;
    }
  }

  if (!raw.ok) {
    const messages = extractMessages(parsed);
    const first = messages.find((m) => m.message)?.message;
    const message = first ?? (typeof parsed === 'string' && parsed.length < 500 ? parsed : `HTTP ${raw.status}`);
    const retryAfterHeader = raw.headers.get('retry-after');
    const retryAfter = retryAfterHeader && !Number.isNaN(Number(retryAfterHeader)) ? Number(retryAfterHeader) : undefined;
    throw new StellarDsError(`StellarDS request failed (${raw.status}): ${message}`, {
      kind: 'http',
      status: raw.status,
      messages,
      body: parsed,
      rawBody: text,
      retryAfter,
    });
  }

  if (text.trim() !== '' && !isJson) {
    throw new StellarDsError(`Expected JSON from StellarDS but got: ${text.slice(0, 200)}`, {
      kind: 'parse',
      status: raw.status,
      body: text,
      rawBody: text,
    });
  }

  if (expect === 'envelope' && isEnvelope(parsed)) {
    const messages = parsed.messages ?? [];
    if (!parsed.isSuccess) {
      const first = messages.find((m) => m.message)?.message ?? 'the server reported a failure';
      throw new StellarDsError(`StellarDS request failed: ${first}`, {
        kind: 'api',
        status: raw.status,
        messages,
        body: parsed,
        rawBody: text,
      });
    }
    return {
      data: parsed.data as T,
      count: typeof parsed.count === 'number' ? parsed.count : undefined,
      messages,
      status: raw.status,
    };
  }
  return { data: parsed as T, count: undefined, messages: [], status: raw.status };
}

function isEnvelope(value: unknown): value is { data?: unknown; isSuccess: boolean; messages?: ServiceMessage[]; count?: unknown } {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && typeof (value as { isSuccess?: unknown }).isSuccess === 'boolean';
}

/** Pulls messages out of the shapes the server uses for errors: envelopes, message arrays, ProblemDetails, strings. */
function extractMessages(body: unknown): ServiceMessage[] {
  if (typeof body === 'string') return body ? [{ message: body, type: 30 }] : [];
  if (Array.isArray(body)) {
    return body
      .filter((m): m is Record<string, unknown> => typeof m === 'object' && m !== null)
      .map((m) => ({ code: (m.code as string) ?? null, message: (m.message as string) ?? null, type: (m.type as ServiceMessage['type']) ?? 30 }));
  }
  if (typeof body === 'object' && body !== null) {
    const o = body as Record<string, unknown>;
    if (Array.isArray(o.messages)) return extractMessages(o.messages);
    if (o.errors && typeof o.errors === 'object') {
      const out: ServiceMessage[] = [];
      for (const [field, list] of Object.entries(o.errors as Record<string, unknown>)) {
        for (const msg of Array.isArray(list) ? list : [list]) out.push({ code: field, message: String(msg), type: 30 });
      }
      if (out.length) return out;
    }
    if (typeof o.title === 'string') return [{ code: null, message: o.title, type: 30 }];
  }
  return [];
}
