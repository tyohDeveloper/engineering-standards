---
id: concepts/coding-standards-artifact-contract
item_type: wiki_page
semantic_type: concept
title: Coding standards — artifact contract
description: The polyglot markup contract, artifact verification assertions, and mandatory minimization pass for single-file HTML deliverables. Defines what the shipped bytes must satisfy, independent of source structure.
created_at: '2026-08-08T12:35:00+00:00'
updated_at: '2026-08-08T12:24:00+00:00'
---
# Coding standards — artifact contract

What the shipped bytes must satisfy for a single-file HTML deliverable, independent of how the source is organized. Layers under [[concepts/coding-standards-standalone-html5]] and applies to OmniUnit, History, Deep Time, and Decay[cite:1][cite:2].

## What it is

A contract on the build output rather than the source tree. The source-side standards in [[concepts/coding-architecture-standards]] govern layers, purity, and file sizes; this page governs the artifact a user actually downloads and opens. The two are checked by different tooling and can fail independently — a perfectly layered codebase can still emit an artifact that fails XML parsing or has lost its test identifiers to a minifier.

The central decision: the file ships as HTML and is opened as HTML, but its markup satisfies XHTML rules so the same bytes would parse under a strict XML parser. Both council models rejected extension-only conformance as worse than not attempting it, so the guarantee is enforced on bytes rather than on a filename[cite:2].

## The polyglot markup contract

The shipped file is served and opened as HTML (`text/html`) with an `.html` extension, so end users get the forgiving HTML parser. The *markup inside it* additionally satisfies XHTML rules, so the same bytes would parse as XHTML if renamed and served as `application/xhtml+xml`. Renaming alone is not compliance — both council models rejected extension-only conformance as worse than not doing it — so the guarantee is enforced on the bytes[cite:1][cite:2].

Concretely, the artifact must satisfy all of:

- `<!DOCTYPE html>` first, UTF-8 declared via `<meta charset="UTF-8"/>`
- Every void element self-closed — `<br/>`, `<meta …/>`, `<link …/>`, `<img …/>`, `<input …/>`
- All attribute values quoted; all element and attribute names lower case
- Elements properly nested and explicitly closed; no reliance on HTML's implicit optional-close rules for `<li>`, `<p>`, `<option>`
- **No boolean-attribute shorthand** — `<input disabled="disabled"/>`, not `<input disabled/>`. This is the one place polyglot markup diverges from idiomatic HTML5, and the XHTML rule wins
- Inline `<script>` and `<style>` bodies free of literal `<` and `&`, or wrapped in `//<![CDATA[ … //]]>` for JS and `/*<![CDATA[*/ … /*]]>*/` for CSS. The minifier must never emit the literal sequence `]]>` inside such a block
- No HTML comments inside `<script>` or `<style>` bodies
- No attributes or values a strict XML parser would reject

The artifact is deliberately **not** given an `.xhtml` extension and **not** served with an XHTML MIME type. If a future consumer needs true `application/xhtml+xml`, the change is a rename plus an XML declaration prepend, with no source changes.

### Artifact verification

The build verifier fails on any of these:

1. **Strict XML parse failure** after temporarily prepending an XML prolog to the artifact
2. **Any external reference** — `src=`, `href=`, `url(…)`, `@import`, or dynamic `import(…)` pointing at `http://`, `https://`, or a protocol-relative `//` URL. `data:` URIs for inlined fonts and images are permitted
3. **More than one file** in the build output directory
4. **Test-ID count below the committed manifest**, or any duplicate test-ID value in the artifact
5. **Gzip size above `baseline × 1.05`** — the ceiling formula, not a vibe. Re-baselining is a deliberate reviewed change recording a note that identifies what caused the shift[cite:3]

## Final minimization pass

- **Mandatory, and inside the build** — minimization runs after bundling and *before* verification, so the verifier always inspects the exact bytes the user downloads.
- **Acceptance criteria** — remove all HTML comments except the doctype; remove all non-significant inter-tag whitespace without collapsing inside `<pre>`, `<textarea>`, `<script>`, or `<style>`; remove license-preservation block comments and all remaining JS/CSS comments except required CDATA wrappers; **preserve every test ID**; **preserve the polyglot markup contract** above; and never increase gzip size relative to the un-minimized bundle.
- **The minifier must not "optimize" the contract away** — no rewriting `<br/>` to `<br>`, no dropping attribute quotes, no collapsing boolean attributes. Attribute-stripping options are disabled.
- **Current baseline** is `html-minifier-terser` with `collapseWhitespace`, `removeComments`, and `minifyCSS` on, and `keepClosingSlash`, `caseSensitive` on, `useShortDoctype` and `decodeEntities` off. **`minifyJS` is off deliberately** — the bundler has already minified JS, and running Terser again strips the CDATA wrappers without a custom parser configuration.
- **Changing minimizer requires measurement, not preference** — gzip size, wall-clock time, and a byte-level diff run through the XML verifier. A minimizer that produces a smaller artifact but breaks the markup contract or drops test IDs is rejected. Candidates worth evaluating when the current one limits: `@swc/html` (Rust, typically 5–20× faster, needs CDATA and self-closing verification), `lightningcss` for the inlined CSS only, or a custom XML-safe pass if benchmarked to beat every off-the-shelf option.
- **Re-benchmark** at least once per major release, or whenever the raw bundle grows more than 10%.
- **Fast-path escape hatch** — a `build:fast` target may skip minimization for local iteration, but must not be able to produce a release artifact; verification fails on any output that is not fully minimized.

## See also

- [[concepts/coding-standards-standalone-html5]] — the target these bytes serve
- [[concepts/coding-architecture-standards]] — the source-side standards
- [[concepts/coding-standards-localization]] — the main driver of artifact size

## References

[cite:1]: pplx://sessions/6af5d700-627e-42c6-b71f-6b92a4521aad
[cite:2]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/docs/perplexity/architecture-pass-council-synthesis.md
[cite:3]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.agents/memory/build-size-ceiling.md
