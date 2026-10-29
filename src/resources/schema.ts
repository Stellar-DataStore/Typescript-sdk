import type { ProjectRequestOptions } from '../http.js';
import type { Field, FieldRequest, Table, TableRequest } from '../types.js';
import { Resource } from './base.js';

const TABLE = '/v1/schema/table';
const FIELD = '/v1/schema/table/field';

export class TablesResource extends Resource {
  list(options?: ProjectRequestOptions): Promise<Table[]> {
    return this.inProject({ method: 'GET', path: TABLE }, options);
  }

  /** One table, by id or by name. */
  get(table: number | string, options?: ProjectRequestOptions): Promise<Table> {
    return this.inProject({ method: 'GET', path: TABLE, query: { table } }, options);
  }

  create(request: TableRequest, options?: ProjectRequestOptions): Promise<Table> {
    return this.inProject({ method: 'POST', path: TABLE, json: request }, options);
  }

  update(table: number, request: TableRequest, options?: ProjectRequestOptions): Promise<Table> {
    return this.inProject({ method: 'PUT', path: TABLE, query: { table }, json: request }, options);
  }

  /** Deletes the table and all its records. */
  async delete(table: number, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: TABLE, query: { table } }, options);
  }
}

/** Turns `type: FieldType.enum([...])` into the `type` + `options` the server expects. */
export function toFieldBody(request: FieldRequest): Record<string, unknown> {
  const isSpec = typeof request.type === 'object' && request.type !== null;
  const type = isSpec ? (request.type as { type: string }).type : String(request.type);
  const options = request.options ?? (isSpec ? (request.type as { options?: readonly string[] }).options : undefined);
  const body: Record<string, unknown> = { name: request.name, type };
  if (options) body.options = [...options];
  if (request.replaceOptions) body.replaceOptions = request.replaceOptions;
  return body;
}

export class FieldsResource extends Resource {
  list(table: number, options?: ProjectRequestOptions): Promise<Field[]> {
    return this.inProject({ method: 'GET', path: FIELD, query: { table } }, options);
  }

  get(table: number, field: number, options?: ProjectRequestOptions): Promise<Field> {
    return this.inProject({ method: 'GET', path: FIELD, query: { table, field } }, options);
  }

  create(table: number, request: FieldRequest, options?: ProjectRequestOptions): Promise<Field> {
    return this.inProject({ method: 'POST', path: FIELD, query: { table }, json: toFieldBody(request) }, options);
  }

  /** Renames the field or changes its type. For Enum fields, `replaceOptions` remaps existing values. */
  update(table: number, field: number, request: FieldRequest, options?: ProjectRequestOptions): Promise<Field> {
    return this.inProject({ method: 'PUT', path: FIELD, query: { table, field }, json: toFieldBody(request) }, options);
  }

  async delete(table: number, field: number, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: FIELD, query: { table, field } }, options);
  }
}
