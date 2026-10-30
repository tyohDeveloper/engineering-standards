---
id: concepts/coding-standards-hosted-postgres
item_type: wiki_page
semantic_type: concept
title: Coding standards — hosted app with Postgres backend
description: Deployment-target standards for Replit-hosted server-backed apps with a Postgres database, layered on top of the shared foundation.
created_at: '2026-08-06T22:45:00+00:00'
updated_at: '2026-10-27T07:16:00+00:00'
---
# Coding standards — hosted app with Postgres backend

Standards for apps that need a server, a database, or persistent user state. Layers on top of [[concepts/coding-architecture-standards]] (build discipline, layer structure, testing, repo conventions, MIT/GitHub, commit style). Currently no app in [[projects/tyoh-app-tools-family]] uses this target; the standards exist so a future project (revived Income Tiles with server data, or any app that grows accounts) can bootstrap cleanly.

## What it is

Standards for tyoh.app apps that need a server, a database, or persistent user state. Layers on top of [[concepts/coding-architecture-standards]]. No app in [[projects/tyoh-app-tools-family]] currently uses this target; the standards exist so a future server-backed project can bootstrap cleanly.

## Stack

Replit-hosted, Postgres-backed, TypeScript throughout. Sensible defaults for the "Replit likes it and I want to keep momentum" case:

- **Runtime:** Node.js on Replit (LTS)
- **Server framework:** Fastify or Hono. Fastify if you want ecosystem depth; Hono if you might later move to an edge runtime. Both are fine.
- **Language:** TypeScript, strict mode, same as standalone target
- **Database:** Postgres. Replit provides managed Postgres; use it unless there's a reason not to.
- **Query layer:** Drizzle ORM for type-safe SQL, or plain `postgres`/`pg` with parameterized queries. Avoid heavy ORMs (Prisma is fine but generates more moving parts than usually needed at this scale).
- **Migrations:** Drizzle Kit if using Drizzle; otherwise `node-pg-migrate` or plain SQL files with a small runner. Migrations live in-repo and run automatically on deploy.
- **Frontend (if any):** the same standalone-HTML stack, or a Vite + framework SPA served by the same server. Keep the "SPA served as static from the server" pattern simple; avoid Next.js-style all-in-one frameworks unless the app actually needs SSR.
- **Auth:** Better Auth (TypeScript-first, MIT, self-hosted, works with Postgres via a Drizzle/Kysely adapter) is the current default. Lucia Auth is deprecated — no active development since March 2025, its own maintainers now recommend migrating to Better Auth — and Auth.js/NextAuth is in security-patch-only maintenance mode under the Better Auth team since September 2025, with new-project guidance pointing away from it. A hosted service (Clerk, Supabase Auth) remains a fallback when OAuth providers need to be wired up without writing them, at the cost of per-MAU billing past a free tier. Do not roll your own from scratch[cite:3].
- **Authorization:** CASL (MIT) for simple can-the-user-do-X-to-Y ability checks; node-casbin (Apache-2.0) when the policy model needs RBAC/ABAC sophistication, or must stay behaviorally consistent with a non-TypeScript service — Casbin ships production-ready ports for Java, Python, Go, .NET, and Rust (C++ port is beta) that all read the same policy-model files[cite:3].
- **Testing:** Playwright for E2E against a test database; unit tests for pure logic; integration tests for HTTP handlers hitting a real Postgres test instance.
- **CI:** GitHub Actions with a Postgres service container.

## Schema and migrations

- **Schema-first:** the schema is defined in code (Drizzle) or SQL migration files, not in the database first. The repo is the source of truth.
- **One migration = one commit** — never squash multiple schema changes into one file, and never edit a migration that has been applied to any environment past local dev.
- **Migrations run automatically on deploy** — the server startup checks for pending migrations and applies them before accepting traffic. Never run migrations manually in prod.
- **Rollback discipline** — every migration has a documented rollback path even if not automated. Some destructive changes (dropped columns, changed types) can't be rolled back and must be planned as multi-step migrations (add-new → dual-write → backfill → cut-over → drop-old).
- **Naming:** `YYYYMMDDHHMMSS_short_description.sql` or the ORM's equivalent. Ordered by timestamp, not sequence number.

## Query safety

- **Parameterized queries only** — never string concatenation, never template literals with untrusted values. Every query layer named above supports this natively; use it.
- **Prepared statements** — for hot-path queries, let the query layer prepare them. This is both a performance and a safety measure.
- **No raw SQL for DDL in application code** — schema changes happen through migrations, not at runtime.
- **Query timeouts** — set statement timeouts at the connection level so a bad query can't hold a connection forever.

## Authorization

- **Row-level security (RLS) as the default** — turn on RLS for every table with user data. Policies enforce "a user can only see their own rows" at the database layer, not the app layer. If the app-layer authorization check is forgotten, RLS still protects the data.
- **App-layer checks are defense in depth, not the primary line** — never rely on "the API endpoint checks the user ID" alone. That check will be missed somewhere.
- **Service role for admin operations** — when the server needs to bypass RLS (running migrations, background jobs, admin tools), use a separate service-role connection with its own credentials.
- **No client-side authorization** — anything the client sees, the client can bypass. Every check runs on the server.

## Connection management

