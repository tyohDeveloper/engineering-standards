---
id: concepts/coding-standards-platform-model-remote
item_type: wiki_page
semantic_type: concept
title: Coding standards — PLATFORM, MODEL, and REMOTE roles
description: Full rules for the PLATFORM-PURE/PLATFORM-AMBIENT split, the MODEL/REMOTE one-port-two-adapters pattern, and the Authority and change control section that extend the shared coding-architecture-standards layer model.
created_at: '2026-08-16T20:40:00+00:00'
updated_at: '2026-08-16T21:06:00+00:00'
---
# Coding standards — PLATFORM, MODEL, and REMOTE roles

Companion detail page for [[concepts/coding-architecture-standards]]: the full rules behind the PLATFORM-PURE/PLATFORM-AMBIENT split, the MODEL/REMOTE one-port-two-adapters pattern for persistent state, and the Authority and change control section. Reserved but not yet exercised — every current repo in [[projects/tyoh-app-tools-family]] is standalone-HTML5[cite:1].

## What it is

### PLATFORM: mandated dependencies, split by determinism

Hashing for unique keys, password hashing, canonical serialization, and any org-mandated cross-application primitive live in PLATFORM instead of being authored per app.

- **Split by symbol, not by package** — a real crypto/identifiers package is not purity-homogeneous: `hash(canonicalString)` is deterministic, but `generateSalt()`, `randomUUID()`, and any KMS/HSM-backed call read ambient entropy or perform IO. **PLATFORM-PURE** symbols are enumerated on a checked-in allowlist and importable from PURE. **PLATFORM-AMBIENT** symbols are importable only from CONTROLLER, exactly like `Date.now()`/`Math.random()` today. A PURE file importing a PLATFORM symbol absent from the allowlist fails the same AST check that enforces the rest of the layer model[cite:1].
- **PLATFORM is a top-level role, not a domain leaf** — it names *how* the code behaves architecturally, the same way VIEW/CONTROLLER/STATE/PURE/DATA already do. The "directories name domains, not layers" rule governs leaf names *inside* a role, not the role names themselves; the family's own hosted-Postgres layout already uses top-level role directories (`src/server/`, `src/db/`, `src/client/`), and Smalltalk MVC is the decades-long proof that naming top-level roles explicitly, then subdividing by domain underneath, is architecturally sound[cite:1].
- **File length** — PLATFORM-PURE: 100 lines (same bar as PURE-CORE). PLATFORM-AMBIENT: 150 lines (same bar as CONTROLLER).
- **Collisions with existing dependency policy, resolved explicitly** — mandated PLATFORM packages need an explicit precedence clause against the ≤5 kB gzip / ≤20 kB cumulative runtime budget (silence means the first mandated crypto import fails CI); they get a *standing policy* record with a review date rather than an expiring exception (see Authority below); and they must remain inlinable/vendored to satisfy the offline `file://` requirement, with a hash pin[cite:1].

### PLATFORM concrete bindings: password hashing and authorization

Per OWASP's Password Storage Cheat Sheet, in order of preference: **Argon2id** (RFC 9106, first choice for new systems), **scrypt** (fallback when Argon2 bindings are unavailable), **bcrypt** (legacy/existing systems, work factor ≥12, 72-byte input cap), **PBKDF2-HMAC-SHA256** (only when FIPS-140 compliance forces it, 600k+ iterations)[cite:1].

