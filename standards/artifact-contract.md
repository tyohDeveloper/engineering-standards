# Artifact Contract (single-file packaging)

Status: Normative from release 1.0.0.0; imported from the companion page `coding-standards-artifact-contract` (verbatim export in `references/source-snapshots/programming-wiki/`). Applies to every artifact with `packaging = single-file` regardless of `state`. Language-independent; the TypeScript binding names the tools.

## 1. Shape

- The build emits exactly one file. More than one file in the build output fails the build.
- The file is a polyglot: valid HTML5 and well-formed XML at once, so that strict parsers and lenient browsers read the same document.
- Every asset (scripts, styles, fonts, images, data) is inlined. No `<script src>`, no `<link href>` to a resource, no external URL in CSS (`url()` only with `data:`), no `@import`.
- One `<meta name="generator">` records the application version and, where present, the data version.

## 2. Polyglot rules

- Void elements are self-closed (`<br/>`, `<meta .../>`).
- No boolean-attribute shorthand; write `disabled="disabled"`.
- No raw `<` or `&` in text nodes or attribute values; use entities.
- Script and style bodies are wrapped in CDATA exactly once (`//<![CDATA[ ... //]]>` inside scripts, `/*<![CDATA[*/ ... /*]]>*/` inside styles). The sequence `]]>` must not occur inside the wrapped body.
- No comments remain after minification.
- A Content-Security-Policy meta tag is present as required by profiles §3.1.

## 3. Verification assertions (build fails on any)

1. Exactly one output file.
2. The output parses as well-formed XML.
3. No external resource reference (script, style, font, image, fetch target) of any kind.
4. CDATA wrapping present exactly once per script and style body; no leaked `]]>`.
5. No comments.
6. Gzip size ≤ committed baseline × 1.05. Re-baselining is a reviewed change recording what caused the shift; never an automated bump (C-21).

## 4. Minification

- Minification is build-only and configured to preserve the polyglot shape: keep closing slashes, no boolean-attribute collapse, no attribute-quote removal, no conditional comments, remove all comments, minify inline CSS and JS.
- Minifier output is what the assertions run against.

## 5. Test identifiers

- A committed test-ID manifest lists required identifiers (must be present) and dynamic identifier patterns (`{role}-{area}-{name}`). The build asserts the required set; e2e tests reference identifiers from the manifest only (C-18).
- Identifier changes are additive; renames go through a rename map in the manifest, never silent replacement.

## 6. Enforcement

| Rule | Check |
|---|---|
| §1–§3 | Artifact verifier script run in CI after build (TypeScript binding: `scripts/verify-build.mjs` pattern) |
| §4 | Minifier configuration committed; verifier runs on minified output |
| §5 | Manifest assertion in the verifier; e2e lint on identifier literals |
| §3.6 | Gzip baseline file committed with a note field |
