// Run after npm run build. Uses the same local Chrome setup as the family checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require('E:/AI/projects/zing-site/node_modules/playwright-core')); }
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out');
const shots = path.join(root, '_scratch/shots-seo');
fs.mkdirSync(shots, { recursive: true });
const drafts = fs.readdirSync(path.join(root, 'content/compare')).filter(file => file.endsWith('.md'));
const routes = ['/compare', '/compare/notebooklm', ...drafts.map(file => '/compare/' + file.replace(/^uoink-vs-|\.md$/g, ''))];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let file = path.resolve(out, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(out + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file + '.html')) file += '.html';
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const normalize = text => text.replace(/\s+/g, ' ').trim();
// Preserve the drafts' limitations, competitor quotations and plan names, while
// rejecting every other occurrence, including implied claims without a brand name.
function checkOnly(text, route) {
  const allowed = /Windows 10(?:\/11| and 11) only|copy and paste only|The Librarian only proposes changes|with only the original poster's tweets|Reader only(?: costs)?|only for YouTube currently/gi;
  assert(!/\bonly\b/i.test(text.replace(allowed, '')), `${route}: unreviewed "only" claim`);
}
assert.throws(() => checkOnly('Uoink is the only tool with MCP.', 'fixture'));
assert.throws(() => checkOnly('Only Zing has transcripts.', 'fixture'));
assert.throws(() => checkOnly('The only local library for your AI.', 'fixture'));
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: 'light', isMobile: true, hasTouch: true });
    const origin = `http://127.0.0.1:${server.address().port}`;
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const titles = new Set(), descriptions = new Set();
    const sitemap = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
    for (const route of routes) {
      assert(fs.existsSync(path.join(out, route + '.html')), `${route}: static export`);
      const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(m => m[1].includes(`<loc>https://uoink.app${route}</loc>`));
      assert(entry, `${route}: sitemap`);
      const date = entry[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
      assert(date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && date <= new Date().toISOString().slice(0, 10), `${route}: real lastmod`);
      assert.equal((await page.goto(origin + route)).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1);
      const title = await page.title(), description = await page.locator('meta[name="description"]').getAttribute('content');
      assert(title && !titles.has(title)); titles.add(title);
      assert(description && !descriptions.has(description)); descriptions.add(description);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://uoink.app${route}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: mobile overflow`);
      const text = await page.locator('main').innerText();
      assert(!text.includes('\u2014'), `${route}: em dash`);
      checkOnly(text, route);
      if (route !== '/compare') assert(await page.locator('main a[href="/compare"]').count(), `${route}: back link`);
      const draftFile = drafts.find(file => route.endsWith('/' + file.replace(/^uoink-vs-|\.md$/g, '')));
      if (draftFile) {
        const draft = fs.readFileSync(path.join(root, 'content/compare', draftFile), 'utf8').replace(/\r\n/g, '\n');
        const body = draft.split(/---\n/)[2];
        const visible = normalize(text);
        // Check every paragraph, list item and table cell against the supplied copy.
        for (const line of body.split('\n').filter(line => line.trim() && !/^\|[-|]+\|$/.test(line))) {
          const units = line.startsWith('|') ? line.slice(1, -1).split('|') : [line];
          for (const unit of units) {
            const expected = normalize(unit.replace(/^#{1,2} |^- |^\d+\. /, '').replace(/\*\*|`/g, '').replace(/seen 2026-10-24/g, 'seen Oct 24, 2026'));
            assert(visible.includes(expected), `${route}: missing draft text: ${expected}`);
          }
        }
        for (const url of new Set(body.match(/https:\/\/[^\s)]+/g))) {
          assert(await page.locator(`main a[href="${url}"]`).count(), `${route}: citation ${url}`);
        }
        const seen = (body.match(/seen 2026-10-24/g) || []).length;
        assert.equal((text.match(/seen Oct 24, 2026/g) || []).length, seen);
        for (const href of await page.locator('.comparison-citation').evaluateAll(links => links.map(link => link.hash))) {
          assert.equal(await page.locator(href).count(), 1, `${route}: citation target ${href}`);
        }
        assert(text.includes('Mac (Apple Silicon, macOS 15 or later): preview coming soon.') && !/no Mac build/i.test(text));
        await page.screenshot({ path: path.join(shots, `${route.split('/').at(-1)}-390-light.png`), fullPage: true });
      }
      if (route === '/compare') {
        for (const child of routes.slice(1)) assert(await page.locator(`main a[href="${child}"]`).count());
        await page.screenshot({ path: path.join(shots, 'compare-390-light.png'), fullPage: true });
      }
      console.log(`PASS ${route}: export, sitemap, metadata, copy, citations, claims, 390px`);
    }
    assert.deepEqual(errors, []);
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
