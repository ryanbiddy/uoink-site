// Run after export; npm run build runs the static checks automatically.
// Add --screenshots to exercise the exported routes in Chrome at 390 px.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
require('./register-typescript.cjs');
const { releases, facts, factsTitle, factsDescription, parseFacts, parseReleases } = require('../app/content/seo-pages.ts');
const { pages } = require('../app/content/pages.ts');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out');
const shots = path.join(root, '_scratch/shots-seo');
fs.mkdirSync(shots, { recursive: true });
const routes = ['/changelog', '/facts', ...releases.map(release => release.route)];
const origin = 'https://uoink.app';
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(path.join(dir, item.name)) : [path.join(dir, item.name)]);
function resolveFile(route) {
  const file = path.resolve(out, '.' + decodeURIComponent(route));
  assert(file === out || file.startsWith(out + path.sep), `Path outside export: ${route}`);
  return [file, file + '.html', path.join(file, 'index.html')].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}
const sitemap = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
  route: new URL(body.match(/<loc>(.*?)<\/loc>/)[1]).pathname,
  lastmod: body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
}));
const prerender = JSON.parse(fs.readFileSync(path.join(root, '.next/prerender-manifest.json'), 'utf8'));
const titleFiles = new Map();
for (const file of walk(out).filter(file => file.endsWith('.html'))) {
  const title = fs.readFileSync(file, 'utf8').match(/<title>([\s\S]*?)<\/title>/)?.[1];
  if (title) titleFiles.set(title, [...(titleFiles.get(title) || []), file]);
}
const sourceVersions = [...pages.changelog.html.matchAll(/<h2>v(\d+\.\d+\.\d+)/g)].map(match => match[1]);
assert.deepEqual(releases.map(release => release.version), sourceVersions);
assert.throws(() => parseReleases('<p>No releases</p>'));
const llms = fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8');
assert.throws(() => parseFacts(llms.replace(/^Official MCP registry:.*$/m, '')));
assert.equal(parseFacts(llms.replaceAll(facts.version, '99.88.77')).version, '99.88.77', 'Facts must follow source version updates');
const releaseFixture = parseReleases('<h2>v99.88.77: Fixture</h2><p class="meta"><time datetime="2026-01-02">2026-01-02</time></p><p>A source change.</p><div class="ctas">');
assert.equal(releaseFixture[0].route, '/changelog/99-88-77');
assert.equal(releaseFixture[0].date, '2026-01-02');
const descriptions = new Set();
const results = [];
for (const route of routes) {
  const file = resolveFile(route);
  assert(file, `${route}: missing exported page`);
  assert(prerender.routes[route], `${route}: missing prerendered route`);
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: one h1`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  assert(title, `${route}: title missing`);
  assert.equal(titleFiles.get(title).length, 1, `${route}: title must be unique across the site`);
  const description = html.match(/<meta name="description" content="([^"]+)"/ )?.[1];
  assert(description && !descriptions.has(description), `${route}: missing or repeated description`);
  descriptions.add(description);
  assert(html.includes(`<link rel="canonical" href="${origin}${route}"`), `${route}: canonical`);
  const entries = sitemapEntries.filter(entry => entry.route === route);
  assert.equal(entries.length, 1, `${route}: sitemap entry`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(entries[0].lastmod), `${route}: lastmod`);
  assert.equal(new Date(entries[0].lastmod).toISOString().slice(0, 10), entries[0].lastmod);
  assert(!main.includes('\u2014'), `${route}: em dash`);
  const release = releases.find(release => release.route === route);
  if (release) {
    assert(main.includes(release.html), `${route}: notes must match source`);
    if (release.date) assert(main.includes(`<time dateTime="${release.date}">${release.date}</time>`), `${route}: release date`);
    else assert(main.includes('Release date not recorded in the changelog.') && !/<time\b/.test(main), `${route}: do not invent a date`);
  }
  const parent = release ? '/changelog' : '/';
  assert(main.includes(`href="${parent}"`), `${route}: parent link`);
  let internalLinks = 0;
  for (const [, encoded] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = decode(encoded);
    const url = new URL(href, origin + route);
    if (url.origin !== origin) continue;
    internalLinks++;
    const target = resolveFile(url.pathname);
    assert(target, `${route}: unresolved link ${href}`);
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const targetHtml = fs.readFileSync(target, 'utf8');
      const ids = [...targetHtml.matchAll(/\b(?:id|name)="([^"]+)"/g)].map(match => decode(match[1]));
      assert(ids.includes(id), `${route}: missing anchor ${href}`);
    }
  }
  results.push({ route, title: decode(title), description: decode(description), lastmod: entries[0].lastmod, internalLinks });
}
const index = fs.readFileSync(resolveFile('/changelog'), 'utf8');
for (const release of releases) assert(index.includes(`href="${release.route}"`), `Index missing ${release.route}`);
assert(index.includes('href="/facts"'), 'Facts must be discoverable from the changelog');
const factsHtml = decode(fs.readFileSync(resolveFile('/facts'), 'utf8'));
for (const value of [factsTitle, factsDescription, facts.version, facts.platform, facts.price, facts.license, facts.registry, facts.storage, facts.unsupported, facts.privacy, ...facts.supported]) assert(factsHtml.includes(value), `Facts missing source value: ${value}`);
const evidence = JSON.parse(fs.readFileSync(path.join(shots, 'sitemap-dates.json'), 'utf8'));
assert(evidence.find(item => item.route === '/facts').files.includes('public/llms.txt'), 'Facts lastmod must include llms.txt');
for (const release of releases) assert(evidence.find(item => item.route === release.route).files.includes('app/content/pages.ts'), `${release.route}: release source date evidence`);
fs.writeFileSync(path.join(shots, 'checks.json'), JSON.stringify({ status: 'PASS', newRoutes: releases.length + 1, checkedRoutes: results, sourceVersions, undatedReleases: releases.filter(item => !item.date).map(item => item.version) }, null, 2));
console.log(`PASS: ${releases.length + 1} new routes plus /changelog; exported and prerendered, sitemap with source dates, one h1, unique titles/descriptions, canonicals, parent links, source parity, and ${results.reduce((sum, item) => sum + item.internalLinks, 0)} resolving internal links including fragments.`);

async function screenshots() {
  let chromium;
  try { ({ chromium } = require('playwright-core')); }
  catch { ({ chromium } = require('E:/AI/projects/zing-site/node_modules/playwright-core')); }
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.png': 'image/png', '.txt': 'text/plain' };
  const server = http.createServer((req, res) => {
    const file = resolveFile(new URL(req.url, origin).pathname);
    if (!file) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const localOrigin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
    await context.route('**/*', route => new URL(route.request().url()).origin === localOrigin ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const browserResults = [];
    for (const route of routes) {
      assert.equal((await page.goto(localOrigin + route)).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      const measurements = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, headings: document.querySelectorAll('h1').length, header: document.querySelectorAll('.family-header').length, footer: document.querySelectorAll('.family-footer').length }));
      assert.equal(measurements.overflow, 0, `${route}: 390 px overflow`);
      assert.equal(measurements.headings, 1);
      assert.equal(measurements.header, 1);
      assert.equal(measurements.footer, 1);
      browserResults.push({ route, ...measurements });
      if (['/changelog', '/facts', releases[0].route, ...releases.filter(item => !item.date).map(item => item.route)].includes(route)) {
        const stem = route.slice(1).replaceAll('/', '-');
        await page.screenshot({ path: path.join(shots, `${stem}-390.png`) });
        await page.screenshot({ path: path.join(shots, `${stem}-390-full.png`), fullPage: true });
      }
    }
    assert.deepEqual(errors, [], 'Browser errors');
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const staticPage = await noJs.newPage();
    for (const route of routes) {
      await staticPage.goto(localOrigin + route);
      assert.equal(await staticPage.locator('h1').count(), 1);
      assert((await staticPage.locator('main').innerText()).length > 100);
    }
    fs.writeFileSync(path.join(shots, 'browser-checks.json'), JSON.stringify({ status: 'PASS', viewport: { width: 390, height: 844 }, noJavaScript: 'PASS', errors, routes: browserResults }, null, 2));
    console.log('PASS: every SEO route returns 200 at 390 px, no overflow or browser errors, family header/footer, content without JavaScript; screenshots saved in _scratch/shots-seo/.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
if (process.argv.includes('--screenshots')) screenshots().catch(error => { console.error(error); process.exitCode = 1; });
