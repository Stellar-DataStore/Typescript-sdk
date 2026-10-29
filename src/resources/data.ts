import type { ProjectRequestOptions } from '../http.js';
import { joinQuery, sortQuery, type JoinInput, type SortInput, type WhereBuilder } from '../query.js';
import type {
  CustomQueryResult,
  Procedure,
  ProcedureExecuteResult,
  ProcedureRequest,
  QueryResult,
  RecordData,
} from '../types.js';
import { Resource } from './base.js';

const DATA = '/v1/data/table';

export interface RecordQuery {
  /** A filter from `where(...)`, or a raw `WhereQuery` string. */
  where?: WhereBuilder | string;
  /** Joins, as `{ table, field, foreignTable, foreignField }` or a raw `JoinQuery` string. */
  join?: JoinInput;
  /** `asc('name')`, `[desc('createdAt'), asc('id')]`, or a raw `SortQuery` string. */
  sort?: SortInput;
  /** Records to skip. */
  offset?: number;
  /** Maximum number of records to return. */
  take?: number;
  /** Only distinct rows (combine with `select`). */
  distinct?: boolean;
  /** Only these fields. */
  select?: string | readonly string[];
}

export interface IterateOptions extends RecordQuery {
  /** Records fetched per request (default 100). */
  pageSize?: number;
}

export type BlobInput = Blob | ArrayBuffer | ArrayBufferView | string;

function toQuery(table: number, q: RecordQuery): Record<string, string | number | boolean | undefined> {
  return {
    table,
    Offset: q.offset,
    Take: q.take,
    JoinQuery: q.join === undefined ? undefined : joinQuery(q.join),
    WhereQuery: q.where === undefined ? undefined : String(q.where),
    SortQuery: q.sort === undefined ? undefined : sortQuery(q.sort),
    distinct: q.distinct || undefined,
    select: q.select === undefined ? undefined : typeof q.select === 'string' ? q.select : q.select.join(';'),
  };
}

export class RecordsResource extends Resource {
  /** One page of records plus the total `count` of matching records. */
  async query<T = RecordData>(table: number, query: RecordQuery = {}, options?: ProjectRequestOptions): Promise<QueryResult<T>> {
    const project = this.project(options);
    const result = await this.send<T[]>(
      { method: 'GET', path: DATA, query: { project, ...toQuery(table, query) } },
      options,
    );
    const data = result.data ?? [];
    return { data, count: result.count ?? data.length };
  }

  /** Every matching page, fetched lazily with `offset` / `take`. Sorted on `id` unless you pass `sort`. */
  async *pages<T = RecordData>(table: number, query: IterateOptions = {}, options?: ProjectRequestOptions): AsyncGenerator<QueryResult<T>, void, undefined> {
    const pageSize = query.pageSize ?? query.take ?? 100;
    if (!Number.isInteger(pageSize) || pageSize < 1) throw new RangeError('pageSize must be a positive integer');
    const { pageSize: _ignored, ...rest } = query;
    const base: RecordQuery = { ...rest, sort: rest.sort ?? 'id;asc' };
    let offset = rest.offset ?? 0;
    for (;;) {
      const page = await this.query<T>(table, { ...base, offset, take: pageSize }, options);
      if (page.data.length === 0) return;
      yield page;
      offset += page.data.length;
      if (offset >= page.count || page.data.length < pageSize) return;
    }
  }

  /** Every matching record, one at a time: `for await (const r of client.records.iterate(tableId)) ...` */
  async *iterate<T = RecordData>(table: number, query: IterateOptions = {}, options?: ProjectRequestOptions): AsyncGenerator<T, void, undefined> {
    for await (const page of this.pages<T>(table, query, options)) yield* page.data;
  }

  /** Every matching record in one array. Mind the memory on large tables; prefer `iterate`. */
  async all<T = RecordData>(table: number, query: IterateOptions = {}, options?: ProjectRequestOptions): Promise<T[]> {
    const out: T[] = [];
    for await (const page of this.pages<T>(table, query, options)) out.push(...page.data);
    return out;
  }

  /** Inserts one record or many; returns them as stored (with their `id`). */
  async create<T = RecordData>(table: number, records: Partial<T> | readonly Partial<T>[], options?: ProjectRequestOptions): Promise<T[]> {
    const list = Array.isArray(records) ? records : [records];
    const data = await this.inProject<T[] | undefined>({ method: 'POST', path: DATA, query: { table }, json: { records: list } }, options);
    return data ?? [];
  }