- **The mandated Node binding is `argon2` (MIT)** — and it is a clean worked example of the PLATFORM-PURE/PLATFORM-AMBIENT split: `argon2.hash()` generates a random salt internally and is **PLATFORM-AMBIENT** (CONTROLLER-only); `argon2.verify()` is fully deterministic given a stored hash and an input string — it extracts the embedded salt, recomputes, and compares — so it belongs on the **PLATFORM-PURE** allowlist, importable from PURE[cite:1].
- **Authentication framework (hosted-Postgres target only):** Better Auth (MIT, self-hosted, TypeScript-first) is the mandated choice — see [[concepts/coding-standards-hosted-postgres]] for the full rationale, including why Lucia Auth (deprecated 2025) and Auth.js/NextAuth (maintenance-only) are no longer viable defaults[cite:1].
- **Authorization:** CASL (MIT) for simple ability checks; node-casbin (Apache-2.0) when the policy model needs RBAC/ABAC or must stay consistent with a non-TypeScript service[cite:1].
- **Cross-language equivalents, if a future target isn't TypeScript** — Better Auth and CASL are JS/TS-only with no ports; the practical cross-language path for Better Auth is running it as its own service and consuming it as **REMOTE** over HTTP from any language. Casbin is the one built as a genuine multi-language port set (production-ready jCasbin for Java, PyCasbin, Casbin.NET, Casbin-RS; C++ port is beta) — a Java, Python, or Clojure (via jCasbin over JVM interop) service can enforce the identical policy file as a Node service. Clojure's own idiomatic auth library is **buddy** (`buddy-auth`/`buddy-hashers`, BSD-2-Clause, bcrypt/pbkdf2/scrypt built in); Java's independent equivalents are Spring Security or Apache Shiro (both Apache-2.0). C/C++ has no comparable auth framework category — the pattern there is libsodium's `crypto_pwhash` (Argon2id, ISC license) for the hashing primitive plus a REMOTE call to an identity service for everything else[cite:1].

### MODEL and REMOTE: one port, two adapters

A local Postgres MODEL layer (the only role allowed to import the DB client) is valid **only while this application is the sole schema owner and sole writer/migrator**. Once a second writer or migration-authority holder exists, the application no longer owns the schema and gets a different adapter instead.

- **One port, two adapters, not two ranks** — CONTROLLER depends on a single typed interface for "talk to the true model." MODEL implements it when this app owns the schema; **REMOTE** implements it when the schema is owned by another service and this app consumes a published contract. Both are registered as roles with a directory mapping in a repo's §0, at the same rank below CONTROLLER, so "only MODEL imports the DB client" / "only REMOTE imports HTTP, queue, or RPC clients" are AST-checkable bans, not documentation notes[cite:1].
- **The port never promises atomicity across the boundary** — a multi-step invariant that is one transaction under MODEL becomes one contract operation on the owning service under REMOTE, never client-side coordination across separate calls.
- **The MODEL→REMOTE trigger is write authority, not read access** — a read-only consumer, replica, or ETL job does not force the switch; a second writer does. Ownership is recorded in a checked-in `datastore-ownership.json` (datastore id, schema owner, declared writers, declared readers, contract version); a MODEL role mapping is legal only when the repo is the declared sole writer.
- **File length** — MODEL and REMOTE: 150 lines each, same bar as CONTROLLER.
- **REMOTE is currently unmappable on the standalone-HTML5 target** — a browser-only app has nowhere to hold a service credential, so REMOTE stays a reserved, inert role name until a server-backed target exists; see [[concepts/coding-standards-hosted-postgres]][cite:1].

### Naming: REMOTE, not Client/Stub/Connector/Gateway (ADR-0001)

The adapter for shared/remote persistent state needed a name distinct from the app's existing vocabulary. Four candidates were evaluated and rejected in favor of **REMOTE**:

- **`client`** — already means "the end user of the app" in every interactive-application sense; reusing it for inter-process communication creates the exact overload it was rejected to avoid.
- **`stub`** — the precise RPC term for a local representative of a remote procedure, but it collides with "test stub," a term the testing rules need constantly for mocking this exact role.
- **`connector`** — the software-architecture literature it borrows from (Garlan & Shaw) explicitly includes local procedure calls, pipes, and SQL links as connectors; it draws no line between local and remote, so it does not encode the boundary this role exists to mark. The literature also treats connectors as the arcs between components, not components themselves, so naming a code directory "connector" inverts the term's own definition. Separately, "connector" is now the dominant industry term for third-party integration plugins (Kafka Connect, Airbyte, ODBC/JDBC, MCP connectors), which is the same overload problem `client` had.
- **`gateway`** — Fowler's Gateway pattern ("an object that encapsulates access to an external system or resource") is not HTTP-specific; his own Table Data Gateway pattern applies it to local database access, which makes it ambiguous with MODEL rather than distinct from it.

