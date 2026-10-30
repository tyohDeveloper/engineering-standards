---
id: concepts/coding-standards-localization
item_type: wiki_page
semantic_type: concept
title: Coding standards — localization and locale data
description: Normative rules for locale data, translation-key hygiene, numeral systems, RTL treatment, and source citation across all localizable tyoh.app data apps. Established during OmniUnit's 12-language build; applies to History, Deep Time, and Decay.
created_at: '2026-08-08T12:20:00+00:00'
updated_at: '2026-08-08T12:24:00+00:00'
---
# Coding standards — localization and locale data

Rules for any app that ships translated text or locale-sensitive number, date, and layout treatment. Layers on top of [[concepts/coding-architecture-standards]]. Established during [[projects/omniunitconverter-calculator]]'s 12-language build and its August 2026 architecture pass, and applies unchanged to [[projects/historical-time-and-date-tools]], [[projects/earth-cosmos-timeline]], and [[projects/decay-timescales]] — all of which are localizable data apps that will hit every rule here[cite:1][cite:2].

These rules are the most expensive lessons in the family: silent bundle bloat from orphaned keys, cross-category name collisions producing wrong translations, and numeral-system coupling that made Arabic unusable. Each rule below exists because the absence of it caused a real defect.

## What it is

A set of normative rules for every localizable app in the family, covering five concerns: which locale data files must exist and how they fall back; how translation keys stay in sync with domain data; how numerals and text direction are treated independently of language; how domain values are sourced; and what notation reference text uses. The rules are target-agnostic — a standalone HTML app and a hosted app localize the same way — but the bundle-size consequences bite hardest on the single-file target[cite:1][cite:2].

The distinction that matters most: **language and presentation are separate axes.** Locale selects translated text. Numeral system, text direction, and compound-value ordering are independent preferences that do not follow from the language choice. Coupling them is the defect this page exists to prevent.

## Fallback and key coverage

- **One fallback locale, one chain** — `en` is the fallback. The resolution chain is `requested locale → en → the raw key`, and nothing further. Every string any code path can reach exists as a key in the base locale file.
- **Adding a language is a three-file change** — the locale code joins the canonical supported-languages list, and both translation domains (see below) gain a file with full key coverage. Removing a language removes all three in the same PR. A locale code present in the list without matching data files silently degrades to English with no error.
- **Regional variants carry only the delta** — a variant file (`en-us` against `en`) contains only keys whose values differ from the base. Everything else falls through. The merge is performed by one shared cascade-resolve function reused by every variant layer — the same function the label and symbol configs use. Storing duplicate values in a variant file is a defect, not a style preference.
- **Key sets are shape-identical across locales before pruning** — a locale file that adds a key absent from the base, or omits a key the base has, is a bug caught by an integrity test and a build schema check.

## Translation domains

- **Exactly two domains, and no third without an amendment** — user-visible interface strings (button labels, tooltips, help copy, error messages, chrome-level category and dimension names) are one domain; **display names** of domain entities (units, periods, isotopes) are the other. If a new class of translated string appears, it belongs in one of these two, or this page changes first.
- **Symbols are never translated** — unit symbols, element symbols, and other international/SI notation stay in canonical form regardless of locale. Only display names translate. This is the rule most likely to be violated by a well-meaning translator pass.

## Key hygiene

- **Display-name keys are global, not category-scoped** — the same key resolves to the same translation everywhere it appears. The direct consequence: **two entities in different categories must not share the same base-language display name.** When a collision would occur, the later entrant is disambiguated with a parenthetical qualifier that is part of the name and translates as a whole — mass `Dan (China)` versus volume `Dan (China, Volume)` is the reference case[cite:3].
- **Dead-key guard** — every key in a display-name locale file must correspond to a current entity name in the domain data, a title-cased base-unit value, a key literally referenced by code through the translate functions, or a prefix-generated display name. A guard test enforces this against an explicit allowlist. This rule exists because renames in domain data silently left roughly 120 orphaned keys duplicated across 12 locale files; the older drift test only caught non-base locales diverging from the base, never the base file itself going stale[cite:3].
- **Renames and removals are same-PR, all-locale** — renaming or removing an entity removes its old key from every locale file in the same PR. Adding a code-referenced or prefix-generated key adds its allowlist entry in the same PR.
- **Auditing caveat** — lowercase strings in code and tests (`celsius`, `ohm`, `m³/s`) are usually entity IDs or symbols, not translation keys. Treat them as false positives when scanning for dead keys[cite:3].

## Build-time pruning

