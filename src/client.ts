import { StellarDsError } from './errors.js';
import { HttpClient, TokenManager, type FetchLike, type OAuthCredentials, type RequestOptions, type TokenSet } from './http.js';
import type { ClientContext } from './resources/base.js';
import { ProceduresResource, QueryResource, RecordsResource } from './resources/data.js';
import {
  ApplicationsResource,
  AuditResource,
  PermissionsResource,
  RelationsResource,
  RolesResource,
  UsersResource,
  WebhooksResource,
} from './resources/management.js';
import { DEFAULT_AUTHORIZE_URL, OAuthResource } from './resources/oauth.js';
import { ProjectsResource, ProjectTiersResource } from './resources/projects.js';
import { FieldsResource, TablesResource } from './resources/schema.js';

export const DEFAULT_BASE_URL = 'https://api.stellards.io';
export const DEFAULT_TIMEOUT_MS = 30_000;

export interface StellarDSOptions {
  /** API base URL (default `https://api.stellards.io`). */
  baseUrl?: string;
  /** A static access token (from Applications > Access tokens, or obtained elsewhere). */
  accessToken?: string;
  /** OAuth client credentials; the SDK refreshes the access token before it expires and once after a 401. */
  oauth?: OAuthCredentials;
  /** Called whenever the OAuth tokens change, so you can persist them. The SDK never stores tokens itself. */
  onTokens?: (tokens: TokenSet) => void | Promise<void>;
  /** The default project id for project-scoped calls. Each call can override it with `{ project }`. */
  project?: string;
  /** A fetch implementation (default: the global `fetch`). */
  fetch?: FetchLike;
  /** Per-request timeout in milliseconds (default 30000; 0 disables). */
  timeoutMs?: number;
  /** The OAuth sign-in page (default `https://stellards.io/oauth`). */
  authorizeUrl?: string;
  /** Extra headers sent with every request. */
  headers?: Record<string, string>;
}

/**
 * The StellarDS API client.
 *
 * ```ts
 * const client = new StellarDS({ accessToken: process.env.STELLARDS_TOKEN, project: process.env.STELLARDS_PROJECT });
 * const tables = await client.tables.list();
 * const { data, count } = await client.records.query<Order>(tables[0].id, { where: where('total', '>', 100), take: 50 });
 * ```
 */
export class StellarDS {
  readonly projects: ProjectsResource;
  readonly tables: TablesResource;
  readonly fields: FieldsResource;
  readonly records: RecordsResource;
  readonly query: QueryResource;
  readonly procedures: ProceduresResource;
  readonly relations: RelationsResource;
  readonly roles: RolesResource;
  readonly permissions: PermissionsResource;
  readonly audit: AuditResource;
  readonly webhooks: WebhooksResource;
  readonly users: UsersResource;
  readonly applications: ApplicationsResource;
  readonly projectTiers: ProjectTiersResource;
  readonly oauth: OAuthResource;

  /** The default project id, if one was configured. */
  readonly project: string | undefined;

  private readonly http: HttpClient;
  private readonly tokens: TokenManager;

  constructor(options: StellarDSOptions = {}, shared?: { http: HttpClient; tokens: TokenManager; authorizeUrl: string }) {
    if (shared) {
      this.http = shared.http;
      this.tokens = shared.tokens;
    } else {
      const fetchImpl = options.fetch ?? (typeof fetch === 'function' ? fetch.bind(globalThis) : undefined);
      if (!fetchImpl) {
        throw new StellarDsError('No fetch implementation: use Node 18+ or pass { fetch } in the options', { kind: 'config' });
      }
      if (options.oauth && (!options.oauth.clientId || !options.oauth.clientSecret)) {
        throw new StellarDsError('oauth needs clientId and clientSecret', { kind: 'config' });
      }
      this.http = new HttpClient({
        baseUrl: (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, ''),
        fetch: fetchImpl,
        timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        headers: options.headers,
      });
      this.tokens = new TokenManager(this.http, options.oauth, options.accessToken, options.onTokens);
      this.http.tokens = this.tokens;
    }
    this.project = options.project;
    const authorizeUrl = shared?.authorizeUrl ?? options.authorizeUrl ?? DEFAULT_AUTHORIZE_URL;
    const ctx: ClientContext = { http: this.http, defaultProject: options.project };
    this.projects = new ProjectsResource(ctx);
    this.tables = new TablesResource(ctx);
    this.fields = new FieldsResource(ctx);
    this.records = new RecordsResource(ctx);
    this.query = new QueryResource(ctx);
    this.procedures = new ProceduresResource(ctx);
    this.relations = new RelationsResource(ctx);
    this.roles = new RolesResource(ctx);
    this.permissions = new PermissionsResource(ctx);
    this.audit = new AuditResource(ctx);
    this.webhooks = new WebhooksResource(ctx);
    this.users = new UsersResource(ctx);
    this.applications = new ApplicationsResource(ctx);
    this.projectTiers = new ProjectTiersResource(ctx);
    this.oauth = new OAuthResource(this.http, this.tokens, authorizeUrl);
    this.authorizeUrl = authorizeUrl;
  }

  private readonly authorizeUrl: string;

  /** A client for another project that shares this one's connection and tokens. */
  withProject(project: string): StellarDS {
    return new StellarDS({ project }, { http: this.http, tokens: this.tokens, authorizeUrl: this.authorizeUrl });
  }

  /** Replaces the access token (for example one your app obtained elsewhere). */
  setAccessToken(accessToken: string | undefined, expiresAt?: Date | number): void {
    this.tokens.setAccessToken(accessToken, expiresAt);
  }

  /** The current tokens (for OAuth sessions, after any refresh). */
  getTokens(): { accessToken?: string; refreshToken?: string; expiresAt?: Date } {
    return this.tokens.current;
  }

  /** Checks that the API is reachable; resolves to `"pong"`. Needs no token. */
  async ping(options?: RequestOptions): Promise<string> {
    const result = await this.http.send<string>({
      method: 'GET',
      path: '/v1/ping',
      auth: false,
      expect: 'json',
      signal: options?.signal,
      timeoutMs: options?.timeoutMs,
    });
    return result.data;
  }
}
