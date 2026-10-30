# Changelog

## Unreleased

- apple-music record replaced: 1.0.1.0 schema 2 at application commit b272d80 (PR #2), superseding the 2.2 record of 2026-10-19.

- Unicode-Explorer record updated to application commit 3c00a6e: EXC-0001, EXC-0002, EXC-0003 closed (dead code, license inventory, secret scanning now automated).

- Adoption records at 1.0.1.1 for Unicode-Explorer, history-and-prehistory, Book-Converter, multiCalc, Css-editor, income-tiles and Monaco-JSON-Editor (application PRs merged 2026-10-30). Examples and name recorded out of scope in their own READMEs (non-application repositories; no record).

## 1.0.1.1 — 2026-10-30

Copy-only correction. Release note: `releases/1.0.1.1.md`.

- `standards/profiles.md` status line: removed the stale sentence stating that reconciliation with the companion wiki pages was pending; those pages were exported and reconciled at 1.0.0.0 (`governance/wiki-reconciliation.md`, all rows closed).

- OmniUnitConverter-Calculator adoption record pointed at application commit `02db5bd` (PRs #16–#19 merged: devDependencies reclassified, shippable-only license inventory, `classNames.ts` rename, RTL e2e, context remapped to CONTROLLER; E-7 and E-11 closed).

- OmniUnitConverter-Calculator adoption updated to 1.0.1.0 (application PR #11): C-2, C-3, C-20, C-26, C-31 now automated; exceptions E-1..E-6 closed, E-11 opened.

## 1.0.1.0 — 2026-10-30

Pilot refinements from the OmniUnit adoption. Release note: `releases/1.0.1.0.md`.

- C-43: PLATFORM-PURE mapping optional when PURE takes locale and numeral preference as parameters.
- C-19 and TypeScript binding: CI runner images pinned to a versioned image with a review note; `latest` aliases forbidden.
- Templates: exceptions template gains an "Existing carve-outs" section; adoption template gains `applicationCommit` and `applicationPullRequest`.
- Compliance review: unmatched inline carve-outs and unpinned runners are findings.

- Adoption registered: OmniUnitConverter-Calculator at 1.0.0.0, schema 2 (application commit `03a94b4`, PR #2); first schema-2 record and first adoption of a hub-authored release. Pilot findings recorded in the application PR.
- Repository made public 2026-10-30; visibility decision recorded in README; PROJECT-CONTEXT post-release items closed. Documentation only; no normative change.

## 1.0.0.0 — 2026-10-30 (tag pending)

First hub-authored policy release; authority transferred from the `programming` wiki (ADR-0004). Release note: `releases/1.0.0.0.md`.

### Accepted 2026-10-30 (ADR-0002, ADR-0003)

- ADR-0002 delivery profiles: six declared dimensions, state classes, value-bound rules, platform ports; `standards/profiles.md`.
- ADR-0003 language-independent coding core `C-1`–`C-29` with language classes (application, platform-shell, tooling, analysis, schema) with a class boundary trigger; core rules C-30 (one schema source per boundary) and C-31 (no secrets); TypeScript binding (extracted) and stubs for Rust, Swift, Kotlin, Clojure, Python, SQL.
- Adoption schema version 2 (`profile`, `bindings` as language+class pairs); validator checks dimension values, reserved values, binding existence and declared class. Schema version 1 records remain valid.
- Ports have semantic names, per-packaging default implementations and recorded substitution; architecture review gains a profile-match step.
- Application agent template gains profile directives.
- Profile amendments from provisional wiki comparison (hosted-durable operational rules and mandatory RLS, single-file no-network assertions for all states, declaration files, PGlite supersedes SQLite-first), pending verbatim confirmation.
- Localization: core group K (C-32–C-44) from baseline §15; `localization` profile dimension (scope, mode, domains, locales) with validator checks; TypeScript binding entries referencing OmniUnit's integrity, dead-key and prune implementations.
- Verbatim export of the ten programming-wiki pages with provenance; reconciliation decisions applied: standalone storage confirmed, wrapper storage superseded, shell toolkit as adoption choice (`profile.shell`), one-app-one-database with `shared-data` as REMOTE, AGENTS directory wording. Additions: `standards/artifact-contract.md`; core C-16a, C-45–C-49 (data registry, proven-equal, markers, ordering, source citation); C-19 checker rules; C-24 dependency criteria; TypeScript role file limits, TS-6 stack, TS-7 no barrels; review coverage steps; historical W-0001.
- Release note (`releases/1.0.0.0.md`) and wiki reconciliation checklist (`governance/`).

### Adoption

- Registered `tyohDeveloper/apple-music`: policy 2.2, source commit `f30e6e0`, adopted 2026-10-19 ([record](adoption/apple-music.json)).

## 0.1.0.0 — 2026-10-09

### Added

- Shared standards hub structure, governance, review procedures, and application templates.
- Unmodified v2.2 repository snapshots with source commits, file hashes, and licenses.
- Automated hub-integrity validation and GitHub Actions.
- Perplexity Project context and an explicit manual snapshot contract.

### Authority and adoption

- This is a scaffold checkpoint, not a new normative policy release.
- Existing `programming` wiki authority remains unchanged pending owner-reviewed migration.
- No application or data versions changed; no application repositories were modified.

See [release meaning](releases/0.1.0.0.md).
