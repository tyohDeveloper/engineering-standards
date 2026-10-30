---
id: concepts/coding-standards-data-layer
item_type: wiki_page
semantic_type: concept
title: Coding standards — data layer
description: The DATA layer half of [[concepts/coding-architecture-standards]] — what belongs in JSON rather than code, how it is validated, and the one sanctioned way for a data entry to reach a code-side function.
created_at: '2026-08-08T12:23:00+00:00'
updated_at: '2026-08-08T12:24:00+00:00'
---
# Coding standards — data layer

The DATA layer half of [[concepts/coding-architecture-standards]] — what belongs in JSON rather than code, how it is validated, and the one sanctioned way for a data entry to reach a code-side function[cite:1].

## What it is

DATA is the bottom layer of the dependency model and contains no code. Its rules exist because domain tables embedded as code literals were the most common standards violation found in review: conversion factors, per-category defaults, dimension maps, and button layouts all appeared as literals inside controllers and app shells where no schema check could see them[cite:1].

The threshold is deliberately low. A table with more than five entries, or one likely to change independently of the code that reads it, is data. The payoff is dataset versioning, schema validation, and downstream consumers without a rebuild.

## Externalization and validation

- **No domain table as a code literal** — conversion factors, category groupings, calendar metadata, historical entities, button layouts, and UI strings live in DATA as JSON. A table with more than five entries, or one likely to change independently of code, is data.
- **Schema-validated at build time** — new categories or entity kinds require the schema update in the same PR.
- **Delta-only variants** — locale files, label configs, and regional variants contain only keys that differ from their base; the merge is one shared cascade-resolve function reused by every variant layer. Duplicate values in a variant file are a defect.
- **Declared taxonomies** — behavior is expressed as JSON metadata (`family`, `primaryCategory`, dimensional-alias fields) rather than hardcoded exclusion lists, ghost categories, or duplicate dimension/group maps. New categories or entities don't require scattered filter edits[cite:1].
- **Nothing user-visible is a code literal** — all display text resolves by key from DATA.
- **Everything is 0-indexed** — rows, keys within a row, stack levels, registers, panes, and any other ordered sequence, in code, in JSON, and in task descriptions. When a task description identifies something by both numeric position and name, both must agree under 0-based counting before it is finalized[cite:2].

## Data referencing code

Some domain values cannot be expressed as a factor or a literal — they need a function. The pattern that survived review[cite:3]:

- **Data names a function; a validated registry resolves it** — a data entry declares a named function (`conversionFunction: "<name>"`) resolved against one code-side registry. Schema validation at load rejects unknown names outright. Data never contains code, and code never contains the table of which entries use which function.
- **Redundant representations must be proven equal, not assumed equal** — where an entry carries both a factor and a function, a test asserts the factor exactly equals the function evaluated at unity. Factor-consuming call sites (paste, comparison, lookup) use the factor directly, so silent drift between the two produces wrong results with no error.
- **Entries that break an assumption are marked, not just omitted** — genuinely non-linear entries carry an explicit marker so a predicate can exclude them from every consumer that assumes linearity. Relying on the absence of a flag is not sufficient.
- **Ordering invariants are declared and independently tested** — where array order is semantic (base unit first, then ascending magnitude), a test computes the expected order from the data itself rather than trusting the committed order, with a short explicit exemption list for categories ordered on other grounds. New entries are inserted in sorted position, never appended.

## See also

- [[concepts/coding-architecture-standards]] — the source of truth
- [[concepts/coding-standards-localization]] — locale data is a DATA-layer special case
- [[concepts/architecture-review-lessons]] — why data-in-code kept recurring

## References

[cite:1]: pplx://sessions/6af5d700-627e-42c6-b71f-6b92a4521aad
[cite:2]: https://github.com/tyohDeveloper/multiCalc/blob/main/artifacts/rpn-calc/CONVENTIONS.md
[cite:3]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.agents/memory/conversion-function-registry.md
