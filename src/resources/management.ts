import type { ProjectRequestOptions, RequestOptions } from '../http.js';
import type {
  AccessToken,
  AccessTokenRequest,
  Account,
  AuditPage,
  ClientRequest,
  CreatedAccessToken,
  DuplicateRoleRequest,
  InvitationRequest,
  OAuthClient,
  PermissionInfo,
  Permissions,
  Relation,
  RelationCheck,
  RelationRequest,
  RelationUpdateRequest,
  Role,
  RoleMatrix,
  RoleMatrixRequest,
  RoleRequest,
  RoleTablePermissions,
  SimpleRole,
  TablePermissions,
  TablePosition,
  TableRolePermissions,
  TokenResponse,
  TopLevelRolePermissions,
  UpdateAccessTokenRequest,
  UpdateClientRequest,
  UpdatedAccessToken,
  UserAccessRequest,
  Webhook,
  WebhookDelivery,
  WebhookRequest,
  WebhookWithSecret,
} from '../types.js';
import { Resource } from './base.js';

// ---------------------------------------------------------------- relations

const REL = '/v1/schema/relation';

export class RelationsResource extends Resource {
  /** The project's relations, optionally only those from or to one table. */
  list(options?: ProjectRequestOptions & { tableId?: number }): Promise<Relation[]> {
    return this.inProject({ method: 'GET', path: REL, query: { tableId: options?.tableId } }, options);
  }

  /** What linking `field` of `table` to `toTable` would involve, without changing anything. */
  check(table: number, field: number, toTable: number, options?: ProjectRequestOptions): Promise<RelationCheck> {
    return this.inProject({ method: 'GET', path: `${REL}/check`, query: { table, field, toTable } }, options);
  }

  /** Creates a relation from `table` (the table holding the foreign key). */
  create(table: number, request: RelationRequest, options?: ProjectRequestOptions): Promise<Relation> {
    return this.inProject({ method: 'POST', path: REL, query: { table }, json: request }, options);
  }

  update(table: number, relation: number, request: RelationUpdateRequest, options?: ProjectRequestOptions): Promise<Relation> {
    return this.inProject({ method: 'PUT', path: REL, query: { table, relation }, json: request }, options);
  }

  /** Deletes the relation; the field and its values stay. */
  async delete(table: number, relation: number, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: REL, query: { table, relation } }, options);
  }

  /** Where the tables sit on the database designer's canvas. */
  getLayout(options?: ProjectRequestOptions): Promise<TablePosition[]> {
    return this.inProject({ method: 'GET', path: `${REL}/layout` }, options);
  }

  /** Stores the positions of the given tables; other tables keep theirs. */
  saveLayout(positions: readonly TablePosition[], options?: ProjectRequestOptions): Promise<TablePosition[]> {
    return this.inProject({ method: 'PUT', path: `${REL}/layout`, json: positions }, options);
  }
}

// ---------------------------------------------------------------- roles and permissions

const ROLE = '/v1/role';

export class RolesResource extends Resource {
  list(options?: ProjectRequestOptions): Promise<Role[]> {
    return this.inProject({ method: 'GET', path: ROLE }, options);
  }

  get(role: string, options?: ProjectRequestOptions): Promise<Role> {
    return this.inProject({ method: 'GET', path: ROLE, query: { role } }, options);
  }

  create(request: RoleRequest, options?: ProjectRequestOptions): Promise<Role> {
    return this.inProject({ method: 'POST', path: ROLE, json: request }, options);
  }

  update(role: string, request: RoleRequest, options?: ProjectRequestOptions): Promise<Role> {
    return this.inProject({ method: 'PUT', path: ROLE, query: { role }, json: request }, options);
  }

