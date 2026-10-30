# Standards Release 0.2.0.0 (Draft)

Status: draft release note. Not released, not tagged. Prerequisites: all rows in [wiki reconciliation](../../governance/wiki-reconciliation.md) closed and the authority-transfer ADR accepted. On release, move this file to `releases/0.2.0.0.md`, set the date, and remove the draft status.

Date: TBD. Hub version: 0.2.0.0 (second component: substantial multi-file governance and policy change). Policy version: first hub-authored policy release; the imported 2.2 baseline remains the pinned predecessor.

## Meaning

The hub moves from a scaffold that preserves an imported policy to the maintained source of the policy itself. Two accepted decisions define the change:

- Delivery is described by six declared dimensions rather than named targets, so new combinations (a single-file application with session state; one application shipped as both hosted and app-store editions) are covered by rules bound to values (ADR-0002).
- Coding rules are stated once in a language-independent core (C-1 to C-31) and expressed per language through bindings that declare a class, so the intent of each rule is constant while the obligation varies with the language's purpose (ADR-0003).

This release does not change any application's code, version or data. Applications adopt it deliberately through a schema-version-2 adoption record.

## Scope and decisions

Changed or added rules:

- `standards/profiles.md`: dimensions, state classes with guarantees and verification, value-bound rules, ports with semantic names and per-packaging defaults, reserved-value constraints.
- `standards/coding-core.md`: C-1 to C-31; class applicability table.
- `standards/bindings/typescript.md`: extracted from the baseline, normative. Stubs for Rust, Swift, Kotlin, Clojure, Python, SQL remain non-normative until adopted.
- `reviews/architecture-review.md`: profile-match step.
- `templates/STANDARDS-ADOPTION.json` schema version 2; `templates/AGENTS.application.md` directive block.

Owner decisions recorded in ADR-0002 (2026-10-30): retire "Host" wording; schema v2 shape; device-durable migration exception (owner David Hoyt, review 2027-04-30 or first `device-durable` adoption); access gate for `hosted-durable` with `seeded-owner`.

Owner decisions recorded in ADR-0003 (2026-10-30): five language classes; class boundary trigger; C-30 and C-31; C-10 not applicable to `schema`.

Rejected alternatives: see each ADR. Authority transfer: ADR-0004 (to be written at reconciliation close).

## Verification

- `npm run validate`: required files, Markdown links, snapshot hashes, release identifiers, adoption records (schema 1 and 2), profile dimensions and reserved values, port names and implementations, binding files and classes.
- `npm test`: eleven tests including schema-v2 acceptance, reserved-value rejection, non-default port without reason, unknown binding, undeclared binding class, multi-binding acceptance.
- Human review: architecture and compliance procedures in `reviews/`.
- Unresolved gaps carried forward (ADR-0003 "Known gaps"): declarative configuration files, markup/styling and accessibility, generated code, analysis-to-application provenance. Localization and artifact contract are expected to close during reconciliation (rows 4, 7, 11).

## Adoption effects

| Application | Effect |
|---|---|
| apple-music | Record stays valid at schema 1 / policy 2.2. Re-adoption at schema 2 required to use this policy: profile hosted-durable / hosted-web / sql+json+blob / seeded-owner / required; bindings `typescript:application`, `sql:schema`; access gate recorded as compliance or exception; C-10 scoping tests. No application or data version change caused by the hub. |
| History & Prehistory, Unicode Explorer, OmniUnit | Not adopted. If adopted: profile none / single-file / none / none / none; bindings `typescript:application`; artifact contract (row 4) applies. |
| EPUB/PDF rewrite (planned) | Adopt at creation: session / single-file or native-shell / blob-only / none / none; ports `Blobs`, `Files`; no embedded database engine. |
| Music library, device-durable edition (planned) | First `device-durable` adoption triggers the migration exception record and completion of Rust and Swift bindings. |

Compatibility: schema-version-1 adoption records remain valid indefinitely; the validator accepts both. Policy 2.2 remains available as the pinned predecessor for applications that have not re-adopted.

## Provenance and Project refresh

- Repository: `tyohDeveloper/engineering-standards`; release commit: TBD; tag: `standards-0.2.0.0` (standards-scoped, per governance).
- Predecessor policy: v2.2 snapshots pinned in `references/source-manifest.json`.
- Wiki exports: `references/source-snapshots/programming-wiki/` with revision or hash per page (added during reconciliation).
- Project Files: refresh after tagging; record the release commit in `SOURCE-SYNC.json`.
