// Runs on the static export after every build. Pass --screenshots for 390px proof.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pages } = require('../app/content/use-cases.generated.json');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out');
const shots = path.join(root, '_scratch/shots-seo');
const read = file => fs.readFileSync(file, 'utf8');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(path.join(dir, item.name)) : [path.join(dir, item.name)]);
function resolve(route) {
  const base = path.join(out, decodeURIComponent(route));
  return [base, `${base}.html`, path.join(base, 'index.html')].find(file => fs.existsSync(file) && fs.statSync(file).isFile());
}
const htmlFiles = walk(out).filter(file => file.endsWith('.html'));
const titles = htmlFiles.map(file => ({ file, title: read(file).match(/<title>(.*?)<\/title>/)?.[1] }));
const sitemap = read(path.join(out, 'sitemap.xml'));
const dates = JSON.parse(read(path.join(root, '_scratch/shots-hero/sitemap-dates.json')));
const report = [];
for (const page of pages) {
  const file = resolve(page.route);
  assert(file, `Missing built route: ${page.route}`);
  const html = read(file).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${page.route}: one h1`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && titles.filter(item => item.title === title).length === 1, `${page.route}: unique title`);
  const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
  assert.equal(htmlFiles.filter(other => read(other).includes(`<meta name="description" content="${description}"`)).length, 1);
  assert(html.includes(`<link rel="canonical" href="https://uoink.app${page.route}"`));
  assert(html.includes('href="/how-it-works"'));
  assert(read(resolve('/how-it-works')).includes(`href="${page.route}"`));
  const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`<loc>https://uoink.app${page.route}</loc>`));
  assert(entry, `${page.route}: sitemap entry`);
  const date = entry[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
  assert(/^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)), 'Real lastmod');
  assert.equal(dates.find(item => item.route === page.route)?.lastmod, date);
  let internalLinks = 0;
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'), `https://uoink.app${page.route}`);
    if (url.origin !== 'https://uoink.app') continue;
    const target = resolve(url.pathname);
    assert(target, `${page.route}: broken link ${href}`);
    if (url.hash) assert(read(target).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor: ${href}`);
    internalLinks++;
  }
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  assert(!main.includes('\u2014'), 'No em dashes');
  assert(main.indexOf('search_clips') < main.indexOf('get_evidence_card'));
  assert(main.match(/<a\b[^>]*href="\/install"[^>]*>Install Uoink<\/a>/));
  report.push({ route: page.route, title, lastmod: date, internalLinks, status: 'passed' });
}
fs.mkdirSync(shots, { recursive: true });
fs.writeFileSync(path.join(shots, 'checks.json'), JSON.stringify(report, null, 2));
console.log(`use-cases: ${report.length} routes passed build, sitemap, metadata, h1, flow, parent and internal-link checks`);

if (process.argv.includes('--screenshots')) (async () => {
  const http = require('node:http');
  let chromium;
  try { ({ chromium } = require('playwright-core')); }
  catch { ({ chromium } = require('E:/AI/projects/zing-site/node_modules/playwright-core')); }
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff': 'font/woff', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
  const server = http.createServer((req, res) => {
    const file = resolve(new URL(req.url, 'http://localhost').pathname);
    if (!file) return res.writeHead(404).end();
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const origin = `http://127.0.0.1:${server.address().port}`;
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const tab = await context.newPage();
    for (const page of pages) {
      await tab.goto(origin + page.route);
      await tab.evaluate(() => document.fonts.ready);
      assert.equal(await tab.evaluate(() => document.documentElement.scrollWidth), 390, 'No mobile overflow');
      await tab.screenshot({ path: path.join(shots, `${page.slug}-390.png`), fullPage: true });
    }
    console.log('use-cases: saved both 390px screenshots; no horizontal overflow');
  } finally { await browser?.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
