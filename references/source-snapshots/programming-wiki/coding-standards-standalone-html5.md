---
id: concepts/coding-standards-standalone-html5
item_type: wiki_page
semantic_type: concept
title: Coding standards — standalone HTML5
description: Deployment-target standards for single-file HTML5 apps built on the OmniUnit stack (TypeScript + Vite + Playwright + GitHub Actions), layered on top of the shared foundation. Privacy-, security-, and no-network-safe by design.
created_at: '2026-08-06T22:45:00+00:00'
updated_at: '2026-08-08T17:51:00+00:00'
---
# Coding standards — standalone HTML5

Standards for apps that ship as a single `.html` artifact and run offline from `file://` or any static host. Layers on top of [[concepts/coding-architecture-standards]] (which covers build discipline, layer structure, testing, repo conventions, MIT/GitHub, and commit style). This is the target model used by OmniUnit today and planned for [[projects/historical-time-and-date-tools]], [[projects/earth-cosmos-timeline]], and [[projects/decay-timescales]][cite:1][cite:2].

## What it is

Standards for apps that ship as a single `.html` artifact and run offline from `file://` or any static host, designed to be privacy-safe, security-safe, and no-network-safe as an explicit product property. Layers on top of [[concepts/coding-architecture-standards]] and used today by OmniUnit; planned for [[projects/historical-time-and-date-tools]], [[projects/earth-cosmos-timeline]], and [[projects/decay-timescales]].

## Privacy and safety posture

These apps are designed to be **privacy-safe, security-safe, and no-network-safe** as an explicit product property, not an implementation accident. A user who opens the app from `file://` with the network off, or from a browser that blocks all outbound traffic, must see identical behavior to a user online. The consequences of that posture cascade through the rest of these standards:

- **No user data persisted** — not in `localStorage`, not in `IndexedDB`, not in cookies, not in the file system. The app is stateless across sessions. If a user reloads, they start fresh. Session-scoped in-memory state is fine and expected (a calculator's current expression, a picker's current selection).
- **No telemetry, no analytics, no tracking, no fingerprinting** — not first-party, not third-party, not "anonymized." The app does not know it is being used.
- **No outbound network calls at runtime** — no `fetch()` to any origin, no image loads from external hosts, no font CDN, no analytics beacon, no error-reporting service. The only network activity when the page opens is the initial HTML load itself (which is `file://` for offline use).
- **All hyperlinks are user-initiated navigations to public, static content** — sources page (like the OmniUnit sources page), the public GitHub repo, the MIT license, external references cited in a readout. All open in a new tab. Clicking a link is the *only* way the app touches the network, and even that touch happens in a fresh browser context, not from the app's runtime.
- **No `<form>` submissions, no POST bodies, no WebSockets, no Service Workers, no WebRTC** — the app has no channel back to any server, ever.
- **Optional downloads page** — apps may offer downloads (e.g., a data export, a copy of the current view). Downloads use `Blob` + `URL.createObjectURL()` + a synthetic anchor click, generated entirely client-side. The user's browser handles the save; no server is involved.

A reviewer opening the built `.html` file in a text editor should be able to verify these properties by inspection: no `fetch`, no `XMLHttpRequest`, no `navigator.sendBeacon`, no third-party origins in `src=`/`href=` on any resource-loading element (external `href=` on `<a>` targets is fine because those are user-initiated), no external URLs in `@import` or `url()`.

A build check should enforce as much of this as is statically detectable.

## Stack

The proven stack, established during OmniUnit and reused by default:

- **Language:** TypeScript, strict mode
- **Bundler:** Vite (dev server + production build)
- **Test runner:** Playwright for E2E; whatever unit test runner the project already uses for pure-library layer
- **Minifier:** `html-minifier-terser` as a build-only dependency
- **CI:** GitHub Actions running the same `npm run build` plus Playwright
- **Dev environment:** Replit for iteration; local for offline work; both must produce the same artifact

Deviating from this stack requires a documented reason. It is not sacred, but the "which library for X" question is already answered — so a coding agent starting a new app should not re-litigate it.

## Delivery model

