# Authority, Release, and Propagation

## Present authority

The imported v2.2 repository copies explicitly identify the `programming` Project wiki as canonical and instruct changes there before propagation. Their exact statements are preserved in [source snapshots](../references/README.md).

This new GitHub repository is the versioned home of the hub scaffold and migration work. Its creation is not permission to silently overrule the existing wiki, distribute revised policy, or update application code.

## Migration decision

Before a new normative hub release:

- Export and reconcile the core and companion wiki pages, per the [reconciliation checklist](wiki-reconciliation.md).
- Compare copies and separate genuinely shared policy from application path mappings and target-specific extensions.
- Record the owner-approved authority transfer in an ADR with rejected alternatives.
- Define the policy version, enforcement matrix, migration notes, and accepted exceptions.
- Publish immutable source references and release meaning.
- Update the Project context and identify which source wins during any transition.

## Approved release workflow

- Checkpoint a proposal before large changes.
- Review architecture and policy implications separately from implementation.
- Change enforcement alongside enforceable rules; identify human-reviewed requirements explicitly.
- Run `npm run validate` for hub integrity, plus the applicable checker tests.
- Record version meaning, source provenance, affected requirements, and adoption effects.
- Create a standards-specific tag only after approval; do not create application/data tags from this hub.
- Refresh Project Files deliberately and record their exact source commit.

## Application adoption

Applications pin an approved policy release and immutable source commit. They keep their own architecture, mapping, exceptions, and CI commands. A standards update is a deliberate reviewed adoption change, normally isolated from unrelated application changes.

The initial scaffold does not create adoption records, invite collaborators, configure branch protection, publish public resources, or modify existing application repositories.
