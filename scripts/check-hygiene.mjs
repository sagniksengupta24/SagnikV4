import fs from "node:fs";
import path from "node:path";
const forbiddenNames = new Set(["__MACOSX", ".DS_Store"]);
const generatedDirs = new Set(["node_modules", ".next", "playwright-report", "test-results"]);
const forbiddenExtensions = new Set([".zip", ".bak", ".tmp"]);
const findings = [];
const walk = (target) => {
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.name === ".git" || generatedDirs.has(entry.name)) continue;
    const full = path.join(target, entry.name);
    if (forbiddenNames.has(entry.name)) findings.push(full);
    else if (entry.isDirectory()) walk(full);
    else if (forbiddenExtensions.has(path.extname(entry.name))) findings.push(full);
  }
};
walk(process.cwd());
if (findings.length) { console.error(`Archive hygiene failed:\n${findings.join("\n")}`); process.exit(1); }
console.log("Archive hygiene passed.");
