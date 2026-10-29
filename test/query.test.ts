import { describe, expect, it } from 'vitest';
import { FieldValue, asc, desc, joinQuery, sortQuery, where } from '../src/index.js';
import { client, mockFetch, ok } from './helpers.js';

describe('where builder', () => {
  it('chains clauses with & and |', () => {
    expect(where('age', '>=', 18).and('country', '=', 'BE').or('vip', '=', true).toString()).toBe(
      'age;>=;18&country;=;BE|vip;=;true',
    );
  });

  it('encodes values so separators inside them are safe', () => {
    expect(where('name', '=', 'a;b&c|d%e "f" +g').toString()).toBe('name;=;a%3Bb%26c%7Cd%25e%20%22f%22%20%2Bg');
  });

  it('formats in-lists, nulls, dates and decimals', () => {
    expect(where('id', 'in', [1, 2, 3]).toString()).toBe('id;in;1,2,3');
    expect(where('code', 'notin', ['a b', 'c']).toString()).toBe('code;notin;a%20b,c');
    expect(where('deletedAt', 'null', true).toString()).toBe('deletedAt;null;true');
    expect(where('at', '<', new Date(Date.UTC(2026, 0, 2, 3, 4, 5))).toString()).toBe('at;<;2026-01-02T03%3A04%3A05.000Z');
    expect(where('price', '>', FieldValue.decimal('12345678901234567.89')).toString()).toBe('price;>;12345678901234567.89');
  });

  it('rejects bad input', () => {
    expect(() => where('id', 'in', 5)).toThrow(RangeError);
    expect(() => where('id', '=', [5])).toThrow(RangeError);
    expect(() => where('id', 'in', [])).toThrow(RangeError);
    expect(() => where('a;b', '=', 1)).toThrow(RangeError);
    expect(() => where('a', 'between' as never, 1)).toThrow(RangeError);
    expect(() => where('a', 'in', ['x,y']).toString()).toThrow(/commas/);
    expect(() => where('a', '=', null as never)).toThrow(RangeError);
  });
});

describe('sort and join', () => {
  it('builds sort strings', () => {
    expect(sortQuery(asc('name'))).toBe('name;asc');
    expect(sortQuery([desc('createdAt'), { field: 'id' }])).toBe('createdAt;desc,id;asc');
    expect(sortQuery('raw;desc')).toBe('raw;desc');
    expect(() => sortQuery({ field: 'has space' })).toThrow(RangeError);
  });

  it('builds join strings in the server format table;field=table;field', () => {
    expect(joinQuery({ table: 'Orders', field: 'customerId', foreignTable: 'Customers', foreignField: 'id' })).toBe(
      'Orders;customerId=Customers;id',
    );
    expect(
      joinQuery([
        { table: 'A', field: 'bId', foreignTable: 'B', foreignField: 'id' },
        { table: 'B', field: 'cId', foreignTable: 'C', foreignField: 'id' },
      ]),
    ).toBe('A;bId=B;id&B;cId=C;id');
  });
});

describe('records.query', () => {
  it('builds the query string and returns data + count', async () => {
    const m = mockFetch(() => ok([{ id: 1, total: 5 }], { count: 42 }));
    interface Order { id: number; total: number }
    const result = await client(m.fetch).records.query<Order>(7, {
      where: where('total', '>', 3).and('note', 'like', '%50% off%'),
      sort: [desc('total'), asc('id')],
      join: { table: 'Orders', field: 'cid', foreignTable: 'Customers', foreignField: 'id' },
      offset: 10,
      take: 5,
      distinct: true,
      select: ['id', 'total'],
    });
    expect(result).toEqual({ data: [{ id: 1, total: 5 }], count: 42 });
    const url = m.calls[0]!.url;
    expect(url.pathname).toBe('/v1/data/table');
    const q = Object.fromEntries(url.searchParams);
    expect(q).toEqual({
      project: 'p1',
      table: '7',
      Offset: '10',
      Take: '5',
      JoinQuery: 'Orders;cid=Customers;id',
      WhereQuery: 'total;>;3&note;like;%2550%25%20off%25',
      SortQuery: 'total;desc,id;asc',
      distinct: 'true',
      select: 'id;total',
    });
    // The whole WhereQuery is percent-encoded once more in the URL, so the server's two decodes give the value back.
    expect(url.search).toContain('WhereQuery=total%3B%3E%3B3%26note%3Blike%3B%252550%2525%2520off%2525');
  });

  it('omits unset parameters', async () => {
    const m = mockFetch(() => ok([], { count: 0 }));
    await client(m.fetch).records.query(3);
    expect(m.calls[0]!.url.search).toBe('?project=p1&table=3');
  });

  it('iterates all pages using count, sorted on id by default', async () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }));
    const m = mockFetch((c) => {
      const offset = Number(c.url.searchParams.get('Offset'));
      const take = Number(c.url.searchParams.get('Take'));
      return ok(rows.slice(offset, offset + take), { count: rows.length });
    });
    const seen: number[] = [];
    for await (const r of client(m.fetch).records.iterate<{ id: number }>(1, { pageSize: 2, where: where('id', '>', 0) })) seen.push(r.id);
    expect(seen).toEqual([1, 2, 3, 4, 5]);
    expect(m.calls.map((c) => c.url.searchParams.get('Offset'))).toEqual(['0', '2', '4']);
    expect(m.calls.every((c) => c.url.searchParams.get('SortQuery') === 'id;asc')).toBe(true);
    expect(m.calls.every((c) => c.url.searchParams.get('WhereQuery') === 'id;>;0')).toBe(true);
  });

  it('all() collects and stops on an empty page', async () => {
    const m = mockFetch(
      () => ok([{ id: 1 }, { id: 2 }], { count: 10 }),
      () => ok([], { count: 10 }),
    );
    expect(await client(m.fetch).records.all(1, { pageSize: 2 })).toEqual([{ id: 1 }, { id: 2 }]);
    expect(m.calls).toHaveLength(2);
  });
});

