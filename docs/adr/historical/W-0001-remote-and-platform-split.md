# W-0001 (wiki ADR-0001): REMOTE over Client/Stub/Connector/Gateway; PLATFORM reinstated as a layer

Historical record imported from the companion page `coding-standards-platform-model-remote` (decided 2026-08-16). Numbered `W-` to avoid collision with hub ADR-0001, which is a different decision. The verbatim text is in [the exported page](../../../references/source-snapshots/programming-wiki/coding-standards-platform-model-remote.md); this file is a pointer, not a restatement, and must not be edited to add new decisions.

Summary: the shared-model adapter role is named REMOTE; `client`, `stub`, `connector` and `gateway` are reserved and prohibited for that role because each is ambiguous with another role or pattern. PLATFORM is a named top-level role split by determinism into PLATFORM-PURE and PLATFORM-AMBIENT rather than being folded into the Authority rule. Baseline references to "ADR-0001" in §13.3 and §18 mean this decision.
