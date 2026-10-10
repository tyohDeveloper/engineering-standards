# Shared Architecture Orientation

**Status:** Derived summary of imported v2.2; not an independent normative release.

## Roles, not fixed directory shapes

The imported [portable baseline, sections 0–2 and 18](../references/source-snapshots/history-and-prehistory/CODING-STANDARDS.md) defines the following roles. Each application records where its roles actually live; the imported application's path table is not reusable as-is.

| Role | Responsibility |
|---|---|
| VIEW | Render state and invoke callbacks; no domain computation. |
| CONTROLLER | Sequence effects and IO; invoke domain logic rather than implementing it. |
| STATE | Pure state transitions and selectors; no ambient effects. |
| PURE | Deterministic domain computations; no IO, ambient time/randomness, input mutation, or UI coupling. |
| PURE-CORE | Small reusable pure primitives, subject to its own size limits. |
| DATA | Externalized domain/configuration data, with validation and ownership. |
| PLATFORM-PURE | Approved deterministic mandated primitives, governed by binding manifests. |
| PLATFORM-AMBIENT | Mandated effectful facilities, mediated through CONTROLLER. |
| MODEL | Persistent state for which this application owns write/schema/migration authority. |
| REMOTE | Contract-based access when another service owns the shared persistent state. |

## Core distinctions

- Domain calculation is single-sourced; UI and controllers do not independently reimplement it.
- Time, randomness, and other effects are injected or sequenced at the appropriate boundary.
- MODEL and REMOTE are alternative adapters behind a typed port, not separate dependency ranks.
- A second writer is an ownership trigger requiring reconsideration of MODEL versus REMOTE.
- Cross-service contracts do not imply transactional atomicity.
- Code location and authority to modify mandated bindings are independent.
- Standing policy bindings have review dates; actual exceptions have owners and expiry.

## Application-owned decisions

Each application supplies its role/path mapping, dependency graph, data ownership, target profile, build artifact contract, and ADRs. It does not inherit another application's font behavior, data semantics, storage policy, deployment stack, or source-layout table.

Review using [the architecture-review procedure](../reviews/architecture-review.md), and record deviations using [the exceptions template](../templates/EXCEPTIONS.md). The full baseline remains the controlling source for the exact rules and allowances.
