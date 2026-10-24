// Run after npm run build. No test dependency is added to the site.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch { ({ chromium } = require("E:/AI/projects/zing-site/node_modules/playwright-core")); }

const root = path.resolve(__dirname, "..");
const out = path.join(root, "out");
const shots = path.join(root, "_scratch/shots-family");
fs.mkdirSync(shots, { recursive: true });
const referenceRoot = process.env.FAMILY_REFERENCE_ROOT || "E:/AI/projects/uoink/handoff/suite-split/family-web-2026-10";
const reference = fs.readFileSync(path.join(referenceRoot, "out/the-pick.html"), "utf8");
const referenceCSS = fs.readFileSync(path.join(referenceRoot, "src/pick.css"), "utf8");
const home = fs.readFileSync(path.join(out, "index.html"), "utf8");
const cssLinks = [...home.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].map(m => m[0]).join("");
const htmlClass = home.match(/<html[^>]*class="([^"]+)"/)[1];
// Render the real, intentionally unmounted component only in this local test server.
const ts = require("typescript");
require.extensions[".tsx"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { SavedSourceCard } = require("../app/components/SavedSourceCard.tsx");
const { FamilyWordmark } = require("../app/components/FamilyWordmark.tsx");
const actualCard = renderToStaticMarkup(React.createElement(SavedSourceCard));
// The reference shows review footage; this public repo uses the neutral manifest
// entry, so swap in the manifest's text and compare layout, not content.
const media = require("../app/content/family-media.json").savedSource;
const referenceCard = reference.match(/<div class="saved-source"[^>]*><img[^>]*><div class="source-meta">[\s\S]*?<\/div><\/div>/)[0]
  .replace('data-image="source"', 'src="/assets/family/source.jpg"')
  .replace(/ThursdAI \/ Swyx/g, media.title)
  .replace(/alt="[^"]*"/, `alt="${media.thumbnailAlt}"`);
function fixture(isReference, marks = false) {
  const specimens = ["cream", "ink", "field"].flatMap(ground => [96, 48, 28, 16].flatMap(cap => ["u", "z"].map(brand =>
    `<div style="padding:20px;overflow:auto;background:${ground === "cream" ? "#FFF4EC" : ground === "ink" ? "#0A0A0A" : brand === "u" ? "#C2410C" : "#002C9B"}">${renderToStaticMarkup(React.createElement(FamilyWordmark, { brand, cap, ground }))}</div>`))).join("");
  return `<!doctype html><html class="${htmlClass}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${cssLinks}${isReference ? `<style>${referenceCSS}</style>` : ""}
    <style>body{margin:0;font-family:var(--font-inter),Arial,sans-serif}.sample{padding:20px;width:390px;max-width:100%;background:#FFF4EC}.sample.blue{background:#002C9B}</style></head>
    <body>${marks ? specimens : `<div class="sample">${isReference ? referenceCard : actualCard}</div><div class="sample blue">${isReference ? referenceCard : actualCard}</div>`}</body></html>`;
}
const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".woff": "font/woff", ".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (pathname.startsWith("/__family-")) { res.setHeader("Content-Type", "text/html"); res.end(fixture(pathname.includes("reference"), pathname.includes("marks"))); return; }
  let file = path.resolve(out, "." + pathname);
  if (!file.startsWith(out + path.sep) && file !== out) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file + ".html")) file += ".html";
  else if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]); }
const routes = walk(out).filter(f => f.endsWith(".html") && fs.readFileSync(f, "utf8").includes('class="site-header family-header"'))
  .map(f => "/" + path.relative(out, f).replaceAll("\\", "/").replace(/index\.html$/, "").replace(/\.html$/, ""));
const results = [], pixels = [], errors = [];
const yellow = "rgb(255, 210, 63)";

