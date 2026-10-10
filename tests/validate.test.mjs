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
