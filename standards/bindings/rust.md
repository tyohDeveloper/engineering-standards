# Rust Binding (Draft Stub)

Status: Draft stub (ADR-0003). Not normative. Becomes a proposed binding when the first Rust component (Tauri shell backend or `compute = kernel` module) is adopted. Entries marked "proposed" are starting points, not decisions.

Class: `application`, `platform-shell` (Tauri backend crates follow the platform-shell applicability column).

## Expected toolchain (proposed)

- Edition 2024, stable toolchain pinned in `rust-toolchain.toml`.
- `cargo clippy -- -D warnings`, `cargo fmt --check`, `cargo test`, `cargo deny` (licenses and advisories), `cargo udeps` (unused dependencies).
- Boundaries: crates named for responsibility and mapped to roles in the role-mapping document; dependency direction enforced by `Cargo.toml` (a PURE-role crate depends on nothing with effects).
- Serialization: `serde` with `#[serde(deny_unknown_fields)]` at ports (C-15).
- WASM kernels: `wasm-bindgen` with typed-array interfaces only (profiles §3.8).

## Rule matrix (proposed)

| Core | Status | Mechanism |
|---|---|---|
| C-1 | tool-checked | Crate-to-role mapping in the role-mapping document; module header comment for role |
| C-2 | enforced-by-language | Crate dependency graph; `pure` crates have no `std::fs`, `std::net`, `std::time` usage (clippy `disallowed_methods`) |
| C-3 | tool-checked | clippy `disallowed_types` / `disallowed_methods` for `SystemTime`, `Instant`, `rand::thread_rng`, env, fs, net in `pure` crates; `#![forbid(unsafe_code)]` |
| C-4 | enforced-by-language | Traits in a `ports` module; implementations in `platform` crates; generics or `dyn` injection |
| C-5 | review-checked | |
| C-6 | tool-checked | One `pub` item per module in `pure` crates, checked by a small script until a clippy lint exists |
| C-7 | review-checked | |
| C-8 | enforced-by-language | `&mut` access to state only inside the `state` crate; other crates receive `&` |
| C-9 | enforced-by-language | Ownership and borrowing; additional rule: no `Cell`/`RefCell`/`Mutex` in `pure` crates |
| C-10 | tool-checked | Tests named `scope_*` |
| C-11 | tool-checked | clippy `too_many_lines` (20 for `pub` fns, baseline §3.1), `too_many_arguments` (4) |
| C-12 | review-checked | Baseline §3.3 role limits; clippy has no file-length lint |
| C-13 | tool-checked | clippy `cognitive_complexity` |
| C-14 | tool-checked | Data files validated by a build script or `include_str!` plus schema test |
| C-15 | tool-checked | `serde` `deny_unknown_fields`; `schema_version` field required |
| C-16 | tool-checked | Mandated crates recorded in the adoption record (`uuid` v7, `time` or `jiff` with UTC storage) |
| C-17 | enforced-by-language | `Result<T, E>` with `thiserror`; `#![deny(clippy::unwrap_used, clippy::expect_used, clippy::panic)]` outside `main` and tests |
| C-18 | not-applicable | Rust has no VIEW role in current plans; revisit if a native UI appears |
| C-19 | CI | fmt, clippy, test, deny, udeps |
| C-20 | tool-checked | `#![deny(dead_code)]`, `cargo udeps` |
| C-21 | tool-checked | WASM size recorded and checked (`twiggy` or file-size script) |
| C-22 | review-checked | `cargo llvm-cov` threshold 90% on `pure` and `state` |
| C-23 | tool-checked | C-3 mechanisms; injected clock trait |
| C-24 | review-checked | |
| C-25 | validator | |
| C-26 | tool-checked | `cargo deny` |
| C-27 | validator | |
| C-28 | review-checked | |
| C-29 | validator + review | |

## Rust-specific rules (proposed)

- **RS-1** `unsafe` is forbidden outside a named `platform::ffi` module with an exception record.
- **RS-2** Panics are not an error-handling path; `unwrap`/`expect` only in tests and build scripts.
- **RS-3** Shared mutable state uses `Arc<Mutex<T>>` or `RwLock` placed in `state` or `platform` crates only; `pure` crates take and return owned or borrowed values.
- **RS-4** Kernels expose `&[f64]` / `&mut [f64]` (or integer equivalents) and return `Result`; no allocation hidden behind the interface unless declared.
- **RS-5** Numerical precision and determinism are declared in the kernel's doc comment and tested with fixed inputs.

## Interoperability with the TypeScript binding

- The WASM boundary is a port (C-4). TypeScript treats the kernel as PLATFORM-PURE; Rust treats the host as PLATFORM-AMBIENT.
- Shared schemas are generated from one source (proposed: JSON Schema emitted from Rust types, consumed by Zod via a generator) so C-15 holds on both sides.