- **Single-file `.html` artifact** — the whole app ships as one HTML file with all CSS, JS, fonts, images, and data inlined. Distribution is a static host (Cloudflare Pages, GitHub Pages, `*.tyoh.app`) or direct download.
- **HTML parser with XHTML compatibility** — ship `.html` (not `.xhtml`) so browsers use the forgiving parser, but verify strict XML compatibility, CDATA safety, expanded boolean attributes, and complete test-ID coverage as build checks. This preserves standalone portability without making XML parsing failures user-visible[cite:1].
- **No external URLs at runtime** — no CDN fonts, no CDN JS, no analytics beacons, no external API calls. Everything the running app needs must be inlined. This is what makes `file://` use work and what protects offline-first behavior[cite:1].
- **Offline `file://` use is a first-class requirement** — the app must open and run correctly when double-clicked from a file manager. This forbids anything that requires a served origin (Service Workers, some `fetch()` patterns, some crypto APIs). Test this every build.

## Data model

Apps in this target have **no persistent user data**. Session state lives in memory only.

- **In-memory state only** — the calculator's current expression, the picker's current selection, the current search query. Reloading the page starts from a clean slate. Users are expected to understand this and it should be visible in the UI (e.g., "nothing you enter here is saved").
- **No `localStorage`, no `IndexedDB`, no cookies** — not for preferences, not for last-used settings, not for anything. If a preference is worth remembering, it's worth putting in the URL (as a fragment or query string) so the user controls sharing and persistence by bookmarking or copying the URL.
- **URL fragment as opt-in state** — the acceptable pattern for shareable/persistable state is encoding it in `location.hash` or `location.search`. The user, not the app, decides whether to keep it (via bookmark, copy-paste, etc.). This is compatible with `file://` and requires zero storage APIs.
- **Read-only bundled datasets** — the dataset shipped in the HTML (unit tables, calendar data, historical entities, ICS chart, chart of the nuclides) is read-only and immutable at runtime. There is no "user's copy" of the dataset to migrate; there is only the version shipped in this build.
- **Downloads are client-generated** — if the app offers an export (a CSV of the current filter, a PDF of the current view, a JSON of the current computation), it's built in JavaScript via `Blob` + `URL.createObjectURL()` and handed to the browser's save dialog. Nothing leaves the machine except through the user's explicit Save action.

**If persistence becomes a requirement**, the app has outgrown this target. The choices are:

- Move to [[concepts/coding-standards-hosted-postgres]] if persistence needs to sync across devices
- Move to [[concepts/coding-standards-native-wrappers]] if persistence needs to be local-only but survive reloads
- Reconsider whether the URL-fragment pattern actually solves the underlying need before either of the above

## Reproducible build

Same rules as the shared foundation, plus the standalone-specific verifications:

- **`npm run build`** performs type checks, size checks, tests, Vite bundling, `html-minifier-terser` minification, and final artifact verification[cite:1].
- **Artifact verification** confirms: no external URLs referenced, no CDATA safety issues, all test IDs present, single-file output, gzipped size under the app's target budget.
- **GitHub Actions parity** — CI runs the identical `npm run build` command plus Playwright. Local, CI, and Replit Publish outputs are bit-identical (or as close as tooling allows) so "works on my machine" arguments never happen[cite:1][cite:2].
- **Minification stays out of dev mode** — the minifier is build-only; dev-mode source is readable and stack traces are useful.

## Testing

- **Playwright E2E tests** exercise the built single-file artifact via `file://`, not just the dev server. This catches inlining bugs, XHTML compatibility issues, and offline breakage that pass in `npm run dev`.
- **Stable production test IDs** follow `{role}-{area}-{name}[-{key}]`; uniqueness and manifest coverage are build-tested[cite:1][cite:3].
- **Pure-library layer** (parsing, conversion, formatting) has unit tests. Controllers/reducers may have unit tests. UI components are exercised via Playwright, not unit tests.

## Hyperlinks and external references

Links in the app are limited to **static, public, source-of-truth destinations** that a user might reasonably want to visit for context or verification. Typical categories:

- **Sources page** — primary references for the dataset or math (like the OmniUnit sources page). Every non-obvious value in the app should trace back to a source listed here.
- **Public GitHub repo** — link to `github.com/tyohDeveloper/<app>` for issues, source code, and dataset provenance.
- **MIT license** — either as a link to `LICENSE` in the repo or an inline About dialog. A user should always be one click from knowing the terms.
- **Named external references** — e.g., a Wikipedia article for a historical period, the ICS chart PDF for a geologic interval, a datasheet for a nuclide. Cited by name in the readout, not as bare URLs.
- **Other apps in the family** — the tyoh.app hub and sibling apps ([[projects/tyoh-app-tools-family]]), matching the one-directional cross-link topology.

