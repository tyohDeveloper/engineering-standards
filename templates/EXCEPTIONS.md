# Exceptions Register Template

## Required fields for actual exceptions

| Field | Meaning |
|---|---|
| ID | Stable exception identifier. |
| Policy reference | Exact violated section and adopted version. |
| Scope | Affected paths, symbols, targets, or requirements. |
| Rationale | Why compliance is presently unavailable. |
| Owner / approval | Accountable owner and approval evidence. |
| Approved / expires | Dates; actual exceptions expire. |
| Removal / renewal | Objective condition and reviewed next step. |
| Enforcement | How expiry and scope are checked. |

Use the adopted baseline's inline comment and machine-checkable manifest conventions. Standing org-mandated bindings instead belong in a separate authority manifest with review dates; they are not expiring policy violations.


## Existing carve-outs (fill at adoption)

List every pre-existing lint override, per-file exclusion, skipped test or disabled rule already in the repository (for example ESLint `overrides` blocks with inline EXCEPTION comments). Each becomes an entry above with the core rule it departs from, or is removed. Adoption is not complete while an inline carve-out lacks an entry here (pilot finding, OmniUnit 2026-10-30).