- **Source files stay complete; the bundle gets pruned** — a build-only plugin drops entries that would resolve identically through fallback: base-locale entries whose value equals the key, and other-locale entries whose value equals the resolved base value. Dev server and unit tests always see the full files, so completeness tests keep passing.
- **Pruning depends on the fallback chain staying intact** — if a runtime translate function loses its missing-key → base → key fallback, pruning breaks display. The two are coupled and must be changed together.
- **A translation that just repeats the base language costs roughly zero bundle bytes** but must still exist in source for the integrity tests[cite:4].
- **Locale changes shift the size baseline** — legitimate shifts are recorded in the baseline's note field identifying which locale or category caused them. Unexplained increases fail the size ceiling.

## Numerals, formats, and RTL

- **Numeral system is decoupled from locale** — locale controls translated text; a separate independent preference controls the numeral system (Western Arabic, Arabic-Indic, CJK-myriad, South Asian grouping). New locales inherit Western Arabic as the default, and overrides live in the formatting layer's behavior, not in locale JSON.
- **Layout stays LTR by default** — application layout does not flip for RTL locales. Only text runs that should honor natural direction do so.
- **Compound displays preserve canonical order across RTL** — feet-inches, degrees-minutes-seconds, and similar composites keep their canonical ordering regardless of direction.
- **Numbers inside RTL text runs render in Latin numerals** unless the user explicitly opts into Arabic-Indic through the numeral preference. This is a stable behavioral contract; changing it requires a recorded UX decision.
- **One direction check, not scattered conditionals** — the RTL locale set lives in a single place. Adding an RTL locale extends that set; it does not add direction checks across components.

## Source citation for domain values

- **Every non-obvious value cites a source** — non-obvious means anything other than a direct base-unit definition or a purely mathematical identity. Citations live in a `source`/`sources` field on the entry itself, or in the app's sources view for prose-level attribution.
- **Official over derivative** — prefer primary sources (standards bodies, government gazettes, national laws) over encyclopedias or aggregators.
- **When a primary source is unreachable, cite the aggregator and record the blocker** — the Thai baht case is the reference example: the Royal Gazette notification is the correct primary but was inaccessible from the build environment, so Wikipedia's article was cited with the blocker documented for later revisit[cite:5].
- **Never cite a primary source that contradicts the value it is attached to.** Cite either the primary that matches, or an aggregator that explains the discrepancy. A mismatched primary used to lend authority is worse than no citation.

## Notation conventions in reference text

Formula and notation style for sources tables, defining relations, and reference documents. These were settled by explicit user rejection of the alternatives, so they are decisions rather than preferences[cite:6].

- **`⋅` for multiplication** in formulas.
- **Unicode superscripts only for single-character exponents** — `10ˣ`, `e²ˣ`, `2ˣ`, `10⁻ˣ`, `10⁻¹⁹`.
- **Fractional and compound exponents stay in caret form** — `10^(x/10)`, `10^(x/20)`. Superscript-parenthesized fractions like `10⁽ˣ⁄¹⁰⁾` were explicitly rejected as unreadable and must never be reintroduced by a later cleanup pass.
- **`×` is reserved for physical dimensions** — `A4 = 210 mm × 297 mm`, never for scalar multiplication.

## Enforcement

| Rule area | Enforced by |
|---|---|
| Fallback, key coverage, delta-only variants | JSON schema check in the build; restricted-import lint on the supported-languages list |
| Domain split, shape-identical keys | Data-integrity test suite |
| Global name uniqueness | Cross-category name-collision check in the integrity suite |
| Dead-key guard, renames | "No dead keys" integrity test with a committed allowlist |
| Prune correctness, baseline shifts | Build-only prune plugin; gzip baseline in the artifact verifier |
| Numerals, RTL, compound ordering | Unit tests plus end-to-end RTL scenarios |
| Source citation | PR-review checklist; the sources view renders every citation; blocked primaries recorded in repo agent memory |
| Notation | PR review; never auto-converted by a formatting pass |

## See also

- [[concepts/coding-architecture-standards]] — the shared foundation and source of truth
- [[concepts/coding-standards-standalone-html5]] — where the bundle-size consequences bite hardest
- [[projects/omniunitconverter-calculator]] — the 12-language reference implementation

## References

[cite:1]: pplx://sessions/6af5d700-627e-42c6-b71f-6b92a4521aad
[cite:2]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/docs/perplexity/architecture-standards.md
[cite:3]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.agents/memory/translation-key-hygiene.md
[cite:4]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.agents/memory/build-size-ceiling.md
[cite:5]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.agents/memory/thai-source-citations.md
[cite:6]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.agents/memory/sources-notation-conventions.md
