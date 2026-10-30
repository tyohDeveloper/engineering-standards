# Architecture Review Procedure

## Inputs

- Exact application commit and scope.
- Adopted policy version and pinned source.
- Application role/path mapping and architecture document.
- Deployment target, data ownership, binding manifests, exceptions, and ADRs.

## Review

- Inspect the application before assuming framework, test tooling, or deployment shape.
- Map responsibilities to roles; test dependency direction and domain-named placement.
- Trace representative computation to verify single sourcing.
- Separate pure transforms from ambient effects and IO.
- Identify state and datastore ownership; examine MODEL/REMOTE contract and write authority.
- Review mandated binding authority separately from layer placement.
- Where the adoption record is schema version 2: confirm the declared delivery profile matches the ports, store and packaging actually used; confirm each non-default port implementation has a recorded reason and still satisfies the profile's state-class rules; confirm no domain calculation sits in platform-shell, tooling, analysis or schema code.
- Check the application-specific artifact and data contracts.
- Run existing checks, preserving exact commands/results and inspection commit.
- Examine approved exceptions for owner, rationale, expiry, and continuing applicability.
- Check enforcement coverage: confirm size, purity and import checks run over views and controllers, not only the layers already compliant (review-lessons page). A carve-out around the messy part is a finding.
- When logic was relocated, confirm explanatory comments on platform workarounds moved verbatim; confirm refactor history was retained, not deleted.

## Output and boundaries

Report evidence-backed findings with path/line references, violated policy sections, impact, and remediation options. Distinguish confirmed violations, uncertain interpretations, missing tests, and application decisions requiring the owner.

A review is read-only unless implementation was authorized. Passing a checker is not a completed architecture review; recommendations do not constitute permission to remediate.

This procedure is a candidate for a personal reusable Skill. It is not an installed Skill merely because this Markdown file exists.
