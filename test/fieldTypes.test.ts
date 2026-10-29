import { describe, expect, it } from 'vitest';
import { FieldType, FieldValue, serializeJson } from '../src/index.js';
import { client, mockFetch, ok } from './helpers.js';

describe('FieldType', () => {
  it('produces the type strings the server accepts', () => {
    expect(String(FieldType.nvarchar())).toBe('NVarChar(255)');
    expect(String(FieldType.nvarchar(200))).toBe('NVarChar(200)');
    expect(String(FieldType.nvarchar('max'))).toBe('NVarChar(max)');
    expect(String(FieldType.decimal(10, 2))).toBe('Decimal(10,2)');
    expect(String(FieldType.decimal())).toBe('Decimal(18,2)');
    expect(String(FieldType.decimal(10, 0))).toBe('Decimal(10,0)');
    const simple = {
      tinyInt: 'TinyInt', smallInt: 'SmallInt', int: 'Int', bigInt: 'BigInt', real: 'Real', float: 'Float',
      boolean: 'Boolean', dateTime: 'DateTime', date: 'Date', time: 'Time', dateTimeOffset: 'DateTimeOffset',
      uuid: 'Uuid', json: 'Json', blob: 'Blob',
    } as const;
    for (const [fn, type] of Object.entries(simple)) expect(FieldType[fn as keyof typeof simple]().type).toBe(type);
    expect(FieldType.enum(['open', 'closed'])).toMatchObject({ type: 'Enum', options: ['open', 'closed'] });
  });

  it('validates arguments', () => {
    expect(() => FieldType.decimal(0, 0)).toThrow(RangeError);
    expect(() => FieldType.decimal(5, 6)).toThrow(RangeError);
    expect(() => FieldType.decimal(39, 2)).toThrow(RangeError);
    expect(() => FieldType.nvarchar(0)).toThrow(RangeError);
    expect(() => FieldType.enum([])).toThrow(RangeError);
  });

  it('fields.create sends type and options from FieldType.enum', async () => {
    const m = mockFetch(() => ok({ id: 1, name: 'Status', type: 'Enum', options: ['open', 'closed'] }));
    const c = client(m.fetch);
    await c.fields.create(4, { name: 'Status', type: FieldType.enum(['open', 'closed']) });
    expect(m.calls[0]!.body).toEqual({ name: 'Status', type: 'Enum', options: ['open', 'closed'] });
    expect(m.calls[0]!.url.search).toBe('?project=p1&table=4');

    await c.fields.update(4, 1, { name: 'Status', type: 'Enum', options: ['open', 'done'], replaceOptions: { closed: 'done' } });
    expect(m.calls[1]!.method).toBe('PUT');
    expect(m.calls[1]!.url.search).toBe('?project=p1&table=4&field=1');
    expect(m.calls[1]!.body).toEqual({ name: 'Status', type: 'Enum', options: ['open', 'done'], replaceOptions: { closed: 'done' } });

    await c.fields.create(4, { name: 'Price', type: FieldType.decimal(10, 2) });
    expect(m.calls[2]!.body).toEqual({ name: 'Price', type: 'Decimal(10,2)' });
  });
});

describe('FieldValue and JSON wire forms', () => {
  const d = new Date(2026, 2, 1, 14, 5, 9, 7); // local time

  it('formats Date, Time, DateTime and DateTimeOffset', () => {
    expect(FieldValue.date(d)).toBe('2026-03-01');
    expect(FieldValue.time(d)).toBe('14:05:09');
    expect(FieldValue.time({ hours: 8, minutes: 30 })).toBe('08:30:00');
    expect(FieldValue.dateTime(d)).toBe('2026-03-01T14:05:09.007');
    expect(FieldValue.dateTimeOffset(d)).toMatch(/^2026-03-01T14:05:09\.007[+-]\d{2}:\d{2}$/);
    expect(new Date(FieldValue.dateTimeOffset(d)).getTime()).toBe(d.getTime());
    const utc = new Date(Date.UTC(2026, 11, 31, 23, 59, 0));
    expect(FieldValue.date(utc, { utc: true })).toBe('2026-12-31');
    expect(FieldValue.time(utc, { utc: true })).toBe('23:59:00');
  });

  it('serializes decimals and bigints as JSON numbers without rounding', () => {
    const body = {
      price: FieldValue.decimal('12345678901234567.89'),
      small: FieldValue.decimal(0.1),
      neg: FieldValue.decimal('-3.50'),
      big: 9007199254740993n,
      list: [FieldValue.decimal('1.10')],
      text: 'not 1.5',
    };
    expect(serializeJson(body)).toBe(
      '{"price":12345678901234567.89,"small":0.1,"neg":-3.50,"big":9007199254740993,"list":[1.10],"text":"not 1.5"}',
    );
    expect(JSON.parse(serializeJson(body)).price).toBeTypeOf('number');
    expect(() => FieldValue.decimal('1,5')).toThrow(RangeError);
  });

  it('serializes Date as ISO 8601, uuid as string, json inline', () => {
    const at = new Date(Date.UTC(2026, 0, 1, 12, 0, 0));
    expect(serializeJson({ at, id: '3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90', meta: { a: [1, true, null] } })).toBe(
      '{"at":"2026-01-01T12:00:00.000Z","id":"3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90","meta":{"a":[1,true,null]}}',
    );
  });

  it('record writes use the decimal-aware serializer', async () => {
    const m = mockFetch(() => ok([]));
    await client(m.fetch).records.create(1, { price: FieldValue.decimal('19.99'), day: FieldValue.date(d) });
    expect(m.calls[0]!.rawBody).toBe('{"records":[{"price":19.99,"day":"2026-03-01"}]}');
  });
});
