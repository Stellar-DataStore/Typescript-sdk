/*
 * Request and response shapes of the StellarDS v2 API. Written by hand from the OpenAPI document and the server's
 * DTOs (StellarDS.Dtos). Property names are the JSON names (camelCase); ids are numbers for tables, fields, records,
 * webhooks and relations, and GUID strings for projects, roles, clients and access tokens.
 */

/** A GUID such as `"3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90"`. */
export type Guid = string;

/** Severity of a server message: 10 info, 20 warning, 30 error, 31 database error, 32 parse error. */
export type ServiceMessageType = 10 | 20 | 30 | 31 | 32;

export interface ServiceMessage {
  code?: string | null;
  message?: string | null;
  type: ServiceMessageType;
}

/** The envelope every StellarDS endpoint wraps its result in. The SDK unwraps it for you. */
export interface ServiceResult<T = unknown> {
  data?: T;
  isSuccess: boolean;
  messages?: ServiceMessage[];
  /** Total number of matching records, on record queries. */
  count?: number;
}

// ---------------------------------------------------------------- projects

export interface Project {
  id: Guid;
  name: string;
  description: string;
  isMultitenant: boolean;
  allowNewUsers: boolean;
  tierId: number;
}

export interface ProjectRequest {
  name: string;
  description?: string | null;
  isMultitenant: boolean;
  allowNewUsers: boolean;
}

export interface ProjectUser {
  username?: string | null;
  email: string;
  role?: string | null;
  isOwner: boolean;
  hasApplicationAccess: boolean;
}

export interface ProjectUsers {
  totalCount: number;
  users: ProjectUser[];
}

export interface ProjectUsersParams {
  sortBy?: string;
  sortType?: 'asc' | 'desc' | (string & {});
  /** 1-based page; leave out for all users. */
  page?: number;
  pageSize?: number;
}

export interface ProjectInvitation {
  id: number;
  email: string;
  inviterId: string;
  roleId: Guid;
  roleName: string;
  applicationAccess: boolean;
  existingUser: boolean;
}

export interface HttpLogEntry {
  userId?: string | null;
  clientId?: Guid | null;
  projectId?: Guid | null;
  remoteIp: string;
  accessTokenId?: Guid | null;
  requestDateTime: string;
  requestMethod: string;
  requestPathAndQuery: string;
  responseStatusCode: number;
}

export interface OAuthDesign {
  id: Guid;
  useCustomDesign: boolean;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  fontColor?: string | null;
  buttonColor?: string | null;
  degrees: number;
  projectId: Guid;
  base64Image?: string | null;
  useSolidBackground: boolean;
  title?: string | null;
  subtitle?: string | null;
  buttonRadius?: number | null;
  hideSignUpLink: boolean;
}

export type OAuthDesignRequest = Omit<OAuthDesign, 'id'>;

// ---------------------------------------------------------------- tables and fields

export interface Table {
  id: number;
  name: string;
  description?: string | null;
  isMultitenant: boolean;
}

export interface TableRequest {
  name: string;
  description?: string | null;
  isMultitenant: boolean;
}

export interface Field {
  id: number;
  name: string;
  /** The field type as the server reports it, for example `"NVarChar(255)"` or `"Decimal(10,2)"`. */
  type: string;
  /** The allowed values of an Enum field. */
  options?: string[] | null;
}

/** A field type: a type string, or a {@link FieldTypeSpec} from the `FieldType` helpers. */
export type FieldTypeInput = string | FieldTypeSpec;

export interface FieldTypeSpec {
  readonly type: string;
  readonly options?: readonly string[];
  toString(): string;
}

export interface FieldRequest {
  name: string;
  type: FieldTypeInput;
  /** Enum only: the allowed values. Taken from `FieldType.enum([...])` when left out. */
  options?: readonly string[];
  /** Enum only, on update: rename values (`{ old: new }`); existing records are remapped. */
  replaceOptions?: Record<string, string>;
}

// ---------------------------------------------------------------- records and queries

/** A record as stored in a table. Every record has a numeric `id`. */
export type RecordData = { [field: string]: unknown };

export interface QueryResult<T> {
  data: T[];
  /** Total number of records matching the query, regardless of `take` and `offset`. */
  count: number;
}

export interface CustomQueryColumn {
  name?: string | null;
  type?: string | null;
}

export interface CustomQueryResult<T = RecordData> {
  columns: CustomQueryColumn[];
  rows: T[];
  count: number;
  truncated: boolean;
  durationMs: number;
}

// ---------------------------------------------------------------- procedures

