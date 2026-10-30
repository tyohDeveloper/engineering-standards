---
id: concepts/repository-conventions
item_type: wiki_page
semantic_type: concept
title: Repository conventions
description: GitHub host, branch, licensing, README, gitignore, changelog, versioning, CI, commit, and author-attribution conventions applying to every tyohDeveloper repository.
created_at: '2026-08-08T12:35:00+00:00'
updated_at: '2026-08-08T17:51:00+00:00'
---
# Repository conventions

The repository-level half of [[concepts/coding-architecture-standards]] — where code lives, how it is licensed, what a repo must contain from its first commit, and how changes are committed and gated. These apply to every repository under the account regardless of deployment target or language[cite:2].

## What it is

A floor, not a style guide. Each rule below is a condition a repository either meets or does not, checkable by opening the repo: does a `LICENSE` exist, does the README state the build command, does CI run the same build as local, does `.gitignore` cover secrets. The distinction from the coding standards is scope — those govern what is inside a source file, these govern what surrounds it.

## Conventions

- **Architecture and rules live in the repository** — decisions, coding standards, and CI checks are kept in-repo (e.g., `docs/`) so any coding agent (Replit Agent, Claude, GPT) reads the same source of truth. This is the shared Replit-GitHub workflow described in [[projects/replit-github-development-workflow]][cite:2].
- **Terse commit messages, decomposed commits** — large changes are split into small commits with short subject lines. Reference commits `c9ad870` and `7215e1b` for the pattern[cite:3][cite:4].
- **Major implementation plans checkpointed in GitHub** before large build phases, so the plan is durable and reviewable outside the coding-agent session[cite:2].
- **Author attribution via GitHub noreply address** — because the user has email privacy enabled on GitHub, agent-authored commits use `50533494+tyohDeveloper@users.noreply.github.com` (the same address GitHub's web UI uses), so attribution shows correctly on the account.
- **GitHub is the canonical host** — all repos live under [tyohDeveloper](https://github.com/tyohDeveloper) on GitHub for the foreseeable future. Default branch is `main`. Repos are public by default unless there is a specific reason otherwise (MIT is meaningless on a private repo).
- **MIT license, always** — every new repo starts with a correctly formatted `LICENSE` file at the root (current year + `David Hoyt`) as the first or second commit. MIT is the standing choice for the foreseeable future.
- **Third-party license compatibility** — MIT is permissive and most JS/TS ecosystem dependencies are compatible. Flag GPL/AGPL dependencies as incompatible before adding. When non-trivial third-party code ships in the built artifact, keep a `THIRD_PARTY_LICENSES.md` (or equivalent) with attributions.
- **README as a contract, not marketing** — the minimum viable README states: one-line description of what the app does, a quickstart (`npm install && npm run dev`), the build command, the license line, and a link to the deployed instance if any. Longer READMEs are welcome but this floor is enforced.
- **`.gitignore` from the first commit** — include `node_modules/`, build outputs (`dist/`, `build/`), coverage, editor files (`.vscode/`, `.idea/`), OS junk (`.DS_Store`, `Thumbs.db`), and secrets (`.env*` except `.env.example`).
- **CHANGELOG discipline** — follow Keep-a-Changelog style once a repo has a tagged release. Dataset-versioned projects (like History at v2.1.0) already extend this pattern; app repos should adopt it at the first release, not retrofit.
- **Four-part versioning for anything tagged and released** — `MAJOR.MAJORFIX.MINORFIX.SPELLING`, significance falling left to right: major application or database change; major bug fixing, multi-file changes, minor UI changes; minor bug fixes; spelling. Deliberately not semver — semver encodes an API compatibility promise, and these apps have no API consumers, so it has one slot where this scheme needs three. OmniUnit already uses it at v5.0.0.0[cite:5]; History & Prehistory uses it on two independent tracks, app and data, tagged `<id>-app` and `<id>-data`. A leading digit is a readiness claim: History's app is 3.1.x.x because it works as intended while its data is 0.5.x.x because it is materially incomplete. Never tidy one track to match the other.
- **CI on `main` and PRs** — `.github/workflows/` runs the same build and tests that local `npm run build` runs. No merge without a green CI run[cite:1].
- **Repo topics** — tag each repo with a small set of topics (`tyoh-app`, deployment target, primary language) for discoverability across the GitHub account.

## See also

- [[concepts/coding-architecture-standards]] — the source of truth these support
- [[projects/replit-github-development-workflow]] — the coding-agent workflow these feed
- [[concepts/architecture-review-lessons]] — why CI gating matters

## References

[cite:1]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/blob/main/.github/workflows/build.yml
[cite:2]: pplx://sessions/3c8cdbce-cea3-4325-a2b1-3fbc1dcfecaf
[cite:3]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/commit/c9ad870
[cite:4]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/commit/7215e1b
[cite:5]: https://github.com/tyohDeveloper/OmniUnitConverter-Calculator/tree/v5.0.0.0
