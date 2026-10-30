# Application Adoption

## Registered applications

| Application | Policy | Source commit | Adopted | Record |
|---|---|---|---|---|
| [tyohDeveloper/apple-music](https://github.com/tyohDeveloper/apple-music) | 1.0.1.0 (schema 2); app `b272d80` | `bb876dd` | 2026-10-30 | [apple-music.json](apple-music.json) |
| [tyohDeveloper/OmniUnitConverter-Calculator](https://github.com/tyohDeveloper/OmniUnitConverter-Calculator) | 1.0.1.0 (schema 2) | `bb876dd` | 2026-10-30 | [omniunitconverter-calculator.json](omniunitconverter-calculator.json) |
| [tyohDeveloper/Unicode-Explorer](https://github.com/tyohDeveloper/Unicode-Explorer) | 1.0.1.1 (schema 2); app `3c00a6e` | `9f00458` | 2026-10-30 | [unicode-explorer.json](unicode-explorer.json) |
| [tyohDeveloper/history-and-prehistory](https://github.com/tyohDeveloper/history-and-prehistory) | 1.0.1.1 (schema 2) | `9f00458` | 2026-10-30 | [history-and-prehistory.json](history-and-prehistory.json) |
| [tyohDeveloper/Book-Converter](https://github.com/tyohDeveloper/Book-Converter) | 1.0.1.1 (schema 2) | `9f00458` | 2026-10-30 | [book-converter.json](book-converter.json) |
| [tyohDeveloper/multiCalc](https://github.com/tyohDeveloper/multiCalc) | 1.0.1.1 (schema 2) | `9f00458` | 2026-10-30 | [multicalc.json](multicalc.json) |
| [tyohDeveloper/Css-editor](https://github.com/tyohDeveloper/Css-editor) | 1.0.1.1 (schema 2) | `9f00458` | 2026-10-30 | [css-editor.json](css-editor.json) |
| [tyohDeveloper/income-tiles](https://github.com/tyohDeveloper/income-tiles) | 1.0.1.1 (schema 2) | `9f00458` | 2026-10-30 | [income-tiles.json](income-tiles.json) |
| [tyohDeveloper/Monaco-JSON-Editor](https://github.com/tyohDeveloper/Monaco-JSON-Editor) | 1.0.1.1 (schema 2) | `9f00458` | 2026-10-30 | [monaco-json-editor.json](monaco-json-editor.json) |

## Out of scope

| Repository | Decision |
|---|---|
| [tyohDeveloper/Examples](https://github.com/tyohDeveloper/Examples) | Non-application scratch repository; v2.2 copy removed (PR #3); archived 2026-10-30 |
| [tyohDeveloper/name](https://github.com/tyohDeveloper/name) | Unfinished 2019 Clojure library skeleton; v2.2 copy removed (PR #2); archived 2026-10-30 |

Existing application copies of v2.2 are evidence of the previous distribution process, not proof of migration to this repository.

## Registering adoption

- Review the actual application architecture and local role/path mapping.
- Pin an owner-approved policy release and immutable source commit.
- Preserve application-specific targets, exceptions, and ADRs.
- Bind requirements to actual local check commands and manual reviews.
- Commit the application adoption change separately from unrelated implementation.
- Add `adoption/<application>.json` here only after verifying the application's adoption commit.

Use [the manifest template](../templates/STANDARDS-ADOPTION.json). The validator checks record structure but cannot prove the application actually runs its claimed checks.
