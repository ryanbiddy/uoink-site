// Check the entire export, including routes outside the individual SEO suites.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out');
const origin = 'https://uoink.app';
const read = file => fs.readFileSync(file, 'utf8');
const decode = text => text.replace(/&(?:amp|quot|apos|lt|gt|#x27|#39);/g, value => ({
  '&amp;': '&', '&quot;': '"', '&apos;': "'", '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>',
}[value]));
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
function resolve(route) {
  const base = path.resolve(out, '.' + decodeURIComponent(route));
  if (base !== out && !base.startsWith(out + path.sep)) return undefined;
  return [base, base + '.html', path.join(base, 'index.html')].find(file => fs.existsSync(file) && fs.statSync(file).isFile());
}
const expected = Object.keys(JSON.parse(read(path.join(root, '.next/prerender-manifest.json'))).routes)
  .filter(route => !route.startsWith('/_')).sort();
const actual = [...read(path.join(out, 'sitemap.xml')).matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url).pathname).sort();
assert.equal(actual.length, new Set(actual).size, 'Duplicate sitemap route');
assert.deepEqual(actual, expected, 'Sitemap must match every exported page and RSS route');
for (const route of actual) assert(resolve(route), `Sitemap target missing: ${route}`);
const issues = [];
const home = read(path.join(out, 'index.html'));
const homeTitle = 'Uoink | Save YouTube and podcast transcripts for your AI';
const homeDescription = 'Save YouTube videos, podcasts and articles to your own disk. Your AI searches the library and cites the timestamp. Free and open source, for Windows.';
assert(home.includes(`<title>${homeTitle}</title>`), 'Homepage must preserve the #48 search title');
for (const name of ['description', 'og:description', 'twitter:description']) assert(home.includes(`${name}" content="${homeDescription}"`), `Homepage ${name}`);
for (const name of ['og:title', 'twitter:title']) assert(home.includes(`${name}" content="${homeTitle}"`), `Homepage ${name}`);
assert(read(path.join(root, 'public/llms.txt')).includes('A local library of the YouTube videos, podcasts and articles you study, saved on your Windows PC, that your AI can search and cite with timestamps.'), 'Preserve the #48 llms.txt summary');
let links = 0;
for (const file of walk(out).filter(file => file.endsWith('.html'))) {
  const route = '/' + path.relative(out, file).replaceAll('\\', '/').replace(/index\.html$/, '').replace(/\.html$/, '');
  const html = read(file).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  for (const [, encoded] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = decode(encoded), url = new URL(href, origin + route);
    if (url.origin !== origin) continue;
    links++;
    const target = resolve(url.pathname);
    if (!target) { issues.push({ route, href, reason: 'Missing route or file' }); continue; }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const ids = [...read(target).matchAll(/\b(?:id|name)="([^"]+)"/g)].map(([, value]) => decode(value));
      if (!ids.includes(id)) issues.push({ route, href, reason: 'Missing fragment' });
    }
  }
}
const counts = {};
for (const route of actual) {
  const type = route === '/' ? 'home' : route === '/blog/rss.xml' ? 'rss' : route.startsWith('/blog/') ? 'blogPosts' : route.startsWith('/mcp/tools/') ? 'tools' : route.startsWith('/use-cases/') ? 'useCases' : route.startsWith('/features/') ? 'features' : route === '/compare' || route.startsWith('/compare/') ? 'compare' : route === '/facts' ? 'facts' : route === '/changelog' ? 'changelogIndex' : route.startsWith('/changelog/') ? 'releases' : 'pages';
  counts[type] = (counts[type] || 0) + 1;
}
fs.mkdirSync(path.join(root, '_scratch/shots-live'), { recursive: true });
fs.writeFileSync(path.join(root, '_scratch/shots-live/routes.json'), JSON.stringify({ routes: actual.length, counts, links, issues }, null, 2) + '\n');
assert.deepEqual(issues, [], 'Broken internal links');
console.log(`PASS: ${actual.length} unique sitemap routes; ${links} internal links and fragments resolve. ${JSON.stringify(counts)}`);
