import { StellarDsError } from '../errors.js';
import { requestToken, type HttpClient, type OAuthCredentials, type RequestOptions, type TokenManager, type TokenSet } from '../http.js';
import type { TokenResponse } from '../types.js';

export const DEFAULT_AUTHORIZE_URL = 'https://stellards.io/oauth';

export interface AuthorizeUrlOptions {
  /** Defaults to the client's `oauth.clientId`. */
  clientId?: string;
  /** Must match one of the client's registered redirect URLs. Defaults to `oauth.redirectUri`. */
  redirectUri?: string;
  /** An unguessable value you check when the user comes back. */
  state?: string;
}

export interface ExchangeCodeOptions extends RequestOptions {
  code: string;
  redirectUri?: string;
  clientId?: string;
  clientSecret?: string;
}

/**
 * The OAuth 2.0 authorization-code flow. Typical server-side use:
 *
 * ```ts
 * const url = client.oauth.authorizeUrl({ state });          // redirect the user here
 * const tokens = await client.oauth.exchangeCode({ code });   // on your redirect URI
 * ```
 *
 * The token endpoint needs the client secret, so do this on a server, never in a browser.
 */
export class OAuthResource {
  constructor(
    private readonly http: HttpClient,
    private readonly tokens: TokenManager,
    private readonly authorizeBase: string,
  ) {}

  private get creds(): OAuthCredentials | undefined {
    return this.tokens.oauth;
  }

  /** The sign-in URL to send the user to. */
  authorizeUrl(options: AuthorizeUrlOptions = {}): string {
    const clientId = options.clientId ?? this.creds?.clientId;
    const redirectUri = options.redirectUri ?? this.creds?.redirectUri;
    if (!clientId || !redirectUri) {
      throw new StellarDsError('authorizeUrl needs a clientId and a redirectUri', { kind: 'config' });
    }
    const params = [
      ['response_type', 'code'],
      ['client_id', clientId],
      ['redirect_uri', redirectUri],
      ...(options.state === undefined ? [] : [['state', options.state]]),
    ]
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&');
    return `${this.authorizeBase}${this.authorizeBase.includes('?') ? '&' : '?'}${params}`;
  }

  /**
   * Exchanges the `code` from the redirect for tokens. When the client was created with `oauth` credentials, the
   * tokens are also stored on it (and passed to `onTokens`), so it is signed in afterwards.
   */
  async exchangeCode(options: ExchangeCodeOptions): Promise<TokenSet> {
    const clientId = options.clientId ?? this.creds?.clientId;
    const clientSecret = options.clientSecret ?? this.creds?.clientSecret;
    const redirectUri = options.redirectUri ?? this.creds?.redirectUri;
    if (!clientId || !clientSecret || !redirectUri) {
      throw new StellarDsError('exchangeCode needs clientId, clientSecret and redirectUri', { kind: 'config' });
    }
    const response = await requestToken(this.http, {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: options.code,
    }, options);
    return this.adopt(response, clientId);
  }

  /**
   * Gets a new access token now. Without arguments it refreshes the client's own session; with a refresh token it
   * refreshes that one and, when it belongs to the client's OAuth app, stores the result on the client.
   */
  async refresh(refreshToken?: string): Promise<TokenSet> {
    if (refreshToken === undefined) {
      await this.tokens.refresh();
      const cur = this.tokens.current;
      return {
        accessToken: cur.accessToken ?? '',
        refreshToken: cur.refreshToken ?? '',
        expiresAt: cur.expiresAt ?? new Date(),
        tokenType: 'Bearer',
      };
    }
    const creds = this.creds;
    if (!creds) throw new StellarDsError('refresh needs the client to be created with oauth credentials', { kind: 'config' });
    const response = await requestToken(this.http, {
      grant_type: 'refresh_token',
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: refreshToken,
    });
    return this.adopt(response, creds.clientId);
  }

  /** Revokes a refresh token (by default the client's own), signing that session out. */
  async revoke(refreshToken?: string, options?: RequestOptions): Promise<void> {
    const creds = this.creds;
    const token = refreshToken ?? this.tokens.current.refreshToken;
    if (!creds || !token) throw new StellarDsError('revoke needs oauth credentials and a refresh token', { kind: 'config' });
    await this.http.send({
      method: 'POST',
      path: '/v1/oauth/revoke',
      json: { refresh_token: token, client_id: creds.clientId, client_secret: creds.clientSecret },
      expect: 'json',
      auth: false,
      signal: options?.signal,
      timeoutMs: options?.timeoutMs,
    });
  }

  private async adopt(response: TokenResponse, clientId: string): Promise<TokenSet> {
    if (this.creds && this.creds.clientId === clientId) return this.tokens.store(response);
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt: new Date(Date.now() + response.expires_in * 1000),
      tokenType: response.token_type || 'Bearer',
    };
  }
}
