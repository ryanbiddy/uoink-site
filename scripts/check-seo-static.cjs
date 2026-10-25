// Node-only deployment checks. Full browser suites remain available separately.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
require('./register-typescript.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const decode = text => text.replace(/&(?:amp|quot|apos|lt|gt|#x27|#39);/g, entity => ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>' }[entity]));
const plain = html => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
function check(group) {
  const sitemap = read('out/sitemap.xml');
  const dates = JSON.parse(read('_scratch/shots-seo/sitemap-dates.json'));
  const titles = new Set(), descriptions = new Set();
  function page(route, parent) {
    const raw = read(`out${route}.html`);
    const html = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert(main && !main.includes('\u2014'), `${route}: main content without em dashes`);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: one h1`);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert(title && !titles.has(title), `${route}: unique title`); titles.add(title);
    assert(description && !descriptions.has(description), `${route}: unique description`); descriptions.add(description);
    assert(html.includes(`<link rel="canonical" href="https://uoink.app${route}"`), `${route}: canonical`);
    assert(html.includes(`href="${parent}"`), `${route}: parent link`);
    assert.equal([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].filter(([, loc]) => loc === `https://uoink.app${route}`).length, 1, `${route}: one sitemap entry`);
    const evidence = dates.find(item => item.route === route);
    assert(evidence && /^\d{4}-\d{2}-\d{2}$/.test(evidence.lastmod), `${route}: lastmod evidence`);
    assert(sitemap.includes(`${route}</loc><lastmod>${evidence.lastmod}</lastmod>`));
    assert(html.includes('family-header') && html.includes('family-footer'), `${route}: family kit`);
    return { raw, html, main, evidence, text: plain(main) };
  }
  if (group === 'mcp') {
    const manifest = require('../public/mcp/manifest.json');
    const release = require('../content/release.json');
    const Ajv = require('ajv/dist/2020');
    const ajv = new Ajv({ strict: false, validateFormats: false, allErrors: true });
    assert.equal(manifest.version, release.version);
    assert.equal(manifest.tools.length, release.httpToolCount);
    const expected = manifest.tools.map(tool => `/mcp/tools/${tool.name}`).sort();
    const actual = [...sitemap.matchAll(/<loc>https:\/\/uoink\.app(\/mcp\/tools\/[^<]+)<\/loc>/g)].map(match => match[1]).sort();
    assert.deepEqual(actual, expected, 'Registry and sitemap tool inventories');
    const index = read('out/mcp.html');
    let examples = 0;
    for (const tool of manifest.tools) {
      const route = `/mcp/tools/${tool.name}`;
      const { html, main, evidence, text } = page(route, '/mcp');
      assert(index.includes(`href="${route}"`), `${route}: MCP index link`);
      assert.equal(plain(html.match(/<h1\b[^>]*>(.*?)<\/h1>/)[1]), tool.name);
      assert(evidence.files.includes('public/mcp/manifest.json') && evidence.lastmod >= manifest.generated);
      assert(plain(main.match(/<p\b[^>]*data-tool-answer[^>]*>(.*?)<\/p>/)?.[1] || '').length > 10, `${route}: answer first`);
      for (const section of ['Inputs', 'Outputs and behavior', 'Example call', 'Clients']) assert(text.includes(section));
      const schema = main.match(/<summary>Full input schema<\/summary><pre>([\s\S]*?)<\/pre>/)?.[1];
      assert(schema, `${route}: schema disclosure`);
      assert.deepEqual(JSON.parse(decode(schema)), tool.inputSchema);
      const validate = ajv.compile(tool.inputSchema);
      const calls = [...main.matchAll(/<pre\b[^>]*data-example-call[^>]*>([\s\S]*?)<\/pre>/g)];
      assert(calls.length, `${route}: request example`);
      for (const [, json] of calls) {
        const call = JSON.parse(decode(json));
        assert.equal(call.name, tool.name);
        assert(validate(call.arguments), `${route}: ${ajv.errorsText(validate.errors)}`);
        examples++;
      }
    }
    console.log(`PASS: ${expected.length} tool pages, registry inventory, metadata, source dates and ${examples} schema-validated examples (static).`);
  } else if (group === 'compare') {
    const { comparisonSlugs, getComparison } = require('../app/compare/comparison-data.ts');
    page('/compare', '/');
    page('/compare/notebooklm', '/compare');
    for (const slug of comparisonSlugs) {
      const route = `/compare/${slug}`;
      const { html, text } = page(route, '/compare');
      const article = getComparison(slug);
      assert(html.includes(article.html), `${route}: rendered draft and citations match source`);
      assert(text.includes(article.heading) && text.includes(article.opening));
      assert(text.includes('Mac (Apple Silicon, macOS 15 or later): preview coming soon.'));
      const allowed = /Windows 10(?:\/11| and 11) only|copy and paste only|The Librarian only proposes changes|with only the original poster's tweets|Reader only(?: costs)?|only for YouTube currently/gi;
      assert(!/\bonly\b/i.test(text.replace(allowed, '')), `${route}: unreviewed exclusivity claim`);
    }
    console.log('PASS: comparison index and three pages, metadata, source copy, citations, Mac status and claims (static).');
  } else if (group === 'field-notes') {
    const route = '/blog/loop-engineering';
    const { html, raw, evidence } = page(route, '/blog');
    const notice = 'Draft: two lines in this post become true after Ryan saves the three links in Uoink and edits the post.';
    assert(html.includes(notice) && html.indexOf(notice) < html.indexOf('<h1'), 'Unchanged draft notice before the title');
    const schemas = [...raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(([, json]) => JSON.parse(json));
    assert.deepEqual(schemas.find(schema => schema['@type'] === 'Article'), JSON.parse(read('content/blog/loop-engineering.jsonld')));
    assert(!/"(?:aggregateRating|reviews?)"/.test(JSON.stringify(schemas)));
    assert(evidence.files.includes('content/blog/loop-engineering.md'));
    assert(read('out/blog.html').includes(`href="${route}"`));
    assert(/<a\b(?=[^>]*data-scene-link="4")(?=[^>]*href="\/blog\/loop-engineering")[^>]*>/.test(read('out/index.html')));
    console.log('PASS: loop engineering metadata, JSON-LD, unchanged draft notice, source dates and discovery links (static).');
  } else throw new Error(`Unknown SEO group: ${group}`);
}
module.exports = { check };
if (require.main === module) for (const group of ['mcp', 'compare', 'field-notes']) check(group);
