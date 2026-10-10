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
- Check the application-specific artifact and data contracts.
- Run existing checks, preserving exact commands/results and inspection commit.
- Examine approved exceptions for owner, rationale, expiry, and continuing applicability.

## Output and boundaries

Report evidence-backed findings with path/line references, violated policy sections, impact, and remediation options. Distinguish confirmed violations, uncertain interpretations, missing tests, and application decisions requiring the owner.

A review is read-only unless implementation was authorized. Passing a checker is not a completed architecture review; recommendations do not constitute permission to remediate.

This procedure is a candidate for a personal reusable Skill. It is not an installed Skill merely because this Markdown file exists.
