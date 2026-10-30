---
id: concepts/coding-standards-native-wrappers
item_type: wiki_page
semantic_type: concept
title: Coding standards — native wrappers (iOS, macOS, Windows)
description: Deployment-target standards for wrapping a standalone HTML5 app in a native shell for iOS, macOS, or Windows distribution.
created_at: '2026-08-06T22:45:00+00:00'
updated_at: '2026-08-06T23:28:00+00:00'
---
# Coding standards — native wrappers (iOS, macOS, Windows)

Standards for wrapping a standalone HTML5 app in a native shell for App Store, Mac App Store, or Microsoft Store distribution. Layers on top of [[concepts/coding-architecture-standards]] and consumes the artifact produced by [[concepts/coding-standards-standalone-html5]]. iOS is the near-term target; macOS and Windows are documented as structured scaffolds to fill in when actually built.

## What it is

Standards for wrapping a standalone HTML5 app in a native shell for App Store, Mac App Store, or Microsoft Store distribution. Layers on top of [[concepts/coding-architecture-standards]] and consumes the artifact produced by [[concepts/coding-standards-standalone-html5]]. iOS is the near-term target; macOS and Windows are documented as structured scaffolds to fill in when actually built.

## Shared model

Every wrapper follows the same three-part model regardless of platform:

1. **The HTML app is unchanged.** The single-file `.html` artifact built by the standalone target is bundled into the native app's resource directory. No fork of the web code, no platform-specific branches inside the HTML.
2. **The native shell hosts a WebView** loading that bundled HTML from a local file URL. iOS/macOS use WKWebView; Windows uses WebView2. The shell is intentionally minimal — window creation, WebView setup, and any native-capability bridges.
3. **Native features via a JS bridge, only when needed.** File save, share sheet, notifications, camera, and other native capabilities are exposed to the HTML via a message-passing bridge (`WKScriptMessageHandler` on Apple platforms, `postMessage` on WebView2). The HTML detects whether the bridge exists and gracefully degrades on the web.

Consequences of this model:

- The web version stays the canonical build; wrappers are strictly additive.
- 95%+ of the app's code has zero platform-specific branches.
- Adding a second platform is mostly the shell and packaging, not app logic.
- Feature parity across web and wrapped versions is the default, not something to engineer for.

## When to reach for a wrapper

Not every standalone app benefits from a wrapper. Rough guidance for the current family:

| App | iOS wrapper value | Notes |
|---|---|---|
| Units (OmniUnit) | High | Unit conversion is a canonical mobile use case; offline is native to the app; App Store presence is discoverable |
| History & Prehistory | High | Reference-tool use pattern fits mobile well; offline calendar/period lookups are useful on planes and abroad |
| Deep Time | Medium | Log-scaled timeline UI needs testing on touch; less obvious mobile use case |
| Decay | Low | Entity-browser UI works but the target user (physics/chem novice) is more likely on a laptop |

Windows and macOS wrappers are lower priority than iOS across the board — the web version already works on desktop browsers. Reasons to build a desktop wrapper anyway: Store distribution, offline embedding of a larger dataset than fits comfortably in HTML, file-system integration, or eventual embedded Postgres for local-first data (a "future David" consideration).

## Storage in wrappers

- **iOS:** the WebView's `localStorage` and `IndexedDB` persist across launches automatically. Use them the same way the web version does. No additional native storage layer needed for the current app scope.
- **macOS:** same as iOS for the WebView APIs. If a future app needs larger local storage than IndexedDB allows, SQLite via a small native bridge is the first step; embedded Postgres is a future consideration and not needed today.
- **Windows:** WebView2 also persists `localStorage` and `IndexedDB` across launches, scoped to a user data folder the native shell controls. Same storage guidance as above; SQLite via a bridge if needed, embedded Postgres deferred.

Rule of thumb: for any app that doesn't already need a server (i.e. it's a standalone-target app), the wrapper doesn't add a storage layer either. If the app needs a real database, it belongs in the [[concepts/coding-standards-hosted-postgres]] target, not a wrapper.

---

## iOS (WKWebView + Swift/SwiftUI shell)

### Stack

- **Language:** Swift, current stable
- **UI framework:** SwiftUI for the app shell (window, menu, minimal chrome); WKWebView is embedded as a UIViewRepresentable
- **Toolchain:** Xcode on macOS (required for App Store submission); can iterate on Replit or elsewhere but final signing/submission requires macOS + Xcode
- **Minimum iOS target:** iOS 16 unless there's a reason to go lower — cuts complexity substantially
- **Deployment:** App Store via TestFlight for pre-release, then public release

### App Store review guideline 4.2 ("Minimum Functionality") — the wrapper trap

Apple regularly rejects "just a website wrapped in a WebView" apps under [Guideline 4.2](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality). Guidance:

- The app must provide **native features that a mobile Safari user couldn't get** by visiting the web version. Bare minimum:
  - Offline availability without a network round-trip (the bundled HTML gives you this for free)
  - Integration with iOS system features: Share Sheet, Shortcuts, widgets, or at minimum a native settings screen
  - App icon, launch screen, and proper responsive behavior on all iPhone/iPad sizes
