# Changelog

## Unreleased

### Proposed (branch, pending owner review)

- ADR-0002 delivery profiles: six declared dimensions, state classes, value-bound rules, platform ports; `standards/profiles.md`.
- ADR-0003 language-independent coding core `C-1`–`C-29` with language classes (application, platform-shell, tooling, analysis); TypeScript binding (extracted) and stubs for Rust, Swift, Kotlin, Clojure, Python.
- Adoption schema version 2 (`profile`, `languages`); validator checks dimension values, reserved values, and binding existence. Schema version 1 records remain valid.
- Application agent template gains profile directives.

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
