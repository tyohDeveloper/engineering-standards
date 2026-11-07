# Durable-State Model

Status: proposal, non-normative. Updated November 7, 2026. This document records the proposed model for review; it does not change a released policy, an adoption schema, or any application.

## Purpose and boundary

Separate durability, deployment/sharing, runtime datastore ownership, datastore access concurrency, and application/system processing policy. Do not infer one of these properties from another.

The existing state values remain `none`, `session`, `browser-local`, `device-durable`, `hosted-durable`, and reserved `shared-data` until an approved release changes them ([current released definition](https://github.com/tyohDeveloper/engineering-standards/blob/9f00458c2f11e8e057dc987b926b4cf1ec4db43e/standards/profiles.md#L7-L23)). This proposal develops their conceptual replacement without adding values to the current validator or rewriting adoption records.

## Durable state and its subclasses

Make **durable** the parent state category. Give it deployment or sharing subclasses:

| Subclass | Meaning |
|---|---|
| Device | Durable storage associated with a device. |
| Hosted | Durable storage maintained by a hosted system. |
| Shared | Durable storage shared across applications or systems. Its currently reserved status is not removed by this proposal. |

Every durable subclass allows for both interactive and batch processing. Whether those activities may overlap is a separate processing-policy decision; batch processing is not itself a durability class.

Keep `none` and `session` outside this proposed durable hierarchy. The placement and guarantees of `browser-local` remain an explicit open decision rather than an automatic reclassification.

## Runtime datastore access ownership

Use access ownership to specify which execution contexts may open and use the datastore directly. This is distinct from schema ownership, migration authority, business ownership, and MODEL/REMOTE write authority.

| Ownership model | Meaning |
|---|---|
| Single access owner | Exactly one active execution context owns direct datastore access. Other contexts submit requests through that owner instead of opening or using the datastore directly. |
| Multiple coordinated accessors | Multiple execution contexts may access the datastore directly, subject to the declared access-concurrency and coordination rules. |

A single access owner does not inherently serialize all requests or exclude entire workflows. Multiple accessors do not inherently permit multiple simultaneous writers; the access-concurrency model decides what may overlap.

## Datastore access concurrency

Use **serialized reader/writer access**, rather than “single-threaded,” for the first model. The term describes datastore operations, not physical thread count or whole-application execution.

| Access model | Writers | Readers | Reads during a write |
|---|---|---|---|
| Serialized reader/writer access | At most one datastore operation, read or write, is active at a time. | Reads are serialized with other reads and writes. | Blocked. |
| Single-writer / opportunistic-readers | One writer holds a store-wide write lock. | Readers may operate concurrently without a guaranteed stable view. | Allowed. |
| Single-writer / multiple-readers | One writer holds a store-wide write lock. | Multiple readers are permitted; each defined read and write operation is atomic. | Blocked during the write operation. |
| Multiple-readers / multiple-writers | Multiple concurrent writers are permitted. | Multiple concurrent readers are permitted. | Allowed; consistency and conflict-resolution guarantees must be declared separately. |

For single-writer / multiple-readers, readers do not observe a partially completed write. A reader requesting access during a write waits for that write operation to finish.

Atomicity applies to each defined datastore operation, not automatically to a sequence of operations or the lifetime of a reader's workflow. A workflow may read state A, another workflow may complete a write, and the first workflow may then read state B without violating this model.

Do not infer that a writer must wait for an entire reader workflow to finish. The selected datastore mechanism must preserve the declared operation-level atomicity, but broader application/system exclusion is a separate concern.

The declaration must identify the atomic operation's scope. Whether it is a record operation, a transaction, or another explicitly defined unit is not settled by this summary.

## Application/system processing policy

Define workflow-level exclusion independently of datastore ownership and access locking. A store-wide write lock does not automatically exclude another workflow for the duration of a batch job.

| Processing policy | Meaning |
|---|---|
| Overlapping workflows permitted | Interactive and batch activities may overlap while their datastore operations obey the selected access model. |
| Exclusive workflow processing | One workflow or batch job excludes other processing until it completes or relinquishes exclusivity. A separate application/system mechanism enforces this exclusion. |

Under serialized datastore access, two workflows may alternate atomic operations while performing computation between them. If a batch job must exclude interactive or other processing for its entire duration, declare exclusive workflow processing and enforce that policy separately.

Use the separate workflow mechanism even when the datastore happens to be idle between operations. Do not treat release of a datastore lock as permission to bypass an active workflow-exclusion decision.

## Browser-local policy

Do not use `browser-local` as a synonym for a concurrency model. A browser-local profile may require one access owner, serialized datastore operations, exclusive workflow processing, or a combination, but each restriction must be explicit.

The candidate single-owner design routes datastore requests through one owner while allowing other execution contexts to perform computation. This candidate does not itself select overlapping or exclusive workflows, and it is not made mandatory by this proposal.

Decide browser-local's position in the durability hierarchy and its default ownership/access/processing bindings before promoting the model. Do not describe a chosen restriction as an inherent platform limitation.

## Synthetic conformance cases

Test the standards model using synthetic cases before auditing application repositories. The following are proposed acceptance expectations, not claims about existing implementations.

| Case | Expected decision |
|---|---|
| Two requests reach a single owner configured for serialized access. | At most one datastore operation executes at a time. Owner count and access serialization are checked separately. |
| Two coordinated accessors use a single-writer model. | They may both exist, but only one writer holds the store-wide write lock at a time. |
| A read arrives during a write under single-writer / multiple-readers. | The read waits and does not observe a partially completed write. |
| A workflow performs read, another workflow writes, then the first workflow reads again. | The second read may observe the new completed state unless a separate, stronger workflow policy applies. |
| An opportunistic reader reads during a write. | Overlap is permitted; stable-view guarantees are not inferred. |
| A batch job uses serialized operations while overlapping workflows are permitted. | Other workflows may compute or take turns accessing the store between operations. |
| A batch job holds exclusive workflow-processing authority between writes. | Other processing remains excluded even while no datastore write lock is held. |
| A single owner delegates computation without delegating direct datastore access. | The ownership rule remains satisfied; computation concurrency alone does not violate it. |
| Multiple writers are declared without consistency or conflict-resolution semantics. | The declaration is incomplete; do not invent those guarantees from the model's name. |

## Decisions before normative promotion

- **Hierarchy and guarantees:** Decide where browser-local belongs and define the durability guarantees of each subclass without weakening them implicitly.
- **Declaration shape:** Choose explicit schema fields and compatibility rules for the independent axes. Do not repurpose the existing `compute` or reserved `packaging = batch` values without a separate decision.
- **Atomicity and concurrent writers:** Define atomic operation boundaries and the required consistency/conflict-resolution contracts where they are not yet specified.
- **Ownership and exclusion lifecycle:** Define the scope of the access owner and workflow coordinator, including handoff, failure, cancellation, and release behavior.
- **Browser-local defaults:** Select its ownership, access-concurrency, and processing-policy defaults explicitly; none is selected merely by its storage label.
- **Enforcement and release:** Map each obligation to a synthetic conformance check or named review, record compatibility/adoption effects, obtain owner approval, and release the normative changes through the existing process.

No application audit or implementation change is authorized by this proposal. Resolve and test the standards model first, then consider individual application adoption or compliance.
