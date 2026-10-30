# Wiki Reconciliation Checklist

Status: working checklist, prerequisite to the first normative policy release (see [authority and release](authority-and-release.md) and the draft [0.2.0.0 release note](../docs/drafts/release-0.2.0.0.md)). The v2.2 baseline states that the `programming` project wiki is the source of truth and lists eleven pages. None has been exported to this hub. Until each row below is closed, the pinned baseline governs and hub documents are derived or accepted-pending-release.

## Export status (2026-10-30)

Verbatim export has not been performed. The pages are in the knowledge wiki of the Perplexity Project "programming" (`c4467982-6eac-424d-bef3-d15428bc1cfd`); the knowledge checkout is readable only from a session attached to that Project. To export: open a session in that Project, run `pplx project knowledge sync`, copy `concepts/coding-*.md`, `concepts/repository-conventions.md` and `concepts/architecture-review-lessons.md` into `references/source-snapshots/programming-wiki/`, and record the page `updatedAt` values in `references/source-manifest.json`.

Secondary evidence used for the provisional comparison below, in order of fidelity:

1. `tyohDeveloper/apple-music` `docs/standards/hosted-postgres-profile.md`: rule-by-rule restatement of `coding-standards-hosted-postgres` and `coding-standards-platform-model-remote` (page revisions 2026-08-16, read 2026-10-19).
2. `tyohDeveloper/Unicode-Explorer` `scripts/verify-build.mjs`: the artifact-contract and standalone-HTML5 rules as executable assertions (no-network API list, external-resource ban, CSP meta, strict-XML shell, CDATA wrapping, no comments, test-ID manifest, generator meta, gzip baseline at 5%).
3. Session transcript of 2026-08-06 (thread `21b37757`) in which the three target pages were written, then `standalone-html5` was revised to forbid all local storage and permit only URL-fragment state.
4. The baseline itself for §5, §12, §15, §16, §18 summaries.

Provisional findings are marked (P) and must be re-checked against the verbatim export before any row closes.

## Procedure per page

1. Export the page verbatim to `references/source-snapshots/programming-wiki/<page>.md`, record the export date and the wiki revision (or a content hash if the wiki has no revision identifier) in `references/source-manifest.json`.
2. Diff against the corresponding section of both baseline snapshots (History & Prehistory, Unicode Explorer). Classify each difference as: shared policy, application path mapping, or application-specific extension.
3. Diff against the hub document listed in the "Hub destination" column. Classify each difference as: wiki adds a rule the hub lacks, hub adds a rule the wiki lacks, or conflict.
4. For each conflict, record a decision in the "Conflict decisions" table below. A decision is one of: wiki wins (amend hub), hub wins (ADR records the supersession), or both apply with a stated scope.
5. Mark the row Closed with the decision ADR or commit.

## Pages

