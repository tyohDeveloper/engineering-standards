# Coding Standards: Language-Independent Core

Status: Normative from release 0.2.0.0 (ADR-0003, ADR-0004). Derived from the v2.2 baseline §§1-16 and the exported companion pages; from 0.2.0.0 this document governs and the baseline is the pinned predecessor.

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

**C-16a Everything is zero-indexed.** Rows, keys within a row, stack levels, registers, panes and any other ordered sequence, in code, data and task descriptions; where a description gives both position and name they must agree under zero-based counting (data-layer page, baseline §6).
Check: review; tests where indices are data.

**C-17 Errors are values across role boundaries.** A function that can fail returns a typed result; exceptions or panics do not cross from one role to another. Unrecoverable failures terminate at the entry point with a message.
Check: tool-checked where the language supports it; review.

**C-45 Data may name a function; a validated registry resolves it.** A data entry that needs computation declares a function name resolved against one code-side registry; schema validation rejects unknown names. Data never contains code; code never contains the table of which entries use which function. (data-layer page)
Check: tool-checked schema plus registry test.

**C-46 Redundant representations are proven equal.** Where an entry carries two forms of the same fact (a factor and a function, a cached value and its source), a test asserts equality; consumers may then use either.
Check: tool-checked.

**C-47 Entries that break an assumption carry an explicit marker.** Consumers exclude by predicate on the marker; absence of a flag is never relied upon.
Check: review; schema requires the marker field.

**C-48 Ordering invariants are declared and independently tested.** Where array order is semantic, a test computes the expected order from the data and compares, with a short explicit exemption list. New entries are inserted in sorted position.
Check: tool-checked.

**C-49 Non-obvious domain values cite a source on the entry.** "Non-obvious" is anything other than a direct definition or a mathematical identity. Prefer primary sources (standards bodies, gazettes, law) over aggregators; when the primary is unreachable cite the aggregator and record the blocker; never cite a primary that contradicts the value. (localization page, "Source citation for domain values")
Check: review checklist; the application renders every citation where it has a sources view.

## E. Interface identifiers

**C-18 Stable UI-object identifiers.** Every interactive or tested element carries a stable identifier following baseline §4; identifiers are referenced from tests by name, never by structure.
Check: tool-checked in tests.

## F. Enforcement

**C-19 Build-time gating.** Type check, lint, format, tests, schema validation, dead-code and size checks run in CI and block merge (baseline §7). Warnings are errors. Checkers operate on the language AST; regex is permitted only for JSON, Markdown and the built artifact. Every checker failure message names the core rule or section it enforces, and the checker's header links to the document. Enforcement scope covers the whole application, widest where violation is most likely (views, controllers), never only the already-compliant layer. Rules a checker cannot yet express are recorded as a named lint plan, a `TODO(C-n)` marker or a failing test, not left to convention.
Check: CI configuration and checker scope reviewed at adoption.

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

**C-24 Maintained libraries over home-built code** when size and complexity stay within budget (baseline §9). Known-good bar: a release within 12 months, broad adoption (>100k weekly downloads or clearly canonical in its niche), permissive license (MIT, BSD, Apache-2.0, ISC). Shipped runtime libraries add ≤ 5 kB gzip each and ≤ 20 kB gzip cumulative per release; build-only tooling ships 0 bytes. Reject a library that duplicates what the language, framework or bundler already provides; prefer libraries that shrink existing code. Each dependency is justified in one line.
Check: review plus the C-21 gzip delta.

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

## J. Boundaries and secrets

**C-30 One schema source per cross-binding boundary.** Where code in two bindings exchanges data (shell↔web message port, WASM↔host, SQL↔application, analysis output→application data), one side owns the schema and the other is generated from it or validated against it. The boundary is a port (C-4).
Check: review-checked; generated artifacts diffed in CI where applicable.

**C-31 No secrets in code, configuration, logs or fixtures.** Secrets reach code only through the `Secrets` port or an injected runtime environment. Signing keys and store credentials used by tooling are read from the environment or an OS keychain at run time. CI runs a secret scanner.
Check: tool-checked (secret scanner); review.

## K. Localization

Source: baseline §15 (rules 15.1–15.12), authored for OmniUnitConverter-Calculator and identical in both pinned snapshots. Applies when the application's profile declares `localization.scope` other than `none` (profiles §1, §3.8). Rules are grouped by localization class.

Language class (`scope` includes `language`):

**C-32 One fallback chain.** `requested locale → base locale → raw key`, nothing further. Every reachable string exists as a key in the base locale. (15.1)
Check: tool-checked integrity test.

**C-33 Adding or removing a language is one all-files change.** The locale joins the canonical supported list and every translation domain gains a complete file in the same change; removal removes all of them. Renames and removals of keys are same-change, all-locale. (15.2, 15.9)
Check: tool-checked (list versus files; key-set test).

**C-34 Variants carry only the delta**, merged by the single shared cascade-resolve function. Duplicate values in a variant file are defects. (15.3)
Check: tool-checked.

**C-35 Key sets are shape-identical across locales** before any build-time pruning. (15.4)
Check: tool-checked integrity test.

