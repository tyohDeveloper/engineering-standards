# Lifecycle Reading List

Status: draft, non-normative. Order matters: read each block when the lifecycle work reaches its stages, not all at once.

Last reviewed: 2026-11-03.

For learning Claude and Claude Code from concepts to daily use, start with [reading-guide.html](reading-guide.html). This file keys sources to lifecycle stages.

## Read now: mental model and Stage 1

| # | Reading | Why |
|---|---|---|
| 1 | [Claude Code overview](https://code.claude.com/docs/en/overview.md) | What Claude Code is |
| 2 | [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works.md) | Agent loop, tools, context |
| 3 | [Extend Claude Code](https://code.claude.com/docs/en/features-overview.md) | When to use a skill, a hook, a subagent or a plugin |
| 4 | [Best practices](https://code.claude.com/docs/en/best-practices.md) | Habits that keep agent output reliable |
| 5 | [Model configuration](https://code.claude.com/docs/en/model-config) | `opusplan` and model aliases, the basis for model-level assignment per stage |
| 6 | [Lean Canvas (Rework)](https://resources.rework.com/libraries/strategic-management/lean-canvas) | Basis for the Stage 1 concept page: one page, each entry a hypothesis tagged guess or tested |

## Read at engineering and CI stages

| # | Reading | Why |
|---|---|---|
| 7 | [Claude Code in the cloud](https://code.claude.com/docs/en/claude-code-on-the-web.md) | iPad path: describe a task, get a pull request |
| 8 | [Projects](https://code.claude.com/docs/en/claude-projects.md) | Running related tasks in parallel |
| 9 | [Memory](https://code.claude.com/docs/en/memory.md) | How repository files become the agent's standing context |
| 10 | [Code Review](https://code.claude.com/docs/en/code-review.md) | Automatic review of every pull request |
| 11 | [GitHub Actions](https://code.claude.com/docs/en/github-actions.md) | The CI stage |

## Read at the standards-plugin stage

| # | Reading | Why |
|---|---|---|
| 12 | [Plugins overview](https://code.claude.com/docs/en/plugins/overview.md) | Packaging standards as a versioned plugin |
| 13 | [Skills](https://code.claude.com/docs/en/skills.md) | Plugin component: reusable procedures |
| 14 | [Hooks guide](https://code.claude.com/docs/en/hooks-guide.md) | Plugin component: where enforcement happens |
| 15 | [Subagents](https://code.claude.com/docs/en/sub-agents.md) | Plugin component: per-agent `model` field (`sonnet`, `opus`, `fable`) |
| 16 | [Plugin evals](https://code.claude.com/docs/en/plugin-evals.md) | Tests that block CI when the plugin misbehaves |
| 17 | [Dynamic workflows](https://code.claude.com/docs/en/workflows.md) | Audits across all applications at once |

## Skip until needed

IDE extensions, marketplaces, admin and managed settings, troubleshooting.

## Not covered by Claude Code documentation

Business concept, business process and process integration, and the outer requirements layer are methodology owned by this hub. Their sources are added here as each stage is designed.

## Maintenance

Add an entry when lifecycle work relies on a new source. Keep the order and the stage grouping. Remove nothing silently: mark superseded entries and say what replaced them.
