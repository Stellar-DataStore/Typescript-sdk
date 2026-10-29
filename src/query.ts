import { DecimalValue } from './fieldTypes.js';

/**
 * Comparison operators of record filters. `null` takes `true` (is null) or `false` (is not null); `in` and `notin`
 * take an array.
 */
export type WhereOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'notlike' | 'in' | 'notin' | 'null';

export type WhereScalar = string | number | boolean | bigint | Date | DecimalValue;
export type WhereValue = WhereScalar | readonly WhereScalar[];

const OPERATORS: ReadonlySet<string> = new Set<WhereOperator>([
  '=', '!=', '>', '<', '>=', '<=', 'like', 'notlike', 'in', 'notin', 'null',
]);

function scalarText(value: WhereScalar): string {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof DecimalValue) return value.value;
  return String(value);
}

interface Clause {
  field: string;
  op: WhereOperator;
  value: WhereValue;
  join: '&' | '|' | null;
}

/**
 * Builds the `WhereQuery` of a record query. Clauses are combined left to right:
 *
 * ```ts
 * where('age', '>=', 18).and('country', 'in', ['BE', 'NL']).or('vip', '=', true)
 * where('deletedAt', 'null', true)            // is null
 * where('name', 'like', '%son')
 * ```
 *
 * Values are URL-encoded individually, so `;`, `&`, `|`, `%` and `"` in values are safe. The one limitation is the
 * server's: values of `in` / `notin` cannot contain commas.
 */
export class WhereBuilder {
  private readonly clauses: Clause[] = [];

  constructor(field: string, op: WhereOperator, value: WhereValue) {
    this.push(field, op, value);
  }

  and(field: string, op: WhereOperator, value: WhereValue): this {
    this.setLastJoin('&');
    return this.push(field, op, value);
  }

  or(field: string, op: WhereOperator, value: WhereValue): this {
    this.setLastJoin('|');
    return this.push(field, op, value);
  }

  private setLastJoin(join: '&' | '|') {
    const last = this.clauses[this.clauses.length - 1];
    if (last) last.join = join;
  }

  private push(field: string, op: WhereOperator, value: WhereValue): this {
    if (!field || /[;&|]/.test(field)) throw new RangeError(`Invalid field name in where clause: ${JSON.stringify(field)}`);
    if (!OPERATORS.has(op)) throw new RangeError(`Unknown where operator: ${JSON.stringify(op)}`);
    const isList = op === 'in' || op === 'notin';
    if (isList !== Array.isArray(value)) {
      throw new RangeError(isList ? `'${op}' needs an array of values` : `'${op}' needs a single value, not an array`);
    }
    if (isList && (value as readonly WhereScalar[]).length === 0) throw new RangeError(`'${op}' needs at least one value`);
    if (value === null || value === undefined) throw new RangeError(`Use where(field, 'null', true) to match nulls`);
    this.clauses.push({ field, op, value, join: null });
    return this;
  }

  /** The `WhereQuery` string, before the URL encoding of the query string itself. */
  toString(): string {
    return this.clauses
      .map((c) => {
        let text: string;
        if (Array.isArray(c.value)) {
          text = (c.value as readonly WhereScalar[])
            .map((v) => {
              const s = scalarText(v);
              if (s.includes(',')) throw new RangeError(`Values of '${c.op}' cannot contain commas: ${JSON.stringify(s)}`);
              return encodeURIComponent(s);
            })
            .join(',');
        } else {
          text = encodeURIComponent(scalarText(c.value as WhereScalar));
        }
        return `${c.field};${c.op};${text}${c.join ?? ''}`;
      })
      .join('');
  }
}

/** Starts a record filter. See {@link WhereBuilder}. */
export function where(field: string, op: WhereOperator, value: WhereValue): WhereBuilder {
  return new WhereBuilder(field, op, value);
}

export type SortDirection = 'asc' | 'desc';
export interface SortSpec {
  field: string;
  direction?: SortDirection;
}
export type SortInput = string | SortSpec | readonly SortSpec[];

export const asc = (field: string): SortSpec => ({ field, direction: 'asc' });
export const desc = (field: string): SortSpec => ({ field, direction: 'desc' });

/** `field;asc,other;desc`. Field names must be letters, digits and underscores (the server's `\w+`). */
export function sortQuery(sort: SortInput): string {
  if (typeof sort === 'string') return sort;
  const list = Array.isArray(sort) ? (sort as readonly SortSpec[]) : [sort as SortSpec];
  return list
    .map((s) => {
      if (!/^\w+$/.test(s.field)) throw new RangeError(`Cannot sort on ${JSON.stringify(s.field)}: use the field name or id`);
      return `${s.field};${s.direction ?? 'asc'}`;
    })
    .join(',');
}

/** Joins `table.field` to `foreignTable.foreignField`; tables by name. */
export interface JoinSpec {
  table: string;
  field: string;
  foreignTable: string;
  foreignField: string;
}
export type JoinInput = string | JoinSpec | readonly JoinSpec[];

/** `table;field=foreignTable;foreignField`, several joined with `&`. */
export function joinQuery(join: JoinInput): string {
  if (typeof join === 'string') return join;
  const list = Array.isArray(join) ? (join as readonly JoinSpec[]) : [join as JoinSpec];
  return list
    .map((j) => {
      for (const part of [j.table, j.field, j.foreignTable, j.foreignField]) {
        if (!part || /[;&|=]/.test(part)) throw new RangeError(`Invalid name in join: ${JSON.stringify(part)}`);
      }
      return `${j.table};${j.field}=${j.foreignTable};${j.foreignField}`;
    })
    .join('&');
}
