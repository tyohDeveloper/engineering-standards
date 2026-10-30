# Shared Standards Orientation

These summaries are derived navigation aids, not newly approved policy. The unchanged v2.2 source snapshots and their stated source authority control if wording differs.

- [Architecture](architecture.md): roles, determinism, datastore ownership, authority.
- [Coding](coding.md): decomposition, responsibility naming, testing, libraries, repository conventions.
- [Source snapshots](../references/README.md): complete imported documents, including application-specific material.
- [Coding core](coding-core.md) (proposed, ADR-0003): language-independent rules `C-1`–`C-29`, each with its check requirement.
- [Bindings](bindings/): [TypeScript](bindings/typescript.md) (proposed, extracted from the baseline); draft stubs for [Rust](bindings/rust.md), [Swift](bindings/swift.md), [Kotlin](bindings/kotlin.md), [Clojure](bindings/clojure.md), [Python](bindings/python.md) and [SQL](bindings/sql.md). Bindings declare a language class (application, platform-shell, tooling, analysis, schema) that sets rule applicability.
- [Artifact contract](artifact-contract.md) (accepted, imported from the companion page): single-file polyglot shape, six verification assertions, minifier configuration, test-ID manifest.
- [Delivery profiles](profiles.md) (proposed, ADR-0002): six declared dimensions, state classes, value-bound rules, platform ports.
- [Authority governance](../governance/authority-and-release.md): migration and release requirements.

Target profiles such as standalone HTML5, hosted Postgres, native wrappers, localization, and data-layer policy are referenced by the baseline but have not yet been exported from the companion wiki pages. The companion pages were exported verbatim on 2026-10-30 to `references/source-snapshots/programming-wiki/` and reconciled in `governance/wiki-reconciliation.md`; [Delivery profiles](profiles.md), [coding core](coding-core.md) and [artifact contract](artifact-contract.md) are the hub-side statements. Authority transfer (ADR-0004) remains pending.
