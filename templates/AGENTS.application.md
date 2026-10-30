# Application Agent Contract

Read the repository's README, architecture, adopted standards, ADRs, and exception manifests before implementation. Establish their versions and applicable target.

Inspect the actual code before selecting tooling. Keep domain computation pure and single-sourced, effect sequencing explicit, and names responsibility-based according to the adopted policy.

Checkpoint substantial plans before build phases. Use terse/decomposed commits and run the actual repository checks.

Do not silently change standards versions, data meaning, mandated bindings, architecture ownership, or exceptions. Reviews do not authorize remediation.

## Delivery profile directives (fill from STANDARDS-ADOPTION.json)

- Profile: state `<value>`, packaging `<value>`, store `<value>`, identity `<value>`, network `<value>`, compute `<value>`. Rules bound to these values are in `standards/profiles.md` §3 of the hub; apply them without re-deriving.
- Ports used: `<Store | Blobs | Files | Secrets | Jobs | Identity>`. PURE, STATE and DATA modules import none of them; CONTROLLER mediates.
- Bindings: `<language>:<class>` pairs from the adoption record (classes: application, platform-shell, tooling, analysis, schema). Follow `standards/bindings/<language>.md` for how each core rule `C-n` is checked; the class column in `coding-core.md` sets which rules are mandatory. Domain calculation outside an application binding is ported, never excepted. Shell is invocation glue only.
- Boundaries between bindings have one schema source (C-30). No secrets in code, config, logs or fixtures (C-31).
- Single-file packaging: no embedded database engine. Native-shell packaging: no remotely loaded code; back up before migrating when state is device-durable. Hosted with seeded-owner identity: an access gate must exist.
- Editions of this application with other packagings are separate models; do not add synchronization.

Replace this template with the actual paths, values and commands for the application; do not leave it as an unbound generic instruction.
