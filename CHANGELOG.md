# Changelog

## 2.0.0

A rewrite for the StellarDS v2 API. Breaking: see "Migrating" in the README.

### Added
- One `StellarDS` client with resource groups: `projects`, `tables`, `fields`, `records`, `query`, `procedures`,
  `relations`, `roles`, `permissions`, `audit`, `webhooks`, `users`, `applications`, `projectTiers`, `oauth`.
- OAuth 2.0: automatic refresh before expiry and once on a 401 (one shared refresh for concurrent requests),
  `onTokens` callback, authorization-code helpers (`oauth.authorizeUrl`, `oauth.exchangeCode`, `oauth.revoke`).
- `StellarDsError` with `kind`, `status`, `messages`, `body`, `rawBody` and `retryAfter`.
- Timeouts (`timeoutMs`) and `AbortSignal` on every call; custom `fetch`.
- Record queries with typed results, a `where()` filter builder, sort and join helpers, `records.iterate()` /
  `records.pages()` / `records.all()` paging.
- `FieldType` builders for every field type, including Decimal, Date, Time, DateTimeOffset, Uuid, Json and Enum,
  and `FieldValue` converters; decimals and bigints are sent as exact JSON numbers.
- `verifyWebhookSignature()` and `constructWebhookEvent()` using WebCrypto (Node 18+, browsers, edge runtimes).
- Builds: ESM, CommonJS, type declarations, and a script-tag bundle exposing the `StellarDS` global. This package
  replaces the deprecated `stellards-js-sdk`.

### Removed
- `AuthService`, `ProjectService`, `TableService` and the `services/*` deep imports.
- OpenAPI generator leftovers and the AG-Grid demo (replaced by `examples/`).

### Fixed
- Record reads no longer read the response body twice.
- No console logging; the base URL is configurable.
