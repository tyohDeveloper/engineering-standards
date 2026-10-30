# ADR-0003: Language-Independent Coding Core with Per-Language Bindings

## Status and date

Proposed, 2026-10-30. Owner: David Hoyt / tyohDeveloper. Drafted on a branch for owner review.

## Context

The coding standards in the v2.2 baseline are written against TypeScript and browser tooling: `strict` compiler settings, ESLint and Prettier, Vitest, `tsc` as a gate. Most of the rules are not about TypeScript. Layer roles and import direction, mutable-state discipline, function and file granularity, test-identifier conventions, data-external rule, exceptions with owners and expiry, licensing, dead-code policy and documentation style hold in any language.

The expected language set is wider than TypeScript and Rust. Rust is likely for Tauri shells and reserved numerical kernels (ADR-0002, `compute = kernel`). App-store packaging forces Swift (iOS, macOS) and possibly Kotlin (Android/ChromeOS) for thin native layers. Clojure and ClojureScript are candidates for application code. Python is used for build, packaging and release utilities and may later serve as a high-level scripting layer; analysis languages such as R are an example of the same class. These languages differ in what they are for, and a rule that is mandatory for application code can be meaningless for a packaging script. Some TypeScript rules exist only because the language cannot enforce the idea (immutability by convention); in Rust the compiler enforces it and the rule becomes a note. Rust also needs rules TypeScript does not (unsafe code, panics, interior mutability placement).

## Decision

0. Languages are grouped into classes by purpose. The class decides which core rules are mandatory, which are advisory, and which are not applicable. A binding declares its class.

   | Class | Purpose | Examples | Core applicability |
   |---|---|---|---|
   | `application` | Domain logic, state, views, ports | TypeScript, Rust, Clojure, ClojureScript | All core rules mandatory |
   | `platform-shell` | Thin native layer required by a packaging target; no domain logic | Swift, Kotlin, Rust (Tauri backend) | Roles restricted to PLATFORM-AMBIENT and entry point; C-2, C-3, C-15, C-17, C-19, C-26, C-27 mandatory; granularity rules advisory; C-5 satisfied by containing no domain calculation |
   | `tooling` | Build, packaging, release, data preparation; runs at development time, never shipped | Python, shell | Intent of every rule holds; mandatory: C-14 (data external), C-15 (validate inputs), C-16 (UTC, UUIDs), C-17 (errors are values or explicit exit codes), C-19 (CI gating), C-20, C-26, C-27; granularity and role rules advisory |
   | `analysis` | Exploratory or statistical computation whose output is data or a report | R, Python notebooks | Mandatory: C-3 (seeded randomness, injected inputs), C-14, C-16, C-23 (determinism); results must be reproducible from a recorded script; role rules not applicable |

   A language may have one binding per class (for example `python-tooling` and `python-analysis`) when the checks differ.

1. The coding standard is split into a language-independent core, [standards/coding-core.md](../../standards/coding-core.md), and one binding per language under `standards/bindings/`. The core states each rule once with its intent and what must be checked. A binding states how the rule is expressed and which tool checks it, or that the language enforces it natively.
2. Core rules are numbered `C-n` and stable. Binding entries reference core rule numbers. A binding may add language-specific rules numbered `<lang>-n` but may not weaken a core rule; weakening is an exception under baseline §11.
3. A binding is one of: `enforced-by-language`, `tool-checked`, `review-checked`, or `not-applicable` (with reason) for each core rule.
4. Applications declare the bindings they adopt in `STANDARDS-ADOPTION.json` (`languages`). An application with a Rust kernel and a TypeScript shell declares both.
5. The TypeScript binding is extracted from the baseline without changing meaning. Rust, Swift, Kotlin, Clojure, ClojureScript and Python bindings are draft stubs that become normative when the first component in that language is adopted, not before. Every binding stub declares its class and the applicability table above fixes its minimum obligations in the meantime.
6. `standards/coding.md` remains the orientation summary and points to the core and bindings.

## Alternatives rejected and why

- **Keep one TypeScript-flavoured document and add Rust notes inline.** Rejected: rules would be stated twice with drift, and language-specific exceptions would blur which rule is the invariant.
- **Write a full Rust binding now.** Rejected: no Rust component exists; a binding written without a consumer would be untested policy.
- **One applicability level for all languages.** Rejected: forcing one-export-per-file and 20-line functions on a packaging script produces exceptions without benefit; dropping the rules for everyone loses them where they matter. Classes keep the intent and vary the obligation.
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
