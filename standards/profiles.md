# Delivery Profiles

Status: Accepted by owner 2026-10-30 (ADR-0002). Not yet part of a policy release; the pinned baseline governs until release. Amendments of 2026-10-30 from the [wiki reconciliation](../governance/wiki-reconciliation.md) are applied pending verbatim confirmation of the companion pages. Defines the target-specific standards that the v2.2 baseline §17 delegates to companion wiki pages not yet exported; reconciliation with those pages is pending.

A delivery profile is a tuple of six declared dimensions. Rules bind to dimension values. Named profiles (§4) are shorthands only.

## 1. Dimensions and allowed values

| Dimension | Values | Meaning |
|---|---|---|
| `state` | `none`, `session`, `browser-local`, `device-durable`, `hosted-durable`, `shared-data` (reserved) | How long user data must survive and who holds it |
| `packaging` | `single-file`, `hosted-web`, `native-shell`, `server-cluster` (reserved), `batch` (reserved) | What the user installs or opens |
| `store` | `none`, `blob-only`, `sql+json`, `sql+json+blob` | Shape of persisted data |
| `identity` | `none`, `device-user`, `seeded-owner`, `authenticated` | How the current user is resolved |
| `network` | `none`, `optional-refresh`, `required` | Whether the application functions without connectivity |
| `compute` | `interactive`, `kernel` (reserved) | Whether numerical kernels are a first-class component |

Reserved values may not be declared by an application until an ADR removes the reservation. Rules in §3.7 still constrain today's code so the values stay reachable.

## 2. State classes

Each class states a guarantee and how it is verified. A storage engine never defines durability; the guarantee does.

### 2.1 `none`
No user data persists. Bundled read-only data is permitted.

### 2.2 `session` (window session)
Data survives reloads, navigation between pages of the same application, and switching away from the window or app. It ends on any of: the window or tab closes (where the platform reports it), an explicit end action (New, Done, Quit), or an idle limit declared by the application (default 24 hours).

Rules:
- A session identifier is held in tab-scoped storage (`sessionStorage` or shell equivalent). Session data is held in origin storage (IndexedDB or OPFS) or the shell's temporary directory, keyed by that identifier.
- On launch without a session identifier, the application creates one and deletes all other sessions' data.
- One writer per session, enforced with an exclusive lock (Web Locks API or shell equivalent). A second window on the same session is read-only with a visible notice.
- Platforms that kill suspended processes (iOS) are documented as ending the session only by the end action or idle limit, not by process death.
- Warn before close while unsaved output exists.

Verification: a manual procedure covering reload, page navigation, app switch, window close, duplicate tab.

### 2.3 `browser-local`
Data persists in origin storage under browser eviction rules. The application requests persistence (`navigator.storage.persist()`), ships export and import from the first release, and states in its README that the browser may evict data. Pages opened from `file://` are out of scope for this class because origin handling is inconsistent across browsers.

### 2.4 `device-durable`
Data persists in the application's per-OS-user container for the life of the installation and is included in OS backups. One store per OS user account.

Rules:
- Export and import through a versioned format from the first release.
- Migrations ship with the application and run at launch. They are forward-only. The data directory is backed up before migration; failure restores the backup and reports. This replaces the hosted rollback-block rule; the exception is recorded per §11 with owner and expiry.
- Third-party authorization may lapse during inactivity. A returning user sees their data with a reconnect prompt, never an empty store.

Verification per release: data survives application update, OS restart, and an OS backup-and-restore cycle, by documented procedure.

### 2.5 `hosted-durable`
Data persists in server Postgres under the operator's backups.

Rules:
- Scheduled logical backups or provider backups with a tested restore.
- Migrations with rollback blocks per the baseline; timestamp-prefixed names; one migration per commit; never edit an applied migration; applied automatically before the application accepts traffic.
- Row-level security on every user-owned table is mandatory for this class (companion page `coding-standards-hosted-postgres`, pending verbatim confirmation). The application-layer scoping invariant (§3.3, C-10) is additionally required so the same code is correct in classes where RLS is unavailable.
- Environment separation: distinct databases and secret sets for development, test and production; a committed `.env.example`; a seed script for the owner and an empty store.
- A separate service role for migrations and administration from the role the application uses for requests.
- Statement timeouts and explicit pool limits per role; request transactions are short and bounded; long-running work runs through `Jobs`, not in request handlers.
- Parameterized queries only.
- Health endpoint that checks the database; structured logs with request identifiers; rate limiting on public endpoints.
- With `identity = seeded-owner`, an access gate (private network, identity-aware proxy, or localhost) stands in front of the application.