  async delete(role: string, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: ROLE, query: { role } }, options);
  }

  /** Roles without their permissions. */
  simple(options?: ProjectRequestOptions): Promise<SimpleRole[]> {
    return this.inProject({ method: 'GET', path: `${ROLE}/simple` }, options);
  }

  /** A role with default permissions, to start a new one from. */
  template(options?: ProjectRequestOptions): Promise<Role> {
    return this.inProject({ method: 'GET', path: `${ROLE}/template` }, options);
  }

  /** The project-level permissions of a role, with descriptions. */
  topLevel(role: string, options?: ProjectRequestOptions): Promise<TopLevelRolePermissions> {
    return this.inProject({ method: 'GET', path: `${ROLE}/top-level`, query: { role } }, options);
  }

  /** The permissions every role has on one table. */
  tableRolePermissions(tableName: string, options?: ProjectRequestOptions): Promise<TableRolePermissions> {
    return this.inProject({ method: 'GET', path: `${ROLE}/table-role-permissions`, query: { tableName } }, options);
  }

  /** The permissions of one role on one table. */
  getTable(role: string, table: string, options?: ProjectRequestOptions): Promise<RoleTablePermissions> {
    return this.inProject({ method: 'GET', path: `${ROLE}/table`, query: { role, table } }, options);
  }

  /** Sets the permissions of one role on one table (`tableName` in the body). */
  updateTable(role: string, permissions: TablePermissions, options?: ProjectRequestOptions): Promise<Role> {
    return this.inProject({ method: 'PUT', path: `${ROLE}/table`, query: { role }, json: permissions }, options);
  }

  duplicate(role: string, request: DuplicateRoleRequest, options?: ProjectRequestOptions): Promise<Role> {
    return this.inProject({ method: 'POST', path: `${ROLE}/duplicate`, query: { roleId: role }, json: request }, options);
  }

  /** Every role against every table, with numeric permission ids. */
  getMatrix(options?: ProjectRequestOptions): Promise<RoleMatrix> {
    return this.inProject({ method: 'GET', path: `${ROLE}/matrix` }, options);
  }

  updateMatrix(request: RoleMatrixRequest, options?: ProjectRequestOptions): Promise<RoleMatrix> {
    return this.inProject({ method: 'PUT', path: `${ROLE}/matrix`, json: request }, options);
  }
}

export class PermissionsResource extends Resource {
  /** Names and descriptions of all permissions. */
  info(options?: RequestOptions): Promise<PermissionInfo[]> {
    return this.data({ method: 'GET', path: '/v1/permission/info' }, options);
  }
}

// ---------------------------------------------------------------- audit

export interface AuditPageOptions extends ProjectRequestOptions {
  take?: number;
  offset?: number;
}

export class AuditResource extends Resource {
  /** Changes to project management (roles, members, tokens, ...), newest first. */
  management(options?: AuditPageOptions): Promise<AuditPage> {
    return this.inProject({ method: 'GET', path: '/v1/logging/management', query: { take: options?.take, offset: options?.offset } }, options);
  }

  /** Changes to the schema (tables and fields), newest first. */
  schema(options?: AuditPageOptions): Promise<AuditPage> {
    return this.inProject({ method: 'GET', path: '/v1/logging/schema', query: { take: options?.take, offset: options?.offset } }, options);
  }

  /** Undoes a schema transaction. Only the last one, unless `force: true`. */
  async rollback(transactionId: string, options?: ProjectRequestOptions & { force?: boolean }): Promise<void> {
    await this.inProject(
      { method: 'PUT', path: '/v1/logging/rollback', query: { transactionId, force: options?.force || undefined } },
      options,
    );
  }
}

// ---------------------------------------------------------------- webhooks

const HOOK = '/v1/webhooks';

export class WebhooksResource extends Resource {
  list(options?: ProjectRequestOptions): Promise<Webhook[]> {
    return this.inProject({ method: 'GET', path: HOOK }, options);
  }

  get(id: number, options?: ProjectRequestOptions): Promise<Webhook> {
    return this.inProject({ method: 'GET', path: `${HOOK}/${id}` }, options);
  }

  /** Creates a webhook. The result holds the signing `secret`, which is not shown again: store it. */
  create(request: WebhookRequest, options?: ProjectRequestOptions): Promise<WebhookWithSecret> {
    return this.inProject({ method: 'POST', path: HOOK, json: { isActive: true, ...request } }, options);
  }

  update(id: number, request: WebhookRequest, options?: ProjectRequestOptions): Promise<Webhook> {
    return this.inProject({ method: 'PUT', path: `${HOOK}/${id}`, json: { isActive: true, ...request } }, options);
  }

