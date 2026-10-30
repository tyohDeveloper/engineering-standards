# Swift Binding (Draft Stub)

Status: Draft stub (ADR-0003). Not normative. Becomes a proposed binding when the first component in this language is adopted.

Class: `platform-shell`. Applicability follows the `platform-shell` column in [coding-core.md](../coding-core.md); the rule matrix below is to be completed at that time.

## Purpose

iOS and macOS app-store shells (WKWebView host, MusicKit token and user authorization, file pickers, OS-container storage). No domain logic.

## Expected toolchain and mechanisms (proposed)

- Swift 6 language mode, strict concurrency.
- SwiftLint, SwiftFormat; XCTest for port adapters.
- Only PLATFORM-AMBIENT and entry-point roles; bridge to the web layer through a single typed message port (C-4, C-15).
- `Result` and typed errors; no `try!`/`fatalError` outside `main` (C-17).

## Rule matrix

To be completed. Until then, the `platform-shell` class column sets the minimum obligations.
