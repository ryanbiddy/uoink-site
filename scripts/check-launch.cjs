const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const assert = require("node:assert/strict");
const release = require("../content/release.json");

(async () => {
  const destination = path.join(os.tmpdir(), "uoink-launch", `v${release.version}`);
  await fs.mkdir(destination, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}),
  });
  const results = [];
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 400, height: 844 }]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
      // Keep release verification offline; any attempted external request fails the check.
      await context.route("**/*", route => new URL(route.request().url()).origin === "http://127.0.0.1:4173"
        ? route.continue() : route.abort("blockedbyclient"));
      for (const route of ["/", "/install", "/developers", "/mcp", "/changelog"]) {
        const page = await context.newPage();
        const consoleErrors = [], pageErrors = [], failedRequests = [];
        page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
        page.on("pageerror", error => pageErrors.push(error.message));
        page.on("requestfailed", request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
        const response = await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        // Visit all sections so lazy product screenshots are present in the full-page capture.
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
            window.scrollTo(0, y);
            await new Promise(resolve => setTimeout(resolve, 45));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(400);
        const stem = `${route === "/" ? "home" : route.slice(1)}-${viewport.width}x${viewport.height}`;
        await page.screenshot({ path: path.join(destination, `${stem}.png`), animations: "disabled" });
        await page.screenshot({ path: path.join(destination, `${stem}-full.png`), fullPage: true, animations: "disabled" });
        if (route === "/") {
          for (const [id, name] of [["pull-from", "sources"], ["works-with", "ai"], ["living-library", "living-library"]]) {
            await page.locator(`#${id}`).screenshot({ path: path.join(destination, `${stem}-${name}.png`), animations: "disabled", style: ".site-header { visibility: hidden; }" });
          }
          assert.equal(await page.locator(".source-card").count(), 9);
          assert.equal(await page.locator("#works-with .home-card").count(), 5);
          assert.equal(await page.locator('.home-hero h1').innerText(), "Uoink that shit.");
          assert.equal(await page.locator('.home-hero .btn.primary').getAttribute("href"), `https://github.com/ryanbiddy/uoink/releases/download/v${release.version}/Uoink-Setup-${release.version}.exe`);
          assert.equal(await page.locator('#works-with a.arr-link').getAttribute("href"), "/developers");
          if (viewport.width === 400) {
            const columns = await page.locator(".source-grid").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
            assert.equal(columns, 1, "Source cards stack on phones");
          }
          const clipped = await page.locator(".home-card, .client-chip").evaluateAll(elements => elements.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.left < 0 || rect.right > innerWidth || el.scrollWidth > el.clientWidth + 1;
          }).map(el => el.textContent));
          assert.deepEqual(clipped, [], "No clipped cards or client names");
          await page.locator("#works-with a.arr-link").focus();
          await page.keyboard.press("Tab");
          const focus = await page.evaluate(() => ({ tag: document.activeElement.tagName, outline: getComputedStyle(document.activeElement).outlineStyle }));
          assert.equal(focus.tag, "A");
          assert.notEqual(focus.outline, "none", "Keyboard links have a visible focus ring");
          await page.evaluate(() => document.activeElement.blur());
          // This site has a single light palette. Check that an OS dark preference
          // keeps its colors and content intact, without inventing a second theme.
          const lightColors = await page.locator(".home-card").first().evaluate(el => [getComputedStyle(el).backgroundColor, getComputedStyle(el).color]);
          await page.emulateMedia({ colorScheme: "dark" });
          const darkColors = await page.locator(".home-card").first().evaluate(el => [getComputedStyle(el).backgroundColor, getComputedStyle(el).color]);
          assert.deepEqual(darkColors, lightColors);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({ path: path.join(destination, `${stem}-dark-preference.png`), fullPage: true, animations: "disabled" });
          await page.emulateMedia({ colorScheme: "light" });
        }
        if (route === "/developers") await page.locator("#configs").screenshot({ path: path.join(destination, `${stem}-setup.png`), animations: "disabled" });
        const layout = await page.evaluate(() => ({
          viewportWidth: innerWidth,
          contentWidth: document.documentElement.scrollWidth,
          brokenImages: Array.from(document.images).filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
          title: document.title,
        }));
        const text = await page.locator("body").innerText();
        const result = { route, viewport, status: response.status(), consoleErrors, pageErrors, failedRequests, ...layout,
          hasVersion: text.includes(`v${release.version}`), screenshots: [`${stem}.png`, `${stem}-full.png`] };
        results.push(result);
        console.log(JSON.stringify(result));
        await page.close();
      }
      await context.close();
    }
  } finally { await browser.close(); }
  await fs.writeFile(path.join(destination, "results.json"), JSON.stringify(results, null, 2) + "\n");
  if (results.some(r => r.status !== 200 || r.consoleErrors.length || r.pageErrors.length || r.failedRequests.length || r.brokenImages.length || r.contentWidth > r.viewport.width || !r.hasVersion)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
