# SQL Binding (Draft Stub)

Status: Draft stub (ADR-0003). Not normative. Becomes a proposed binding when adopted by the first application with `store` other than `none` at adoption schema version 2.

Class: `schema`. Applicability follows the `schema` column in [coding-core.md](../coding-core.md).

## Purpose

Shipped data definitions: DDL, migrations, seed data, constraints, and database functions, in the Postgres dialect limited to the subset supported by the embedded WASM build so that hosted and device-durable editions share one schema (profiles §3.2).

## Expected toolchain and mechanisms (proposed)

- Migration tool named by the application (Drizzle Kit is the current default for TypeScript applications); migrations are files committed with the application, numbered and immutable once released.
- `hosted-durable`: up and down blocks per the baseline. `device-durable`: forward-only with backup-before-migrate and restore-on-failure (profiles §2.4); the departure from the baseline is a recorded exception with owner and expiry.
- Each migration runs in one transaction where Postgres allows it; a failure leaves the previous state (C-17).
- CI applies all migrations to an empty database and to a snapshot from the previous release (C-19).
- Constraints that matter (foreign keys, uniqueness, check constraints) live in the schema (profiles §3.8). Scoping to a user, library or session is not a schema obligation (C-10 not applicable). Row-level security policies required by profiles §2.5 for `hosted-durable` are written in this binding as a profile obligation, not a C-10 obligation.
- No domain calculation in database functions (C-5 trigger); functions are limited to integrity and indexing support.
- Schema is the single source for row types; application types are generated from it (C-30).
- `sqlfluff` or the migration tool's linter; a dialect-subset check against the PGlite support list.
- No credentials in migration files or seed data (C-31).

## Rule matrix

To be completed. Until then, the `schema` class column sets the minimum obligations.
