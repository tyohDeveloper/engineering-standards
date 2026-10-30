# Clojure and ClojureScript Binding (Draft Stub)

Status: Draft stub (ADR-0003). Not normative. Becomes a proposed binding when the first component in this language is adopted.

Class: `application`. Applicability follows the `application` column in [coding-core.md](../coding-core.md); the rule matrix below is to be completed at that time.

## Purpose

Application code where immutable data and REPL development are the better fit; ClojureScript may share a single-file or hosted-web packaging with TypeScript.

## Expected toolchain and mechanisms (proposed)

- clj-kondo, cljfmt; `clojure.test` or `kaocha`.
- Roles mapped to namespaces in the role-mapping document (C-1); clj-kondo `:discouraged-namespace` for effect namespaces in PURE (C-2, C-3).
- Boundaries validated with Malli or spec; `:schema-version` key in documents (C-15).
- Atoms/refs confined to STATE namespaces (C-8); persistent data structures satisfy C-9 natively.
- Failures as data (`{:ok ...}`/`{:error ...}`) across role boundaries; no `throw` out of PURE (C-17).
- clj-kondo `:unused-public-var` for C-20.

## Rule matrix

To be completed. Until then, the `application` class column sets the minimum obligations.
