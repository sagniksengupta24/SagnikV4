import fs from "node:fs";
const required = ["app/icon.svg", "app/apple-icon.png", "app/opengraph-image.tsx", "app/robots.ts", "app/sitemap.ts", "app/not-found.tsx", "app/error.tsx"];
const missing = required.filter((file) => !fs.existsSync(file));
const layout = fs.readFileSync("app/layout.tsx", "utf8");
for (const token of ["openGraph", "twitter", "alternates", "application/ld+json", "themeColor"]) if (!layout.includes(token)) missing.push(`layout token: ${token}`);
if (missing.length) { console.error(`Metadata check failed:\n${missing.join("\n")}`); process.exit(1); }
console.log("Metadata check passed.");
