# Application Adoption

## Registered applications

| Application | Policy | Source commit | Adopted | Record |
|---|---|---|---|---|
| [tyohDeveloper/apple-music](https://github.com/tyohDeveloper/apple-music) | 2.2 | `f30e6e0` | 2026-10-19 | [apple-music.json](apple-music.json) |

Existing application copies of v2.2 are evidence of the previous distribution process, not proof of migration to this repository.

## Registering adoption

- Review the actual application architecture and local role/path mapping.
- Pin an owner-approved policy release and immutable source commit.
- Preserve application-specific targets, exceptions, and ADRs.
- Bind requirements to actual local check commands and manual reviews.
- Commit the application adoption change separately from unrelated implementation.
- Add `adoption/<application>.json` here only after verifying the application's adoption commit.

Use [the manifest template](../templates/STANDARDS-ADOPTION.json). The validator checks record structure but cannot prove the application actually runs its claimed checks.
