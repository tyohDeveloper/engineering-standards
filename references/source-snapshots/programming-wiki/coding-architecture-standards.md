---
id: concepts/coding-architecture-standards
item_type: wiki_page
semantic_type: concept
title: Coding architecture standards (shared foundation)
description: Canonical source of truth for coding and architecture standards across all tyohDeveloper repositories, including the layer model, function and file size limits, naming, data, testing, and dependency rules; target-specific standards layer on top.
created_at: '2026-08-06T22:20:00+00:00'
updated_at: '2026-10-27T07:16:00+00:00'
---
# Coding architecture standards (shared foundation)

> **This page is the source of truth.** It is the canonical, normative statement of the coding and architecture standards for every repository under [tyohDeveloper](https://github.com/tyohDeveloper). Every repo carries a derived copy at `docs/CODING-STANDARDS.md` so coding agents read the same rules from inside the checkout. Amend this page first, then propagate. Where a repo file and this page disagree, this page wins.

This page is the target-agnostic foundation that every tyoh.app project inherits. It captures the build, code-structure, testing, dependency, repository, and documentation rules established during [[projects/omniunitconverter-calculator]] development[cite:1][cite:2]. Deployment-target-specific rules layer on top and live on their own pages:

- [[concepts/coding-standards-standalone-html5]] — single-file HTML apps (OmniUnit, History, Deep Time, Decay)
- [[concepts/coding-standards-hosted-postgres]] — Replit-hosted apps with a Postgres backend
- [[concepts/coding-standards-native-wrappers]] — iOS, macOS, and Windows wrappers around a standalone HTML build
- [[concepts/coding-standards-localization]] — locale data, key hygiene, numerals, RTL, and citation rules for any localizable app

Two companion pages carry material that belongs to this foundation but does not fit on one page:

- [[concepts/repository-conventions]] — GitHub host, branch, licensing, README, commit, and CI conventions
- [[concepts/architecture-review-lessons]] — meta-rules about applying and enforcing these standards
- [[concepts/coding-standards-data-layer]] — data externalization, schemas, taxonomies, indexing, and data-to-code references

Repository-owned rules and CI checks keep Replit Agent and other coding models aligned on the same architecture across projects[cite:1][cite:4]. Build and delivery mechanics for each target live on the target pages above.

## What it is

A target-agnostic set of build, code-structure, testing, dependency, repository, and documentation rules that every tyoh.app project inherits, established during OmniUnit development and reused across the family. Target-specific rules layer on top and live on their own pages.



## The layer model

Seven roles, one dependency direction — a layer imports only from layers below it: **VIEW** (rendering only) → **CONTROLLER** (hooks, effects, dispatch, IO, timers) → **STATE** (reducers, actions, selectors) → **PURE** (side-effect-free) → **{ DATA, PLATFORM-PURE, PLATFORM-AMBIENT }**, plus **MODEL**/**REMOTE** as two adapters behind one port beside CONTROLLER[cite:7][cite:12].

- **VIEW computes nothing** — views render state and call controller-supplied callbacks. No domain results, domain-text parsing, locale formatting, or domain arithmetic inline.
- **CONTROLLER sequences, never calculates** — effects, refs, timer handles, IO, dispatch, and calls into PURE. No arithmetic, domain policy, formatting algorithms, or parsing.
- **STATE is pure** — no `setTimeout`, `fetch`, DOM access, `Date.now()`, or `Math.random()` in reducers, action creators, or selectors.
- **PURE is genuinely pure** — no UI-framework imports, no `document`/`window`, no `Date.now()`, no IO, no module-level mutable state, no input mutation. Clock and randomness are injected as parameters, never read ambiently.
- **Single-sourced computation** — any calculation, transformation, or formatting operation is one PURE function that every call site imports. The review test: "if I fix a bug in this formula, how many files must I change?" The answer must be one. Extraction is preferred even for single-use formulas; skip it only when the computation is genuinely view-local. Intentional divergence between two call sites requires a documented exception with an owner and a resolution plan.
- **Runtime-dependency selection is single-sourced too** — the *choice* between a polyfill, a native API, and an alternative library is itself a single-source decision. One PURE file re-exports the chosen binding under an app-owned path; no consumer imports the underlying library or touches the global. Migration becomes a one-line change[cite:1].
- **PLATFORM and MODEL/REMOTE** — mandated crypto/ID primitives and shared-model access get a named role, not ad hoc app code. Full rules in [[concepts/coding-standards-platform-model-remote]][cite:12].

## Function and file granularity

Hard limits, not guidelines, enforced by CI. Stated against layer roles so they port across standalone-HTML, hosted-Postgres, and native-wrapper targets; each repo maps roles to its own paths in §0 of its copy[cite:7].

| Rule | Limit |
|---|---|
| **Function length** | Every exported function body **≤ 20 lines**, excluding signature and closing brace |
| **One export per file** | PURE files export at most one function (or function-producing factory); filename matches the function name in camelCase |
| **File length — PURE-CORE** | **100 lines** |
| **File length — PURE (elsewhere)** | **150 lines** |
| **File length — STATE** | **150 lines** |
| **File length — CONTROLLER** | **150 lines** |
| **File length — PLATFORM-PURE** | **100 lines** |
| **File length — PLATFORM-AMBIENT / MODEL / REMOTE** | **150 lines** |
| **File length — VIEW** | **250 lines**, with a **80-line** cap on markup in the return statement |

**Coverage rule:** these limits apply to the entire application, not to the subset that already complies. See the enforcement lesson under "Lessons from the architecture pass" below — this is the rule the original enforcement got wrong.


- **The VIEW carve-out is narrow** — inside a view file, event handlers, effects, IIFEs, and named callbacks still obey the 20-line rule. A declarative markup render body is the only function body permitted to exceed it. A component whose markup exceeds 80 lines is split into children. Deliberate carve-out, not a hole.
- **Over-limit files diagnose themselves** — a controller over 150 lines is either doing pure work (extract to PURE) or coordinating too many domains (split by domain).
- **No duplication** — logic used in more than one file is extracted to its own PURE file. Applies to data too: a value appearing in multiple JSON files belongs in the base file only, resolved by a single shared cascade function.
- **No dead code** — unused functions, exports, JSON keys, dead branches, identical `if`/`else` arms, and unreachable defaults are removed on sight, enforced by a build-time scan.
- **Name for responsibility, not shape** — `helpers`, `utils`, `misc`, `common`, `shared`, `handlers`, `setters`, `getters`, `lib`, `index`, `types`, `useHelpers`, `useHandlers` are prohibited by default, including as leaf names inside a well-named directory. Directories name domains, not layers; a `formatting/` directory that accumulates parsers has drifted and must be renamed, split, or have the outliers moved[cite:1].
- **`client`, `stub`, `connector`, `gateway` are reserved and prohibited** for the shared-state adapter role, in favor of REMOTE (ADR-0001, rationale in [[concepts/coding-standards-platform-model-remote]])[cite:12].
- **No barrel files** — no file consisting only of re-exports, and no single re-export statement inside an otherwise substantive file. Barrels launder the domain boundaries the naming rule exists to force people to draw, double refactor cost, signal overloaded consumers, and risk defeating tree-shaking. Permitted only as a single-symbol migration shim with a removal date, or a single-symbol runtime-dependency source-selection shim[cite:1].
- **Exceptions expire** — every excluded file carries an `EXCEPTION [coding-standards §N]` comment with reason, owner, approval date, expiry date, and renewal condition. Repo-wide exceptions live in a machine-checkable `.architecture-exceptions.json`. An exception that outlives the condition that produced it is dead code.

### Superseded predecessors

The limits tightened over time; earlier per-repo files remain as history but are no longer normative. Book-Converter's `Cleanup.txt` set < 200-line files and ≤ 30-line functions; multiCalc's `artifacts/rpn-calc/CONVENTIONS.md` set ≤ 25-line functions; OmniUnit's `docs/perplexity/architecture-standards.md` v1.7 §3 set the current 20-line rule, which this page adopts family-wide[cite:8][cite:9][cite:10].


## Testing and IDs

- **Stable production test IDs** — shipped IDs follow `{role}-{area}-{name}[-{key}]`; uniqueness and manifest coverage are build-tested. The small bundle cost is accepted so the delivered artifact remains externally testable[cite:1][cite:4].
- **Playwright in CI, not just locally** — GitHub Actions runs the same test suite so build parity across environments stays enforced[cite:1][cite:3].
- **Identifier grammar and coverage** — every interactive primitive and every test-asserted read-only display carries a `data-testid`. The `{key}` segment is required for anything generated in a list and uses the domain key, never the array index. IDs are additive-only; corrective renames go through a rename-manifest PR listing every old → new mapping and updating every consumer in the same change[cite:1].
- **Every exported PURE function has a unit test**, every reducer has transition tests for every action type, and every user-visible flow has an end-to-end test run against the built artifact rather than the dev server[cite:1].
- **No rule enforced only by convention** — if a checker cannot express a rule today, it is captured as a named lint-rule plan, a `TODO(coding-standards §N)` marker, or a targeted failing test. Linters are devDependencies only and add zero bytes to the artifact. Checkers use the language AST; regex parsing is permitted only for JSON, Markdown, and the built artifact[cite:1].
- **Gzip ceiling is a formula** — the artifact verifier enforces gzip ≤ `baseline × 1.05`. Re-baselining is a deliberate reviewed change that records a note identifying what caused the shift; it is never an automated bump[cite:11].

## Dependency policy

- **Maintained libraries preferred over custom code** when deliverable size and complexity stay controlled. This matches the user's general preference[cite:1].
- **Explicit size impact for shipped dependencies** — the HTML minifier is build-only; ESLint with typescript-eslint is the planned replacement for the regex size checker after structural extraction work[cite:1].
- **Known-good bar** — actively maintained (release within 12 months), broadly adopted (>100k weekly downloads or clearly canonical in its niche), permissively licensed (MIT/BSD/Apache-2.0/ISC). A library that is the canonical implementation in its category is presumed compliant; popular is not enough[cite:1].
- **Measured size budget** — dev/build-only tooling costs **0 bytes shipped** as a hard rule. Runtime libraries are **≤ +5 kB gzip** each and **≤ +20 kB gzip** cumulative per release, enforced by the gzip-baseline delta. Exceeding either ceiling needs an exception with measured before/after numbers[cite:1].
- **Prefer libraries that shrink existing code**, and reject any library duplicating a capability the language, framework, or bundler already provides — this is the rule that catches utility-library sprawl[cite:1].
- **Dev tools are not free at 0 bytes shipped** — new devDeps cost install time, disk, and CI cache, and must justify themselves against the checker or capability they enable[cite:1].
- **No external URLs at runtime** — offline `file://` use is a first-class requirement across the app family, so all fonts, libraries, and assets are inlined[cite:1].


## Authority and change control

Orthogonal to the layer model: layer is where code lives, authority is who may change a mandated binding and whether the build matches policy. Full rule set in [[concepts/coding-standards-platform-model-remote]][cite:12].


## Documentation style

- **Textbook-style reference specs, not directive documents** — reference documents in `docs/perplexity/` present math and rules in exact symbolic form as a matter of style, without prescriptive language like "do not hard-code decimals" that could be misinterpreted by downstream consumers[cite:5]. See `docs/perplexity/quantization-snr-spec.md` for the pattern.
- **Cite primary sources in commits** — reference documents include a primary-source citation list so commits can point to specific authorities.
- **Architecture decisions get a numbered, immutable record** — `docs/adr/NNNN-*.md`, one file per decision, required "alternatives rejected and why" section (ADR-0001 in [[concepts/coding-standards-platform-model-remote]])[cite:12].


## Propagation to repositories

- **Every repo carries `docs/CODING-STANDARDS.md`** — a derived copy of this page, stated against layer roles rather than literal paths, so the same file is valid in a single-file HTML app, a Replit-hosted Postgres app, and a native wrapper. All eleven repositories under the account carry it, including the older playgrounds, so any agent opening any checkout finds the rules.
- **Each repo declares its own path mapping** — §0 of the repo copy maps each role, now including PLATFORM-PURE / PLATFORM-AMBIENT / MODEL / REMOTE, to that repository's actual directories. An unmapped role means the repo has no such layer and the rule is inert. An empty mapping marks a pre-architecture repo, filled in by its first structural PR.
- **Agent entry points point at the file** — `AGENTS.md` and `replit.md`, where present, link to `docs/CODING-STANDARDS.md` as the binding rules, since those are the files coding agents read first.
- **Amend here, then propagate** — the wiki page is amended first; repo copies are updated from it. A standard is not adopted until the enforcing checker fails on a violation.

## Open follow-ups

- **Dimensional policy for odd roots and transcendental functions** — the OmniUnit architecture review left one documented follow-up: define and test behavior for roots of odd unit exponents and transcendental functions applied to dimensioned values. This applies to any future app that inherits the numeric pipeline[cite:1][cite:6].
- **PLATFORM, MODEL, REMOTE are reserved but unexercised** — all current repos are standalone-HTML5; see [[concepts/coding-standards-platform-model-remote]][cite:12].

## See also

- [[projects/omniunitconverter-calculator]] — where these standards were established
- [[projects/tyoh-app-tools-family]] — the apps that inherit these standards
- [[projects/apple-music-library-curation]] — a server-backed app inheriting the foundation
- [[concepts/repository-conventions]] — repo, license, and commit conventions
- [[concepts/coding-standards-data-layer]] — the DATA layer rules in full
- [[concepts/coding-standards-platform-model-remote]] — the PLATFORM, MODEL, and REMOTE roles in full, and the authority/change-control rules (links onward to architecture-review-lessons)

## References

[cite:1]: pplx://sessions/6af5d700-627e-42c6-b71f-6b92a4521aad
[cite:2]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator
[cite:3]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.github/workflows/build.yml
[cite:4]: pplx://sessions/3c8cdbce-cea3-4325-a2b1-3fbc1dcfecaf
[cite:5]: pplx://sessions/4fb47892-55c0-40db-adef-58211d78845e
[cite:6]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/commit/e362bcc112
[cite:7]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/docs/perplexity/architecture-standards.md
[cite:8]: https://github.com/tyohDeveloper/Book-Converter/blob/main/Cleanup.txt
[cite:9]: https://github.com/tyohDeveloper/multiCalc/blob/main/artifacts/rpn-calc/CONVENTIONS.md
[cite:10]: https://github.com/tyohDeveloper/multiCalc/blob/main/docs/tasks/task-1.md
[cite:11]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.agents/memory/build-size-ceiling.md
[cite:12]: pplx://sessions/1deda0c7-3fc4-4567-a8ed-b728a56ba165
