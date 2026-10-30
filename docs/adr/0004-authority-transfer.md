# ADR-0004: Authority Transfer from the Programming Wiki to the Hub

## Status and date

Proposed for owner approval, 2026-10-30, on branch `release/1.0.0.0`. Takes effect when release 1.0.0.0 is tagged. Owner: David Hoyt / tyohDeveloper.

## Context

The v2.2 portable baseline, copied into every application as `docs/CODING-STANDARDS.md`, states that the `programming` Perplexity Project knowledge wiki is the source of truth ("If this file and the wiki disagree, the wiki wins") and lists the core page and nine companions. The hub was established (ADR-0001) to hold versioned, validated standards with provenance, but it imported copies without moving authority.

Since then: the ten wiki pages were exported verbatim with provenance (`references/source-snapshots/programming-wiki/`, knowledge commit `29fd5065…`); every difference between the pages and the hub was classified and decided (`governance/wiki-reconciliation.md`, all rows closed); delivery profiles (ADR-0002) and the language-independent core with bindings (ADR-0003) were accepted; and the wiki pages themselves were found to have drifted (two revised 2026-10-27, one with an internal inconsistency on its authentication binding) with no mechanism to validate them.

## Decision

1. From release 1.0.0.0, this repository is the sole source of truth for the architecture and coding standards, delivery profiles, bindings, artifact contract, review procedures and adoption records. A tagged release commit is the authoritative statement; `main` between releases is proposed text.
2. The ten wiki pages are retained as historical evidence in `references/source-snapshots/programming-wiki/` and are not edited there. On the wiki, each page is to be replaced by a short pointer stating the page is superseded, naming the hub document and release that replaces it, and keeping its `[[...]]` inbound links working. Pointer text is in the appendix.
3. Application copies of the standards cite the hub release and commit in their header instead of the wiki. The application template (`templates/CODING-STANDARDS.application.md`) carries the new header. Applications change their header only when they adopt a release (adoption process unchanged).
4. The imported v2.2 baseline remains the pinned predecessor policy for applications that have not adopted 1.0.0.0; its "wiki wins" clause is void for them as well, because the wiki pages it refers to become pointers. Where a 2.2 copy and the hub disagree for a non-adopting application, the application's pinned copy governs that application until it adopts.
5. Changes to normative text follow `governance/authority-and-release.md`: proposal on a branch, owner approval, validator and tests, release note with meaning, tag. Wiki pages are never the place to propose standards changes.
6. The hub validator continues to pin the exported pages by hash; `authorityMigration` in `references/source-manifest.json` becomes `transferred-1.0.0.0`.

## Alternatives rejected and why

- **Keep the wiki authoritative and propagate to the hub.** Rejected: the wiki has no validation, no tags, no PR review, and has already drifted internally; propagation would re-create the two-source problem that the reconciliation just closed.
- **Dual authority (wiki for rationale, hub for rules).** Rejected: rationale lives in ADRs here; splitting it produces exactly the stale-rationale failure seen on the hosted-postgres page (Lucia versus Better Auth).
- **Delete the wiki pages.** Rejected: inbound `[[concepts/...]]` links from project pages would break and the history of why rules exist (the OmniUnit architecture pass) would be lost. Pointers preserve both.
- **Transfer authority without a release.** Rejected: an authority statement needs an immutable referent; the tag is it.

## Consequences

- `PROJECT-CONTEXT.md` boundaries and open decisions updated; the Engineering Standards Project Files snapshot is refreshed after tagging with the release commit.
- Wiki pointer edits are a follow-up performed in a session attached to the `programming` Project (the hub cannot write there); until done, the pages carry stale text but no authority.
- Application issues already filed ("Adopt engineering-standards 1.0.0.0 when released") become actionable at the tag.
- Versioning: `governance/versioning.md` classes an authority change as a first-component change; the release carrying this ADR is therefore `1.0.0.0` (renumbered from the planned `0.2.0.0` before tagging).

## Evidence and approval

- Thread of record: Perplexity Computer task `e2eee077-6a89-4764-8822-68cf0f3ba8f3`.
- Reconciliation: `governance/wiki-reconciliation.md`; exports and hashes in `references/source-manifest.json`.
- Approval: pending owner review of this branch; effective at tag `standards-1.0.0.0`.

## Supersession

Supersedes the authority clause of the v2.2 baseline header ("the wiki wins") for all applications that adopt 1.0.0.0 or later, and voids the clause for non-adopters as described in decision 4.

## Appendix: wiki pointer text

For each of the ten pages, replace the body with:

> **Superseded.** This page is retained for its inbound links and history. The normative statement is now `tyohDeveloper/engineering-standards`, release 1.0.0.0 (tag `standards-1.0.0.0`): `<hub document path>`. The last wiki revision of this page is preserved verbatim in that repository under `references/source-snapshots/programming-wiki/<page>.md`. Do not edit this page to propose changes; open a proposal in the hub.

| Page | Hub document |
|---|---|
| coding-architecture-standards | standards/architecture.md, standards/coding-core.md, standards/bindings/typescript.md |
| coding-standards-platform-model-remote | standards/architecture.md, standards/profiles.md §3.6, docs/adr/historical/W-0001 |
| coding-standards-standalone-html5 | standards/profiles.md §3.1, standards/artifact-contract.md |
| coding-standards-artifact-contract | standards/artifact-contract.md |
| coding-standards-hosted-postgres | standards/profiles.md §2.5, standards/bindings/sql.md |
| coding-standards-native-wrappers | standards/profiles.md §3.1, §3.6, standards/bindings/swift.md |
| coding-standards-localization | standards/coding-core.md group K, standards/profiles.md §3.7 |
| coding-standards-data-layer | standards/coding-core.md group D |
| repository-conventions | standards/coding.md, governance/versioning.md |
| architecture-review-lessons | reviews/architecture-review.md, standards/coding-core.md C-19 |
