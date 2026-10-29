import type { FieldTypeSpec } from './types.js';

function spec(type: string, options?: readonly string[]): FieldTypeSpec {
  const value: FieldTypeSpec = options
    ? { type, options: Object.freeze([...options]), toString: () => type }
    : { type, toString: () => type };
  return Object.freeze(value);
}

function positiveInt(name: string, value: number, max?: number): number {
  if (!Number.isInteger(value) || value < 1 || (max !== undefined && value > max)) {
    throw new RangeError(`${name} must be an integer between 1 and ${max ?? 'infinity'}, got ${value}`);
  }
  return value;
}

/**
 * Builders for the field types StellarDS accepts. Pass the result as `type` when creating or updating a field:
 *
 * ```ts
 * await client.fields.create(tableId, { name: 'Price', type: FieldType.decimal(10, 2) });
 * await client.fields.create(tableId, { name: 'Status', type: FieldType.enum(['open', 'closed']) });
 * ```
 */
export const FieldType = {
  /** Text up to `length` characters (default 255), or `'max'` for unlimited. */
  nvarchar(length: number | 'max' = 255): FieldTypeSpec {
    return spec(`NVarChar(${length === 'max' ? 'max' : positiveInt('length', length)})`);
  },
  tinyInt: (): FieldTypeSpec => spec('TinyInt'),
  smallInt: (): FieldTypeSpec => spec('SmallInt'),
  int: (): FieldTypeSpec => spec('Int'),
  bigInt: (): FieldTypeSpec => spec('BigInt'),
  real: (): FieldTypeSpec => spec('Real'),
  float: (): FieldTypeSpec => spec('Float'),
  /** An exact number with `precision` digits of which `scale` after the point (default 18,2). A JSON number. */
  decimal(precision = 18, scale = 2): FieldTypeSpec {
    positiveInt('precision', precision, 38);
    if (!Number.isInteger(scale) || scale < 0 || scale > precision) {
      throw new RangeError(`scale must be an integer between 0 and precision (${precision}), got ${scale}`);
    }
    return spec(`Decimal(${precision},${scale})`);
  },
  boolean: (): FieldTypeSpec => spec('Boolean'),
  /** Date and time without an offset; ISO 8601 in JSON. */
  dateTime: (): FieldTypeSpec => spec('DateTime'),
  /** A calendar date; `"yyyy-MM-dd"` in JSON. */
  date: (): FieldTypeSpec => spec('Date'),
  /** A time of day; `"HH:mm:ss"` in JSON. */
  time: (): FieldTypeSpec => spec('Time'),
  /** A moment with its UTC offset; ISO 8601 with the offset in JSON. */
  dateTimeOffset: (): FieldTypeSpec => spec('DateTimeOffset'),
  /** A GUID string. */
  uuid: (): FieldTypeSpec => spec('Uuid'),
  /** Any JSON object or array, stored and returned inline. Only filterable with the null operator. */
  json: (): FieldTypeSpec => spec('Json'),
  /** One of a fixed list of strings (at most 200 options of at most 100 characters). */
  enum(options: readonly string[]): FieldTypeSpec {
    if (!Array.isArray(options) || options.length === 0) throw new RangeError('enum needs at least one option');
    return spec('Enum', options);
  },
  /** Binary data, read and written with `records.downloadBlob` / `records.uploadBlob`. */
  blob: (): FieldTypeSpec => spec('Blob'),
} as const;

const pad = (n: number, width = 2) => String(Math.abs(n)).padStart(width, '0');

/** An exact decimal value that is sent as a JSON number without going through a float. */
export class DecimalValue {
  readonly value: string;
  constructor(value: string | number | bigint) {
    const text = typeof value === 'string' ? value.trim() : String(value);
    if (!/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(text)) {
      throw new RangeError(`Not a decimal number: ${JSON.stringify(value)}`);
    }
    this.value = text;
  }
  toString(): string {
    return this.value;
  }
  toJSON(): number {
    // Only used by plain JSON.stringify; the SDK's own serializer writes `value` verbatim.
    return Number(this.value);
  }
}

/**
 * Converters that produce the exact JSON forms StellarDS expects for record values.
 * Plain JS values already work for most types (numbers, booleans, strings, JSON objects, and `Date` for
 * DateTime / DateTimeOffset); use these for Date-only, Time, local DateTime and exact decimals.
 */
export const FieldValue = {
  /** `"yyyy-MM-dd"` from a Date (its local calendar date, or the UTC date with `{ utc: true }`). */
  date(value: Date, options: { utc?: boolean } = {}): string {
    const u = options.utc;
    const y = u ? value.getUTCFullYear() : value.getFullYear();
    const m = (u ? value.getUTCMonth() : value.getMonth()) + 1;
    const d = u ? value.getUTCDate() : value.getDate();
    return `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
  },
  /** `"HH:mm:ss"` from a Date (local time, or UTC with `{ utc: true }`), or from hours/minutes/seconds. */
  time(value: Date | { hours: number; minutes?: number; seconds?: number }, options: { utc?: boolean } = {}): string {
    if (value instanceof Date) {
      const u = options.utc;
      return `${pad(u ? value.getUTCHours() : value.getHours())}:${pad(u ? value.getUTCMinutes() : value.getMinutes())}:${pad(u ? value.getUTCSeconds() : value.getSeconds())}`;
    }
    return `${pad(value.hours)}:${pad(value.minutes ?? 0)}:${pad(value.seconds ?? 0)}`;
  },
  /** ISO 8601 with the local UTC offset, e.g. `"2026-03-01T14:30:00.000+01:00"`. `Date` itself sends UTC (`Z`). */
  dateTimeOffset(value: Date): string {
    const offset = -value.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    return `${FieldValue.dateTime(value)}${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
  },
  /** ISO 8601 local date and time without an offset, e.g. `"2026-03-01T14:30:00.000"`. */
  dateTime(value: Date): string {
    return `${FieldValue.date(value)}T${FieldValue.time(value)}.${pad(value.getMilliseconds(), 3)}`;
  },
  /** An exact decimal, sent as a JSON number with every digit kept: `FieldValue.decimal('12345678901234.56')`. */
  decimal(value: string | number | bigint): DecimalValue {
    return new DecimalValue(value);
  },
} as const;

const MARKER = '⁣stellards-num⁣';
const markerPattern = new RegExp(`"${MARKER}(-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)"`, 'g');

/**
 * JSON.stringify that writes {@link DecimalValue} and `bigint` as JSON numbers with all their digits.
 */
export function serializeJson(value: unknown): string {
  let needsRewrite = false;
  const json = JSON.stringify(value, function (this: unknown, key: string, v: unknown) {
    const original = (this as Record<string, unknown> | undefined)?.[key];
    if (original instanceof DecimalValue) {
      needsRewrite = true;
      return MARKER + original.value;
    }
    if (typeof v === 'bigint') {
      needsRewrite = true;
      return MARKER + v.toString();
    }
    return v;
  });
  return needsRewrite ? json.replace(markerPattern, '$1') : json;
}