### 2.6 `shared-data` (reserved)
Multiple applications read and write one database. Constraints only, in §3.7.

## 3. Rules bound to dimension values

### 3.1 Packaging
- `single-file`: the companion page `coding-standards-standalone-html5` (pending verbatim confirmation) defines the `single-file` + `state = none` + `network = none` combination exactly: no origin storage of any kind, no network APIs (`fetch`, `XMLHttpRequest`, `sendBeacon`, WebSocket, Service Worker, WebRTC, EventSource, `importScripts`), no external resource URLs, a Content-Security-Policy meta tag, URL fragment or query string as the only shareable state, client-generated downloads only, user-initiated links with `rel="noopener noreferrer"`. The no-network and external-resource assertions and the artifact contract apply to every `single-file` artifact regardless of `state`. Origin storage (IndexedDB or OPFS) is permitted only when `state = session` is declared and the §2.2 lock and cleanup rules are met; `state = browser-local` with `single-file` requires an exception. No embedded database engine (WASM Postgres or SQLite). The §7.6 size baseline applies.
- `hosted-web`: installable (web manifest, offline shell) when `state` is `session` or `browser-local`.
- `native-shell`: the bundle contains all executable code; no remotely loaded scripts (Apple App Review 2.5.2). The shell must add native value beyond displaying pages (App Review 4.2): file pickers, sharing, OS-container storage. Pages are served from a stable custom origin, never `file://`. Shells target desktop (macOS, Windows, Linux) and iOS; ChromeOS is served by `hosted-web`.

### 3.2 Store
- One SQL dialect: Postgres, limited to features the embedded WASM build supports, so `hosted-durable` and `device-durable` editions share schema and migrations.
- Rows hold identity, relationships, constraints, and any attribute that is filtered, joined or sorted. `jsonb` holds source payloads, provenance, and unmodeled attributes.
- No references inside JSON documents that need integrity; such references become foreign-key columns.
- Every JSON document carries a `schemaVersion` and is validated at the boundary on read and write.
- A JSON field that becomes a query target is promoted to a column. JSON indexes require a measured need.
- Binaries live in `Blobs`, never in the database. `blob-only` stores are content-addressed and scoped by session or user.
- Export formats are versioned independently of the database schema.

### 3.3 Identity and scoping
- Every user-owned row carries `user_id`. Libraries or workspaces belong to a user; third-party accounts link to a user and are not the user.
- Scoping filters are domain invariants in STATE or PURE and are unit-tested there. Database row-level security is mandatory for `hosted-durable` (§2.5) and unavailable in embedded engines; the application-layer invariant is what makes the code portable between the two.
- `device-user`: a UUID created on first launch in the OS account's container.
- `seeded-owner`: one owner row seeded at setup; no login UI. Requires the §2.5 access gate.
- `authenticated`: login through a real session. Not required for any current application.
- No uniqueness rule may assume a single user. No sharing or visibility features exist until an ADR adds them.

### 3.4 Editions
Editions of one application with different `packaging` are separate MODELs. They do not synchronize. Interchange is export/import only. Synchronization requires an ADR.

### 3.5 Network
- `optional-refresh`: all stored data is readable offline; remote calls only add or update.
- `required`: the application may refuse to start without connectivity but must still fail with a message, not a blank page.

### 3.6 Platform ports
Ports are typed interfaces with semantic names, not implementations. Core code (PURE, STATE, DATA) imports none of them; CONTROLLER mediates. Each port has a default implementation per packaging value. An application may substitute another implementation by recording the choice and reason in its adoption record (`profile.ports[].implementation`); substitution is a declaration, not an exception, unless it breaks a rule in §2 or §3.

