import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const expect = (condition, message) => {
  if (!condition) errors.push(message);
};
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const required = [
  "README.md", "LICENSE", "AGENTS.md", "PROJECT-CONTEXT.md", "CHANGELOG.md",
  "standards/architecture.md", "standards/coding.md", "standards/coding-core.md", "standards/profiles.md",
  "standards/bindings/typescript.md", "standards/bindings/rust.md", "standards/bindings/swift.md",
  "standards/bindings/kotlin.md", "standards/bindings/clojure.md", "standards/bindings/python.md",
  "standards/bindings/sql.md",
  "governance/authority-and-release.md", "governance/versioning.md",
  "reviews/architecture-review.md", "reviews/standards-compliance-review.md",
  "templates/STANDARDS-ADOPTION.json", "adoption/README.md",
  "docs/adr/0001-establish-standards-hub.md", "references/source-manifest.json",
  "releases/0.1.0.0.md",
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => ![".git", "node_modules"].includes(entry.name))
    .flatMap((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    });
}

for (const file of required) expect(fs.existsSync(path.join(root, file)), `Missing ${file}`);
const manifest = readJson("references/source-manifest.json");
expect(manifest.schemaVersion === 1, "Unsupported source manifest schema");
expect(manifest.authorityMigration === "pending-owner-review", "Authority migration needs explicit review");
for (const source of manifest.files) {
  const target = path.resolve(root, source.path);
  if (!target.startsWith(root + path.sep)) {
    errors.push(`Unsafe snapshot path: ${source.path}`);
    continue;
  }
  expect(/^[a-f0-9]{40}$/.test(source.sourceCommit), `Invalid source commit: ${source.path}`);
  expect(source.sourceUrl.includes(source.sourceCommit), `Unpinned source URL: ${source.path}`);
  if (!fs.existsSync(target)) {
    errors.push(`Missing snapshot: ${source.path}`);
    continue;
  }
  const bytes = fs.readFileSync(target);
  expect(bytes.length === source.bytes, `Byte length changed: ${source.path}`);
  const digest = crypto.createHash("sha256").update(bytes).digest("hex");
  expect(digest === source.sha256, `Snapshot hash changed: ${source.path}`);
}