All links open in a new tab (`target="_blank"` with `rel="noopener noreferrer"` for referrer hygiene). Link text is descriptive, not "click here" or a raw URL. No tracking parameters are appended.

## Distribution

- **Primary distribution:** subdomain of `tyoh.app` (see [[projects/tyoh-app-tools-family]] for the current subdomain map).
- **Secondary distribution:** direct `.html` file download link from the subdomain, for offline use. Users are encouraged to download and keep local copies — the app runs identically from `file://`, which is a first-class distribution mode, not a fallback.
- **Version stamping:** every built artifact includes a visible version string (footer, About dialog, or DOM meta) so bug reports can be traced to a specific build.
- **Content Security Policy** — the built HTML includes a strict CSP `<meta>` tag (`default-src 'self' 'unsafe-inline'; connect-src 'none'; frame-src 'none'; object-src 'none'`) that programmatically enforces the no-outbound-network posture. If a future change accidentally introduces a `fetch()`, the browser blocks it and the developer sees the failure loudly.

## Paste-into-Replit starter checklist

When starting a new standalone-HTML app in Replit:

1. **Create the GitHub repo** (public, MIT). Add `README.md`, `LICENSE`, `.gitignore`. Set default branch `main`.
2. **Initialize the toolchain:** `npm init -y`, then add TypeScript, Vite, Playwright, `html-minifier-terser`, and any pure-library dependencies. Pin versions.
3. **Repo layout:** `src/` for TypeScript with one directory per domain, `src/data/` for JSON, `docs/` for reference material, `.github/workflows/` for CI. Domain directories name what they own — History & Prehistory uses `calendars/`, `chrono/`, `temporal/`, `entity/`, `dataset/`, `focus/`, `research/`. There is no `src/lib/`: it is prohibited by the naming rule in `coding-architecture-standards`, and prescribing it here is what caused it to be recreated repeatedly in History & Prehistory.
4. **Add the `npm run build` script** matching the OmniUnit chain (type-check → test → bundle → minify → verify).
5. **Add the GitHub Actions workflow** that runs the same build plus Playwright on push and PR.
6. **Add a test-ID manifest and a build check** enforcing it.
7. **Initial commit:** `LICENSE`, `.gitignore`, `README.md` with the one-line description and quickstart. Second commit: the toolchain skeleton. Third commit: the first actual feature. Terse messages, decomposed commits[cite:4][cite:5].
8. **Configure the tyoh.app subdomain** in the family plan before the first real release (see [[projects/tyoh-app-tools-family]]).


## Explicit non-goals

- No auth, no user accounts, no server-side state
- No telemetry, no analytics, no error reporting to any external service, no tracking of any kind
- No persistent user data (no `localStorage`, `IndexedDB`, or cookies)
- No outbound `fetch()`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `WebRTC`, or Service Worker
- No CDN fonts, CDN JS, external images, or any third-party origin referenced by the running page
- No PWA installability without a corresponding subdomain deploy — `file://` use is the primary distribution path
- No embedded iframes to external content

If any of these becomes a requirement, the app has outgrown this target. Move to hosted-Postgres (if syncing across devices) or to a native wrapper (if local-only persistence is enough).

## See also

- [[concepts/coding-architecture-standards]] — shared foundation
- [[concepts/coding-standards-hosted-postgres]] — when you need a backend
- [[concepts/coding-standards-native-wrappers]] — when you need an App Store release
- [[concepts/coding-standards-artifact-contract]] — the polyglot markup contract and minimization pass
- [[concepts/coding-standards-localization]] — locale data rules, where bundle-size consequences bite hardest
- [[projects/omniunitconverter-calculator]] — the reference implementation of this pattern

## References

[cite:1]: pplx://sessions/6af5d700-627e-42c6-b71f-6b92a4521aad
[cite:2]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.github/workflows/build.yml
[cite:3]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/commit/12802b7
[cite:4]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/commit/c9ad870
[cite:5]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/commit/7215e1b
