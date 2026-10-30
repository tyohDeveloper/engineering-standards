# Shared Coding Orientation

**Status:** Derived summary of imported v2.2; not an independent normative release.

The exact requirements, carve-outs, and enforcement obligations remain in [the complete portable baseline](../references/source-snapshots/history-and-prehistory/CODING-STANDARDS.md).

A proposed restatement as a [language-independent core](coding-core.md) with [per-language bindings](bindings/) is on review (ADR-0003). Until adopted, the baseline governs.

## Decomposition and responsibility

- Exported function bodies are limited to 20 lines under section 3.1, with the specified counting convention and documented exceptions.
- Section 3.2 calls for one export per file, subject to explicit allowances.
- Section 3.3 has role-specific file limits; it is not one universal 250-line limit.
- Names and directories identify domain responsibilities. Generic shape names such as `lib`, `utils`, `helpers`, and barrels are prohibited by default, with documented baseline carve-outs.
- Pure computation and runtime binding selection are single-sourced; generic re-export barrels are not the solution.
- Data that changes independently belongs in externalized validated data, not duplicated code constants.

## Checks and dependencies

- Every exported PURE function has unit coverage under section 8; inspect each application before selecting tools.
- Test, lint, typecheck, build, architecture, artifact, and data checks must run through explicit repository commands appropriate to that application.
- Prefer maintained libraries when bundle/cost/license constraints permit; document the choice rather than assuming all custom code is desirable.
- MIT repository licensing and dependency compatibility screening remain the standing imported policy.
- A new enforceable standard requires its checker to change in the same reviewed change; documentation alone is not proof of enforcement.

## Repository practice

Keep cross-agent guidance, application architecture, and coding requirements in the repository. Use terse/decomposed commits, durable implementation-plan checkpoints, ADRs with rejected alternatives, and release notes that explain semantic changes.

The existing four-part application version scheme is not SemVer. Hub versions and application/data versions remain separate; see [versioning](../governance/versioning.md).

Application-specific mappings and extensions in a snapshot remain local to its original repository. Do not transplant them without review.
