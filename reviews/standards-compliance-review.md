# Standards Compliance Review Procedure

## Establish the contract

Read the application's adoption record, complete standards copy, role/path mapping, exceptions, and target-specific profiles. Resolve authority conflicts before treating a summary as normative.

## Check

- Inspect the selected repository at an exact commit.
- Record which policy requirements have executable checks and which require human review.
- Run the repository's declared validation, lint, typecheck, tests, build, architecture, data, and artifact checks as applicable.
- Examine function/file limits, responsibility naming, import boundaries, dead code, data externalization, and pure-function tests.
- Verify mandated bindings and exception expiry where present.
- Compare documentation claims with actual enforcement; a no-op or incomplete checker is a gap, not a pass.

## Report

Include scope, source versions, commands/results, evidence, exceptions, untested requirements, and prioritized findings. Do not infer full compliance from this hub's `npm run validate`.

If an enforceable rule changes, require a corresponding checker/test change before adoption. No application edits are authorized by invoking this review procedure alone.
