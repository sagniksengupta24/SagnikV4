import { defineConfig, devices } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function discoverChromium() {
  const cache = join(homedir(), ".cache", "ms-playwright");
  if (existsSync(cache)) {
    const candidates = readdirSync(cache)
      .filter((name) => name.startsWith("chromium-") && !name.includes("headless"))
      .sort()
      .reverse();
    for (const name of candidates) {
      const candidate = join(cache, name, "chrome-linux64", "chrome");
      if (existsSync(candidate)) return candidate;
    }
  }
  return existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined;
}

const chromiumPath = discoverChromium();

const port = 4173;
const localURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || localURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: chromiumPath ? { executablePath: chromiumPath, args: ["--no-sandbox"] } : undefined,
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    // `next start` does not work with `output: "export"`.
    // Use the locally-installed `serve` package to host the static `out` directory.
    command: `node_modules/.bin/serve out -l ${port} --no-port-switching`,
    url: localURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