  /**
   * Updates records with the values in `record`. Which records: `ids`, or else the `id` in `record`.
   * Without either the server refuses, unless `force: true` (which updates every record).
   */
  async update<T = RecordData>(
    table: number,
    record: Partial<T>,
    options?: ProjectRequestOptions & { ids?: readonly (number | string)[]; force?: boolean },
  ): Promise<T[]> {
    const body: Record<string, unknown> = { record };
    if (options?.ids) body.idList = [...options.ids];
    const data = await this.inProject<T[] | undefined>(
      { method: 'PUT', path: DATA, query: { table, force: options?.force || undefined }, json: body },
      options,
    );
    return data ?? [];
  }

  async delete(table: number, id: number, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: DATA, query: { table, record: id } }, options);
  }

  async deleteMany(table: number, ids: readonly (number | string)[], options?: ProjectRequestOptions): Promise<void> {
    if (ids.length === 0) return;
    await this.inProject({ method: 'POST', path: `${DATA}/delete`, query: { table }, json: ids.map(String) }, options);
  }

  /** Deletes every record of the table. */
  async clear(table: number, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: `${DATA}/clear`, query: { table } }, options);
  }

  /** The content of a Blob field. */
  async downloadBlob(table: number, record: number, field: string, options?: ProjectRequestOptions): Promise<Blob> {
    const project = this.project(options);
    const result = await this.send<Blob>(
      { method: 'GET', path: `${DATA}/blob`, query: { project, table, record, field }, expect: 'blob' },
      options,
    );
    return result.data;
  }

  /** Stores binary data in a Blob field (the server accepts up to 1 MB). */
  async uploadBlob(
    table: number,
    record: number,
    field: string,
    data: BlobInput,
    options?: ProjectRequestOptions & { filename?: string; contentType?: string },
  ): Promise<void> {
    const blob =
      data instanceof Blob
        ? data
        : new Blob([data as BlobPart], { type: options?.contentType ?? 'application/octet-stream' });
    const form = new FormData();
    form.append('data', blob, options?.filename ?? 'data');
    await this.inProject({ method: 'POST', path: `${DATA}/blob`, query: { table, record, field }, formData: form }, options);
  }
}

export class QueryResource extends Resource {
  /**
   * Runs a read-only SQL SELECT over the project's tables, using table and field names.
   * Parameters are referenced as `@name` in the query.
   */
  execute<T = RecordData>(sql: string, parameters?: Record<string, unknown>, options?: ProjectRequestOptions): Promise<CustomQueryResult<T>> {
    return this.inProject({ method: 'POST', path: '/v1/data/query', json: { query: sql, parameters } }, options);
  }
}

const PROC = '/v1/procedures';
const procPath = (name: string) => `${PROC}/${encodeURIComponent(name)}`;

export class ProceduresResource extends Resource {
  list(options?: ProjectRequestOptions): Promise<Procedure[]> {
    return this.inProject({ method: 'GET', path: PROC }, options);
  }

  get(name: string, options?: ProjectRequestOptions): Promise<Procedure> {
    return this.inProject({ method: 'GET', path: procPath(name) }, options);
  }

  create(request: ProcedureRequest, options?: ProjectRequestOptions): Promise<Procedure> {
    return this.inProject({ method: 'POST', path: PROC, json: request }, options);
  }

  /** Saves a new version. Pass the `version` you edited to get a 409 instead of overwriting a newer one. */
  update(name: string, request: ProcedureRequest, options?: ProjectRequestOptions): Promise<Procedure> {
    return this.inProject({ method: 'PUT', path: procPath(name), json: request }, options);
  }

  async delete(name: string, options?: ProjectRequestOptions): Promise<void> {
    await this.inProject({ method: 'DELETE', path: procPath(name) }, options);
  }

  execute<T = RecordData>(name: string, parameters?: Record<string, unknown>, options?: ProjectRequestOptions): Promise<ProcedureExecuteResult<T>> {
    return this.inProject({ method: 'POST', path: `${procPath(name)}/execute`, json: { parameters } }, options);
  }
}
