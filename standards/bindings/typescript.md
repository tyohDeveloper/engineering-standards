# TypeScript Binding

Status: Normative from release 1.0.0.0 (ADR-0003). Extracted from the v2.2 baseline without change of meaning. Applies to browser and Node TypeScript, including Tauri frontends.

Class: `application`.

## Toolchain

- Compiler: `tsc` with `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `verbatimModuleSyntax`.
- Lint: ESLint flat config with `typescript-eslint` (strict-type-checked), an import-boundary plugin (`eslint-plugin-boundaries` or `eslint-plugin-import` with zones), `eslint-plugin-unicorn` selected rules.
- Format: Prettier, default configuration unless the application records otherwise.
- Tests: Vitest; `@testing-library/dom` for VIEW tests.
- Schema: Zod at ports (C-15) and for data files (C-14).
- Dead code: `knip`.
- Size: `size-limit` or an equivalent gzip check (C-21).
- Licenses: `license-checker-rseidelsohn` or equivalent inventory (C-26).

## Rule matrix

| Core | Status | Mechanism |
|---|---|---|
| C-1 | tool-checked | Responsibility-named directories mapped to roles in the application's role-mapping document (`roleMappingDocument`); the boundaries plugin element types are generated from that mapping, never from layer-named folders |
| C-2 | tool-checked | Boundaries plugin rules keyed by role: PURE and DATA import only PURE/DATA; PLATFORM-AMBIENT, MODEL, REMOTE imported only from CONTROLLER |
| C-3 | tool-checked | `no-restricted-globals` (`Date`, `Math.random`, `fetch`, `localStorage`, `crypto`, `performance`) and `no-restricted-imports` scoped to PURE and DATA directories via overrides |
| C-4 | review-checked | Port interfaces are declared in a CONTROLLER-role module named for the capability; implementations are PLATFORM-AMBIENT, MODEL or REMOTE modules per the role mapping |
| C-5 | review-checked | Architecture review item |
| C-6 | tool-checked | `import/no-default-export`; one-export rule; `no-restricted-imports` on `lib`, `utils`, `helpers`, barrel paths |
| C-7 | review-checked | STATE module inventory in `ARCHITECTURE.md` |
| C-8 | tool-checked | `readonly` on exported state types; mutation only through STATE functions; `no-param-reassign` |
| C-9 | tool-checked | `readonly` types, `as const`, `prefer-readonly-parameter-types` where practical; persistent structures not required |
| C-10 | tool-checked | Tests named `scope-*` must exist for every user-owned entity; checked by a test-name grep in CI |
| C-11 | tool-checked | `max-lines-per-function: 20` on exported functions (baseline §3.1 counting), `max-params: 4` |
| C-12 | tool-checked | `max-lines` per role via ESLint overrides: PURE-CORE 100, PURE 150, STATE 150, CONTROLLER 150, PLATFORM-PURE 100, PLATFORM-AMBIENT/MODEL/REMOTE 150, VIEW 250 with an 80-line markup cap (core page, 2026-10-27); generated data exempt |
| C-13 | tool-checked | `max-depth: 3`, `complexity: 10` |
| C-14 | tool-checked | Zod schemas in `data/schemas/`; build script validates `data/**/*.json` |
| C-15 | tool-checked | Every port method parses with Zod; `schemaVersion` literal in every document schema |
| C-16 | tool-checked | Mandated bindings per adoption record (date-time library, `uuid` v7); `no-restricted-globals` on `Date` outside PLATFORM-PURE |
| C-17 | tool-checked | `Result<T, E>` type from a responsibility-named result module; `@typescript-eslint/only-throw-error`; `no-throw-literal`; throwing allowed only inside PLATFORM-AMBIENT adapters and the entry point |
| C-18 | tool-checked | `data-testid` naming rule; tests use `getByTestId` only |
| C-19 | CI | `tsc --noEmit`, `eslint --max-warnings 0`, `prettier --check`, `vitest run`, schema validation, `knip`, size check; custom checkers written against the TypeScript AST (`ts-morph` or typescript-eslint rules), failure messages prefixed with the `C-n` enforced. GitHub Actions `runs-on` pinned to a versioned image (for example `ubuntu-24.04`), never `ubuntu-latest`; Playwright browser installs are the usual casualty of a floating image |
| C-20 | tool-checked | `knip` |
| C-21 | tool-checked | gzip baseline recorded in `package.json` `size-limit` |
| C-22 | review-checked | Coverage threshold 90% lines on PURE and STATE directories, enforced by Vitest config |
| C-23 | tool-checked | C-3 rules; `vi.useFakeTimers()` in tests touching time |
| C-24 | review + tool | One-line justification per dependency in `DEPENDENCIES.md`; `size-limit` delta per PR against the 5 kB / 20 kB ceilings |
| C-25 | validator | Adoption record `mandatedBindings` |
| C-26 | tool-checked | License inventory at build |
| C-27 | validator | `EXCEPTIONS.md` |
| C-28 | review-checked | |
| C-29 | validator + review | Adoption record `profile` |
| C-30 | review-checked | Generated types diffed in CI where a generator exists |
| C-31 | tool-checked | `gitleaks` or `secretlint` in CI; `.env.example` committed |
| C-32–C-35 | tool-checked | Locale-file integrity tests (Vitest): base-key coverage, shape-identical key sets, supported-list versus files, no duplicate values in variants (OmniUnit `tests/json-integrity.test.ts` is the reference implementation) |
| C-36 | validator | `profile.localization.domains` |
| C-37, C-38 | tool-checked | Uniqueness test over base-language display names; symbol tables excluded from translation files |
| C-39 | tool-checked | Dead-key guard test against a committed allowlist |
| C-40 | tool-checked | Build-only prune plugin (OmniUnit `vite-plugin-prune-translations.ts`) plus a test that pruned resolution equals unpruned |
| C-41 | review + e2e | Playwright check on an RTL locale where a VIEW exists; RTL set in one module |
| C-45–C-48 | tool-checked | Registry schema test; factor-equals-function test; marker predicate test; order-derivation test with exemption list (OmniUnit `conversion-function-registry` pattern) |
| C-49 | review-checked | PR checklist item; sources view renders citations |
| C-42, C-43 | tool-checked | Formatting through `Intl` wrappers in PLATFORM-PURE with injected locale and numeral preference; `no-restricted-globals` on `navigator` in PURE; no numeral data in locale files (test) |

## TypeScript-specific rules

- **TS-1** No `any`; `unknown` at boundaries, narrowed by Zod.
- **TS-2** No enums; use string-literal unions or `as const` objects.
- **TS-3** No namespaces, no `export default`.
- **TS-4** ESM only; `verbatimModuleSyntax` with explicit `type` imports.
- **TS-5** Single-file targets inline all assets at build; no runtime `import()` of remote modules (profiles §3.1); the [artifact contract](../artifact-contract.md) verifier runs in CI.
- **TS-6** Mandated `single-file` stack (standalone page): Vite with a single-file plugin, html-minifier-terser configured per the artifact contract, Playwright for e2e, GitHub Actions for CI. Deviation requires a documented reason in the adoption record.
- **TS-7** No barrel files: no file consisting only of re-exports and no re-export statement inside a substantive file.
