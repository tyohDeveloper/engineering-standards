# ADR-0003: Language-Independent Coding Core with Per-Language Bindings

## Status and date

Proposed, 2026-10-30. Owner: David Hoyt / tyohDeveloper. Drafted on a branch for owner review.

## Context

The coding standards in the v2.2 baseline are written against TypeScript and browser tooling: `strict` compiler settings, ESLint and Prettier, Vitest, `tsc` as a gate. Most of the rules are not about TypeScript. Layer roles and import direction, mutable-state discipline, function and file granularity, test-identifier conventions, data-external rule, exceptions with owners and expiry, licensing, dead-code policy and documentation style hold in any language.

Rust is a plausible addition: Tauri shells have a Rust backend, and reserved numerical kernels (ADR-0002, `compute = kernel`) would likely compile Rust to WebAssembly. Some TypeScript rules exist only because the language cannot enforce the idea (immutability by convention); in Rust the compiler enforces it and the rule becomes a note. Rust also needs rules TypeScript does not (unsafe code, panics, interior mutability placement).

## Decision

1. The coding standard is split into a language-independent core, [standards/coding-core.md](../../standards/coding-core.md), and one binding per language under `standards/bindings/`. The core states each rule once with its intent and what must be checked. A binding states how the rule is expressed and which tool checks it, or that the language enforces it natively.
2. Core rules are numbered `C-n` and stable. Binding entries reference core rule numbers. A binding may add language-specific rules numbered `<lang>-n` but may not weaken a core rule; weakening is an exception under baseline §11.
3. A binding is one of: `enforced-by-language`, `tool-checked`, `review-checked`, or `not-applicable` (with reason) for each core rule.
4. Applications declare the bindings they adopt in `STANDARDS-ADOPTION.json` (`languages`). An application with a Rust kernel and a TypeScript shell declares both.
5. The TypeScript binding is extracted from the baseline without changing meaning. The Rust binding is a draft stub that becomes normative when the first Rust component is adopted, not before.
6. `standards/coding.md` remains the orientation summary and points to the core and bindings.

## Alternatives rejected and why

- **Keep one TypeScript-flavoured document and add Rust notes inline.** Rejected: rules would be stated twice with drift, and language-specific exceptions would blur which rule is the invariant.
- **Write a full Rust binding now.** Rejected: no Rust component exists; a binding written without a consumer would be untested policy.
- **Treat Rust as out of scope.** Rejected: the Tauri shell decision in ADR-0002 makes Rust present in native-shell editions regardless.

## Consequences

- Coding-agent instruction files (`AGENTS.md` templates) point to the binding for the application's languages; coding sessions do not need the core's rationale.
- The hub validator checks that declared languages have a binding file.
- Baseline cross-references in `standards/coding.md` and the review procedures gain core rule numbers when this ADR is accepted.

## Evidence and approval

- Thread of record: Perplexity Computer task `e2eee077-6a89-4764-8822-68cf0f3ba8f3`.
- Baseline: §§1-16 of the pinned snapshot.
- Approval: pending owner review.

## Supersession

None.
