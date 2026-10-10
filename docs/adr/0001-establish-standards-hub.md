# ADR-0001: Establish a Standards Hub Without Silent Authority Transfer

## Status and date

Accepted setup scope, 2026-10-09. Owner: David Hoyt / tyohDeveloper. The user requested a separate Engineering Standards Project, recommended structure, and GitHub repository.

## Context

The imported portable v2.2 documents identify the `programming` wiki as the current authority. Their repository copies also contain local path mappings and target-specific extensions.

## Decision

Create a private Perplexity Engineering Standards Project and private `tyohDeveloper/engineering-standards` repository. Preserve unchanged, commit-pinned source snapshots with hashes and licenses. Add shared orientation, governance, review procedures, templates, and hub validation.

Do not treat creating the hub as a completed migration, a new normative standards release, application adoption, or permission to change application repositories.

## Alternatives rejected and why

- **A new policy written from scratch:** Would conflict with existing v2.2 requirements and discard established decisions.
- **Copy one application's entire architecture as shared policy:** Would incorrectly generalize path mappings and deployment-specific requirements.
- **Silently declare the new repo canonical for all policy:** Would contradict the preserved authority statements without reviewing companion wiki material.
- **Assume Project inheritance or live file import:** Would hide version and propagation obligations.

## Consequences

The owner now has an explicit shared maintenance surface and provenance. Normative authority transfer remains an open decision; application adoption is deliberate and versioned.

## Evidence

- [History & Prehistory source at pinned commit](https://github.com/tyohDeveloper/history-and-prehistory/blob/62c721d9b269bd6b25e202d0dbc8d94edf1e5d3b/docs/CODING-STANDARDS.md).
- [Unicode Explorer source at pinned commit](https://github.com/tyohDeveloper/Unicode-Explorer/blob/f48203173fce67959da14a1ccaa8e033af1ca220/docs/CODING-STANDARDS.md).
- [Source manifest](../../references/source-manifest.json).
