# Shared Standards Orientation

These summaries are derived navigation aids, not newly approved policy. The unchanged v2.2 source snapshots and their stated source authority control if wording differs.

- [Architecture](architecture.md): roles, determinism, datastore ownership, authority.
- [Coding](coding.md): decomposition, responsibility naming, testing, libraries, repository conventions.
- [Source snapshots](../references/README.md): complete imported documents, including application-specific material.
- [Coding core](coding-core.md) (proposed, ADR-0003): language-independent rules `C-1`–`C-29`, each with its check requirement.
- [Bindings](bindings/): [TypeScript](bindings/typescript.md) (proposed, extracted from the baseline); draft stubs for [Rust](bindings/rust.md), [Swift](bindings/swift.md), [Kotlin](bindings/kotlin.md), [Clojure](bindings/clojure.md) and [Python](bindings/python.md). Bindings declare a language class (application, platform-shell, tooling, analysis) that sets rule applicability.
- [Delivery profiles](profiles.md) (proposed, ADR-0002): six declared dimensions, state classes, value-bound rules, platform ports.
- [Authority governance](../governance/authority-and-release.md): migration and release requirements.

Target profiles such as standalone HTML5, hosted Postgres, native wrappers, localization, and data-layer policy are referenced by the baseline but have not yet been exported from the companion wiki pages. [Delivery profiles](profiles.md) is a proposed hub-side definition of the target dimension; it is not an export of those pages and does not complete the migration. Localization and data-layer policy remain unexported.
