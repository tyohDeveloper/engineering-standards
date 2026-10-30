# Agent Contract: Engineering Standards Hub

This is a governance/documentation repository, not an application.

- Read [README](README.md), [authority governance](governance/authority-and-release.md), and [source provenance](references/README.md) before editing.
- Treat source snapshots as immutable historical evidence. Do not rewrite them to remove application-specific mappings or the original wiki authority statement.
- The architecture/coding summaries are navigation aids, not a replacement for the imported normative baseline.
- Preserve the distinction between hub version, policy version, application version, and data version.
- Never infer application adoption or silently update an application repository.
- Never select a programming language, framework, test runner, deployment target, or domain architecture merely because another application uses it.
- Keep architecture roles explicit and recorded in each application's role mapping. Do not impose a directory layout; applications may name directories by responsibility or, as the hosted layout on the companion page does, by role at the top level.
- Checkpoint major plans before implementation, use terse/decomposed commits, and document rejected alternatives in ADRs.
- Any new normative standard needs owner approval, a source-authority decision, an enforcement mapping, and a defined adoption process.
- Do not convert standing mandated-binding reviews into expiring exceptions.
- Run `npm run validate` before committing. State what it actually checks; do not call it an application-compliance audit.
- Perplexity Project copies are snapshots. Update their source-commit record when refreshing them.

This hub contract governs maintenance here. It is not automatically imported by application Projects.
