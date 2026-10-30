# ADR-0002: Delivery Profiles as Declared Dimensions

## Status and date

Accepted by owner, 2026-10-30 (decisions 1–4 below). Owner: David Hoyt / tyohDeveloper. Not yet part of a normative policy release; the migration steps in governance/authority-and-release.md (wiki export and reconciliation) remain prerequisites to release. Not adopted by any application.

## Context

The imported v2.2 baseline references target-specific standards (§17: standalone HTML5, hosted Postgres, native wrappers) that live on companion wiki pages not yet exported to this hub. Current and planned applications no longer fit three targets:

- Stateless single-file tools (OmniUnit, Unicode Explorer, History & Prehistory).
- A single-file or shell-packaged document converter whose working data must survive reloads and app switches but not the end of the window (EPUB/PDF/HTML rewrite).
- A hosted Postgres application (apple-music) that the owner also intends to ship as a self-contained App Store, Windows and Linux app with no hosted database.
- Reserved future shapes: shared-database enterprise systems and numerical/HPC kernels, which the owner does not plan to build soon but which should not be foreclosed by today's rules.

The thread that produced this ADR also found that single-axis profile names ("standalone", "hosted") conflate independent questions. The EPUB case is packaged like a standalone app but has session-scoped state; the apple-music case keeps one schema across two different packagings.

## Decision

1. A delivery profile is a tuple of declared dimension values, not a name. The dimensions and allowed values are defined in [standards/profiles.md](../../standards/profiles.md): `state`, `packaging`, `store`, `identity`, `network`, `compute`.
2. Named profiles are shorthands for common tuples and carry no rules of their own. Rules bind to dimension values (for example, `packaging = single-file` forbids embedded database engines) so that a new combination is covered without a new profile.
3. Applications declare their profile in `STANDARDS-ADOPTION.json` (schema version 2). The hub validator checks that every dimension is present and holds an allowed value. The hub does not check that the declaration matches the code; that is an application-repository check and an architecture-review step.
4. Ports are semantically named typed interfaces with a default implementation per packaging value and recorded substitution (profiles §3.6). The platform facilities an application needs are expressed as the existing baseline roles, not a new vocabulary: `Store` is MODEL or REMOTE behind a typed port; `Blobs`, `Files`, `Secrets`, `Jobs` and `Identity` are PLATFORM-AMBIENT ports mediated by CONTROLLER; clock and identifier generation are PLATFORM-PURE bindings under §18.
5. Editions of one application with different packagings are separate MODELs. Interchange between them is export/import through a versioned format. Synchronization between editions requires its own ADR.
6. Postgres is the single SQL dialect for `store = sql+json` and `sql+json+blob`. Allowed SQL features are limited to the subset supported by the embedded WASM build (PGlite) so that a hosted application can be repackaged without schema changes.
7. Reserved values (`state = shared-data`, `packaging = server-cluster | batch`, `compute = kernel`) carry constraints only (identifiers, time, database-enforced integrity, idempotent writes, pure kernels). No application may declare them until a later ADR removes the reservation.

## Alternatives rejected and why

- **Keep three named targets and add a fourth for packaged local apps.** Rejected: the EPUB case and the apple-music case both show that packaging and state lifetime vary independently; named targets would multiply or be applied inconsistently.
- **Introduce a `Host` interface as a new architectural seam.** Rejected: duplicates MODEL/REMOTE and PLATFORM-AMBIENT, which the standards checker already enforces. Two names for one concept drift.
- **SQLite for packaged editions, Postgres for hosted.** Rejected: two dialects, two migration sets, divergent JSON functions. Accepted cost: a multi-megabyte WASM payload and in-memory loading of the IndexedDB-backed database in webviews; measured gates decide if a fallback is ever needed.
- **Rely on row-level security for data scoping in all editions.** Rejected: the embedded engine runs single-user and bypasses RLS. Scoping becomes a domain invariant tested in STATE/PURE; RLS is hosted-only hardening.
- **Treat session state as plain browser storage.** Rejected: browser eviction and tab-restore behavior differ by platform. Session state is defined by explicit end conditions and a single-writer lock.
- **Omit reserved shapes until needed.** Rejected: cheap constraints now (UUIDs, UTC, pure kernels) avoid expensive retrofits later; §18.4 already anticipates numerical bindings.

## Consequences

- Each application records six dimension values; the apple-music adoption record must be re-issued at schema version 2 when it next adopts a policy release. Existing schema-version-1 records remain valid.
- `standards/profiles.md` is new normative text, not an export of the §17 wiki pages. Reconciling it with those pages is a listed migration step in [authority governance](../../governance/authority-and-release.md) and is not completed by this ADR.
- The packaged-durable profile needs an exception from the hosted-profile migration rollback-block check (users cannot restore by hand; the rule becomes pre-migration backup and restore-on-failure). The exception has an owner and expiry per §11.
- The hosted profile with `identity = seeded-owner` requires an access gate in front of the application until `identity = authenticated` exists, because stored third-party tokens must not be reachable by URL alone.
- Enforcement: hub validator (dimension presence and values); application repositories (import direction for ports, single-file engine prohibition, bundle-contains-all-code check for `native-shell`, backup-before-migrate for `device-durable`).

## Evidence and approval

- Thread of record: Perplexity Computer task `e2eee077-6a89-4764-8822-68cf0f3ba8f3`.
- Baseline references: §1 layer model, §2 state classes, §11 exceptions, §17 target-specific standards, §18 authority, in the [pinned snapshot](../../references/source-snapshots/history-and-prehistory/CODING-STANDARDS.md).
- External constraints cited in `standards/profiles.md`: WebKit storage eviction policy, Apple App Review Guidelines 2.5.2 and 4.2, PGlite filesystem documentation.
- Owner decisions 2026-10-30:
  1. Retire the "Host seam" wording in favour of existing roles; ports carry semantic names with per-packaging defaults and recorded substitution.
  2. Adoption schema version 2 shape approved (`profile` with six dimensions and ports; `bindings` as language+class pairs).
  3. Device-durable migration exception approved: backup-before-migrate and restore-on-failure replace rollback blocks. Owner: David Hoyt. Review date: 2027-04-30, or at the first `device-durable` adoption if earlier. Recorded per baseline §11 when the first application adopts the profile.
  4. Access-gate requirement for `hosted-durable` with `identity = seeded-owner` approved. apple-music records compliance or an exception at its schema-v2 re-adoption.
- Release: pending completion of the migration prerequisites.

## Supersession

None. A later ADR may remove reservations or add dimensions; it must say so explicitly.
