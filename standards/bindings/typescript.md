# TypeScript Binding

Status: Proposed draft (ADR-0003). Extracted from the v2.2 baseline without change of meaning. Applies to browser and Node TypeScript, including Tauri frontends.

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
| C-12 | tool-checked | `max-lines` per role directory via ESLint overrides (baseline §3.3 values); generated data exempt |
| C-13 | tool-checked | `max-depth: 3`, `complexity: 10` |
| C-14 | tool-checked | Zod schemas in `data/schemas/`; build script validates `data/**/*.json` |
| C-15 | tool-checked | Every port method parses with Zod; `schemaVersion` literal in every document schema |
| C-16 | tool-checked | Mandated bindings per adoption record (date-time library, `uuid` v7); `no-restricted-globals` on `Date` outside PLATFORM-PURE |
| C-17 | tool-checked | `Result<T, E>` type from a responsibility-named result module; `@typescript-eslint/only-throw-error`; `no-throw-literal`; throwing allowed only inside PLATFORM-AMBIENT adapters and the entry point |
| C-18 | tool-checked | `data-testid` naming rule; tests use `getByTestId` only |
| C-19 | CI | `tsc --noEmit`, `eslint --max-warnings 0`, `prettier --check`, `vitest run`, schema validation, `knip`, size check |
| C-20 | tool-checked | `knip` |
| C-21 | tool-checked | gzip baseline recorded in `package.json` `size-limit` |
| C-22 | review-checked | Coverage threshold 90% lines on PURE and STATE directories, enforced by Vitest config |
| C-23 | tool-checked | C-3 rules; `vi.useFakeTimers()` in tests touching time |
| C-24 | review-checked | One-line justification per dependency in `DEPENDENCIES.md` |
| C-25 | validator | Adoption record `mandatedBindings` |
| C-26 | tool-checked | License inventory at build |
| C-27 | validator | `EXCEPTIONS.md` |
| C-28 | review-checked | |
| C-29 | validator + review | Adoption record `profile` |

## TypeScript-specific rules

- **TS-1** No `any`; `unknown` at boundaries, narrowed by Zod.
- **TS-2** No enums; use string-literal unions or `as const` objects.
- **TS-3** No namespaces, no `export default`.
- **TS-4** ESM only; `verbatimModuleSyntax` with explicit `type` imports.
- **TS-5** Single-file targets inline all assets at build; no runtime `import()` of remote modules (profiles §3.1).
