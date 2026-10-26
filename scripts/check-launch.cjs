let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require("E:/AI/projects/zing-site/node_modules/playwright-core")); }
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const release = require("../content/release.json");

(async () => {
  const destination = path.join(os.tmpdir(), "uoink-launch", `v${release.version}`);
  await fs.mkdir(destination, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const results = [];
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
      // Keep release verification offline; any attempted external request fails the check.
      await context.route("**/*", route => new URL(route.request().url()).origin === "http://127.0.0.1:4173"
        ? route.continue() : route.abort("blockedbyclient"));
      for (const route of ["/", "/install", "/developers", "/mcp", "/changelog"]) {
        const page = await context.newPage();
        const consoleErrors = [], pageErrors = [], failedRequests = [], cancelledMedia = [];
        page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
        page.on("pageerror", error => pageErrors.push(error.message));
        page.on("requestfailed", request => {
          const failure = { url: request.url(), error: request.failure()?.errorText };
          // Chromium may cancel a local media range once its buffer is filled.
          // These are accepted only after checking the response and decoded video below.
          if (request.resourceType() === 'media' && new URL(request.url()).origin === 'http://127.0.0.1:4173' && failure.error === 'net::ERR_ABORTED') cancelledMedia.push(failure);
          else failedRequests.push(failure);
        });
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
        const media = await page.locator('video').evaluateAll(videos => videos.map(video => ({ src: video.src, readyState: video.readyState, error: video.error?.message, width: video.videoWidth, height: video.videoHeight })));
        for (const video of media) {
          const check = await page.request.get(video.src, { headers: { Range: 'bytes=0-1023' } });
          if (check.status() !== 206 || !check.headers()['content-type']?.startsWith('video/') || !check.headers()['content-range']?.startsWith('bytes 0-1023/') || video.error || video.readyState < 2 || !video.width || !video.height) failedRequests.push({ url: video.src, error: 'Media range response or decoded frame check failed' });
        }
        for (const failure of cancelledMedia) if (!media.some(video => video.src === failure.url)) failedRequests.push(failure);
        const stem = `${route === "/" ? "home" : route.slice(1)}-${viewport.width}x${viewport.height}`;
        await page.screenshot({ path: path.join(destination, `${stem}.png`), animations: "disabled" });
        await page.screenshot({ path: path.join(destination, `${stem}-full.png`), fullPage: true, animations: "disabled" });
        if (route === "/") await page.locator("#u-flow").screenshot({ path: path.join(destination, `${stem}-hero.png`), animations: "disabled" });
        if (route === "/changelog") await page.locator("#living-library").screenshot({ path: path.join(destination, `${stem}-living-library.png`), animations: "disabled" });
        if (route === "/developers") await page.locator("#configs").screenshot({ path: path.join(destination, `${stem}-setup.png`), animations: "disabled" });
        const layout = await page.evaluate(() => ({
          viewportWidth: innerWidth,
          contentWidth: document.documentElement.scrollWidth,
          brokenImages: Array.from(document.images).filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
          title: document.title,
        }));
        const text = await page.locator("body").innerText();
        const result = { route, viewport, status: response.status(), consoleErrors, pageErrors, failedRequests, cancelledMedia, media, ...layout,
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
