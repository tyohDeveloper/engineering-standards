# Durable Datastore Concurrency Classification

Status: proposal, non-normative. Updated November 7, 2026. This document records the proposed model for review; it does not change a released policy, an adoption schema, or any application.

## Purpose and boundary

Classify durable datastore access using four models: serialized reader/writer, single-writer/opportunistic-readers, single-writer/multiple-readers, and multiple-writers/multiple-readers. Their permitted operation overlap and guarantees are the core of this proposal.

Durability subclasses provide context for this classification. Datastore access ownership, browser-local restrictions, and application/system workflow exclusion are supporting commentary, not additional concurrency classes or coequal policy workstreams.

The existing state values remain `none`, `session`, `browser-local`, `device-durable`, `hosted-durable`, and reserved `shared-data` until an approved release changes them ([current released definition](https://github.com/tyohDeveloper/engineering-standards/blob/9f00458c2f11e8e057dc987b926b4cf1ec4db43e/standards/profiles.md#L7-L23)). This proposal develops their conceptual replacement without adding values to the current validator or rewriting adoption records.

## Datastore access concurrency

Use **serialized reader/writer access**, rather than “single-threaded,” for the first model. The term describes datastore operations, not physical thread count or whole-application execution.

| Access model | Writers | Readers | Reads during a write |
|---|---|---|---|
| Serialized reader/writer access | At most one datastore operation, read or write, is active at a time. | Reads are serialized with other reads and writes. | Blocked. |
| Single-writer / opportunistic-readers | One writer holds a store-wide write lock. | Readers may operate concurrently without a guaranteed stable view. | Allowed. |
| Single-writer / multiple-readers | One writer holds a store-wide write lock. | Multiple readers are permitted; each defined read and write operation is atomic. | Blocked during the write operation. |
| Multiple-writers / multiple-readers | Multiple concurrent writers are permitted. | Multiple concurrent readers are permitted. | Allowed; consistency and conflict-resolution guarantees must be declared separately. |

For single-writer / multiple-readers, readers do not observe a partially completed write. A reader requesting access during a write waits for that write operation to finish.

Atomicity applies to each defined datastore operation, not automatically to a sequence of operations or the lifetime of a reader's workflow. A workflow may read state A, another workflow may complete a write, and the first workflow may then read state B without violating this model.

Do not infer that a writer must wait for an entire reader workflow to finish. The selected datastore mechanism must preserve the declared operation-level atomicity, but broader application/system exclusion is a separate concern.

The declaration must identify the atomic operation's scope. Whether it is a record operation, a transaction, or another explicitly defined unit is not settled by this summary.

## Durable classification context

Make **durable** the parent state category, with device, hosted, and shared deployment or sharing subclasses. Device denotes durable storage associated with a device; hosted denotes storage maintained by a hosted system; shared denotes storage shared across applications or systems and retains its currently reserved status.

The four access models classify operation concurrency independently of these subclasses. Every durable subclass allows for interactive and batch processing; batch processing is not itself a durability or datastore concurrency class.

Keep `none` and `session` outside this proposed durable hierarchy. Browser-local's hierarchy placement remains open; its supporting access binding below does not settle that placement.

## Supporting commentary and boundaries

### Datastore access ownership

Ownership identifies which contexts may open and use the datastore directly, not what operations may overlap. One owner may service multiple workflows; multiple coordinated accessors may still use a single-writer model. Schema ownership, migration authority, business ownership, and MODEL/REMOTE write authority are separate concerns.

### Browser-local binding

Browser-local uses one active direct-access owner across tabs, windows, and workers, with serialized reader/writer access, including read/read serialization. Other contexts route requests through that owner and do not access the store directly, even read-only. This is an application-specific design restriction, not a browser capability claim or a fifth access model; computation and workflow overlap remain separate concerns.

### Application/system processing exclusion

Blocking an entire workflow or batch job is not a datastore concurrency classification. Reads and writes retain the guarantees of their selected access model, but any broader processing exclusion requires a separate application/system mechanism, including while the datastore is idle between operations. Without such exclusion, workflows may alternate datastore operations and perform computation between them; releasing a datastore lock does not override separately established workflow exclusion.

## Synthetic conformance cases

Test the standards model using synthetic cases before auditing application repositories. The following are proposed acceptance expectations, not claims about existing implementations.

| Case | Expected decision |
|---|---|
| Two reads and a write are pending under serialized reader/writer access. | No two datastore operations overlap, including two reads. |
| Two coordinated accessors use a single-writer model. | They may both exist, but only one writer holds the store-wide write lock at a time. |
| Multiple reads execute under single-writer / multiple-readers with no write in progress. | Concurrent reads are permitted; this is not serialized reader/writer access. |
| A read arrives during a write under single-writer / multiple-readers. | The read waits and does not observe a partially completed write. |
| A workflow performs read, another workflow writes, then the first workflow reads again. | The second read may observe the new completed state unless a separate, stronger workflow policy applies. |
| An opportunistic reader reads during a write. | Overlap is permitted; stable-view guarantees are not inferred. |
| A batch job uses serialized operations while overlapping workflows are permitted. | Other workflows may compute or take turns accessing the store between operations. |
| A batch job holds exclusive workflow-processing authority between writes. | Other processing remains excluded even while no datastore write lock is held. |
| Multiple writes and reads overlap under multiple-writers / multiple-readers. | Their concurrency is permitted; the separately declared consistency and conflict-resolution contract still applies. |
| Multiple-writers / multiple-readers is declared without consistency or conflict-resolution semantics. | The declaration is incomplete; do not invent those guarantees from the model's name. |

## Decisions before normative promotion

- **Concurrency declaration:** Choose the schema representation and compatibility rules for the four access classes. Do not repurpose the existing `compute` or reserved `packaging = batch` values without a separate decision.
- **Atomicity and concurrent writers:** Define atomic operation boundaries and the required consistency/conflict-resolution contracts where they are not yet specified.
- **Durable classification compatibility:** Define subclass guarantees and resolve hierarchy placement where needed for the classification's adoption, without turning browser-specific processing policy or workflow-coordinator design into datastore requirements.
- **Enforcement and release:** Map each obligation to a synthetic conformance check or named review, record compatibility/adoption effects, obtain owner approval, and release the normative changes through the existing process.

No application audit or implementation change is authorized by this proposal. Resolve and test the standards model first, then consider individual application adoption or compliance.
