import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fixture(t) {
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), "standards-validation-"));
  fs.cpSync(root, destination, {
    recursive: true,
    filter: (source) => ![".git", "node_modules"].includes(path.basename(source)),
  });
  t.after(() => fs.rmSync(destination, { recursive: true, force: true }));
  return destination;
}

function run(directory) {
  return spawnSync(process.execPath, ["tools/validate.mjs"], {
    cwd: directory,
    encoding: "utf8",
  });
}

test("unchanged scaffold passes", () => {
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
});

test("modified historical snapshot fails", (t) => {
  const directory = fixture(t);
  fs.appendFileSync(path.join(directory,
    "references/source-snapshots/history-and-prehistory/CODING-STANDARDS.md"), "\nchanged\n");
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Snapshot hash changed/);
});

test("broken local Markdown link fails", (t) => {
  const directory = fixture(t);
  fs.appendFileSync(path.join(directory, "README.md"), "\n[missing](missing.md)\n");
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Broken link/);
});

test("unapproved application adoption fails", (t) => {
  const directory = fixture(t);
  const template = fs.readFileSync(path.join(directory, "templates/STANDARDS-ADOPTION.json"));
  fs.writeFileSync(path.join(directory, "adoption/unapproved.json"), template);
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Adoption not approved/);
});

test("unsafe source snapshot paths fail", (t) => {
  const directory = fixture(t);
  const target = path.join(directory, "references/source-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(target, "utf8"));
  manifest.files[0].path = "../outside.md";
  fs.writeFileSync(target, JSON.stringify(manifest));
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unsafe snapshot path/);
});

function adoptionV2(overrides = {}) {
  return JSON.stringify({
    schemaVersion: 2, status: "adopted", applicationRepository: "tyohDeveloper/example",
    policyVersion: "0.1.0.0", sourceRepository: "https://github.com/tyohDeveloper/engineering-standards",
    sourceCommit: "a".repeat(40), approvedBy: "owner", adoptedOn: "2026-10-30",
    profile: { state: "session", packaging: "single-file", store: "blob-only", identity: "none",
      network: "none", compute: "interactive", localization: { scope: "none" },
      ports: [{ name: "Blobs", implementation: "default" }, { name: "Files", implementation: "default" }] },
    bindings: [{ language: "typescript", class: "application" }],
    checks: [{ requirement: "C-2", command: "npm run lint", enforcement: "automated" }],
    ...overrides,
  });
}

test("schema 2 adoption with valid profile passes", (t) => {
  const directory = fixture(t);
  fs.writeFileSync(path.join(directory, "adoption/example.json"), adoptionV2());
  const result = run(directory);
  assert.equal(result.status, 0, result.stderr);
});

test("reserved profile value fails", (t) => {
  const directory = fixture(t);
  fs.writeFileSync(path.join(directory, "adoption/example.json"), adoptionV2({
    profile: { state: "shared-data", packaging: "single-file", store: "none", identity: "none",
      network: "none", compute: "interactive", localization: { scope: "none" }, ports: [] },
  }));
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Reserved profile\.state/);
});

test("non-default port without reason fails", (t) => {
  const directory = fixture(t);
  fs.writeFileSync(path.join(directory, "adoption/example.json"), adoptionV2({
    profile: { state: "session", packaging: "single-file", store: "blob-only", identity: "none",
      network: "none", compute: "interactive", localization: { scope: "none" }, ports: [{ name: "Blobs", implementation: "indexeddb" }] },
  }));
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Non-default port "Blobs" lacks reason/);
});

test("language localization without domains fails", (t) => {
  const directory = fixture(t);
  fs.writeFileSync(path.join(directory, "adoption/example.json"), adoptionV2({
    profile: { state: "none", packaging: "single-file", store: "none", identity: "none", network: "none",
      compute: "interactive", localization: { scope: ["language", "numeric"], mode: "dynamic", locales: ["en"] },
      ports: [] },
  }));
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /localization\.domains required/);
});

test("OmniUnit-shaped localization passes", (t) => {
  const directory = fixture(t);
  fs.writeFileSync(path.join(directory, "adoption/example.json"), adoptionV2({
    profile: { state: "none", packaging: "single-file", store: "none", identity: "none", network: "none",
      compute: "interactive", ports: [],
      localization: { scope: ["language", "numeric"], mode: "dynamic", domains: ["ui", "units"],
        locales: ["en", "en-us", "de", "es", "fr", "it", "ja", "ko", "ar"] } },
  }));
  const result = run(directory);
  assert.equal(result.status, 0, result.stderr);
});

test("undeclared language binding fails", (t) => {
  const directory = fixture(t);
  fs.writeFileSync(path.join(directory, "adoption/example.json"),
    adoptionV2({ bindings: [{ language: "cobol", class: "application" }] }));
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /No binding for language "cobol"/);
});

test("binding class not declared by binding file fails", (t) => {
  const directory = fixture(t);
  fs.writeFileSync(path.join(directory, "adoption/example.json"),
    adoptionV2({ bindings: [{ language: "swift", class: "application" }] }));
  const result = run(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not declare class "application"/);
});

test("rust declared as platform-shell passes", (t) => {
  const directory = fixture(t);
  fs.writeFileSync(path.join(directory, "adoption/example.json"),
    adoptionV2({ bindings: [{ language: "rust", class: "platform-shell" }, { language: "sql", class: "schema" }] }));
  const result = run(directory);
  assert.equal(result.status, 0, result.stderr);
});
