# Coding Standards: Language-Independent Core

Status: Proposed draft (ADR-0003). Derived from the v2.2 baseline §§1-16; where this document and the pinned baseline disagree, the baseline governs until a policy release adopts this text.

Each rule has a stable number `C-n`, an intent, and a check requirement. Bindings in `standards/bindings/` say how each rule is enforced in a given language. A binding may tighten a rule; weakening is an exception under baseline §11.

## A. Structure and roles

**C-1 Every module has exactly one role.** Roles: VIEW, CONTROLLER, STATE, PURE, DATA, PLATFORM-PURE, PLATFORM-AMBIENT, MODEL, REMOTE (baseline §1). The role is recorded in the application's role-mapping document against responsibility-named directories or crates; layer-named directories are not imposed (hub AGENTS contract).
Check: tool-checked by directory or header convention.

**C-2 Imports flow in one direction.** VIEW → CONTROLLER → STATE → PURE; PURE and DATA import nothing with effects; PLATFORM-AMBIENT, MODEL and REMOTE are reached only from CONTROLLER through typed ports.
Check: tool-checked import-boundary rule.

**C-3 Pure modules have no ambient effects.** No clock, randomness, network, filesystem, environment, or global mutable state. Time and randomness are injected.
Check: tool-checked (forbidden identifiers or imports) plus review.

**C-4 Platform facilities are ports.** Storage, blobs, files, secrets, jobs, identity, clock and identifiers are accessed through typed interfaces with swappable implementations per delivery profile (profiles §3.6).
Check: review-checked; import rule in C-2 covers the mechanism.

**C-5 Domain calculation is single-sourced.** A rule or formula appears in one PURE module. Views and controllers never recompute it.
Check: review-checked; duplicate-detection tooling where available.

**C-6 One export per file** (baseline §3.2), subject to its explicit allowances. Names and directories identify domain responsibility; generic shape names (`lib`, `utils`, `helpers`, barrels) are prohibited by default.
Check: tool-checked where the language allows; otherwise review.

## B. State

**C-7 Mutable state is classified.** Each piece of state is one of: UI-transient, session, durable, derived. Derived state is recomputed, never stored (baseline §2).
Check: review-checked against the STATE module inventory.

**C-8 State changes go through STATE.** No module outside STATE mutates shared state; VIEW and CONTROLLER request changes.
Check: tool-checked where the language permits (readonly types, ownership); otherwise review.

**C-9 Data values are immutable by default.** Transformations return new values. Where the language enforces ownership or immutability natively, this rule is satisfied by the language.
Check: enforced-by-language or tool-checked.

**C-10 Scoping is a domain invariant.** Filters that restrict data to a user, library or session live in STATE or PURE and are unit-tested there. Storage-layer security is additional, never the sole mechanism.
Check: tool-checked by the presence of named tests; review.

## C. Granularity

**C-11 Function size.** Exported function bodies are limited to 20 lines under baseline §3.1, with its counting convention and documented exceptions; the binding sets the parameter limit (default 4).
Check: tool-checked.

**C-12 File size.** Role-specific file limits per baseline §3.3; there is no single universal limit. Generated data files are exempt and marked.
Check: tool-checked.

**C-13 No deep nesting.** Maximum nesting depth as set by the binding (default 3). Early return over nested conditionals.
Check: tool-checked.

## D. Data

**C-14 Data is external to code.** Reference data, lookup tables and copy live in data files with a declared schema, not in source (baseline §5). Data files are validated at build time.
Check: tool-checked schema validation.

**C-15 Boundaries validate.** Every value entering from outside the process (network, storage, file, user input) is validated against a schema before use. Documents carry a `schemaVersion`.
Check: tool-checked at the port layer; review.

**C-16 Identifiers and time.** Identifiers are UUIDs (v7 where ordering matters). Timestamps are stored in UTC with explicit offsets at boundaries. Counting and indexing conventions follow baseline §6.
Check: tool-checked by the mandated binding (§18).

**C-17 Errors are values across role boundaries.** A function that can fail returns a typed result; exceptions or panics do not cross from one role to another. Unrecoverable failures terminate at the entry point with a message.
Check: tool-checked where the language supports it; review.

