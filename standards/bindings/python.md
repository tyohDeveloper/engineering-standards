# Python Binding (Draft Stub)

Status: Draft stub (ADR-0003). Not normative. Becomes a proposed binding when the first component in this language is adopted.

Class: `tooling`. Applicability follows the `tooling` column in [coding-core.md](../coding-core.md); the rule matrix below is to be completed at that time.

## Purpose

Build, packaging, release and data-preparation utilities. Not shipped to users. A separate `python-analysis` binding would be added if Python is used for high-level scripting or analysis.

## Expected toolchain and mechanisms (proposed)

- Pinned interpreter and locked dependencies (`uv` or `pip-tools`).
- `ruff` (lint and format), `mypy --strict`, `pytest`.
- Inputs validated (pydantic or explicit checks) and exits with explicit codes and messages (C-15, C-17).
- Scripts are deterministic given inputs; time and randomness are parameters (C-3, C-23).
- Reference data in files, not literals (C-14). UTC and UUIDs (C-16).
- `pip-licenses` or equivalent inventory (C-26).

## Shell scripts

Shell is not a separate binding. It is permitted only as invocation glue: sequential commands, no branching, no data handling, no secrets handling. Anything beyond that is written in Python under this binding (ADR-0003 class boundary trigger).

## Rule matrix

To be completed. Until then, the `tooling` class column sets the minimum obligations.
