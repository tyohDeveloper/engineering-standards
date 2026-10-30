# Wiki Reconciliation Checklist

Status: working checklist, prerequisite to the first normative policy release (see [authority and release](authority-and-release.md) and the draft [0.2.0.0 release note](../docs/drafts/release-0.2.0.0.md)). The v2.2 baseline states that the `programming` project wiki is the source of truth and lists eleven pages. None has been exported to this hub. Until each row below is closed, the pinned baseline governs and hub documents are derived or accepted-pending-release.

## Procedure per page

1. Export the page verbatim to `references/source-snapshots/programming-wiki/<page>.md`, record the export date and the wiki revision (or a content hash if the wiki has no revision identifier) in `references/source-manifest.json`.
2. Diff against the corresponding section of both baseline snapshots (History & Prehistory, Unicode Explorer). Classify each difference as: shared policy, application path mapping, or application-specific extension.
3. Diff against the hub document listed in the "Hub destination" column. Classify each difference as: wiki adds a rule the hub lacks, hub adds a rule the wiki lacks, or conflict.
4. For each conflict, record a decision in the "Conflict decisions" table below. A decision is one of: wiki wins (amend hub), hub wins (ADR records the supersession), or both apply with a stated scope.
5. Mark the row Closed with the decision ADR or commit.

## Pages

| # | Wiki page | Baseline section | Hub destination | Known or expected conflicts with the accepted package | Status |
|---|---|---|---|---|---|
| 1 | `concepts/coding-architecture-standards` (core) | §§0–14, 16 | `standards/architecture.md`, `standards/coding-core.md`, `standards/bindings/typescript.md` | Core rule numbering `C-n` is new; confirm every baseline rule maps to a `C-n` or is a TypeScript binding entry. Baseline §3.1 20-line limit and §3.3 role file limits are already reflected. | Open |
| 2 | `concepts/coding-standards-platform-model-remote` | §17 item, §18; records original ADR-0001 | `standards/architecture.md`, `standards/profiles.md` §3.6 | Ports with semantic names and per-packaging defaults extend MODEL/REMOTE; check that mandated-binding authority (§18) is unchanged. The wiki's ADR-0001 must be imported as historical evidence, not renumbered; hub ADR-0001 is a different decision and the collision needs a note in `docs/adr/`. | Open |
| 3 | `concepts/coding-standards-standalone-html5` | §17 | `standards/profiles.md` (`packaging = single-file`) | Wiki: "no network, no persisted user data, URL fragment as the only opt-in state." Package: `single-file` may carry `state = session` (EPUB) with origin storage. Likely conflict; proposed resolution: wiki rule becomes the `single-file` + `state = none` combination, and `session` is a documented extension with its own rules (profiles §2.2). Needs owner decision. | Open |
| 4 | `concepts/coding-standards-artifact-contract` | §17 | New `standards/artifact-contract.md` or a section of `standards/bindings/typescript.md` | Not addressed by the package. Polyglot markup contract, five verification assertions, minimization pass. Belongs under C-21 (size budget) and the TypeScript binding (TS-5). Import as-is; no expected conflict. | Open |
| 5 | `concepts/coding-standards-hosted-postgres` | §17 | `standards/profiles.md` §2.5, `standards/bindings/sql.md` | Wiki: one migration per commit, never edit an applied migration, environment separation with distinct databases and secret sets. Package: consistent, but `device-durable` forward-only migrations with backup are a recorded departure (ADR-0002 decision 3). Confirm the wiki's rule is scoped to hosted. Environment separation is not yet in the package; add to profiles §2.5. | Open |
| 6 | `concepts/coding-standards-native-wrappers` | §17 | `standards/profiles.md` §3.1 (`packaging = native-shell`), `standards/bindings/swift.md`, `kotlin.md`, `rust.md` | Wiki: "minimal native shell hosting a WebView over the bundled HTML build; platform storage guidance and signing." Package adds: App Review 2.5.2/4.2 constraints, custom origin (no `file://`), OS-container storage for `device-durable`, single typed message port (C-30), no domain logic (`platform-shell` class). Expect additive differences; check the wiki's storage guidance against §2.4. Signing guidance maps to C-31. | Open |
| 7 | `concepts/coding-standards-localization` | §15 | New `standards/localization.md` | Not in the package. §15 rules (one fallback chain, etc.) are language-independent and should become `C-32+` with binding entries. No expected conflict; gap recorded in ADR-0003. | Open |
| 8 | `concepts/coding-standards-data-layer` | §5 | `standards/coding-core.md` C-14, C-15; `standards/profiles.md` §3.2 | Package adds rows-vs-`jsonb` placement, `schemaVersion` in documents, promotion rule, binaries in `Blobs`. Check the wiki's data-referencing rules (§5 "Data referencing code") against C-14. | Open |
| 9 | `concepts/repository-conventions` | §12 | `standards/coding.md` repository practice; `templates/` | Package adds adoption schema v2 and the agent template directive block. Check branch, commit and release conventions for conflicts with `governance/versioning.md`. | Open |
| 10 | `concepts/architecture-review-lessons` | §16 | `reviews/architecture-review.md` | Package adds a profile-match review step. Additive; confirm the wiki's lessons list is fully represented in the review procedure. | Open |
| 11 | `concepts/coding-standards-artifact-contract` benchmark cadence and minifier configuration (sub-section) | §17 | With row 4 | Verify whether cadence is a rule or an operational note; if a rule, it needs a check under C-19. | Open |

## Conflict decisions

| Page | Conflict | Decision | Recorded in |
|---|---|---|---|
| | | | |

## Authority transfer

After all rows are Closed:

- Record the authority transfer in an ADR (ADR-0004 proposed): the hub becomes the source of truth; the wiki pages become historical evidence or are updated to point at the hub. Rejected alternatives: keep the wiki authoritative and propagate; dual authority.
- Update the baseline-derived `CODING-STANDARDS.md` header convention in the application template so copies cite the hub release and commit instead of the wiki.
- Update `PROJECT-CONTEXT.md` "Boundaries" and "Open decisions."
- Then cut the 0.2.0.0 policy release.