## E. Interface identifiers

**C-18 Stable UI-object identifiers.** Every interactive or tested element carries a stable identifier following baseline §4; identifiers are referenced from tests by name, never by structure.
Check: tool-checked in tests.

## F. Enforcement

**C-19 Build-time gating.** Type check, lint, format, tests, schema validation, dead-code and size checks run in CI and block merge (baseline §7). Warnings are errors.
Check: CI configuration reviewed at adoption.

**C-20 No dead code.** Unused exports, dependencies and files fail the build.
Check: tool-checked.

**C-21 Size budget.** Delivered artifacts have a declared size baseline and a regression threshold (baseline §7.6 for single-file targets).
Check: tool-checked.

## G. Testing

**C-22 Tests target behavior through public interfaces.** PURE modules have unit tests; CONTROLLER and STATE have tests through ports with fake implementations; VIEW has identifier-based tests. Test names carry the identifier of the rule or feature under test (baseline §8).
Check: review; coverage thresholds set by the binding.

**C-23 Determinism.** Tests inject time and randomness. No network in unit tests.
Check: tool-checked by C-3 mechanisms.

## H. Dependencies and licensing

**C-24 Maintained libraries over home-built code** when size and complexity stay within budget (baseline §9). Each dependency is justified in one line in the dependency manifest or README.
Check: review.

**C-25 Mandated bindings.** Where the hub mandates a library for a concern (time, identifiers, numerics), applications use it or hold a recorded exception (baseline §18).
Check: tool-checked by the validator against the adoption record.

**C-26 Licensing.** Dependencies have licenses compatible with the application's license; a license inventory is generated at build (baseline §10).
Check: tool-checked.

## I. Process

**C-27 Exceptions have an owner and an expiry.** Every departure from a rule is recorded in `EXCEPTIONS.md` with rule number, reason, owner and review date (baseline §11).
Check: validator.

**C-28 Documentation style.** Rules are imperative, one idea per sentence, with the check stated (baseline §13). Agent instruction files contain directives only; rationale lives in ADRs.
Check: review.

**C-29 Delivery profile is declared** (profiles §5) and matches the ports and store actually used.
Check: validator for declaration; architecture review for match.

## Language classes

Bindings declare a class (ADR-0003 §0): `application`, `platform-shell`, `tooling`, or `analysis`. The class fixes which rules are mandatory, advisory, or not applicable. Intent is constant across classes; obligation varies.

| Rule group | application | platform-shell | tooling | analysis |
|---|---|---|---|---|
| A Structure and roles (C-1–C-6) | mandatory | C-2, C-3 mandatory; roles limited to PLATFORM-AMBIENT and entry; others advisory | advisory | not applicable |
| B State (C-7–C-10) | mandatory | C-8, C-9 mandatory; C-10 where data is scoped | advisory | not applicable |
| C Granularity (C-11–C-13) | mandatory | advisory | advisory | advisory |
| D Data (C-14–C-17) | mandatory | C-15, C-16, C-17 mandatory | mandatory | C-14, C-16 mandatory; C-17 as exit codes |
| E Identifiers (C-18) | mandatory where a VIEW exists | mandatory where a VIEW exists | not applicable | not applicable |
| F Enforcement (C-19–C-21) | mandatory | C-19 mandatory; C-21 for shipped bundle | C-19, C-20 mandatory | C-19 as reproducibility run |
| G Testing (C-22–C-23) | mandatory | C-22 for ports; C-23 mandatory | C-23 mandatory; C-22 advisory | C-23 mandatory (seeded, recorded inputs) |
| H Dependencies (C-24–C-26) | mandatory | mandatory | mandatory | C-26 mandatory; pinned environment |
| I Process (C-27–C-29) | mandatory | mandatory | C-27 mandatory | C-27 mandatory |

## Rule-to-binding matrix

Each binding file declares its class and lists every `C-n` with one of: `enforced-by-language`, `tool-checked <tool>`, `review-checked`, `advisory`, `not-applicable <reason>`.