**REMOTE** was chosen because it states the actual invariant (out-of-process, hence version negotiation, inter-service auth, retry/timeout, degraded mode), has no collision with any of the four rejected terms or with the JS `Proxy` global, generalizes to queues/gRPC/IPC as well as HTTP, and does not share CONTROLLER's silhouette on grep or skim. `client`, `stub`, `connector`, and `gateway` are added to the prohibited-name denylist in [[concepts/coding-architecture-standards]] so the decision is enforced rather than remembered[cite:1].

## Authority and change control

Applies to any file where the correct implementation is chosen by policy rather than by the team maintaining the code that imports it: mandated PLATFORM bindings, vendor-pinned numeric/hardware libraries (e.g. a supercomputing target requiring a vendor BLAS/cuBLAS/MKL implementation over a portable one), DB migrations, RLS policies, the propagated `docs/CODING-STANDARDS.md` copies, and `.architecture-exceptions.json` itself. This is orthogonal to the layer model: the layer answers *where the code lives and what may import it* (an import-graph question, AST-checkable); authority answers *who may change the binding and whether production matches policy* (a manifest question). Both are required; neither substitutes for the other[cite:1].

- **Every mandated binding is a manifest entry, not a comment** — `.architecture-bindings.json` records: binding id → authority (`team-editable` | `org-mandated`) → approved module specifier and integrity hash **per deployment target** → policy reference → review date. A CI job resolves each mandated binding in the built artifact and fails the build if it does not match the manifest entry for that target.
- **`CODEOWNERS` enforces authority the moment a second person exists** — for a solo maintainer the manifest is the record of intent; for any team, `CODEOWNERS` requires review on `org-mandated` paths.
- **Standing policy bindings review, they don't expire** — an org mandate is not a violation with a countdown. Record it with an owner, a policy reference, and an annual review date, in a manifest separate from `.architecture-exceptions.json`, so "exceptions expire" stays literally true for actual exceptions.
- **Target-conditional binding resolves at build time, never at runtime** — shipping both the portable and the vendor-tuned binding and choosing at runtime breaks the gzip budget and the offline `file://` requirement. CI builds and tests every mandated target, not only the portable dev default, so dev/CI never exercises a different code path than production runs.
- **Numerically divergent bindings need a declared tolerance** — vendor-tuned math libraries (BLAS/LAPACK-class) are not bit-for-bit identical to a portable reference implementation. No test may assert exact equality on a value derived from a target-conditional numeric binding; compare against a shared conformance-vector suite with a declared tolerance, and round for display through a single PURE formatter.

## Architecture decisions

- **ADR-0001: REMOTE over Client/Stub/Connector/Gateway; PLATFORM reinstated as a layer** — decided 2026-08-16. Context: an architecture discussion proposed folding mandated dependencies into the Authority rule alone and naming the shared-model adapter CONNECTOR. Rationale: PLATFORM was reinstated as a named top-level role (not folded into Authority alone) because a named role is what makes drift visible to a human or model reviewer scanning a directory listing, and naming top-level roles is not the same as the "no shapeless leaf names" rule it was initially thought to violate; CONNECTOR was rejected after primary-source review showed it does not carry the remoteness meaning intended and denotes an interaction rather than a component[cite:1].

## See also

- [[concepts/coding-architecture-standards]] — the shared foundation this page extends
- [[concepts/coding-standards-hosted-postgres]] — the target where MODEL and REMOTE first become mappable
- [[concepts/architecture-review-lessons]] — how to apply and enforce these rules

## References

[cite:1]: pplx://sessions/1deda0c7-3fc4-4567-a8ed-b728a56ba165
