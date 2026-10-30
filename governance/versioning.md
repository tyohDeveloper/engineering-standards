# Version Meaning

## Separate tracks

| Track | Initial state |
|---|---|
| Hub scaffold | `0.1.0.0`: initial organization/provenance/validation checkpoint. |
| Hub policy | `1.0.0.0`: first hub-authored policy release and authority transfer (ADR-0002, ADR-0003, ADR-0004). First-component bump because authority moved to the hub; planned as `0.2.0.0` before that was folded in. |
| Imported policy | `2.2`: preserved portable edition; not converted to a new number. |
| Application | Owned and released by each application repository. |
| Application data | Separate from application software where relevant. |

The hub uses four components for meaningful change chunks, and release notes explain the actual significance. This is deliberately **not SemVer**; the existing application convention is documented in section 12 of [the baseline](../references/source-snapshots/history-and-prehistory/CODING-STANDARDS.md).

## Hub interpretation

- First component: major approved change to the hub's scope or authority.
- Second: substantial multi-file governance/process changes.
- Third: smaller substantive fixes.
- Fourth: spelling/copy-only corrections.

This mapping is a hub maintenance convention, not a retroactive rewrite of existing application version rules. `0.1.0.0` is a scaffold checkpoint; it does not certify completed standards migration or mature enforcement.

## Tags and meaning

Do not tag an unapproved policy as authoritative. Once approved, use a clearly standards-scoped tag and a release document carrying scope, decisions, compatibility/adoption notes, verification, and owner approval. Documentation-only updates do not bump unrelated app or data tracks.
