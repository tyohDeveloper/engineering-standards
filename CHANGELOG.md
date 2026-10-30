# Changelog

## Unreleased

### Accepted 2026-10-30, pending policy release (ADR-0002, ADR-0003)

- ADR-0002 delivery profiles: six declared dimensions, state classes, value-bound rules, platform ports; `standards/profiles.md`.
- ADR-0003 language-independent coding core `C-1`–`C-29` with language classes (application, platform-shell, tooling, analysis, schema) with a class boundary trigger; core rules C-30 (one schema source per boundary) and C-31 (no secrets); TypeScript binding (extracted) and stubs for Rust, Swift, Kotlin, Clojure, Python, SQL.
- Adoption schema version 2 (`profile`, `bindings` as language+class pairs); validator checks dimension values, reserved values, binding existence and declared class. Schema version 1 records remain valid.
- Ports have semantic names, per-packaging default implementations and recorded substitution; architecture review gains a profile-match step.
- Application agent template gains profile directives.
- Profile amendments from provisional wiki comparison (hosted-durable operational rules and mandatory RLS, single-file no-network assertions for all states, declaration files, PGlite supersedes SQLite-first), pending verbatim confirmation.
- Localization: core group K (C-32–C-44) from baseline §15; `localization` profile dimension (scope, mode, domains, locales) with validator checks; TypeScript binding entries referencing OmniUnit's integrity, dead-key and prune implementations.
- Verbatim export of the ten programming-wiki pages with provenance; reconciliation decisions applied: standalone storage confirmed, wrapper storage superseded, shell toolkit as adoption choice (`profile.shell`), one-app-one-database with `shared-data` as REMOTE, AGENTS directory wording. Additions: `standards/artifact-contract.md`; core C-16a, C-45–C-49 (data registry, proven-equal, markers, ordering, source citation); C-19 checker rules; C-24 dependency criteria; TypeScript role file limits, TS-6 stack, TS-7 no barrels; review coverage steps; historical W-0001.
- Draft 0.2.0.0 release note (`docs/drafts/`) and wiki reconciliation checklist (`governance/`), prerequisites to release.

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