| Port | Role | Contract | Default: single-file / hosted-web | Default: native-shell | Default: hosted server |
|---|---|---|---|---|---|
| `Store` | MODEL (hosted, device) or REMOTE (shared-data) | Drizzle, Postgres dialect, PGlite subset | PGlite (IndexedDB) for `browser-local`; forbidden for `single-file` | PGlite in the app container (supersedes the companion page's SQLite-first guidance; ADR-0002) | Postgres |
| `Blobs` | PLATFORM-AMBIENT | Content-addressed, scoped by session or user | OPFS, IndexedDB fallback | App container directory | Object storage or filesystem |
| `Files` | PLATFORM-AMBIENT | Pick, save, share | File System Access API, `<input type=file>` and download fallback | Native dialogs via the shell | Upload/download endpoints |
| `Secrets` | PLATFORM-AMBIENT | Get and set by name; never logged | None (no secrets in browser-only profiles) | OS keychain via the shell | Environment or KMS |
| `Jobs` | PLATFORM-AMBIENT | Resumable from checkpoint; one run per scope; progress and cancellation | Web Worker | Web Worker or shell background task | Server worker |
| `Identity` | PLATFORM-AMBIENT | Resolves current user identifier only | None or stored UUID | OS-account UUID (`device-user`) | Seeded owner or session |
| Clock, identifiers | PLATFORM-PURE binding (§18) | UTC; UUID v7 | Mandated binding | Mandated binding | Mandated binding |

An adoption record lists which ports the application uses and, where it departs from the default, the implementation chosen. Applications also commit two declaration files from the PLATFORM/MODEL/REMOTE companion page: a datastore-ownership file naming the MODEL or REMOTE owner of each store, and a PLATFORM-PURE allowlist of permitted deterministic platform modules (C-4, C-25).

### 3.7 Reserved-value constraints (apply to all applications now)
- Identifiers are UUIDs; no per-table sequences in exported or shared data.
- Timestamps are stored in UTC with explicit offsets at boundaries.
- Integrity constraints that matter are enforced in the database, not only in client code.
- Write operations are idempotent or carry an idempotency key.
- Numerical code is isolated in PURE modules with typed-array interfaces, declared precision, deterministic results, and no I/O, so a kernel can move to a native or batch binding without touching the application.

## 4. Named profiles (shorthands)

| Profile | state | packaging | store | identity | network | compute |
|---|---|---|---|---|---|---|
| Standalone static | none | single-file | none | none | none | interactive |
| Standalone session | session | single-file or native-shell | blob-only | none | none | interactive |
| Browser-local tool | browser-local | hosted-web | blob-only or sql+json | none | none or optional-refresh | interactive |
| Packaged local | device-durable | native-shell | sql+json+blob | device-user | optional-refresh | interactive |
| Hosted | hosted-durable | hosted-web | sql+json+blob | seeded-owner or authenticated | required | interactive |
| Shared-data enterprise (reserved) | shared-data | server-cluster | sql+json+blob | authenticated | required | interactive |
| Numerical (reserved) | any | batch or any | any | any | any | kernel |

## 5. Declaration and checks

- Applications declare all six dimensions and the ports used in `STANDARDS-ADOPTION.json` schema version 2.
- Hub check: presence and allowed values (`tools/validate.mjs`).
- Application checks: import direction for ports; engine prohibition under `single-file`; bundle completeness under `native-shell`; backup-before-migrate under `device-durable`; scoping invariant tests under any `identity` other than `none`.
- Architecture review adds: declared profile matches ports and store actually used.

## 6. External constraints referenced

- WebKit storage eviction: [Tracking Prevention](https://webkit.org/tracking-prevention/) and [Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/).
- Apple App Review Guidelines [2.5.2 and 4.2](https://developer.apple.com/app-store/review/guidelines/).
- PGlite [filesystems](https://pglite.dev/docs/filesystems) and [Drizzle PGlite driver](https://orm.drizzle.team/docs/connect-pglite).
- MusicKit [automatic token generation](https://developer.apple.com/documentation/MusicKit/Using-Automatic-Token-Generation-for-Apple-Music-API) (Apple platforms) versus [developer tokens](https://developer.apple.com/documentation/applemusicapi/generating-developer-tokens) (other platforms require a signing service).