- **PgBouncer or the equivalent** for connection pooling as soon as the app has any real traffic. Replit's managed Postgres may include this; verify.
- **Connection limits are per-app** — set them explicitly rather than defaulting to "as many as Postgres allows." A runaway app should degrade gracefully, not exhaust the pool for other apps.
- **No long-lived transactions from HTTP handlers** — transactions are short and scoped. Long-running work goes to background jobs.

## Secrets and configuration

- **Replit Secrets (not the repo)** — all database URLs, API keys, and auth secrets live in Replit's Secrets pane, exposed to the app as env vars. Never commit real secrets. `.env.example` in the repo documents which vars exist without values.
- **Environment separation** — at minimum, local dev, staging (optional), and production have distinct databases and distinct secret sets. Local dev uses a local Postgres or a scratch Replit database, not the prod one.
- **Seed scripts** — every environment has a reproducible seed script for a working baseline. `npm run seed` populates a fresh database with enough data to log in and click around.

## Backup and durability

- **Backup strategy decided from day one** — even for a toy app, answer: "if the database disappeared right now, what would I lose?" Options: Replit's managed backups (verify they exist and their retention), scheduled `pg_dump` to object storage, or a managed provider (Neon, Supabase) with PITR.
- **Point-in-time recovery (PITR)** — desirable for anything with real user data. If Replit's managed Postgres doesn't offer it and the app needs it, use an external provider.
- **Restore is tested, not assumed** — at least once, restore a backup to a scratch database and verify the app runs against it. Untested backups aren't backups.

## Rate limiting and abuse

- **Rate limit at the edge** — every public endpoint has a rate limit. Fastify/Hono both have plugins; use them from the first release rather than retrofitting after abuse.
- **Bot protection** — for public forms, either a hosted CAPTCHA (hCaptcha, Cloudflare Turnstile) or a proof-of-work challenge. Don't rely on hidden form fields alone.
- **Structured request logging with request IDs** — every request gets a unique ID; every log line includes it. Grepping by request ID reconstructs the whole story.

## Observability

- **Structured logs** — JSON-lines, not free-form. Fields: timestamp, level, request_id, user_id (if any), route, latency, status. Free-form message goes in a `msg` field.
- **Minimal metrics** — request count, latency percentiles, error rate, database connection count. Grafana/Prometheus is overkill for a solo project; a small `/metrics` endpoint plus log aggregation is enough.
- **Health check endpoint** — `/health` returns 200 with a small JSON body when the app is up and the database is reachable. Replit uses this for deployment health.

## Data placement

- **Postgres for transactional data** — rows, relationships, structured queries.
- **Object storage (S3-compatible) for blobs** — images, uploaded files, generated PDFs. Never blobs in Postgres. Replit may not include S3-compatible storage natively; if not, use Cloudflare R2 or a similar provider.
- **Redis / KV for ephemeral state** — session storage, rate-limit counters, caches. Postgres can do these but a dedicated KV is cheaper and faster. Skip until actually needed.

## Paste-into-Replit starter checklist

When starting a new hosted-Postgres app in Replit:

1. **Create the GitHub repo** (public, MIT). Add `README.md`, `LICENSE`, `.gitignore`. Set default branch `main`.
2. **Provision Replit Postgres** for the project. Copy the connection string into Replit Secrets as `DATABASE_URL`; add a `.env.example` referencing it without a value.
3. **Initialize the toolchain:** `npm init -y`, then add TypeScript, Fastify or Hono, Drizzle (or your chosen query layer), Playwright, and a testing library. Pin versions.
4. **Repo layout:** `src/server/` for routes and middleware, `src/db/` for schema and migrations, `src/client/` for frontend if colocated, `tests/` for E2E and integration. Pure logic goes in domain-named directories, never `src/lib/` — see the naming rule in `coding-architecture-standards`.
5. **First migration:** `users` table with columns for the auth library you chose (Lucia's expected shape, or the hosted service's requirements). Include RLS setup as part of this migration.
6. **Server skeleton:** health check, one authenticated route, one public route, structured logging, error handler, rate limiter.
7. **CI workflow:** GitHub Actions with a Postgres service container. Run migrations, then tests, then a build check.
8. **Initial commits:** `LICENSE` + `.gitignore` + `README.md`; toolchain skeleton; server skeleton with health check; first feature. Terse, decomposed[cite:1][cite:2].
9. **Deploy configuration:** Replit Deployments (or the equivalent) with the migration-on-startup entry point. Verify a cold deploy runs migrations before accepting traffic.
10. **Backup verification:** immediately after first deploy, take a backup and restore it to a scratch database. Document the procedure in `docs/ops/backup.md`.

## Explicit non-goals

- No shared database across unrelated apps — one app, one database
- No sensitive data client-side beyond a session token
- No custom-rolled auth from scratch
- No blob storage in Postgres
- No frontend framework choices that fight the "SPA served as static from the same server" pattern (Next.js-style SSR-everywhere is overkill here)

## See also

- [[concepts/coding-architecture-standards]] — shared foundation
- [[concepts/coding-standards-standalone-html5]] — the target this app "graduated from" if it started as a standalone
- [[projects/apple-music-library-curation]] — a server-backed app with an open database choice
- [[projects/replit-github-development-workflow]] — the coding-agent workflow this feeds into

## References

[cite:1]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/commit/c9ad870
[cite:2]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/commit/7215e1b
[cite:3]: pplx://sessions/1deda0c7-3fc4-4567-a8ed-b728a56ba165
