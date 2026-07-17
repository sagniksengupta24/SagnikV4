import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const viewports = [
  { width: 320, height: 760 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`no overflow or runtime errors at ${viewport.width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
    await expect(page.locator("h1")).toContainText("I build AI systems");
    await expect(page.locator("#private-ai-system")).toBeVisible();
  });
}

test("keyboard navigation and skip link work", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("reduced motion remains readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-reveal]").first()).toBeVisible();
  await expect(page.locator(".verification-core-shell canvas")).toHaveCount(0);
});

test("critical accessibility scan", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("flagship interactions remain usable", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const walkForward = page.getByRole("tab", { name: /Walk-forward testing/i });
  await walkForward.click();
  await expect(walkForward).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("The model only earns confidence on future periods it did not train on.")).toBeVisible();

  const verifyStep = page.getByRole("button", { name: /Verify Deterministic checks/i });
  await verifyStep.click();
  await expect(verifyStep).toHaveAttribute("aria-pressed", "true");

  const replayButton = page.getByRole("button", { name: /Pause replay|Play replay/i });
  await expect(replayButton).toBeVisible();
  await replayButton.click();
  await expect(replayButton).toHaveText(/Play replay|Pause replay/);
});

test("landing page keeps the intended narrative structure", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link")).toHaveCount(4);
  await expect(page.locator("#work")).toBeVisible();
  await expect(page.locator("#experiments")).toBeVisible();
  await expect(page.locator("#capabilities")).toBeVisible();
  await expect(page.locator("#method")).toBeVisible();
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
});

test("mobile composition and navigation remain intentional", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const titleBox = await page.locator("h1").boundingBox();
  expect(titleBox).not.toBeNull();
  expect((titleBox?.x ?? 0) + (titleBox?.width ?? 0)).toBeLessThanOrEqual(390);
  await expect(page.locator(".verification-core-shell")).toBeHidden();
  await expect(page.locator(".hero-mobile-core")).toBeVisible();

  const menuButton = page.getByRole("button", { name: "Toggle navigation" });
  await menuButton.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);
  await expect(menuButton).toBeFocused();
});
