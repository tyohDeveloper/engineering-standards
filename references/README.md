# Source Provenance

The [manifest](source-manifest.json) pins each downloaded source file to a GitHub repository commit and a local SHA-256 hash. Files under `source-snapshots/` are unchanged source evidence and are excluded from local Markdown-link checks because their links refer to their original application checkouts.

## Imported material

- History & Prehistory portable v2.2 coding/architecture standards and its MIT license.
- Unicode Explorer portable v2.2 coding/architecture standards and its MIT license.

The documents are not identical: they include application role/path mappings and later application-specific extensions. Neither complete snapshot is a universally reusable application configuration.

## Not yet imported

The core and companion `programming` wiki pages have not been exported or reconciled. The migration therefore remains incomplete, and the shared orientation documents must not replace the stated normative authority.

## Refreshing evidence

Download from a new exact commit into a new snapshot path, record provenance, review the diff, and update migration notes. Do not silently mutate the existing historical snapshot.

## Programming Project wiki export (2026-10-30)

`source-snapshots/programming-wiki/` holds verbatim exports of the ten wiki pages that the v2.2 baseline names as its source of truth (core page plus nine companions), taken from the knowledge repository of the Perplexity Project "programming" at the commit recorded in `source-manifest.json` (`wikiExport.knowledgeCommit`). Each entry records the page's `updated_at`. The pages are immutable historical evidence here; the comparison and decisions are in `governance/wiki-reconciliation.md`. Wiki-internal links (`[[concepts/...]]`) and `pplx://` citations are left as written and do not resolve from this repository.
