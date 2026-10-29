# StellarDS SDK for JavaScript and TypeScript

The official client for the [StellarDS.io](https://stellards.io) v2 API. One package for every JavaScript runtime:

- **Node.js 18+**, Deno, Bun and edge runtimes (ESM and CommonJS)
- **Browsers**, through your bundler or a plain `<script>` tag
- **TypeScript** types for every request and response

It has no runtime dependencies: it uses the platform's `fetch` and WebCrypto.

> This package replaces both the 1.x versions of `stellards_typescript_sdk` and the deprecated `stellards-js-sdk`
> package. See [Migrating](#migrating) below.

## Contents

- [Install](#install)
- [Quick start](#quick-start)
- [Authentication](#authentication)
- [Projects and the default project](#projects-and-the-default-project)
- [Resources](#resources)
- [Field types and values](#field-types-and-values)
- [Webhooks](#webhooks)
- [Errors, timeouts and cancellation](#errors-timeouts-and-cancellation)
- [Examples](#examples)
- [Migrating](#migrating)
- [Development](#development)

## Install

```sh
npm install stellards_typescript_sdk
```

Or without a build step, from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/stellards_typescript_sdk@2/dist/stellards.global.min.js"></script>
<script>
  const client = new StellarDS({ accessToken: '...', project: '...' });
</script>
```

The script-tag build defines one global, `StellarDS`: the client class, with every helper attached
(`StellarDS.where`, `StellarDS.FieldType`, `StellarDS.verifyWebhookSignature`, `StellarDS.StellarDsError`, ...).

## Quick start

```ts
import { StellarDS, where, desc } from 'stellards_typescript_sdk';
// CommonJS: const { StellarDS, where, desc } = require('stellards_typescript_sdk');

const client = new StellarDS({
  accessToken: process.env.STELLARDS_TOKEN,
  project: process.env.STELLARDS_PROJECT, // the project id (a GUID)
});

const tables = await client.tables.list();

interface Order { id: number; customer: string; total: number }

const { data, count } = await client.records.query<Order>(tables[0].id, {
  where: where('total', '>', 100).and('customer', 'like', 'A%'),
  sort: desc('total'),
  take: 20,
});
console.log(`${count} matching orders, first: ${data[0]?.customer}`);
```

## Authentication

### Static access token

Create an access token in the StellarDS app under **Applications > Access tokens** and pass it as `accessToken`.
Anyone with the token can act with its role, so keep it on servers; don't ship it in a public web page.

```ts
const client = new StellarDS({ accessToken: process.env.STELLARDS_TOKEN, project });
client.setAccessToken(newToken); // swap it later if needed
```

### OAuth 2.0 with automatic refresh

For apps that people sign in to, register an OAuth application (**Applications > OAuth applications**) to get a
client id and secret. Give the SDK the credentials and a refresh token; it then:

- refreshes the access token shortly (60 s) before it expires,
- refreshes once when a request gets a 401, and retries that request once,
- shares one refresh between concurrent requests,
- calls `onTokens` whenever the tokens change, so you can persist them. The SDK never stores tokens itself.

```ts
const client = new StellarDS({
  project,
  oauth: {
    clientId: process.env.STELLARDS_CLIENT_ID!,
    clientSecret: process.env.STELLARDS_CLIENT_SECRET!,
    redirectUri: 'https://myapp.example/callback',
    refreshToken: await db.loadRefreshToken(user), // from an earlier sign-in, if any
  },
  onTokens: (tokens) => db.saveTokens(user, tokens), // { accessToken, refreshToken, expiresAt, tokenType }
});
```

The authorization-code flow (do this on a server: it needs the client secret):

```ts
// 1. Send the user to the sign-in page.
const state = crypto.randomUUID();
session.oauthState = state;
res.redirect(client.oauth.authorizeUrl({ state }));
// -> https://stellards.io/oauth?response_type=code&client_id=...&redirect_uri=...&state=...

// 2. On your redirect URI, exchange the code. The client is signed in afterwards and onTokens is called.
const tokens = await client.oauth.exchangeCode({ code: req.query.code });

// Later: sign out by revoking the refresh token.
await client.oauth.revoke();
```

The sign-in page URL is `https://stellards.io/oauth` by default; change it with the `authorizeUrl` option. The token
endpoint supports the `authorization_code` and `refresh_token` grants.

## Projects and the default project

Almost every call works inside a project. Set a default with the `project` option, override it per call with
`{ project }` in the last argument, or derive a client for another project that shares the connection and tokens:

```ts
await client.tables.list();                       // default project
await client.tables.list({ project: otherId });   // one call
const other = client.withProject(otherId);        // a client for another project
```

## Resources

Every method returns a promise of the unwrapped `data` of the StellarDS response and takes an optional last argument
`{ signal?, timeoutMs?, project? }`. Ids of tables, fields, records, webhooks and relations are numbers; ids of
projects, roles, clients and access tokens are GUID strings.

### projects

```ts
await client.projects.list();
await client.projects.get();                        // the default project, or get(id)
const p = await client.projects.create({ name: 'Shop', isMultitenant: false, allowNewUsers: false });
await client.projects.update({ name: 'Shop 2', isMultitenant: false, allowNewUsers: true }, { project: p.id });
await client.projects.delete({ project: p.id });
await client.projects.users({ page: 1, pageSize: 50 });   // { totalCount, users }
await client.projects.userCount();
await client.projects.invitedUsers();
await client.projects.appAccess();
await client.projects.log(new Date());              // HTTP request log of one day
await client.projects.getOAuthDesign();
```

### tables and fields

```ts
import { FieldType } from 'stellards_typescript_sdk';

const table = await client.tables.create({ name: 'Orders', description: 'Web shop orders', isMultitenant: false });
await client.tables.get(table.id);                  // or by name: get('Orders')
await client.tables.update(table.id, { name: 'Orders', description: 'All orders', isMultitenant: false });

await client.fields.create(table.id, { name: 'Customer', type: FieldType.nvarchar(200) });
await client.fields.create(table.id, { name: 'Total', type: FieldType.decimal(10, 2) });
const status = await client.fields.create(table.id, { name: 'Status', type: FieldType.enum(['open', 'paid']) });
// Rename an enum value; existing records are remapped.
await client.fields.update(table.id, status.id, {
  name: 'Status', type: 'Enum', options: ['open', 'settled'], replaceOptions: { paid: 'settled' },
});
await client.fields.list(table.id);
await client.fields.delete(table.id, status.id);
await client.tables.delete(table.id);
```

### records

```ts
import { where, asc, desc, FieldValue } from 'stellards_typescript_sdk';

// Query one page. `count` is the total number of matches.
const page = await client.records.query<Order>(tableId, {
  where: where('status', 'in', ['open', 'paid']).and('deletedAt', 'null', true),
  sort: [desc('total'), asc('id')],
  select: ['id', 'customer', 'total'],
  offset: 0,
  take: 50,
});

// Every record, page by page (100 per request by default, sorted on id unless you pass sort).
for await (const order of client.records.iterate<Order>(tableId, { where: where('total', '>', 0), pageSize: 200 })) {
  console.log(order.id);
}
const everything = await client.records.all<Order>(tableId);

// Create one or many; you get them back with their ids.
const [created] = await client.records.create<Order>(tableId, { customer: 'Ann', total: FieldValue.decimal('19.99') });
await client.records.create(tableId, [{ customer: 'Bob' }, { customer: 'Cy' }]);

// Update: by the id in the record, by ids, or (force) every record.
await client.records.update(tableId, { id: created.id, total: 25 });
await client.records.update(tableId, { status: 'paid' }, { ids: [1, 2, 3] });
await client.records.update(tableId, { status: 'open' }, { force: true });

await client.records.delete(tableId, created.id);
await client.records.deleteMany(tableId, [4, 5, 6]);
await client.records.clear(tableId);                 // deletes every record

// Blob fields (up to 1 MB).
await client.records.uploadBlob(tableId, recordId, 'Photo', file, { filename: 'photo.jpg', contentType: 'image/jpeg' });
const blob = await client.records.downloadBlob(tableId, recordId, 'Photo'); // a Blob
```

Filters: `where(field, operator, value)` with `.and(...)` / `.or(...)`, evaluated left to right. Operators: `=`, `!=`,
`>`, `<`, `>=`, `<=`, `like`, `notlike`, `in` and `notin` (an array), `null` (`true` = is null, `false` = is not
null). Values are encoded for you, so `;`, `&`, `|` and `%` in values are safe; values of `in` cannot contain commas.
Json fields can only be filtered with `null`. Joins:
`join: { table: 'Orders', field: 'customerId', foreignTable: 'Customers', foreignField: 'id' }`.
Raw `WhereQuery`, `SortQuery` and `JoinQuery` strings are accepted too.

### query (custom SQL)

```ts
const result = await client.query.execute<{ city: string; n: number }>(
  'select City as city, count(*) as n from Customers where Country = @country group by City',
  { country: 'BE' },
);
result.rows; result.columns; result.count; result.truncated; result.durationMs;
```

### procedures

```ts
await client.procedures.create({
  name: 'monthly_totals',
  parameters: [{ name: 'month', type: 'Int', required: true }],
  steps: [{ name: 'totals', sql: 'select sum(Total) as total from Orders where month(CreatedAt) = @month' }],
});
const run = await client.procedures.execute('monthly_totals', { month: 3 });
run.results[0].rows;
const proc = await client.procedures.get('monthly_totals');
await client.procedures.update('monthly_totals', { ...proc, description: 'Sum per month' }); // 409 if someone saved a newer version
await client.procedures.list();
await client.procedures.delete('monthly_totals');
```

### relations

```ts
const check = await client.relations.check(ordersId, customerFieldId, customersId); // { isValid, requiresConversion, orphanCount, ... }
const rel = await client.relations.create(ordersId, {
  fromFieldId: customerFieldId, toTableId: customersId, onDelete: 'Restrict', convertToBigInt: check.requiresConversion,
});
await client.relations.update(ordersId, rel.id, { onDelete: 'Cascade' });
await client.relations.list({ tableId: ordersId });
await client.relations.delete(ordersId, rel.id);
await client.relations.getLayout();
await client.relations.saveLayout([{ tableId: ordersId, x: 120, y: 80 }]);
```

### roles and permissions

```ts
const template = await client.roles.template();
const role = await client.roles.create({ name: 'Support', description: 'Read-only', permissions: template.permissions });
await client.roles.update(role.id, { name: 'Support', description: 'Read and comment', permissions: role.permissions });
await client.roles.updateTable(role.id, {
  tableName: 'Orders', readTable: true, readRecords: true, createRecord: false, updateRecord: false,
  deleteRecord: false, updateTable: false, updateTableMetadata: false,
});
await client.roles.duplicate(role.id, { name: 'Support 2', description: 'Copy' });
await client.roles.list(); await client.roles.get(role.id); await client.roles.simple();
await client.roles.topLevel(role.id); await client.roles.getTable(role.id, 'Orders');
await client.roles.tableRolePermissions('Orders');
const matrix = await client.roles.getMatrix(); await client.roles.updateMatrix({ roles: [/* ... */] });
await client.roles.delete(role.id);
await client.permissions.info();          // names and descriptions of all permissions
await client.users.permissions();         // what the current user may do in the project
```

### audit

```ts
const { audits, count } = await client.audit.schema({ take: 20, offset: 0 });
await client.audit.management({ take: 20 });
await client.audit.rollback(audits[0].id);          // only the last transaction unless { force: true }
```

### webhooks

```ts
const hook = await client.webhooks.create({
  url: 'https://myapp.example/stellards', events: ['record.created', 'record.updated'], tableIds: [ordersId],
});
saveSecret(hook.secret); // shown only now (and on rotate)
await client.webhooks.test(hook.id);              // sends a ping
const rotated = await client.webhooks.rotateSecret(hook.id);
const deliveries = await client.webhooks.deliveries(hook.id, { take: 20 });
await client.webhooks.redeliver(hook.id, deliveries[0].id);
await client.webhooks.update(hook.id, { url: hook.url, isActive: false });
await client.webhooks.list(); await client.webhooks.get(hook.id); await client.webhooks.delete(hook.id);
```

Event types: `record.created`, `record.updated`, `record.deleted`, `table.created`, `table.updated`,
`table.deleted`, `field.created`, `field.updated`, `field.deleted`. Without `events` a webhook gets the record events.

### users

```ts
await client.users.me();                                  // { username, email }
await client.users.invite({ email: 'ann@example.com', role: roleId, allowAppAccess: true });
await client.projects.invitedUsers();
await client.users.updateInvitation(invitationId, { email: 'ann@example.com', role: otherRoleId, allowAppAccess: false });
await client.users.revokeInvitation(invitationId);
await client.users.updateAccess({ email: 'ann@example.com', role: roleId, hasApplicationAccess: true });
await client.users.removeAccess('ann@example.com');
await client.users.deleteMe();                            // deletes your account
```

### applications (access tokens and OAuth clients)

```ts
import { DurationUnit } from 'stellards_typescript_sdk';

const created = await client.applications.createAccessToken({ name: 'CI', role: roleId, duration: 30, span: DurationUnit.Days });
created.access_token; // the token, shown only now
await client.applications.listAccessTokens();
await client.applications.regenerateAccessToken(created.metadata.id);
await client.applications.deleteAccessToken(created.metadata.id);

const app = await client.applications.createClient({ name: 'Web', role: roleId, redirectUrls: ['https://myapp.example/callback'] });
app.clientId; app.clientSecret; // the secret is shown only now
await client.applications.regenerateClientSecret(app.clientId);
await client.applications.listClients();
await client.applications.deleteClient(app.clientId);
```

### project tiers and ping

```ts
await client.projectTiers.get();      // the tier's limits: { name, users, tables, maxRequests }
await client.projectTiers.current();  // current usage in the same shape
await client.ping();                  // 'pong', no token needed
```

## Field types and values

`FieldType` builds the type strings the server accepts:

| Helper | Type string | JSON value |
| --- | --- | --- |
| `FieldType.nvarchar(n)` / `nvarchar('max')` | `NVarChar(n)` / `NVarChar(max)` | string |
| `tinyInt()`, `smallInt()`, `int()`, `bigInt()` | `TinyInt` ... `BigInt` | number |
| `real()`, `float()` | `Real`, `Float` | number |
| `decimal(p, s)` | `Decimal(p,s)` (default 18,2) | number, never a string |
| `boolean()` | `Boolean` | `true` / `false` |
| `dateTime()` | `DateTime` | ISO 8601 |
| `date()` | `Date` | `"yyyy-MM-dd"` |
| `time()` | `Time` | `"HH:mm:ss"` |
| `dateTimeOffset()` | `DateTimeOffset` | ISO 8601 with offset |
| `uuid()` | `Uuid` | string |
| `json()` | `Json` | any JSON value, inline |
| `enum(['a', 'b'])` | `Enum` + options | one of the options |
| `blob()` | `Blob` | via `uploadBlob` / `downloadBlob` |

When writing records, plain values work for most types: numbers, strings, booleans, objects for Json, and `Date`
objects for DateTime and DateTimeOffset (sent as UTC ISO 8601). `FieldValue` produces the other exact forms:

```ts
import { FieldValue } from 'stellards_typescript_sdk';

await client.records.create(tableId, {
  Day: FieldValue.date(new Date()),                         // "2026-10-29"
  At: FieldValue.time({ hours: 9, minutes: 30 }),           // "09:30:00"
  Local: FieldValue.dateTime(new Date()),                   // "2026-10-29T09:30:00.000" (no offset)
  Stamp: FieldValue.dateTimeOffset(new Date()),             // "2026-10-29T09:30:00.000+01:00"
  Price: FieldValue.decimal('12345678901234.56'),           // 12345678901234.56, every digit kept
  Big: 9007199254740993n,                                   // bigint is sent as a JSON number too
});
```

Responses are parsed with `JSON.parse`, so numbers beyond 2^53 (very large BigInt ids, high-precision decimals) lose
precision when read. Keep such values below 2^53 or read them through a custom query that casts them to text.

## Webhooks

Each delivery carries `StellarDS-Signature: t=<unix seconds>,v1=<hex>[,v1=<hex>]` (one `v1` per valid secret during
a rotation) and `StellarDS-Event-Id`. Verify the **raw** body before parsing it. Verification uses WebCrypto, so it
works in Node 18+, browsers, Deno, Bun, Cloudflare Workers and other edge runtimes, and is async.

```ts
import { verifyWebhookSignature, constructWebhookEvent } from 'stellards_typescript_sdk';

// Express: app.post('/stellards', express.raw({ type: 'application/json' }), handler)
async function handler(req, res) {
  const ok = await verifyWebhookSignature({
    payload: req.body,                                  // Buffer / Uint8Array / string: the raw body
    header: req.get('StellarDS-Signature'),
    secret: process.env.STELLARDS_WEBHOOK_SECRET!,      // or [newSecret, oldSecret] around a rotation
    // toleranceSeconds: 300 (default)
  });
  if (!ok) return res.status(401).end();
  const event = JSON.parse(req.body.toString('utf8'));
  // Deduplicate on event.id / the StellarDS-Event-Id header: deliveries can repeat.
  res.status(200).end();
}

// Or verify and parse in one go (throws a StellarDsError with status 401 when invalid):
const event = await constructWebhookEvent({ payload: rawBody, header, secret });
event.type; event.table?.name; event.data.record; event.data.changed;
```

The check refuses timestamps more than 5 minutes from now and compares signatures in constant time.

## Errors, timeouts and cancellation

Every failure is a `StellarDsError`:

```ts
import { StellarDsError } from 'stellards_typescript_sdk';

try {
  await client.tables.get(12345);
} catch (e) {
  if (e instanceof StellarDsError) {
    e.kind;       // 'http' | 'api' | 'network' | 'timeout' | 'auth' | 'config' | 'parse'
    e.status;     // HTTP status, 0 without a response
    e.messages;   // [{ code, message, type }] from the server
    e.code;       // first message code, e.g. 'NotFound'
    e.body;       // parsed body; e.rawBody: the text as received
    e.retryAfter; // seconds, on a 429
  }
}
```

`http` is a non-2xx response; `api` a 2xx response whose envelope says `isSuccess: false`. The SDK never logs.

Requests time out after 30 s by default (`timeoutMs` on the client or per call; 0 disables). Every call accepts an
`AbortSignal`; aborting rejects with the signal's reason (an `AbortError`), not a `StellarDsError`:

```ts
const controller = new AbortController();
const page = client.records.query(tableId, { take: 100 }, { signal: controller.signal, timeoutMs: 5000 });
controller.abort();
```

Use the `fetch` option to supply your own implementation (older runtimes, proxies, tests).

## Examples

- [`examples/vite-demo`](examples/vite-demo): a Vite + TypeScript page that lists tables and pages through records.
  Run `npm install && npm run build` in the repo root, then in `examples/vite-demo` copy `.env.example` to
  `.env.local`, fill in a token and project id, and run `npm install && npm run dev`.
- [`examples/browser.html`](examples/browser.html): the script-tag build, no tooling. Open it after `npm run build`.
- [`examples/webhook-receiver.mjs`](examples/webhook-receiver.mjs): a `node:http` webhook receiver with signature
  verification and deduplication.

## Migrating

### From `stellards_typescript_sdk` 1.x

2.0 is a rewrite for the v2 API. The separate `AuthService`, `ProjectService` and `TableService` classes are replaced
by one `StellarDS` client, and methods now return the unwrapped `data` instead of the raw `{ data, isSuccess }`
response, throwing a `StellarDsError` on failure.

| 1.x | 2.0 |
| --- | --- |
| `new TableService(token, projectId)` | `new StellarDS({ accessToken: token, project: projectId })` |
| `projectService.listProjects()` | `client.projects.list()` |
| `tableService.getTables(projectId)` | `client.tables.list()` |
| `createTable / updateTable / deleteTable` | `client.tables.create / update / delete` |
| `getTableFields / addField / updateField / deleteField` | `client.fields.list / create / update / delete` |
| `getTableData(projectId, tableId)` | `client.records.query(tableId, { ... })` (or `iterate` / `all`) |
| `addRecords(projectId, tableId, records)` | `client.records.create(tableId, records)` |
| `updateRecords(...)` | `client.records.update(tableId, record, { ids })` |
| `deleteRecords(projectId, tableId, id)` | `client.records.delete(tableId, id)` / `deleteMany` |
| `clearTable` | `client.records.clear(tableId)` |
| `downloadBlob / uploadBlob` | `client.records.downloadBlob / uploadBlob` |
| `authService.getUserDetails(token)` | `client.users.me()` |
| `authService.getUserPermissions(projectId, token)` | `client.users.permissions()` |
| `authService.revokeToken(token)` | `client.oauth.revoke(refreshToken)` |

The package is now ESM-first with a CommonJS build; the deep import `stellards_typescript_sdk/services/*` is gone.

### From `stellards-js-sdk` (deprecated)

`stellards-js-sdk` was a generated client for the original v1 API. Uninstall it and install this package:

```sh
npm uninstall stellards-js-sdk
npm install stellards_typescript_sdk
```

- Instead of configuring `ApiClient.instance` and creating `DataApi`, `TableApi`, `FieldApi`, `ProjectApi`, ... objects,
  create one `new StellarDS({ accessToken, project })` and use its resource properties (`records`, `tables`, `fields`,
  `projects`, ...).
- Callbacks and superagent responses are replaced by promises that resolve to the data.
- Browser pages that loaded `https://stellards.io/js/stellardssdk.js` and used `window.stellards_js_sdk` should load
  `dist/stellards.global.min.js` from this package (for example from jsDelivr, see [Install](#install)) and use the
  `StellarDS` global.
- `WhereQuery` / `SortQuery` / `JoinQuery` strings still work as-is; `where()`, `asc()`/`desc()` and join objects
  build them for you.

## Development

```sh
npm install
npm run typecheck   # tsc --noEmit, strict
npm test            # vitest, fetch is mocked: no network calls
npm run build       # tsup -> dist/
```

`dist/` contains `index.js` (ESM), `index.cjs` (CommonJS), `index.d.ts` / `index.d.cts` and
`stellards.global.js` / `stellards.global.min.js` (script tag). It is built on publish and not committed.

## License

[Unlicense](https://unlicense.org)