**C-36 Translation domains are a declared closed set.** The application declares its domains (OmniUnit: interface strings and entity display names). Adding a domain amends the declaration first. (15.5, generalized from "exactly two")
Check: validator reads the declaration; review.

**C-37 Symbols and notation are never translated.** Unit, element, and SI or international notation stay canonical in every locale; only display names translate. (15.6)
Check: review; tool-checked where symbol tables exist.

**C-38 Display-name keys are global.** The same key resolves identically everywhere, so two entities must not share a base-language display name; collisions take a parenthetical qualifier that translates as part of the name. (15.7)
Check: tool-checked uniqueness test.

**C-39 Dead-key guard.** Every display-name key corresponds to a current entity, a title-cased base value, a key referenced by code through the translate functions, or a prefix-generated name, enforced against a committed allowlist. (15.8)
Check: tool-checked.

**C-40 Source locale files stay complete; the delivered artifact may be pruned.** Pruning drops only entries that resolve identically through fallback, runs at build only, and is coupled to the fallback chain so the two change together. (15.10)
Check: tool-checked build step plus a test that pruned output resolves identically.

**C-41 RTL treatment.** Layout stays LTR by default; only text runs honor natural direction; compound displays keep canonical order; numbers in RTL runs render in Latin numerals unless the user opts in; the RTL locale set lives in one place. (15.12)
Check: review; e2e test where a VIEW exists.

Numeric class (`scope` includes `numeric`):

**C-42 Numeral system is an independent preference.** Locale controls translated text; the numeral system is a separate preference resolved in the formatting layer, defaulting to Western Arabic; overrides never live in locale data. (15.11)
Check: tool-checked (no numeral data in locale files); review.

**C-43 Locale-sensitive formatting goes through the mandated binding** in PLATFORM-PURE with the locale and numeral preference injected. PURE code never reads ambient locale (`navigator.language`, process locale). Applies to numeric and date/time classes.
Check: tool-checked by C-3 mechanisms plus the mandated-binding check.

Date/time class (`scope` includes `datetime`):

**C-44 Reserved.** No application yet declares this class. Until a concrete case, C-43 applies and calendar or time-zone behavior is treated as domain data under C-14, not as localization.

Not adopted into the core: baseline 15.13 (notation conventions in reference text) is an application content convention under C-14 and stays in the application's standards document.

## Language classes

Bindings declare a class (ADR-0003 §0): `application`, `platform-shell`, `tooling`, `analysis`, or `schema`. Domain calculation found outside `application` is a violation remedied by porting, not by exception (ADR-0003 class boundary trigger). The class fixes which rules are mandatory, advisory, or not applicable. Intent is constant across classes; obligation varies.

| Rule group | application | platform-shell | tooling | analysis | schema |
|---|---|---|---|---|---|
| A Structure and roles (C-1–C-6) | mandatory | C-2, C-3 mandatory; roles limited to PLATFORM-AMBIENT and entry; others advisory | advisory | not applicable | not applicable (C-5: no domain calculation in database functions) |
| B State (C-7–C-10) | mandatory | C-8, C-9 mandatory; C-10 where data is scoped | advisory | not applicable | not applicable (scoping belongs to the application layer; hosted-only RLS is a profile rule, not a schema obligation) |
| C Granularity (C-11–C-13) | mandatory | advisory | advisory | advisory | advisory (one migration per change) |
| D Data (C-14–C-17, C-45–C-49) | mandatory | C-15, C-16, C-17 mandatory | mandatory | C-14, C-16, C-49 mandatory; C-17 as exit codes | mandatory; C-17 as transactional migrations; C-45–C-48 where seed data applies |
| E Identifiers (C-18) | mandatory where a VIEW exists | mandatory where a VIEW exists | not applicable | not applicable | not applicable |
| F Enforcement (C-19–C-21) | mandatory | C-19 mandatory; C-21 for shipped bundle | C-19, C-20 mandatory | C-19 as reproducibility run | C-19 (migrate up on empty and on previous release in CI) |
| G Testing (C-22–C-23) | mandatory | C-22 for ports; C-23 mandatory | C-23 mandatory; C-22 advisory | C-23 mandatory (seeded, recorded inputs) | C-22 for constraints and functions |
| H Dependencies (C-24–C-26) | mandatory | mandatory | mandatory | C-26 mandatory; pinned environment | C-25 (dialect subset) |
| I Process (C-27–C-29) | mandatory | mandatory | C-27 mandatory | C-27 mandatory | C-27, C-29 (profile migration rules) |
| J Boundaries and secrets (C-30–C-31) | mandatory | mandatory | mandatory | mandatory | mandatory |
| K Localization (C-32–C-44) | mandatory for declared scope | C-43 where the shell formats anything; otherwise not applicable | not applicable (tooling output is not localized) | not applicable | not applicable (locale data is DATA, not schema) |

## Rule-to-binding matrix

Each binding file declares its class and lists every `C-n` with one of: `enforced-by-language`, `tool-checked <tool>`, `review-checked`, `advisory`, `not-applicable <reason>`.
