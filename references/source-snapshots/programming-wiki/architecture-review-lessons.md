---
id: concepts/architecture-review-lessons
item_type: wiki_page
semantic_type: concept
title: Architecture review lessons
description: Meta-rules about applying and enforcing coding standards, derived from the August 2026 model-council architecture review of OmniUnit. Covers enforcement coverage, refactor sequencing, and why duplication is a defect rather than a style issue.
created_at: '2026-08-08T12:35:00+00:00'
updated_at: '2026-08-08T12:24:00+00:00'
---
# Architecture review lessons

Meta-rules for applying and enforcing [[concepts/coding-architecture-standards]], derived from the August 2026 model-council review of [[projects/omniunitconverter-calculator]] in which two models independently read the codebase against the then-stated standards[cite:1]. These generalize better than any individual size limit, because they describe how a standard fails in practice rather than what it requires.

## What it is

A set of nine observations about the gap between having standards and having them hold. The review's framing was that OmniUnit's foundation was sound and its problem was boundary erosion, not missing structure: the pure-function library honored every stated rule, while the controller and view layers accumulated the arithmetic, parsing, and formatting those rules forbade there[cite:1].

The distinction that matters: a standard is a claim about the whole codebase, but enforcement is always scoped to particular paths. Every lesson below is a consequence of that mismatch.

## Lessons

- **Enforcement that covers only the compliant layer is not enforcement.** The review's central finding: the size linter governed exactly the directory that already passed, while a 1,211-line pane holding arithmetic, parsing, and formatting was invisible to it. Coverage must be widest where violation is most likely — views and controllers — not where compliance is easiest to demonstrate. A rule with a scope carve-out around the messy part of the codebase is decoration.
- **Extract misplaced logic before splitting large files.** Splitting a file that is large *because* it contains logic belonging elsewhere just redistributes the violation across more files, and the resulting split reflects line counts rather than real responsibilities. Extract first, then split along the boundaries the extraction reveals.
- **A compliant decomposition must be actively protected.** Both models explicitly warned against "simplifying" the one-function-per-file pure layer back into fewer, larger files. Fine-grained decomposition looks like overhead to a reader encountering it cold; the standards exist partly to defend it from well-meaning re-consolidation. What not to change is as much a part of the standard as what to change.
- **Duplication drifts before anyone tries to change it.** The two implementations of the RPN operations had *already* diverged — differing prefix fields, differing precision defaults, and in the executed copy, silent rounding of odd exponents and dimension preservation where dimensionless input was required. The compliant copy was correct and unused; the violating copy was wrong and running. This is why §1.6 is a defect rule, not a style rule.
- **Purity is about reviewability, not just testability.** A dimensional policy buried in a 30-case switch cannot be reviewed. The same policy as a named pure function lets a reviewer or a test ask "what should this return for √(m³)?" and get an unambiguous answer.
- **The checker and the document cite each other.** Lint and verifier failure messages name the section number they enforce, and the enforcing script's header links back to the document. A developer hitting a failure should reach the rationale in one hop.
- **Dead code is a diagnostic, not just debris.** An `if`/`else` whose branches were identical had accumulated in the one file no linter or test inspected. Finding that class of defect is evidence of an enforcement blind spot, so the response is to fix the coverage, not only the line.
- **Platform workarounds relocate with their comments verbatim.** iOS-WebKit focus and blur handling is non-obvious, load-bearing, and expensive to rediscover. When such code moves during a refactor, the explanatory comments move unchanged with it — tidying them is how the knowledge gets lost.
- **Refactor history is worth keeping.** The phase-by-phase task records are superseded as normative statements but retained as the record of how the codebase reached its current shape. New standards cite that history rather than deleting it.

## See also

- [[concepts/coding-architecture-standards]] — the standards these lessons govern
- [[projects/omniunitconverter-calculator]] — the codebase reviewed
- [[concepts/coding-standards-data-layer]] — where the duplication rules land

## References

[cite:1]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/docs/perplexity/architecture-pass-council-synthesis.md