export interface ProcedureParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string | null;
}

export interface ProcedureStep {
  name: string;
  sql: string;
}

export interface ProcedureRequest {
  name: string;
  description?: string | null;
  parameters?: ProcedureParameter[];
  steps?: ProcedureStep[];
  /** The version you edited; the server refuses the update (409) when someone saved a newer one. */
  version?: number | null;
}

export interface Procedure {
  name: string;
  description?: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  parameters: ProcedureParameter[];
  steps: ProcedureStep[];
  problems?: string[] | null;
}

export interface ProcedureStepResult<T = RecordData> extends CustomQueryResult<T> {
  step?: string | null;
}

export interface ProcedureExecuteResult<T = RecordData> {
  name: string;
  version: number;
  results: ProcedureStepResult<T>[];
  durationMs: number;
}

// ---------------------------------------------------------------- relations

export type RelationOnDelete = 'Restrict' | 'Cascade' | 'SetNull';
export type RelationOrphanHandling = 'Abort' | 'SetNull';

export interface Relation {
  id: number;
  name: string;
  fromTableId: number;
  fromTableName: string;
  fromFieldId: number;
  fromFieldName: string;
  toTableId: number;
  toTableName: string;
  onDelete: RelationOnDelete;
  displayFieldId?: number | null;
  displayFieldName?: string | null;
}

export interface RelationRequest {
  name?: string | null;
  /** The existing field that holds the foreign key. Leave out and set `newFieldName` to create one. */
  fromFieldId?: number | null;
  /** Creates a new BigInt field with this name to hold the foreign key. */
  newFieldName?: string | null;
  toTableId: number;
  onDelete?: RelationOnDelete;
  displayFieldId?: number | null;
  /** Allow converting an integer field to BigInt, which the referenced id column requires. */
  convertToBigInt?: boolean;
  /** `Abort` (default) refuses while values without a matching record exist; `SetNull` clears them. */
  orphanHandling?: RelationOrphanHandling;
}

export interface RelationUpdateRequest {
  name?: string | null;
  onDelete: RelationOnDelete;
  displayFieldId?: number | null;
}

export interface RelationCheck {
  fieldType?: string | null;
  requiresConversion: boolean;
  isValid: boolean;
  problem?: string | null;
  orphanCount: number;
}

export interface TablePosition {
  tableId: number;
  x: number;
  y: number;
}

// ---------------------------------------------------------------- roles and permissions

export interface TablePermission {
  readTable: boolean;
  updateTableMetadata: boolean;
  updateTable: boolean;
  createRecord: boolean;
  readRecords: boolean;
  deleteRecord: boolean;
  updateRecord: boolean;
}

export interface TablePermissions extends TablePermission {
  tableName: string;
}

export interface Permissions {
  updateProject: boolean;
  deleteProject: boolean;
  createTables: boolean;
  deleteTables: boolean;
  ignoreMultitenant: boolean;
  manageAccessTokens: boolean;
  manageClients: boolean;
  manageWebhooks: boolean;
  updatePermissions: boolean;
  inviteUsers: boolean;
  readMembers: boolean;
  removeMembers: boolean;
  tables?: TablePermissions[] | null;
  defaultTablePermission?: TablePermission;
}

export interface SimpleRole {
  id: Guid;
  name: string;
  description: string;
  projectId: Guid;
}

export interface Role extends SimpleRole {
  permissions: Permissions;
}

export interface RoleRequest {
  name: string;
  description: string;
  permissions: Permissions;
}

export interface DuplicateRoleRequest {
  name: string;
  description: string;
}

export interface PermissionInfo {
  name: string;
  description: string;
}

export interface DetailedPermission extends PermissionInfo {
  enabled: boolean;
}

export interface TopLevelRolePermissions {
  permissions: DetailedPermission[];
  defaultTablePermissions: DetailedPermission[];
  tables: string[];
}

export interface RoleTablePermissions {
  tableName: string;
  permissions: DetailedPermission[];
}

export interface TableRolePermissions {
  tableName: string;
  roles: { id: Guid; name: string; permissions: DetailedPermission[] }[];
}

export interface RoleMatrix {
  tables: { id: number; name: string }[];
  roles: {
    id: Guid;
    name: string;
    description?: string | null;
    permissions: number[];
    defaultTablePermissions: number[];
    tables: { tableId: number; permissions: number[] }[];
    members: string[];
    memberCount: number;
    accessTokens: string[];
    clients: string[];
  }[];
}