| # | Wiki page | Baseline section | Hub destination | Known or expected conflicts with the accepted package | Status |
|---|---|---|---|---|---|
| 1 | `concepts/coding-architecture-standards` (core) | §§0–14, 16 | `standards/architecture.md`, `standards/coding-core.md`, `standards/bindings/typescript.md` | Core rule numbering `C-n` is new; confirm every baseline rule maps to a `C-n` or is a TypeScript binding entry. Baseline §3.1 20-line limit and §3.3 role file limits are already reflected. (P) The Aug-2026 revision added a "Repository conventions" section (GitHub canonical, MIT standing, README/CHANGELOG/.gitignore, CI on PRs, noreply attribution) that is now baseline §12; no conflict seen. | Open, compared (P) |
| 2 | `concepts/coding-standards-platform-model-remote` | §17 item, §18; records original ADR-0001 | `standards/architecture.md`, `standards/profiles.md` §3.6 | Ports with semantic names and per-packaging defaults extend MODEL/REMOTE; check that mandated-binding authority (§18) is unchanged. The wiki's ADR-0001 must be imported as historical evidence, not renumbered; hub ADR-0001 is a different decision and the collision needs a note in `docs/adr/`. (P) From apple-music: only MODEL imports database clients; only REMOTE imports HTTP clients; PLATFORM-PURE allowlist file; PLATFORM-AMBIENT from CONTROLLER only; datastore ownership declared in a file; adapter names `client`, `stub`, `connector`, `gateway` reserved. Package port names do not collide. Package should add: `datastore-ownership` and `platform-pure-allowlist` as the declared form of C-4/C-25. No conflict. | Open, compared (P) |
| 3 | `concepts/coding-standards-standalone-html5` | §17 | `standards/profiles.md` (`packaging = single-file`) | (P) Confirmed from transcript and checker: wiki forbids `localStorage` and `IndexedDB` outright, forbids `fetch`, `XMLHttpRequest`, `sendBeacon`, WebSocket, Service Worker, WebRTC, EventSource, `importScripts`; requires CSP meta; only URL fragment/query for shareable state; downloads via `Blob` + `createObjectURL`; links are user-initiated with `rel="noopener noreferrer"`. Package: `single-file` + `state = session` uses IndexedDB/OPFS. **Conflict.** Proposed: wiki rules define `single-file` + `state = none` + `network = none` exactly; the no-network assertions apply to every `single-file` artifact regardless of state; origin storage is permitted only under `state = session` with the §2.2 cleanup and lock rules and must be declared. Needs owner decision. | Open, conflict (P) |
| 4 | `concepts/coding-standards-artifact-contract` | §17 | New `standards/artifact-contract.md` or a section of `standards/bindings/typescript.md` | (P) From the checker: strict-XML well-formed shell; script and style bodies CDATA-wrapped exactly once; no `]]>` leakage; no comments after minification; no `<script src>`; no external resource URLs; CSS `url()` only `data:`; no `@import`; test-ID manifest with required/dynamic sets and `{role}-{area}-{name}` pattern; generator meta matching package and data versions; gzip within 5% of a committed baseline. Not in the package. Import as `standards/artifact-contract.md` bound to `packaging = single-file`, referenced from C-18, C-21 and TS-5. No conflict. | Open, compared (P) |
| 5 | `concepts/coding-standards-hosted-postgres` | §17 | `standards/profiles.md` §2.5, `standards/bindings/sql.md` | (P) From apple-music: migrations applied automatically before traffic; timestamp-prefixed names; never edit an applied migration; one migration per commit; rollback block per migration; parameterized queries only; statement timeouts and pool limits; **row-level security for user data as the authorization mechanism**; separate service role for administration; no long transactions in HTTP handlers; secrets from environment with `.env.example`; environment separation; seed script; tested restore; rate limiting; structured logs with request IDs; health and metrics endpoints. **Conflict:** the wiki makes RLS the default authorization mechanism; package §2.5 calls it "defense in depth." Proposed: both apply with scope. For `hosted-durable`, RLS remains mandatory as the wiki states; the package adds the application-layer invariant (C-10) so the same code is correct where RLS is unavailable (`device-durable`). Amend §2.5 wording from "defense in depth" to "mandatory for hosted; the application-layer invariant is additionally required." Also add to §2.5: environment separation, service-role separation, statement timeouts, short request transactions, health endpoint, `.env.example`. `device-durable` departure already recorded. | Open, conflict (P) |
| 6 | `concepts/coding-standards-native-wrappers` | §17 | `standards/profiles.md` §3.1 (`packaging = native-shell`), `standards/bindings/swift.md`, `kotlin.md`, `rust.md` | (P) From transcript: shared model (native shell hosts WebView over bundled HTML; JS bridge via `WKScriptMessageHandler` only when needed); iOS written in full (Guideline 4.2 traps, signing, TestFlight, CI options, expected rejections); macOS and Windows are structured stubs; desktop local storage guidance says **SQLite first, embedded Postgres a future consideration**. **Conflict:** package default is PGlite for `native-shell` + `device-durable`, SQLite only as a measured fallback (ADR-0002 rejected SQLite for dialect unity). Proposed: hub wins; ADR-0002 records the supersession and the wiki page is updated to point at profiles §3.6. Package additions (2.5.2, custom origin, OS-container storage, single typed port, `platform-shell` class) are additive. | Open, conflict (P) |
| 7 | `concepts/coding-standards-localization` | §15 | New `standards/localization.md` | Not in the package. (P) Baseline §15 text is available in the snapshot; the wiki page adds enforcement mapping and source-citation rules. Propose `C-32` to `C-3n` from §15 with binding entries once the page is exported. No conflict expected. | Open, partial (P) |
| 8 | `concepts/coding-standards-data-layer` | §5 | `standards/coding-core.md` C-14, C-15; `standards/profiles.md` §3.2 | Package adds rows-vs-`jsonb` placement, `schemaVersion` in documents, promotion rule, binaries in `Blobs`. (P) Baseline §5 and the hosted page's "blobs to object storage, never in Postgres" agree with §3.2. Check the wiki's "data referencing code" rules against C-14 after export. | Open, partial (P) |
| 9 | `concepts/repository-conventions` | §12 | `standards/coding.md` repository practice; `templates/` | (P) Transcript says the section includes "semver expectations"; the hub's four-part scheme is explicitly not SemVer (`governance/versioning.md`, baseline §12). Possible conflict on version meaning; check the exported text. Noreply attribution and MIT standing match current practice. | Open, possible conflict (P) |
| 10 | `concepts/architecture-review-lessons` | §16 | `reviews/architecture-review.md` | Package adds a profile-match review step. (P) Baseline §16 is available in the snapshot; additive. Confirm after export. | Open, partial (P) |
| 11 | `concepts/coding-standards-artifact-contract` benchmark cadence and minifier configuration (sub-section) | §17 | With row 4 | (P) The checker enforces the 5% gzip threshold on every build; cadence for re-baselining is a reviewed commit with a note. Treat the threshold as a C-21 rule and the cadence as an operational note. | Open, compared (P) |