const files = walk(root);
for (const file of files.filter((item) => item.endsWith(".md"))) {
  const relative = path.relative(root, file);
  if (relative.startsWith("references" + path.sep + "source-snapshots" + path.sep)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const link = match[1];
    if (/^(?:https?:|mailto:|#)/.test(link)) continue;
    const local = decodeURIComponent(link.split("#")[0]);
    expect(fs.existsSync(path.resolve(path.dirname(file), local)), `Broken link in ${relative}: ${link}`);
  }
}

for (const file of files.filter((item) => item.endsWith(".json"))) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    errors.push(`Invalid JSON: ${path.relative(root, file)}`);
  }
}
// Delivery profile (standards/profiles.md, ADR-0002) and language bindings (ADR-0003).
const profileDimensions = {
  state: ["none", "session", "browser-local", "device-durable", "hosted-durable", "shared-data"],
  packaging: ["single-file", "hosted-web", "native-shell", "server-cluster", "batch"],
  store: ["none", "blob-only", "sql+json", "sql+json+blob"],
  identity: ["none", "device-user", "seeded-owner", "authenticated"],
  network: ["none", "optional-refresh", "required"],
  compute: ["interactive", "kernel"]
};
const reservedValues = { state: ["shared-data"], packaging: ["server-cluster", "batch"], compute: ["kernel"] };
const bindingClasses = ["application", "platform-shell", "tooling", "analysis", "schema"];
const knownPorts = ["Store", "Blobs", "Files", "Secrets", "Jobs", "Identity"];
const localizationScopes = ["language", "numeric", "datetime"];
function validateLocalization(loc, file) {
  expect(loc && typeof loc === "object", `Missing profile.localization: ${file}`);
  if (!loc) return;
  const scope = loc.scope;
  const none = scope === "none" || (Array.isArray(scope) && scope.length === 0);
  if (!none) {
    expect(Array.isArray(scope) && scope.every((v) => localizationScopes.includes(v)),
      `Invalid localization.scope: ${file}`);
    expect(["dynamic", "static"].includes(loc.mode), `Invalid localization.mode "${loc.mode}": ${file}`);
    expect(loc.mode !== "static", `Reserved localization.mode "static": ${file}`);
    if (Array.isArray(scope) && scope.includes("language")) {
      expect(Array.isArray(loc.domains) && loc.domains.length > 0, `localization.domains required: ${file}`);
      expect(Array.isArray(loc.locales) && loc.locales.length > 0, `localization.locales required: ${file}`);
    }
  }
}
function validateProfile(record, file) {
  const profile = record.profile;
  expect(profile && typeof profile === "object", `Missing profile: ${file}`);
  if (!profile) return;
  for (const [dimension, values] of Object.entries(profileDimensions)) {
    const value = profile[dimension];
    expect(values.includes(value), `Invalid profile.${dimension} "${value}": ${file}`);
    expect(!(reservedValues[dimension] ?? []).includes(value), `Reserved profile.${dimension} "${value}": ${file}`);
  }
  if (profile.packaging === "native-shell") {
    expect(["swift", "tauri", "kotlin"].includes(profile.shell), `native-shell requires profile.shell: ${file}`);
  }
  validateLocalization(profile.localization, file);
  expect(Array.isArray(profile.ports), `Missing profile.ports: ${file}`);
  for (const port of profile.ports ?? []) {
    expect(port && knownPorts.includes(port.name), `Invalid port name "${port?.name}": ${file}`);
    expect(typeof port?.implementation === "string" && port.implementation.length > 0,
      `Port "${port?.name}" lacks implementation: ${file}`);
    if (port?.implementation !== "default") {
      expect(typeof port.reason === "string" && port.reason.length > 0,
        `Non-default port "${port.name}" lacks reason: ${file}`);
    }
  }
  expect(Array.isArray(record.bindings) && record.bindings.length > 0, `No bindings declared: ${file}`);
  for (const binding of record.bindings ?? []) {
    const bindingFile = path.join(root, "standards", "bindings", `${binding.language}.md`);
    expect(fs.existsSync(bindingFile), `No binding for language "${binding.language}": ${file}`);
    expect(bindingClasses.includes(binding.class), `Invalid binding class "${binding.class}": ${file}`);
    if (fs.existsSync(bindingFile)) {
      const declared = fs.readFileSync(bindingFile, "utf8").match(/^Class: (.+)$/m)?.[1] ?? "";
      expect(declared.includes(`\`${binding.class}\``),
        `Binding "${binding.language}" does not declare class "${binding.class}": ${file}`);
    }
  }
}
const adoptionFiles = files.filter((file) =>
  path.relative(root, file).startsWith("adoption" + path.sep) && file.endsWith(".json"));
for (const file of adoptionFiles) {
  const record = JSON.parse(fs.readFileSync(file, "utf8"));
  expect(record.status === "adopted", `Adoption not approved: ${file}`);
  expect(/^[a-f0-9]{40}$/.test(record.sourceCommit), `Unpinned adoption: ${file}`);
  for (const key of ["applicationRepository", "policyVersion", "approvedBy", "adoptedOn"]) {
    expect(typeof record[key] === "string" && !record[key].includes("<"), `Incomplete ${key}: ${file}`);
  }
  expect(Array.isArray(record.checks) && record.checks.length > 0, `No enforcement mapping: ${file}`);
  expect([1, 2].includes(record.schemaVersion), `Unsupported adoption schema: ${file}`);
  if (record.schemaVersion === 2) validateProfile(record, file);
}
const releaseIds = files.filter((file) => path.relative(root, file).startsWith("releases" + path.sep))
  .map((file) => path.basename(file, ".md"));
for (const id of releaseIds) expect(/^\d+\.\d+\.\d+\.\d+$/.test(id), `Invalid release ID: ${id}`);
expect(readJson("templates/STANDARDS-ADOPTION.json").status === "template", "Template claims adoption");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${required.length} required files, ${manifest.files.length} source hashes, ` +
    `${files.filter((file) => file.endsWith(".md")).length} Markdown files, and ${adoptionFiles.length} adoption records.`);
}