  async delete(id: number, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: `${HOOK}/${id}` }, options);
  }

  /** Sends a `ping` event now and returns the delivery. */
  test(id: number, options?: ProjectRequestOptions): Promise<WebhookDelivery> {
    return this.inProject({ method: 'POST', path: `${HOOK}/${id}/test` }, options);
  }

  /** Issues a new secret. The old one keeps working for a while (`previousSecretExpiresAt`). */
  rotateSecret(id: number, options?: ProjectRequestOptions): Promise<WebhookWithSecret> {
    return this.inProject({ method: 'POST', path: `${HOOK}/${id}/rotate-secret` }, options);
  }

  deliveries(id: number, options?: ProjectRequestOptions & { offset?: number; take?: number }): Promise<WebhookDelivery[]> {
    return this.inProject(
      { method: 'GET', path: `${HOOK}/${id}/deliveries`, query: { offset: options?.offset, take: options?.take } },
      options,
    );
  }

  redeliver(id: number, deliveryId: number, options?: ProjectRequestOptions): Promise<WebhookDelivery> {
    return this.inProject({ method: 'POST', path: `${HOOK}/${id}/deliveries/${deliveryId}/redeliver` }, options);
  }
}

// ---------------------------------------------------------------- users

const USER = '/v1/user';

export class UsersResource extends Resource {
  /** The signed-in user. */
  me(options?: RequestOptions): Promise<Account> {
    return this.data({ method: 'GET', path: USER }, options);
  }

  /** Deletes the signed-in user's account. */
  async deleteMe(options?: RequestOptions): Promise<void> {
    await this.data({ method: 'DELETE', path: USER }, options);
  }

  /** What the signed-in user may do in the project. */
  permissions(options?: ProjectRequestOptions): Promise<Permissions> {
    return this.inProject({ method: 'GET', path: `${USER}/permissions` }, options, 'projectId');
  }

  /** Invites someone to the project by email. */
  async invite(request: InvitationRequest, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'POST', path: `${USER}/invite`, json: request }, options);
  }

  async updateInvitation(id: number, request: InvitationRequest, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'PUT', path: `${USER}/invitation`, query: { id }, json: request }, options);
  }

  async revokeInvitation(id: number, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: `${USER}/revoke-invitation`, query: { id } }, options);
  }

  /** Changes a member's role or application access. */
  async updateAccess(request: UserAccessRequest, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'PUT', path: `${USER}/user-access`, json: request }, options);
  }

  /** Removes a member from the project. */
  async removeAccess(email: string, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: `${USER}/remove-user-access`, query: { email } }, options);
  }
}

// ---------------------------------------------------------------- applications

const APP = '/v1/application';

export class ApplicationsResource extends Resource {
  listAccessTokens(options?: ProjectRequestOptions): Promise<AccessToken[]> {
    return this.inProject({ method: 'GET', path: `${APP}/access-token` }, options);
  }

  /** Creates an access token; `access_token` in the result is the token to use (not shown again). */
  createAccessToken(request: AccessTokenRequest, options?: ProjectRequestOptions): Promise<CreatedAccessToken> {
    return this.inProject({ method: 'POST', path: `${APP}/access-token`, json: request }, options);
  }

  updateAccessToken(request: UpdateAccessTokenRequest, options?: ProjectRequestOptions): Promise<UpdatedAccessToken> {
    return this.inProject({ method: 'PUT', path: `${APP}/access-token`, json: request }, options);
  }

  async deleteAccessToken(accessTokenId: string, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: `${APP}/access-token`, query: { accessTokenId } }, options);
  }

  /** Issues a new token value for an existing access token. */
  regenerateAccessToken(accessTokenId: string, options?: ProjectRequestOptions): Promise<TokenResponse> {
    return this.inProject({ method: 'POST', path: `${APP}/generate-jwt-token`, json: accessTokenId }, options);
  }

  listClients(options?: ProjectRequestOptions): Promise<OAuthClient[]> {
    return this.inProject({ method: 'GET', path: `${APP}/client` }, options);
  }

  /** Creates an OAuth client; `clientSecret` in the result is not shown again. */
  createClient(request: ClientRequest, options?: ProjectRequestOptions): Promise<OAuthClient> {
    return this.inProject({ method: 'POST', path: `${APP}/client`, json: request }, options);
  }

  updateClient(request: UpdateClientRequest, options?: ProjectRequestOptions): Promise<OAuthClient> {
    return this.inProject({ method: 'PUT', path: `${APP}/client`, json: request }, options);
  }

  async deleteClient(clientId: string, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: `${APP}/client`, query: { clientId } }, options);
  }

  regenerateClientSecret(clientId: string, options?: ProjectRequestOptions): Promise<OAuthClient> {
    return this.inProject({ method: 'POST', path: `${APP}/generate-new-secret`, json: clientId }, options);
  }
}