async function captureYellow(page, file, fullPage = false) {
  const samples = await page.evaluate(fullPage => [...document.querySelectorAll(".yellow-detail, .u-tip-l, .u-tip-s, .charge-handle i")].flatMap(el => {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    if (s.display === "none" || s.visibility === "hidden" || !r.width || !r.height || (!fullPage && (r.top < 0 || r.bottom > innerHeight))) return [];
    const fractions = el.classList.contains("u-tips") ? [.16, .84] : [.5];
    return fractions.map(f => ({ x: Math.floor(r.x + r.width * f), y: Math.floor(r.y + r.height / 2), color: el.tagName === "I" ? s.backgroundColor : s.fill }))
      .filter(point => {
        if (fullPage) return true;
        // A sticky header can cover an otherwise onscreen mark.
        const top = document.elementFromPoint(point.x, point.y);
        return top && (el.contains(top) || top.contains(el));
      });
  }), fullPage);
  for (const sample of samples) assert.equal(sample.color, yellow);
  await page.screenshot({ path: path.join(shots, file), fullPage });
  pixels.push({ file, samples });
}

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const width of [1440, 390]) for (const colorScheme of ["light", "dark"]) {
      const stem = `${width}-${colorScheme}`;
      const profile = fs.mkdtempSync(path.join(shots, "chrome-profile-"));
      const context = await chromium.launchPersistentContext(profile, {
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true,
        viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1,
        colorScheme, isMobile: width === 390, hasTouch: width === 390, serviceWorkers: "block",
        args: ["--disable-background-networking", "--disable-component-update", "--no-first-run"],
      });
      await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort("blockedbyclient"));
      const page = await context.newPage();
      page.on("pageerror", error => errors.push(error.message));
      const measurements = [];
      try {
        for (const route of routes) {
          await page.goto(origin + route, { waitUntil: "load" });
          await page.evaluate(() => document.fonts.ready);
          const m = await page.evaluate(() => {
            const visible = el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
            return {
              header: document.querySelector(".family-header").getBoundingClientRect().height,
              cap: document.querySelector(".brand-link .letter-body-path").getBoundingClientRect().height,
              overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
              footer: document.querySelectorAll(".family-footer").length,
              footerWordmarks: document.querySelectorAll('.site-footer .family-wordmark[data-brand="u"], .site-footer .wm-line, .home-end .wm-line').length,
              stripWordmarks: document.querySelectorAll('.family-footer .family-wordmark[data-brand="u"]').length,
              closingLine: document.querySelector('.site-footer > [data-final-cta]')?.textContent.trim(),
              cards: document.querySelectorAll(".saved-source").length,
              buttons: [...document.querySelectorAll("button, .btn, .nav-cta, .button")].filter(visible).map(el => {
                const s = getComputedStyle(el);
                return { text: el.textContent.trim(), height: el.getBoundingClientRect().height, radius: s.borderRadius, padding: s.padding, size: s.fontSize, weight: s.fontWeight, line: s.lineHeight };
              }),
              yellows: [...document.querySelectorAll(".yellow-detail, .u-tip-l, .u-tip-s")].filter(visible).map(el => getComputedStyle(el).fill),
            };
          });
          assert.equal(m.header, 120, `${stem} ${route}: header`);
          assert(Math.abs(m.cap - 24) < .01, `${stem} ${route}: cap ${m.cap}`);
          assert.equal(m.overflow, 0, `${stem} ${route}: overflow`);
          assert.equal(m.footer, 1); assert.equal(m.cards, 0);
          assert.equal(m.footerWordmarks, 1, `${stem} ${route}: exactly one UOINK wordmark in footer area`);
          assert.equal(m.stripWordmarks, 1, `${stem} ${route}: footer wordmark belongs to family strip`);
          assert.equal(m.closingLine, "Take the video. Make it usable.");
          for (const b of m.buttons) {
            assert.equal(b.height, 48, `${stem} ${route}: ${b.text} height`);
            assert.equal(b.radius, "10px", `${stem} ${route}: ${b.text} radius`);
            assert.equal(b.padding, "12px 16px", `${stem} ${route}: padding`);
            assert.equal(b.size, "14px"); assert.equal(b.weight, "700"); assert.equal(b.line, "22px");
          }
          for (const fill of m.yellows) assert.equal(fill, yellow);
          measurements.push({ route, ...m });
        }
        await page.goto(origin, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await captureYellow(page, `header-${stem}.png`);
        const cta = page.locator(".site-header-top .nav-cta");
        await cta.hover();
        await page.waitForTimeout(200);
        assert.equal(await cta.evaluate(el => getComputedStyle(el).backgroundColor), width === 390 ? "rgb(194, 65, 12)" : "rgb(155, 45, 14)");
        await page.keyboard.press("Tab"); await cta.focus();
        assert.equal(await cta.evaluate(el => getComputedStyle(el).outlineWidth), "3px");
        const secondary = page.locator("main .btn.ghost").first();
        await secondary.hover(); await page.waitForTimeout(200);
        assert.equal(await secondary.evaluate(el => getComputedStyle(el).backgroundColor), width === 390 ? "rgb(255, 244, 236)" : "rgb(234, 217, 204)");
        await page.keyboard.press("Tab"); await secondary.focus();
        assert.equal(await secondary.evaluate(el => getComputedStyle(el).outlineWidth), "3px");
        await page.locator(".family-footer").scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        const handle = page.locator(".charge-handle");
        const before = await handle.boundingBox();
        await captureYellow(page, `footer-viewport-${stem}.png`);
        await page.locator(".site-footer").screenshot({
          path: path.join(shots, `footer-rest-${stem}.png`),
          // Keep the sticky header from covering the footer in the element capture.
          style: ".site-header { visibility: hidden !important; }",
        });
        if (width === 390) await page.getByRole("button", { name: "Send the charge" }).tap();
        else await page.getByRole("button", { name: "Send the charge" }).click();
        await page.waitForTimeout(400);
        assert.equal(await handle.getAttribute("aria-valuenow"), "100");
        const after = await handle.boundingBox();
        const movement = before.x - after.x;
        assert(movement > 170, "Tap must move the charge into Uoink");
        await captureYellow(page, `footer-sent-${stem}.png`);
        await handle.focus(); await page.keyboard.press("Home"); await page.waitForTimeout(400);
        assert.equal(await handle.getAttribute("aria-valuenow"), "0");
        await page.keyboard.press("End"); await page.waitForTimeout(400);
        assert.equal(await handle.getAttribute("aria-valuenow"), "100");
        assert.equal(await handle.evaluate(el => getComputedStyle(el).outlineWidth), "3px");
        await page.keyboard.press("ArrowRight"); await page.waitForTimeout(400);
        // Exercise pointer capture with a real mouse or CDP touch sequence.
        const b = await handle.boundingBox();
        const u = await page.locator('.family-footer [data-brand="u"]').boundingBox();
        const start = { x: b.x + 24, y: b.y + 24 }, end = { x: u.x + 17, y: u.y + 28 };
        if (width === 390) {
          const cdp = await context.newCDPSession(page);
          await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
          for (let i = 1; i <= 12; i++) {
            // Realistic gesture timing avoids Chromium treating instant moves as a fling.
            await page.waitForTimeout(20);
            await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + (end.x - start.x) * i / 12, y: start.y + (end.y - start.y) * i / 12 }] });
          }
          await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
          await cdp.detach();
        } else {
          await page.mouse.move(start.x, start.y); await page.mouse.down(); await page.mouse.move(end.x, end.y, { steps: 12 }); await page.mouse.up();
        }
        await page.waitForTimeout(400);
        assert.equal(await handle.getAttribute("aria-valuenow"), "100", "Drag must land in Uoink");
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.getByRole("button", { name: "Send it back" }).click();
        assert.equal(await handle.getAttribute("aria-valuenow"), "0");
        const reducedStart = await handle.boundingBox();
        await page.getByRole("button", { name: "Send the charge" }).click();
        const reducedEnd = await handle.boundingBox();
        assert(reducedStart.x - reducedEnd.x > 170, "Reduced motion completes immediately");
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.getByRole("button", { name: "Send it back" }).click();
        await page.emulateMedia({ reducedMotion: "reduce" });
        const interrupted = await handle.boundingBox();
        await page.waitForTimeout(400);
        assert.deepEqual(await handle.boundingBox(), interrupted, "Preference change cancels active motion");
        if (width === 390) {
          await page.evaluate(() => scrollTo(0, 0));
          await page.waitForTimeout(150);
          await page.getByRole("button", { name: "Open menu" }).tap();
          await page.locator(".mobile-menu").waitFor({ state: "visible" });
          await page.waitForTimeout(400);
          await page.screenshot({ path: path.join(shots, `menu-${stem}.png`) });
          const menuButtons = await page.locator(".mobile-menu button, .mobile-menu .nav-cta").evaluateAll(elements => elements.map(el => {
            const s = getComputedStyle(el);
            return { height: el.getBoundingClientRect().height, radius: s.borderRadius, padding: s.padding };
          }));
          for (const b of menuButtons) assert.deepEqual(b, { height: 48, radius: "10px", padding: "12px 16px" });
          assert.equal(await page.locator(".mobile-menu").getAttribute("aria-hidden"), "false");
          await page.keyboard.press("Escape");
          await page.locator(".mobile-menu").waitFor({ state: "hidden" });
          assert.equal(await page.locator(".mobile-menu").getAttribute("aria-hidden"), "true");
          assert(await page.getByRole("button", { name: "Open menu" }).evaluate(el => el === document.activeElement));
        }
        for (const variant of ["actual", "reference"]) {
          await page.goto(`${origin}/__family-${variant}`, { waitUntil: "networkidle" });
          await page.evaluate(() => document.fonts.ready);
          const cards = page.locator(".saved-source");
          for (let i = 0; i < 2; i++) {
            const rect = await cards.nth(i).boundingBox();
            assert.equal(rect.width, 350); assert.equal(rect.height, 112);
            await cards.nth(i).screenshot({ path: path.join(shots, `card-${variant}-${i}-${stem}.png`) });
          }
        }
        await page.goto(`${origin}/__family-marks`, { waitUntil: "networkidle" });
        await captureYellow(page, `marks-${stem}.png`, true);
        results.push({ width, colorScheme, routes: measurements.length, buttons: measurements.reduce((n, m) => n + m.buttons.length, 0), movement, tap: "pass", drag: "pass", keyboard: "pass", reducedMotion: "pass", measurements });
        console.log(`PASS ${stem}: ${measurements.length} routes, header 120, cap 24, buttons 48/10, tap ${movement.toFixed(2)}px; drag, keyboard, reduced motion.`);
      } finally { await context.close(); }
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(shots, "yellow-samples.json"), JSON.stringify(pixels));
    const pixelCheck = spawnSync("python", ["-c", `
import json,pathlib
from PIL import Image,ImageChops
p=pathlib.Path(${JSON.stringify(shots)})
samples=json.loads((p/'yellow-samples.json').read_text())
n=0
for capture in samples:
 im=Image.open(p/capture['file']).convert('RGB')
 for s in capture['samples']:
  color=im.getpixel((s['x'],s['y']))
  assert color==(255,210,63),(capture['file'],s,color)
  n+=1
for width in [1440,390]:
 for theme in ['light','dark']:
  actual=Image.open(p/f'card-actual-0-{width}-{theme}.png').convert('RGBA')
  for variant,i in [('actual',1),('reference',0),('reference',1)]:
   other=Image.open(p/f'card-{variant}-{i}-{width}-{theme}.png').convert('RGBA')
   assert ImageChops.difference(actual,other).getbbox(alpha_only=False) is None,(width,theme,variant,i)
print(f'PASS: {n} solid yellow pixel samples RGB (255, 210, 63); 12 card comparisons, 0 differing RGBA pixels.')
`], { encoding: "utf8" });
    console.log(pixelCheck.stdout); assert.equal(pixelCheck.status, 0, pixelCheck.stderr);
    fs.writeFileSync(path.join(shots, "results.json"), JSON.stringify({ results, pixelCheck: pixelCheck.stdout, errors }, null, 2) + "\n");
  } finally { server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
