import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const roots = ["app", "components", "data", "public", "tests", "README.md", "UPGRADE_NOTES.md", "VALIDATION_REPORT.md"];
const blockedFingerprints = new Set([
  "8ca35f228d71a2f45206ef82386894581a53f6d5b7a60dba11bdf628ac649fb2",
  "a9ac600e5ff734757d1dcb5ac744be5c64f5ba30a655d2ad6eabea2f8864b456",
  "dc3d9c4e9e4c62df1cbe3bed4381ab1059ee09086bacecc2265abfabed6caf0d",
  "547a43522dbc3e4c4ef161cebd9b275907b852fedc6a4d63a59f1cbc3be8c09a",
  "a6dd1eb1474dfebbcece01a5a1747db27dbb375749fea74c25c3ce1ba9a34820",
  "6370a9b035ec5792e446656ca3d92ab835fd3573f08c3987c70305245f77f289",
  "b881417d9d4440ff0db13d2ee0d847941e123a3399264e9887882f94fcbfeaa4",
]);
const findings = [];
const fingerprint = (value) => crypto.createHash("sha256").update(value).digest("hex");
const candidatesFor = (text) => {
  const tokens = text
    .toLowerCase()
    .match(/[a-z0-9.+%-]+(?:-[a-z0-9.+%-]+)*/g) ?? [];
  const candidates = new Set(tokens);
  for (let index = 0; index < tokens.length; index += 1) {
    for (let size = 2; size <= 5 && index + size <= tokens.length; size += 1) {
      candidates.add(tokens.slice(index, index + size).join(" "));
    }
  }
  return candidates;
};
const scanFile = (full) => {
  const buffer = fs.readFileSync(full);
  if (buffer.includes(0)) return;
  const text = buffer.toString("utf8");
  candidatesFor(text).forEach((candidate) => {
    const hash = fingerprint(candidate);
    if (blockedFingerprints.has(hash)) findings.push(`${path.relative(process.cwd(), full)} contains blocked fingerprint ${hash.slice(0, 12)}`);
  });
};
const walk = (target) => {
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    scanFile(target);
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) walk(full);
    else scanFile(full);
  }
};
roots.forEach((target) => walk(path.join(process.cwd(), target)));
if (findings.length) { console.error(findings.join("\n")); process.exit(1); }
console.log("Confidentiality scan passed.");
