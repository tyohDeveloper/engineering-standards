# Kotlin Binding (Draft Stub)

Status: Draft stub (ADR-0003). Not normative. Becomes a proposed binding when the first component in this language is adopted.

Class: `platform-shell`. Applicability follows the `platform-shell` column in [coding-core.md](../coding-core.md); the rule matrix below is to be completed at that time.

## Purpose

Android and ChromeOS shells, if a Play Store edition is ever built. No domain logic.

## Expected toolchain and mechanisms (proposed)

- ktlint, detekt; JUnit for port adapters.
- Same single typed message port as Swift (C-4, C-15).
- `Result`/sealed error types; no uncaught exceptions across the bridge (C-17).

## Rule matrix

To be completed. Until then, the `platform-shell` class column sets the minimum obligations.