- Include a native "About" or "Settings" screen outside the WebView so the app clearly isn't just Safari with a custom URL.
- If the web version has ads or trackers, strip them from the bundled HTML build for iOS. Apple scrutinizes.
- Read [Guideline 4.3 ("Spam")](https://developer.apple.com/app-store/review/guidelines/#design) too — related pitfall.

### JS bridge pattern

Use `WKScriptMessageHandler` for calls from HTML to Swift. Register message handlers at WebView setup; in the HTML, call `window.webkit.messageHandlers.<name>.postMessage(payload)`. For Swift-to-HTML calls, use `evaluateJavaScript`. The HTML side gates on `window.webkit?.messageHandlers?.<name>` to feature-detect and gracefully degrade on web.

Keep the bridge surface small — every method is an ongoing maintenance commitment across platforms. Start with:

- `shareText(payload)` — invoke the iOS Share Sheet
- `saveFile(payload)` — write to Files app
- `setAppearance(payload)` — sync dark/light mode with iOS system

Add more only when a specific feature demands it.

### Required assets and metadata

- App icon set (all required sizes; use an icon generator from a single high-res source)
- Launch screen (SwiftUI or storyboard; keep it minimal)
- Screenshots for App Store listing (all required device sizes)
- App Store description, keywords, category
- Privacy nutrition labels ([App Privacy details](https://developer.apple.com/app-store/app-privacy-details/)) — if the app collects nothing, declare that explicitly
- Support URL and marketing URL (can be the app's tyoh.app subdomain)

### Signing and provisioning

The genuinely painful part. In order:

1. **Apple Developer Program membership** — $99/year, required for App Store submission. Register the tyoh developer account.
2. **Certificates:** Development certificate for local testing, Distribution certificate for App Store builds. Managed in Apple Developer portal or via Xcode "Automatic Signing" (fine for solo projects).
3. **Provisioning profiles:** Development profile for local devices, App Store distribution profile for release builds. Xcode's automatic signing handles both if the Developer account is linked.
4. **Bundle identifier:** `org.tyoh.<appname>` or similar; reserve early because bundle IDs are globally unique.
5. **App-specific password** for CI upload if using GitHub Actions or Xcode Cloud.

### CI options

- **Xcode Cloud** — Apple's hosted CI, integrates natively with App Store Connect. Costs money past the free tier. Simplest for solo dev.
- **GitHub Actions with macOS runners** — free tier exists but macOS minutes are expensive. Works but be mindful of costs.
- **Local-only builds** — perfectly valid for a solo project; run `xcodebuild archive` locally, upload via Xcode's Organizer. No CI required if the release cadence is slow.

For now, local-only builds are the pragmatic default. Add CI when release frequency justifies it.

### Paste-into-Xcode starter checklist

When starting the first iOS wrapper (History or Units, most likely):

1. **In the existing app's GitHub repo,** add an `ios/` directory. The wrapper lives in the same repo as the web app so the HTML artifact is a build input, not a separate download.
2. **Create the Xcode project** as a SwiftUI iOS App inside `ios/`. Bundle ID `org.tyoh.<appname>`. Minimum iOS 16.
3. **Add a build phase** that copies the latest `dist/index.html` from the web app's Vite build into the iOS app's `Resources/` folder. Alternately, script this in a Makefile so `make ios` builds the web app and refreshes the wrapper's HTML.
4. **Implement the WebView shell:** a SwiftUI `App` with one `WindowGroup` containing a `WKWebViewRepresentable` that loads `Bundle.main.url(forResource: "index", withExtension: "html")`.
5. **Register the JS bridge:** `WKScriptMessageHandler` for `shareText`, `saveFile`, `setAppearance` as a starting surface. Feature-detect in the HTML.
6. **Add a native Settings screen** outside the WebView with app version, credits, license (MIT), and a link to the web version. This satisfies Guideline 4.2 and gives you a hook for future settings.
7. **Icons, launch screen, screenshots:** generate from a single high-res source; use Xcode's asset catalog.
8. **Privacy nutrition labels:** if the app collects nothing, declare "Data Not Collected" for all categories.
9. **TestFlight build:** archive, upload, add internal testers (yourself and any friends). Iterate.
10. **App Store submission:** description, keywords, category, screenshots, review notes explaining the app's purpose and native features. Submit for review.

Expect the first submission to be rejected on something small (missing metadata, an oversight in Guideline 4.2, a screenshot issue). Address and resubmit. Second submissions almost always pass.

### iOS-specific non-goals

- No custom rendering engine (App Store forbids)
- No JavaScriptCore-only apps (must use WebKit)
- No dynamic code loading past what WebKit allows
- No in-app purchases in the initial release — adds review complexity for no benefit at this stage

## macOS and Windows — scaffolds

Detailed macOS (WKWebView + SwiftUI + notarization + Mac App Store vs Developer ID) and Windows (WebView2 + WinUI 3 + MSIX + Microsoft Store vs direct installer) standards are deferred. Both share the iOS shared model above and will be researched against current Apple/Microsoft documentation when the first wrapper of each type is actually built. Key questions to answer at that point: sandboxing choice, notarization pipeline (macOS), WebView2 runtime distribution and code-signing cost (Windows), local storage escalation path from IndexedDB to SQLite, and Store vs direct-distribution tradeoffs.

## See also

- [[concepts/coding-architecture-standards]] — shared foundation
- [[concepts/coding-standards-standalone-html5]] — the target this wraps
- [[projects/tyoh-app-tools-family]] — the app family whose members are candidates for wrappers

## References

*This page synthesizes patterns from OmniUnit's build discipline, the tyoh.app tools family architecture, and general native-wrapper practice. Specific vendor documentation (Apple, Microsoft) should be consulted when actually building each platform's wrapper.*
