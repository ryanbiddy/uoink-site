// Requires Python jsonschema for request validation.
// Run after npm run build. Uses the same local browser dependency as the family-kit check.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require('E:/AI/projects/zing-site/node_modules/playwright-core')); }
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out');
const shots = path.join(root, '_scratch/shots-seo');
fs.mkdirSync(shots, { recursive: true });
const manifest = require('../public/mcp/manifest.json');
const release = require('../content/release.json');
const sitemap = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
const dateEvidence = JSON.parse(fs.readFileSync(path.join(shots, 'sitemap-dates.json'), 'utf8'));
assert.equal(manifest.tools.length, release.httpToolCount);
assert.equal(manifest.version, release.version);
const routes = manifest.tools.map(tool => `/mcp/tools/${tool.name}`);
const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/uoink.app(\/mcp\/tools\/[^<]+)<\/loc>/g)].map(m => m[1]);
assert.deepEqual(sitemapRoutes.sort(), [...routes].sort(), 'Sitemap tool inventory must match the synced registry');
function resolveFile(route) {
  const base = path.resolve(out, '.' + decodeURIComponent(route));
  if (!base.startsWith(out + path.sep) && base !== out) return undefined;
  return [base, base + '.html', path.join(base, 'index.html')].find(file => fs.existsSync(file) && fs.statSync(file).isFile());
}
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const file = resolveFile(new URL(req.url, 'http://localhost').pathname);
  if (!file) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const titles = new Set(), descriptions = new Set(), examples = [], results = [];
const samples = new Set(['search_clips', 'get_schema_version', 'claim_library_work']);
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    // JavaScript disabled: discovery content, links and schemas must exist in static HTML.
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, javaScriptEnabled: false });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    let checkedLinks = 0;
    for (const route of ['/mcp', ...routes]) {
      assert(resolveFile(route), `${route} missing from export`);
      const response = await page.goto(origin + route, { waitUntil: 'load' });
      assert.equal(response.status(), 200, route);
      const data = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        h1: [...document.querySelectorAll('h1')].map(el => el.textContent),
        links: [...document.querySelectorAll('a[href]')].map(el => el.getAttribute('href')),
        answer: document.querySelector('[data-tool-answer]')?.textContent,
        examples: [...document.querySelectorAll('[data-example-call]')].map(el => JSON.parse(el.textContent)),
        text: document.querySelector('main').textContent,
        overflow: document.documentElement.scrollWidth - innerWidth,
        headerHeight: document.querySelector('.family-header').getBoundingClientRect().height,
        footer: !!document.querySelector('.family-footer'),
        buttons: [...document.querySelectorAll('main .btn')].map(el => ({ height: el.getBoundingClientRect().height, radius: getComputedStyle(el).borderRadius })),
      }));
      assert.equal(data.h1.length, 1, `${route}: h1 count`);
      for (const href of data.links) {
        const url = new URL(href, origin + route);
        if (![origin, 'https://uoink.app'].includes(url.origin)) continue;
        const target = resolveFile(url.pathname);
        assert(target, `${route}: unresolved link ${href}`);
        if (url.hash && target.endsWith('.html')) {
          const targetHtml = fs.readFileSync(target, 'utf8');
          const id = decodeURIComponent(url.hash.slice(1));
          assert(targetHtml.includes(`id="${id}"`) || targetHtml.includes(`name="${id}"`), `${route}: unresolved fragment ${href}`);
        }
        checkedLinks++;
      }
      if (route === '/mcp') {
        for (const toolRoute of routes) assert(data.links.includes(toolRoute), `/mcp must link to ${toolRoute}`);
        continue;
      }
      const tool = manifest.tools.find(tool => route.endsWith('/' + tool.name));
      assert.equal(data.h1[0], tool.name);
      assert(data.title && !titles.has(data.title), `${route}: duplicate or empty title`);
      assert(data.description && !descriptions.has(data.description), `${route}: duplicate or empty description`);
      titles.add(data.title); descriptions.add(data.description);
      assert.equal(data.canonical, 'https://uoink.app' + route);
      assert(data.answer && data.answer.length > 10, `${route}: missing answer-first line`);
      assert(data.links.includes('/mcp'), `${route}: parent link`);
      for (const section of ['Inputs', 'Outputs and behavior', 'Example call', 'Clients']) assert(data.text.includes(section));
      assert(!data.text.includes('\u2014'), `${route}: em dash`);
      assert.equal(data.overflow, 0, `${route}: mobile overflow`);
      assert.equal(data.headerHeight, 120, `${route}: family header`);
      assert(data.footer, `${route}: family footer`);
      for (const button of data.buttons) assert.deepEqual(button, { height: 48, radius: '10px' });
      const evidence = dateEvidence.find(row => row.route === route);
      assert(evidence && evidence.files.includes('public/mcp/manifest.json'), `${route}: missing lastmod provenance`);
      assert(sitemap.includes(`<loc>https://uoink.app${route}</loc><lastmod>${evidence.lastmod}</lastmod>`));
      assert(/^\d{4}-\d{2}-\d{2}$/.test(evidence.lastmod) && evidence.lastmod >= manifest.generated);
      for (const call of data.examples) { assert.equal(call.name, tool.name); examples.push(call); }
      if (samples.has(tool.name)) {
        await page.screenshot({ path: path.join(shots, `${tool.name}-390.png`), fullPage: true });
        await page.screenshot({ path: path.join(shots, `${tool.name}-390-top.png`) });
      }
      results.push({ route, title: data.title, canonical: data.canonical, lastmod: evidence.lastmod, internalLinks: data.links.length, overflow: data.overflow });
    }
    fs.writeFileSync(path.join(shots, 'example-calls.json'), JSON.stringify(examples, null, 2));
    const validation = spawnSync('python', ['-X', 'utf8', '-c', `import json,jsonschema,sys\nm=json.load(open(sys.argv[1],encoding='utf-8'))\ntools={t['name']:t for t in m['tools']}\ncalls=json.load(open(sys.argv[2],encoding='utf-8'))\nfor c in calls: jsonschema.Draft202012Validator(tools[c['name']]['inputSchema']).validate(c['arguments'])\nprint(f'PASS: {len(calls)} request templates validate against exact registry schemas.')`, path.join(root, 'public/mcp/manifest.json'), path.join(shots, 'example-calls.json')], { encoding: 'utf8' });
    assert.equal(validation.status, 0, validation.stderr);
    console.log(validation.stdout.trim());
    const summary = `PASS: ${routes.length} exported tool routes, sitemap entries with date provenance, unique titles/descriptions, one h1, canonical URLs, parent links; ${checkedLinks} internal links resolve; all tool pages fit 390 px without JavaScript.`;
    fs.writeFileSync(path.join(shots, 'results.json'), JSON.stringify({ summary, exampleValidation: validation.stdout.trim(), results }, null, 2) + '\n');
    console.log(summary);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
