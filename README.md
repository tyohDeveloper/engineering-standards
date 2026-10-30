# Engineering Standards

Shared architecture and coding governance, review procedures, and versioned application-adoption records for tyohDeveloper.

Visibility: private during the authority migration, because adoption records and reconciliation notes reference unreleased application work. The repository-conventions page expects public by default with a recorded reason otherwise; owner decision 2026-10-30 is to revisit at release 0.2.0.0 and either publish or record a standing reason.

## Status and authority

**Hub scaffold:** `0.1.0.0`, initial setup. **Imported standards baseline:** `2.2`, portable edition. These are separate identifiers; the hub version does not replace or increment the imported policy version.

The imported repository copies name the existing `programming` Project knowledge wiki as their authority. This repository is authoritative for its own scaffold, provenance, and maintenance records, but **does not yet supersede that wiki**. A documented owner decision and reconciliation of the companion wiki pages are prerequisites for transferring standards authority. See [authority and release governance](governance/authority-and-release.md) and [ADR-0001](docs/adr/0001-establish-standards-hub.md).

No application repository was changed by creating this hub. Registered adoptions are listed in [adoption/](adoption/README.md): `tyohDeveloper/apple-music` adopted policy 2.2 from source commit `f30e6e0` on 2026-10-19.

## Quickstart

Requires Node.js 22 or newer; no dependency installation is needed.

```sh
git clone https://github.com/tyohDeveloper/engineering-standards.git
cd engineering-standards
npm run validate
npm test
```

This documentation repository has no application build or deployed site. Validation checks local Markdown links, source-snapshot hashes, release identifiers, and adoption-record metadata; it does not claim to validate application architecture. The test suite verifies that corrupted snapshots, broken links, unapproved adoptions, and unsafe source paths fail validation.

## Structure

| Directory / file | Purpose |
|---|---|
| [standards/](standards/README.md) | Shared architecture/coding orientation; imported originals retain authority over these summaries. |
| [governance/](governance/authority-and-release.md) | Authority, releases, update propagation, and version meanings. |
| [reviews/](reviews/architecture-review.md) | Repeatable review procedures suitable for later packaging as personal Skills. |
| [templates/](templates/README.md) | Application adoption, architecture, coding guidance, exceptions, and release templates. |
| [adoption/](adoption/README.md) | Explicit records of application adoption; initially empty. |
| [docs/adr/](docs/adr/0001-establish-standards-hub.md) | Immutable architecture/governance decision records. |
| [references/](references/README.md) | Unmodified, commit-pinned source snapshots and provenance manifest. |
| [releases/](releases/0.1.0.0.md) | Human-readable release meaning, scope, verification, and adoption effects. |
| [tools/validate.mjs](tools/validate.mjs) | Hub-integrity checks. |
| [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) | Perplexity Project purpose, authority boundaries, and synchronization contract. |
| [AGENTS.md](AGENTS.md) | Instructions specifically for agents maintaining this hub. |

## Using the standards in an application

Start with [the adoption template](templates/STANDARDS-ADOPTION.json), not an assumption of Project inheritance. Record the adopted policy version and immutable source commit, retain the application's own role/path mapping and architecture decisions, and map each requirement to real local checks. See [application adoption](adoption/README.md).

Files copied into a Perplexity Project are reference snapshots. They are not a live GitHub mirror and must be refreshed deliberately; the source commit is recorded in the Project's synchronization record.

## Sources and license

The unchanged baselines come from [history-and-prehistory at its pinned commit](https://github.com/tyohDeveloper/history-and-prehistory/blob/62c721d9b269bd6b25e202d0dbc8d94edf1e5d3b/docs/CODING-STANDARDS.md) and [Unicode-Explorer at its pinned commit](https://github.com/tyohDeveloper/Unicode-Explorer/blob/f48203173fce67959da14a1ccaa8e033af1ca220/docs/CODING-STANDARDS.md). Their application-specific sections must not be treated as shared defaults.

License: [MIT](LICENSE), following the existing standing repository policy. Imported snapshots retain their neighboring source-license files and original attribution.