export interface RoleMatrixRequest {
  roles: {
    roleId: Guid;
    name?: string | null;
    description?: string | null;
    permissions?: number[] | null;
    defaultTablePermissions?: number[] | null;
    tables?: { tableId: number; permissions: number[] }[] | null;
  }[];
}

// ---------------------------------------------------------------- audit

export interface AuditUser {
  username?: string | null;
  email: string;
  role?: string | null;
  isOwner: boolean;
  hasApplicationAccess: boolean;
}

export interface AuditEntry {
  id: Guid;
  tableName: string;
  dateTime: string;
  user: AuditUser;
  operation: string;
  difference: string;
  state: string;
  stateByUser?: AuditUser | null;
}

export interface AuditPage {
  audits: AuditEntry[];
  count: number;
}

// ---------------------------------------------------------------- webhooks

export type WebhookEventType =
  | 'record.created'
  | 'record.updated'
  | 'record.deleted'
  | 'table.created'
  | 'table.updated'
  | 'table.deleted'
  | 'field.created'
  | 'field.updated'
  | 'field.deleted';

export interface WebhookRequest {
  url: string;
  /** Event types to send; empty or left out means every record event. */
  events?: (WebhookEventType | (string & {}))[];
  /** Only send events for these tables; empty means all tables. */
  tableIds?: number[];
  isActive?: boolean;
}

export interface Webhook {
  id: number;
  url: string;
  events: string[];
  tableIds: number[];
  isActive: boolean;
  disabledAt?: string | null;
  failingSince?: string | null;
  previousSecretExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookWithSecret extends Webhook {
  /** The signing secret (`whsec_...`). Only returned on create and rotate: store it now. */
  secret: string;
}

export interface WebhookDelivery {
  id: number;
  eventId?: string | null;
  eventType?: string | null;
  status?: string | null;
  attempts: number;
  createdAt: string;
  nextAttemptAt?: string | null;
  deliveredAt?: string | null;
  lastStatusCode?: number | null;
  lastResponse?: string | null;
  payload?: string | null;
}

/** The JSON body of a webhook delivery. */
export interface WebhookEvent<TRecord = RecordData> {
  /** `evt_...`; deliveries can repeat, so deduplicate on it (also sent as the StellarDS-Event-Id header). */
  id: string;
  type: WebhookEventType | 'ping' | (string & {});
  createdAt: string;
  project: Guid;
  table?: { id: number; name: string };
  actor: { userId: string; clientId?: Guid | null };
  data: {
    record?: TRecord;
    changed?: string[];
    field?: { id: number; name: string; type?: string | null };
  };
}

// ---------------------------------------------------------------- users

export interface Account {
  username: string;
  email: string;
}

export interface InvitationRequest {
  role: Guid;
  email: string;
  allowAppAccess: boolean;
}

export interface UserAccessRequest {
  email: string;
  role: Guid;
  hasApplicationAccess: boolean;
}

// ---------------------------------------------------------------- applications

/** How long an access token stays valid: Minutes 0, Hours 1, Days 2, Weeks 3, Months 4, Years 5, Unlimited -1. */
export const DurationUnit = {
  Minutes: 0,
  Hours: 1,
  Days: 2,
  Weeks: 3,
  Months: 4,
  Years: 5,
  Unlimited: -1,
} as const;
export type DurationUnit = (typeof DurationUnit)[keyof typeof DurationUnit];

export interface AccessTokenRequest {
  name: string;
  role: Guid;
  domain?: string | null;
  duration: number;
  span: DurationUnit;
}

export interface UpdateAccessTokenRequest extends AccessTokenRequest {
  accessTokenId: Guid;
}

export interface AccessToken {
  id: Guid;
  name: string;
  domain?: string | null;
  duration: number;
  span: DurationUnit;
  endTime: string;
  role: Role;
  createdAt: string;
}

/** The raw token response of the OAuth endpoints and of access-token creation. */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface CreatedAccessToken extends TokenResponse {
  metadata: AccessToken;
}

export interface UpdatedAccessToken {
  accessToken: AccessToken;
  tokenReponse: TokenResponse;
}

export interface ClientRequest {
  name: string;
  role: Guid;
  redirectUrls: string[];
}

export interface UpdateClientRequest extends ClientRequest {
  clientId: Guid;
}

export interface OAuthClient {
  name: string;
  clientId: Guid;
  /** Only returned when the client is created or its secret regenerated. */
  clientSecret?: string | null;
  redirectUrls: string[];
  domain?: string | null;
  role: Role;
}

// ---------------------------------------------------------------- project tiers

export interface ProjectTier {
  name: string;
  users: number;
  tables: number;
  maxRequests: number;
}
