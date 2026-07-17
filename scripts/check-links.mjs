import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDirs = ["app", "components"];
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
};
sourceDirs.forEach((dir) => walk(path.join(root, dir)));
const text = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const ids = new Set([...text.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
const hrefs = [...text.matchAll(/\bhref="([^"]+)"/g)].map((match) => match[1]);
const errors = [];
for (const href of hrefs) {
  if (href.startsWith("#") && !ids.has(href.slice(1))) errors.push(`Missing anchor target: ${href}`);
  if (/^https?:/.test(href)) {
    try { new URL(href); } catch { errors.push(`Invalid URL: ${href}`); }
  }
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Link check passed (${hrefs.length} static hrefs).`);
