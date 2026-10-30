# Engineering Standards Project Context

## Purpose

Maintain the shared engineering standards hub, review proposed changes, record decisions and releases, and coordinate deliberate adoption across application repositories.

- Project: [Engineering Standards](https://www.perplexity.ai/projects/engineering-standards-88KjnGOsQzyhcD_3obT2VA)
- Repository: [tyohDeveloper/engineering-standards](https://github.com/tyohDeveloper/engineering-standards)
- Owner: David Hoyt / tyohDeveloper.

## Boundaries

GitHub is authoritative for this hub's versioned files and, from release 1.0.0.0 (ADR-0004), for the standards themselves. The `programming` wiki pages are superseded pointers; their last revisions are preserved verbatim under `references/source-snapshots/programming-wiki/`.

Each application retains its own architecture, role/path mapping, deployment target, CI, data requirements, and exception records. Do not infer shared memory or instruction inheritance between Projects.

## Project Files layout

Keep a snapshot of the repository under `engineering-standards/`, preserving relative paths. At the Project root maintain `PROJECT-CONTEXT.md` and `SOURCE-SYNC.json` with source repository URL, exact source commit, copied paths, refresh date, and snapshot status.

Do not copy `.git/`, installed dependencies, caches, downloaded scratch files, or secrets. A successful Project-file submission, not a local file copy alone, establishes persistence.

## Working process

- Review repository status and provenance before relying on a Project snapshot.
- Develop proposals in discussion sessions; record accepted changes and rationale in GitHub.
- Keep architecture reviews separate from implementation and approval to remediate.
- Refresh Project Files at meaningful release/checkpoint boundaries, not silently after every upstream change.
- Skill candidates are the review procedures in `reviews/`; a personal Skill should load the application's adopted standards instead of embedding an unversioned policy copy.

## Open decisions

- Done 2026-10-30: tag `standards-1.0.0.0` on `6adc1ad`; Project Files refreshed; wiki pages replaced with pointers (knowledge commit `cb5c015`); repository made public.
- Version number resolved 2026-10-30: `1.0.0.0`, per the first-component rule for authority changes.
- Register application adoption only after checking local role/path mappings and enforcement.
- Decide which procedures to package as personal Skills; none is created by this scaffold.
