const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");

(async () => {
  const destination = path.resolve("docs/launch/screens");
  await fs.mkdir(destination, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}),
  });
  const results = [];
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
      for (const route of ["/", "/install", "/developers", "/changelog"]) {
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
        if (route === "/") await page.locator("#living-library").screenshot({ path: path.join(destination, `${stem}-living-library.png`), animations: "disabled" });
        if (route === "/developers") await page.locator("#configs").screenshot({ path: path.join(destination, `${stem}-setup.png`), animations: "disabled" });
        const layout = await page.evaluate(() => ({
          viewportWidth: innerWidth,
          contentWidth: document.documentElement.scrollWidth,
          brokenImages: Array.from(document.images).filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
          title: document.title,
        }));
        const text = await page.locator("body").innerText();
        const result = { route, viewport, status: response.status(), consoleErrors, pageErrors, failedRequests, ...layout,
          hasVersion: /v3\.8\.0/i.test(text), screenshots: [`${stem}.png`, `${stem}-full.png`] };
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
