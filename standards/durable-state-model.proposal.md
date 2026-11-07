# Durable Datastore Concurrency Classification

Status: proposed normative architectural revision, pending approval and merge. Updated November 7, 2026. Once approved and merged, this revision's architectural definitions and requirements become normative. Illustrations are non-normative; they explain the requirements without prescribing a particular implementation.

## Purpose and boundary

Classify durable datastore access using four models: serialized accessor, single-writer/opportunistic-readers, single-writer/multiple-readers, and multiple-writers/multiple-readers. Their permitted access overlap and guarantees are the core of this proposal.

An application/system architecture must identify the one or more durable datastores it uses and declare the access class for each. It must guarantee that access conforms to the declared class and may rely on that class's stated guarantees; it must not assume guarantees that the class does not provide. Required operation scopes and consistency or conflict-resolution contracts must be stated explicitly where the classification calls for them.

Durability subclasses provide context for this classification. Datastore access ownership, browser-local restrictions, and application/system workflow exclusion are supporting architectural clarifications, not additional concurrency classes or coequal policy workstreams.

The existing profile vocabulary lists `none`, `session`, `browser-local`, `device-durable`, `hosted-durable`, and reserved `shared-data` ([current released definition](https://github.com/tyohDeveloper/engineering-standards/blob/9f00458c2f11e8e057dc987b926b4cf1ec4db43e/standards/profiles.md#L7-L23)). This revision defines the architectural classification without adding values to the current validator or rewriting application adoption records.

## Datastore access concurrency

Use **serialized accessor**, rather than “single-threaded,” for the first model. The term describes exclusive access to the entire datastore, not physical thread count or whole-application execution.

| Access model | Writers | Readers | Reads during a write |
|---|---|---|---|
| Serialized accessor | Zero or one active accessor holds access to the entire datastore. | All other accessors are blocked for the full duration that access is held, including read-only access to different records or subsets. | Blocked for other accessors throughout the held-access duration. |
| Single-writer / opportunistic-readers | At most one active writer. | Opportunistic readers have no atomicity, consistency, completeness, or stable-view guarantee and do not block other access. | Allowed without those guarantees. |
| Single-writer / multiple-readers | At most one active writer; defined write operations appear atomic to ordinary accessors. | Multiple readers are permitted; defined read operations appear atomic. | Implementation-dependent; ordinary readers must not observe a partially completed operation. |
| Multiple-writers / multiple-readers | Multiple concurrent writers are permitted. | Multiple concurrent readers are permitted. | Allowed; consistency and conflict-resolution guarantees must be declared separately. |

A **serialized accessor** datastore permits zero or one active accessor. For the duration that an accessor holds access, all other access to the entire datastore is blocked, whether reading or writing. That duration may encompass multiple datastore operations and periods between them; it is not limited to a single operation. This classification does not prescribe when an accessor must release access.

Atomicity, where declared, is an observable guarantee for defined primary operations, including reads and writes that create, modify, or delete data. It does not prescribe a datastore-wide, table-level, or row-level lock, or any particular provider mechanism; those are implementation choices.

For single-writer / multiple-readers, ordinary readers do not observe a partially completed write. A read concurrent with a write may wait or complete without waiting, provided the declared atomicity is preserved; neither store-wide blocking nor a particular lock scope is required.

Opportunistic reads are an explicit exception to atomic-view guarantees. A result may be indeterminate, incomplete, or contain a mixture of old and new state; it is not certified as a coherent read of a completed operation. Opportunistic reads do not block other access or provide access-exclusion authority.

In single-writer / multiple-readers, atomicity applies to each defined datastore operation, not automatically to a sequence of operations or the lifetime of a reader's workflow. A workflow may read state A, another workflow may complete a write, and the first workflow may then read state B without violating this model.

For that model, do not infer that a writer must wait for an entire reader workflow to finish. The declaration must identify the atomic operation's scope; whether it is a record operation, a transaction, or another explicitly defined unit is not settled here, and that scope does not prescribe a lock's granularity. Operation-level atomicity is distinct from the held-access duration of serialized accessor and from broader application/system processing exclusion.

## Durable classification context

Make **durable** the parent state category, with device, hosted, and shared deployment or sharing subclasses. Device denotes durable storage associated with a device; hosted denotes storage maintained by a hosted system; shared denotes storage shared across applications or systems and retains its currently reserved status.

The four access models classify datastore access concurrency independently of these subclasses. Every durable subclass allows for interactive and batch processing; batch processing is not itself a durability or datastore concurrency class.

Keep `none` and `session` outside this proposed durable hierarchy. Browser-local's hierarchy placement remains open; its supporting access binding below does not settle that placement.

## Supporting architectural boundaries

### Datastore access ownership

Ownership identifies which contexts may open and use the datastore directly, not what operations may overlap. One owner may service multiple workflows; multiple coordinated accessors may still use a single-writer model. Schema ownership, migration authority, business ownership, and MODEL/REMOTE write authority are separate concerns.

### Browser-local binding

Browser-local uses one active direct-access owner across tabs, windows, and workers, with the serialized accessor classification. Other contexts route requests through that owner and do not access the store directly, even read-only. This is an application-specific design restriction, not a browser capability claim or a fifth access model; computation and workflow overlap remain separate concerns.

### Application/system processing exclusion

Blocking an entire workflow or batch job is not a datastore concurrency classification. Such processing coordination requires a separate application/system mechanism and may span multiple datastores or cover only a subset of one datastore; serialized accessor instead applies to the entire datastore. Other workflows may compute independently, but their datastore access must still obey the selected model: an idle period between operations does not release an accessor's held access, and release of datastore access does not override separately established processing exclusion.

## Synthetic conformance cases

Test the standards model using synthetic cases before auditing application repositories. The following acceptance cases express the proposed architectural requirements, not claims about existing implementations; they are distinct from non-normative illustrations.

| Case | Expected decision |
|---|---|
| An accessor holds access under serialized accessor while another accessor requests a read or write. | The requesting accessor is blocked from the entire datastore, including different records or subsets. |
| A serialized accessor is between operations but still holds access. | Other accessors remain blocked; completion of an individual operation does not release held access. |
| A serialized accessor releases access and another accessor is granted access. | The next accessor may use the datastore; no two accessors hold access concurrently. |
| Two coordinated accessors use a single-writer model. | They may both exist, but at most one active writer is permitted; no lock mechanism or granularity is prescribed. |
| Multiple readers access the store under single-writer / multiple-readers with no write in progress. | Concurrent readers are permitted; this differs from serialized accessor. |
| An ordinary read arrives during a write under single-writer / multiple-readers. | The read must preserve the declared atomicity and not observe a partially completed operation; waiting is not required if those guarantees are otherwise preserved. |
| Different internal locking scopes or coordination mechanisms preserve the same declared access and atomicity guarantees. | The classification does not prefer or require one implementation; conformance depends on the observable guarantees. |
| Under single-writer / multiple-readers, a workflow performs a read, another workflow writes, then the first workflow reads again. | The second read may observe the new completed state unless a separate, stronger workflow policy applies. |
| An opportunistic reader reads during a write and receives incomplete or mixed old/new state. | Overlap and an indeterminate result are permitted; atomicity, consistency, completeness, and a stable view are not guaranteed. |
| An opportunistic read prevents another accessor from reading or writing by imposing access exclusion. | This violates the opportunistic-read contract; such reads do not block other access. |
| A batch job's accessor holds access under serialized accessor while no broader processing exclusion is established. | Other workflows may compute, but other accessors cannot use the datastore until held access is released. |
| A batch job holds exclusive workflow-processing authority between writes. | Other processing remains excluded even while no datastore operation or held-access interval is active. |
| Multiple writes and reads overlap under multiple-writers / multiple-readers. | Their concurrency is permitted; the separately declared consistency and conflict-resolution contract still applies. |
| Multiple-writers / multiple-readers is declared without consistency or conflict-resolution semantics. | The declaration is incomplete; do not invent those guarantees from the model's name. |

## Review and adoption considerations

- **Concurrency declaration:** Choose the schema representation and compatibility rules for the four access classes. Do not repurpose the existing `compute` or reserved `packaging = batch` values without a separate decision.
- **Access duration, atomicity, and concurrent writers:** Define the access-grant/release contract for serialized accessor, atomic operation boundaries where applicable, and required consistency/conflict-resolution contracts where they are not yet specified.
- **Durable classification compatibility:** Define subclass guarantees and resolve hierarchy placement where needed for the classification's adoption, without turning browser-specific processing policy or workflow-coordinator design into datastore requirements.
- **Approval, merge, and adoption:** Map each obligation to a synthetic conformance check or named review and record compatibility/adoption effects. Approval and merge make this architectural revision normative; application adoption, tooling updates, and release/version bookkeeping are separately recorded work.

This revision changes the architectural standard, not individual application repositories. Resolve and test the standards model first, then consider individual application adoption or compliance.
