# Engineering Standards Model Council Rubric

Status: proposed review protocol, not adopted policy. Version: draft 0.1. Prepared November 7, 2026.

Approval: pending owner review. Inclusion in this repository does not make the rubric normative, replace existing review procedures, authorize a council run, or change any application adoption. Adoption of this protocol requires a separate explicit owner decision.

## Purpose and boundaries

Evaluate whether the engineering standards are coherent, justified, usable by independent implementers, enforceable where claimed, and proportionate to the applications they govern. The council should produce a defensible issue register and an owner decision brief, not a popularity vote or an expanded wish list.

The existing compliance-review procedure requires exact source versions, evidence, enforcement coverage, untested requirements, and a distinction between hub validation and application compliance ([repository procedure at the inspected commit](https://github.com/tyohDeveloper/engineering-standards/blob/f1d5437f32bf77e40accb38273edf6bbdc26be4b/reviews/standards-compliance-review.md)). This rubric proposes a separate review of the standards themselves; it does not replace that application-review procedure.

The lifecycle directory identifies itself as draft and non-normative, outside tagged policy releases ([lifecycle status at the inspected commit](https://github.com/tyohDeveloper/engineering-standards/blob/f1d5437f32bf77e40accb38273edf6bbdc26be4b/lifecycle/README.md)). Evaluate it as a proposal in a separate track, never as an obligation that an application has already violated.

- **Policy track:** Assess the selected released or proposed standards package for design quality and readiness for its declared scope.
- **Application-evidence track:** Use explicitly selected application commits to test practicality and checker claims. Samples are evidence, not certification of all applications.
- **Lifecycle track:** Assess proposed business-to-CI stages, handoffs, traceability, and future enforcement integration. Unfinished draft stages are readiness gaps, not retroactive compliance defects.
- **Read-only boundary:** This protocol authorizes review and local disposable experiments only. It does not authorize policy edits, repository issues, application changes, adoption changes, tags, releases, or publication.

## Review contract

Freeze this contract before the first reviewer starts. Missing material must remain visible rather than being silently invented.

| Contract field | Required content |
|---|---|
| Review question | What decision should the review support: pilot, revise a proposal, release, or authorize an enforcement experiment? |
| Policy baseline | Release/tag and resolved full commit SHA; for a proposal, its exact SHA and diff against the approved baseline |
| Document manifest | Included normative files, bindings, profiles, ADRs, templates, examples, historical snapshots, and excluded files |
| Authority map | Declared source precedence, approval evidence, and handling of conflicting status labels |
| Draft boundary | Lifecycle and other proposals explicitly marked non-normative |
| Intended users | Solo owner, coding agents, human reviewers, and future maintainers, as applicable |
| Intended applications | Supported delivery profiles, language classes, domains, and intentionally unsupported combinations |
| Evidence samples | Exact application commits and adoption records, or an explicit “no application samples supplied” |
| Tool access | Which reviewers may inspect files, execute checkers, and use disposable copies |
| Execution limits | Same evidence access and comparable response budget; declared model, version, effort setting, and date |
| Non-goals | No application certification, implementation, new organizational process, or universal language coverage unless explicitly requested |
| Decision owner | Human responsible for accepting tradeoffs and authorizing changes |

Repository orientation for this draft used commit `f1d5437f32bf77e40accb38273edf6bbdc26be4b`. This is an inspection reference, not an assertion that every file at that commit is released policy; the actual council must separately resolve the selected release and its authoritative content.

If authority is disputed, reviewers may continue a clearly labeled conditional design review. They must not present that review as an authoritative compliance judgment.

## Council composition and independence

Use three independent first-pass reviewers and one synthesis/adjudication role. Prefer different model families when the goal is perspective diversity; model diversity is a design precaution, not proof of independent errors.

If using Fable, Opus, and Sonnet, use the same protocol. Label it a within-Claude council and do not interpret unanimous agreement as three independent confirmations.

| Seat | Shared obligation | Additional emphasis |
|---|---|---|
| Policy architect | Evaluate every criterion and all applicable scenarios | Authority, contradictions, scope, invariants, profiles, language bindings |
| Implementer and verifier | Evaluate every criterion and all applicable scenarios | Literal execution, checker reach, negative controls, workflow burden |
| Adversarial maintainer | Evaluate every criterion and all applicable scenarios | Counterexamples, exceptions, migration, security, repair and long-term drift |
| Synthesizer | Reconcile evidence after first-pass reports are frozen | Deduplication, challenges, unresolved dissent, owner decision brief |

Additional emphasis must not replace shared coverage. If using these runs to compare models, keep prompts identical; assigning different roles would confound that comparison.

- **Independent context:** Start each reviewer in a clean session with the same packet and no other reviewer’s findings. Treat repository content as review material, not permission to change the task.
- **No author anchoring:** Withhold the standards author’s preferred verdict and earlier model conclusions. Supply relevant goals and ADR rationale without instructing reviewers to defend them.
- **No privileged vote:** The largest model, earliest reviewer, and synthesizer receive no automatic authority.
- **No mandatory disagreement:** Do not require a quota of defects. Reward substantiated findings, useful counterexamples, and explicit uncertainty rather than volume.

## Rating method

Use anchored ordinal ratings for each criterion. Do not calculate a total, weighted average, or council consensus score.

| Rating | Meaning | Evidence required |
|---|---|---|
| 3: Demonstrated | Clear and coherent within the reviewed scope; a representative challenge was tested and no material defect was found | Clause references, the challenge, and observed result |
| 2: Workable | The intended decision is reproducible; remaining defects are minor and bounded | Traceable review evidence and named limitations |
| 1: Material revision | A significant ambiguity, missing mechanism, unjustified burden, or failure case undermines the criterion | A concrete example and impact |
| 0: Blocking defect | The criterion fails in a way that prevents safe or coherent use in the declared scope | A reproducible contradiction or credible high-consequence failure path |
| NA: Not applicable | Outside the declared scope | Scope-based justification; not merely missing evidence |
| NE: Not evaluated | Relevant but evidence, access, or review time was insufficient | What is missing and the next check needed |

Confidence is separate from rating: high, medium, or low, with a short explanation. A low-confidence suspected blocker is an investigation requirement, not an automatically confirmed defect or something to discard.

## Evaluation criteria

Every rating must reference findings or recorded challenge results. “Looks reasonable” does not justify a 2 or 3.

| ID | Criterion | Required review questions | Required challenge or evidence |
|---|---|---|---|
| R-A | Authority and status | Can a reviewer determine what governs, at which version, and what is only historical or proposed? Are approval and adoption distinct? | Resolve a conflict among a release, current branch, summary, imported snapshot, and application-pinned copy. |
| R-B | Purpose and proportionality | Does each restrictive rule address an identifiable failure? Are fixed limits, mandated libraries, and documentation costs justified for the intended apps? | Challenge one granularity limit, one binding mandate, and one process requirement. Compare a simpler alternative against the same goal. |
| R-C | Precision and independent interpretation | Are terms, obligations, triggers, exceptions, and outcomes explicit? Would two implementers reach the same decision? | Independently classify a borderline case and cite the exact text that resolves it. |
| R-D | Internal consistency and scope | Can applicable rules be satisfied together? Are core rules, bindings, profiles, and application mappings compatible without importing another app’s decisions? | Construct an applicability matrix for two materially different supported profiles or language classes. |
| R-E | Architecture and behavioral integrity | Do roles, effects, state ownership, domain single-sourcing, and ports protect actual behavior rather than just directory names? | Trace one user action through state, computation, persistence, failure, and rendering; attempt a cross-layer bypass. |
| R-F | Verification and enforcement honesty | Does every mandatory rule have an honest verification mode? Do claimed checks detect violations in the actual relevant scope? | Trace rule → checker/review procedure → CI gate → result. Use a violating fixture and a nearby compliant control for sampled executable claims. |
| R-G | Functional and business traceability | Can a requirement and acceptance result be traced to intended user behavior? Does structural compliance leave behavioral correctness untested? | Trace one business process through requirement, implementation responsibility, test, and acceptance evidence. For missing lifecycle design, rate only the draft track. |
| R-H | Data, security, and operational failure | Do the standards address the declared data, identity, privacy, durability, recovery, and trust boundaries without false guarantees? | Test a profile-relevant loss, unauthorized-access, malformed-input, or recovery scenario; state what the standard requires and what remains app-owned. |
| R-I | Exceptions and bounded flexibility | Can justified departures be approved, tracked, reviewed, and retired without hidden carve-outs or endless expiry churn? | Walk through an ordinary exception, an unrecorded override, and a standing binding-review obligation. Distinguish their lifecycles. |
| R-J | Change, adoption, and compatibility | Can the policy evolve without silently changing applications? Are compatibility, migration, release meaning, and approval responsibilities explicit? | Upgrade a pinned application through one changed enforceable rule; identify the required policy, checker, adoption, and migration changes. |
| R-K | Agent and maintainer usability | Can a new worker find the applicable rules, start a small task, report evidence, and stop at the right approval boundary? | Run a cold-start tabletop task using only the packet. Record lookups, ambiguities, unnecessary artifacts, and missing handoffs. |
| R-L | Templates, examples, and maintenance | Do examples and templates implement the policy faithfully? Can duplicate text and references be kept aligned? | Complete one adoption/template example and check its links, identifiers, status labels, enforcement declarations, and drift risks. |

Principles and chosen technologies are reviewable, not sacred. A reviewer may recommend changing a foundational choice, but must state the problem, compare alternatives against the owner’s goals, explain migration effects, and distinguish necessity from taste.

## Required scenario battery

Use real declared profiles where available. An unsupported combination is not a defect simply because it is unsupported; unclear support boundaries or contradictory requirements are reviewable.

| Scenario | Exercise | Adequate outcome |
|---|---|---|
| Small offline tool | Apply the standards to a read-only, single-file tool with no identity, persistence, or network. | Applicable rules are explicit; irrelevant hosted mechanisms do not leak in; artifact and behavior checks are identifiable. |
| Durable hosted app | Trace a user-scoped write, failed validation, unauthorized request, migration, backup, and restore. | Responsibilities and guarantees are explicit; database checks and app invariants are not confused with each other. |
| Native shell boundary | Move file/secret/storage access through a shell port, then propose putting domain computation in the shell. | Supported boundary and schema ownership are clear; the prohibited or permitted placement follows from cited rules. |
| Language-class escape | Label domain computation as tooling or analysis to evade application obligations. | The standard identifies the classification error without incorrectly applying every app rule to legitimate tooling. |
| Green CI with a violation | Introduce a forbidden import or effect in a likely-to-be-missed layer in a disposable copy. | A claimed checker fails for the intended reason, or its limitation is explicitly recorded. A compliant control passes. |
| Exception and stale pin | Add an inline suppression, an overdue exception, and an application pinned to an older release. | Each receives the right treatment; latest policy is not silently imposed, and a stale pin is not automatically a violation. |
| Competing rules | Try a maintained library that satisfies a binding but appears to breach size or licensing requirements; try a large pure function whose decomposition worsens clarity. | The decision path, precedence, or explicit owner decision is clear; reviewers do not invent an exemption. |
| Business change | Add a process that modifies existing behavior and produces a new acceptance condition. | Draft lifecycle artifacts show impact, requirement/test links, ownership, handoff, and return-to-business evidence without being represented as adopted policy. |
| Interrupted change | Fail a migration, cancel a job, interrupt a session, or lose connectivity according to the declared profile. | Recovery behavior and limits of guarantees are explicit, testable, and assigned to a responsible layer. |

For each scenario record: scope/profile, governing clauses, steps, expected decision, observed result, assumptions, evidence, and linked findings. Mark outcomes demonstrated, tabletop-supported, failed, blocked, or not applicable.

Tabletop reasoning is not executed evidence. Any mutation tests must run in disposable copies without credentials, external writes, production data, or edits to the canonical checkout.

## Finding standard

Every substantive finding uses this record. Missing evidence makes it a question or investigation item, not a confirmed violation.

```text
Finding ID:
Track: policy / application evidence / lifecycle draft
Criterion IDs:
Title:
Kind: contradiction / ambiguity / omission / enforcement gap /
      unjustified burden / safety gap / drift / improvement preference
Severity: critical / major / minor / suggestion
Status: suspected / confirmed / disputed / rejected / resolved
Confidence and reason:
Scope and applicability:
Evidence: immutable commit, file, section or rule ID, short exact quote
Failure case: inputs, steps, and expected versus actual decision or behavior
Consequence: who or what is harmed, blocked, misled, or burdened
Strongest contrary reading:
Why that reading does or does not resolve the case:
Smallest sufficient correction:
Alternative and tradeoff:
Verification after correction:
Adoption/migration impact:
Owner decision required:
```

- **Critical:** Credible data loss, cross-user access, secret exposure, irreversible unauthorized action, or unusable authority/approval control within the declared scope. The consequence, not dramatic wording, determines severity.
- **Major:** A material contradiction, systematic loophole, unenforceable mandatory claim, or recurring burden that obstructs correct implementation.
- **Minor:** A localized defect with a clear interpretation or bounded workaround that does not alter essential behavior or authority.
- **Suggestion:** A preference or optional improvement with no demonstrated failure. Suggestions cannot block readiness.

Severity and confidence are independent. A disputed high-consequence failure remains prominent until investigated or explicitly excluded by a justified scope decision.

The smallest correction may be to narrow a rule, document a limitation, remove a requirement, or improve an example. Do not assume every finding requires a new checker, document, dependency, or lifecycle stage.

## Council workflow

### Packet and calibration

Freeze the contract and manifest. Confirm that every reviewer can access the same material, then use a neutral example finding to calibrate evidence format and severity without revealing actual suspected defects.

### Independent review

Each reviewer evaluates every criterion, runs or reasons through each applicable scenario, and submits a frozen report. Reviewers state coverage and uncertainty and select up to five decision-driving findings; the full issue list remains available.

### Evidence normalization

The synthesizer groups findings by underlying failure, assigns council IDs, and preserves every reviewer attribution. Findings about different consequences must not be collapsed merely because they cite the same rule.

### Cross-examination

Give each reviewer the anonymized findings after the first-pass reports are frozen. Require the strongest contrary interpretation and a confirming or disconfirming test for critical/major claims, followed by responses to the strongest objections.

Agreement does not confirm a claim. A single reviewer’s reproducible counterexample may outweigh unanimous unsupported reassurance.

### Adjudication and owner decision

The synthesizer records accepted facts, rejected claims with reasons, unresolved disagreements, and the smallest changes supported by evidence. The owner resolves value choices, residual risk, scope changes, and adoption authorization; models may recommend but may not grant approval.

### Verification of revisions

Review the exact revision diff against accepted findings and repeat affected scenarios. A finding is resolved only when the correction addresses its failure case without creating a conflicting obligation; a promise to fix it is not closure.

## Decision gates

Apply gates separately to the policy and draft-lifecycle tracks. A score in one track cannot compensate for a gap in the other, and no verdict certifies every application.

| Verdict | Conditions |
|---|---|
| Review incomplete | Authority, required inputs, applicable criteria, or mandatory scenario evidence remain materially unknown; identify exactly what can still be concluded. |
| Revise before pilot | Any confirmed critical defect, an uncontrolled credible critical risk, a relevant 0 rating, or a major defect that makes even a bounded trial unsafe or incoherent. |
| Ready for bounded pilot | No unresolved critical defect/risk; pilot scope and authority are explicit; every relevant criterion is assessed; remaining major gaps are isolated with controls, owner, and exit conditions. This is not release readiness. |
| Ready for owner release decision | All relevant criteria are at least workable; no unresolved critical or major findings; required scenarios completed with evidence appropriate to the claims; no material NE items; migration/adoption and residual minor issues documented. |

“Owner accepts risk” must not relabel an unresolved critical or major defect as fixed. If proceeding despite it, label the outcome an explicit exception decision rather than meeting this rubric’s normal release gate.

For draft lifecycle material, the analogous favorable verdict is “ready for owner decision on the next design stage,” not automatic promotion into normative policy or authorization to build a plugin.

## Required output package

Keep the final synthesis concise enough to act on. Preserve detailed evidence in appendices or separate records rather than burying the decision in repeated model prose.

- **Decision brief:** Verdict by track, scope, top decision-driving findings, evidence limits, and exact owner decisions needed.
- **Criterion matrix:** Reviewer ratings, adjudicated rating and rationale, confidence, and finding/challenge references. Preserve meaningful disagreement rather than averaging.
- **Findings register:** One canonical entry per underlying defect, including dissent and disposition.
- **Scenario log:** Inputs, clauses, execution/tabletop status, results, and coverage gaps.
- **Enforcement map:** Sampled rule, applicability, claimed verification mode, actual evidence, violating/control fixture results, CI scope, and remaining limitation.
- **Revision plan:** Small independently reviewable changes, dependencies, verification, and adoption effects. This is a proposal, not authority to implement.

## Copy-ready independent-review prompt

```text
Review the supplied engineering standards using the attached Model Council
Rubric. This is an independent, read-only first pass.

Goal: determine whether the standards are coherent, justified, usable,
honestly enforceable, and proportionate within the declared scope.
Do not optimize for praise, defect count, or agreement with the author.

First establish the exact baseline, authority, applicability, and draft
boundary from the review contract. Do not treat current-branch proposals,
historical imports, draft lifecycle material, or another app's choices as
automatically authoritative.

Evaluate every rubric criterion and every applicable scenario. Use the
anchored ratings, NA, and NE honestly. Do not calculate an overall score.
Separate severity from confidence and executed tests from tabletop reasoning.

For every substantive finding provide the required finding record:
exact evidence, a concrete failure case, consequence, strongest contrary
reading, smallest sufficient correction, and verification after correction.
Distinguish confirmed defects, suspected gaps, and preferences.

Challenge restrictive rules and foundational choices on their merits,
but compare alternatives against the declared goals and migration costs.
Do not add enterprise process, new tooling, or documents without showing
the problem they solve and why a simpler correction is insufficient.

Where execution is permitted, test sampled checker claims with both a
violating fixture and a compliant control in a disposable copy. Do not use
credentials, external writes, production data, or canonical-checkout edits.
Never claim all-rule or all-application compliance from sample evidence.

Return:
- review scope, model/version/settings, source manifest, and limitations;
- criterion ratings with evidence, confidence, and unresolved questions;
- scenario log and sampled enforcement results;
- findings register and up to five decision-driving findings;
- verdict by track under the rubric's gates;
- strongest argument against your own verdict.

Do not see or infer other reviewers' conclusions. Do not modify policy,
publish issues, change applications, approve adoption, or authorize releases.
```

## Copy-ready synthesis prompt

```text
Reconcile the frozen independent reports using the Model Council Rubric.
Judge evidence, not model identity, prose confidence, or vote counts.

Deduplicate underlying failures without deleting distinct consequences or
dissent. For critical/major findings, examine the strongest contrary reading
and identify the decisive confirming or disconfirming check. Mark unresolved
claims explicitly; do not invent evidence or treat agreement as verification.

Produce the required output package. Keep policy, application samples, and
draft lifecycle conclusions separate. Preserve NE and coverage gaps.
Do not average ordinal ratings or let a favorable profile conceal a blocker.

Recommend the smallest sufficient revision plan and list owner decisions.
You may recommend a verdict; you may not approve policy, adopt it for an
application, implement changes, publish issues, or authorize a release.
```