describe('record writes', () => {
  it('create wraps one or many records in { records }', async () => {
    const m = mockFetch((c) => ok((c.body as { records: unknown[] }).records.map((r, i) => ({ id: i + 1, ...(r as object) }))));
    const c = client(m.fetch);
    expect(await c.records.create(2, { name: 'a' })).toEqual([{ id: 1, name: 'a' }]);
    await c.records.create(2, [{ name: 'a' }, { name: 'b' }]);
    expect(m.calls[0]!.method).toBe('POST');
    expect(m.calls[0]!.url.search).toBe('?project=p1&table=2');
    expect(m.calls[1]!.body).toEqual({ records: [{ name: 'a' }, { name: 'b' }] });
  });

  it('update sends record, idList and force', async () => {
    const m = mockFetch(() => ok([]));
    const c = client(m.fetch);
    await c.records.update(2, { id: 5, name: 'x' });
    expect(m.calls[0]!.body).toEqual({ record: { id: 5, name: 'x' } });
    expect(m.calls[0]!.url.searchParams.has('force')).toBe(false);
    await c.records.update(2, { done: true }, { ids: [1, 2] });
    expect(m.calls[1]!.body).toEqual({ record: { done: true }, idList: [1, 2] });
    await c.records.update(2, { done: false }, { force: true });
    expect(m.calls[2]!.url.searchParams.get('force')).toBe('true');
    expect(m.calls[2]!.method).toBe('PUT');
  });

  it('delete one, delete many and clear use the right routes', async () => {
    const m = mockFetch(() => ok(null));
    const c = client(m.fetch);
    await c.records.delete(2, 9);
    await c.records.deleteMany(2, [1, 2, 3]);
    await c.records.deleteMany(2, []);
    await c.records.clear(2);
    expect(m.calls.map((x) => `${x.method} ${x.url.pathname}${x.url.search}`)).toEqual([
      'DELETE /v1/data/table?project=p1&table=2&record=9',
      'POST /v1/data/table/delete?project=p1&table=2',
      'DELETE /v1/data/table/clear?project=p1&table=2',
    ]);
    expect(m.calls[1]!.body).toEqual(['1', '2', '3']);
  });

  it('downloads and uploads blobs', async () => {
    const bytes = new Uint8Array([1, 2, 3, 250]);
    const m = mockFetch(
      () => new Response(bytes, { status: 200, headers: { 'content-type': 'image/png' } }),
      () => ok(null),
    );
    const c = client(m.fetch);
    const blob = await c.records.downloadBlob(2, 9, 'Photo');
    expect(blob.type).toBe('image/png');
    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(bytes);
    expect(m.calls[0]!.url.search).toBe('?project=p1&table=2&record=9&field=Photo');

    await c.records.uploadBlob(2, 9, 'Photo', bytes, { filename: 'p.png', contentType: 'image/png' });
    const form = m.calls[1]!.rawBody as FormData;
    expect(form).toBeInstanceOf(FormData);
    const file = form.get('data') as File;
    expect(file.name).toBe('p.png');
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(bytes);
    expect(m.calls[1]!.headers['content-type']).toBeUndefined();
  });

  it('custom query and procedures', async () => {
    const m = mockFetch(() => ok({ columns: [], rows: [{ n: 1 }], count: 1, truncated: false, durationMs: 3 }));
    const c = client(m.fetch);
    const r = await c.query.execute<{ n: number }>('select count(*) n from Orders where city = @city', { city: 'Ghent' });
    expect(r.rows[0]!.n).toBe(1);
    expect(m.calls[0]!.body).toEqual({ query: 'select count(*) n from Orders where city = @city', parameters: { city: 'Ghent' } });
    await c.procedures.execute('monthly report', { month: 3 });
    expect(m.calls[1]!.url.pathname).toBe('/v1/procedures/monthly%20report/execute');
    expect(m.calls[1]!.body).toEqual({ parameters: { month: 3 } });
  });
});