## Conflict decisions

Provisional (P) entries await owner decision and verbatim confirmation.

| Page | Conflict | Decision | Recorded in |
|---|---|---|---|
| standalone-html5 | Wiki forbids all origin storage; package permits it under `state = session` | (P) Proposed: both apply with scope. Wiki rules define `single-file` + `state = none`; no-network assertions apply to all `single-file`; storage only under declared `state = session` | pending |
| hosted-postgres | Wiki: RLS is the authorization mechanism; package: defense in depth | (P) Proposed: both apply. RLS mandatory for `hosted-durable`; C-10 application-layer invariant additionally required. Amend §2.5 wording | pending |
| hosted-postgres | Operational rules absent from §2.5 (environment separation, service roles, timeouts, short transactions, health endpoint, `.env.example`) | (P) Proposed: wiki wins; add to §2.5 | pending |
| native-wrappers | Wiki: SQLite first for desktop storage; package: PGlite default | (P) Proposed: hub wins per ADR-0002 rejected alternative; record supersession; update wiki page | pending |
| platform-model-remote | None; package should adopt `datastore-ownership` and `platform-pure-allowlist` declaration files | (P) Proposed: additive; add to C-4/C-25 binding entries | pending |
| repository-conventions | Possible SemVer wording vs four-part non-SemVer | (P) Check exported text; hub governance wins if conflict | pending |

## Authority transfer

After all rows are Closed:

- Record the authority transfer in an ADR (ADR-0004 proposed): the hub becomes the source of truth; the wiki pages become historical evidence or are updated to point at the hub. Rejected alternatives: keep the wiki authoritative and propagate; dual authority.
- Update the baseline-derived `CODING-STANDARDS.md` header convention in the application template so copies cite the hub release and commit instead of the wiki.
- Update `PROJECT-CONTEXT.md` "Boundaries" and "Open decisions."
- Then cut the 0.2.0.0 policy release.
