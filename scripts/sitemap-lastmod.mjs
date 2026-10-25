import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('./register-typescript.cjs');
const { releases } = require('../app/content/seo-pages.ts');
const seoRoutes = new Set(['/facts', '/changelog', ...releases.map(release => release.route)]);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDate = new Date().toISOString().slice(0, 10);
const relative = file => path.relative(root, file).replaceAll('\\', '/');
function sourceFiles(route) {
  let entry = route === '/' ? 'app/page.tsx' : `app${route}/page.tsx`;
  if (route.startsWith('/mcp/tools/')) entry = 'app/mcp/tools/[tool]/page.tsx';
  if (route.startsWith('/use-cases/')) entry = 'app/use-cases/[slug]/page.tsx';
  if (fs.existsSync(path.join(root, `app${route}/route.ts`))) entry = `app${route}/route.ts`;
  if (!fs.existsSync(path.join(root, entry))) {
    entry = route.startsWith('/compare/') ? 'app/compare/[slug]/page.tsx' : route.startsWith('/changelog/') ? 'app/changelog/[version]/page.tsx' : route.startsWith('/features/') ? 'app/features/[slug]/page.tsx' : 'app/blog/[slug]/page.tsx';
  }
  const found = new Set();
  function visit(file) {
    if (!fs.existsSync(file) || found.has(file)) return;
    found.add(file);
    if (!/\.[cm]?[jt]sx?$/.test(file)) return;
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)) {
      const base = path.resolve(path.dirname(file), match[1]);
      const resolved = [base, ...['.ts', '.tsx', '.json', '.css'].map(ext => base + ext)].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (resolved) visit(resolved);
    }
  }
  visit(path.join(root, entry));
  visit(path.join(root, 'app/layout.tsx'));
  if (route.startsWith('/use-cases/')) {
    for (const file of ['public/llms.txt', 'public/mcp/manifest.json', 'scripts/generate-use-cases.cjs']) visit(path.join(root, file));
  }
  if (route.startsWith('/blog/') && route !== '/blog/rss.xml') visit(path.join(root, `content${route}.md`));
  if (route.startsWith('/compare/') && route !== '/compare/notebooklm') visit(path.join(root, `content/compare/uoink-vs-${route.split('/').at(-1)}.md`));
  if (route === '/') visit(path.join(root, 'public/hero-story.js'));
  if (route === '/facts') visit(path.join(root, 'public/llms.txt'));
  return [...found].map(relative);
}
// New SEO pages use source history and actual working-file timestamps. A page
// modification date is separate from its release date (which can be unknown).
function seoLastmod(files) {
  let dates = [];
  try {
    dates = execFileSync('git', ['log', '--format=%cI', '--', ...files], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean).map(date => new Date(date).getTime());
    const dirty = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', ...files], { cwd: root, encoding: 'utf8' });
    for (const record of dirty.split('\0').filter(Boolean)) {
      const file = record.slice(3);
      if (files.includes(file) && fs.existsSync(path.join(root, file))) dates.push(fs.statSync(path.join(root, file)).mtimeMs);
    }
  } catch { /* Source timestamps also support builds from source archives. */ }
  if (!dates.length) dates = files.map(file => fs.statSync(path.join(root, file)).mtimeMs);
  if (!dates.length) throw new Error('Missing lastmod evidence');
  return new Date(Math.max(...dates)).toISOString().slice(0, 10);
}
export function lastmod(files) {
  try {
    // Uncommitted edits are part of this build, even when the previous commit is old.
    const dirty = execFileSync('git', ['status', '--porcelain', '--', ...files], { cwd: root, encoding: 'utf8' }).trim();
    if (dirty) return buildDate;
    const dates = execFileSync('git', ['log', '--format=%cs', '--', ...files], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean).sort();
    return dates.at(-1) || buildDate;
  } catch { return buildDate; }
}
// Reconcile against this build, so added pages appear and retired URLs disappear.
// The registry and generated use cases must agree with the exported routes.
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/mcp/manifest.json'), 'utf8'));
const useCases = JSON.parse(fs.readFileSync(path.join(root, 'app/content/use-cases.generated.json'), 'utf8'));
const prerender = JSON.parse(fs.readFileSync(path.join(root, '.next/prerender-manifest.json'), 'utf8'));
const exportedRoutes = Object.keys(prerender.routes).filter(route => !route.startsWith('/_'));
const toolRoutes = manifest.tools.map(tool => `/mcp/tools/${tool.name}`);
const useCaseRoutes = useCases.pages.map(page => page.route);
for (const route of [...seoRoutes, ...toolRoutes, ...useCaseRoutes]) {
  if (!exportedRoutes.includes(route)) throw new Error(`Missing exported sitemap route: ${route}`);
}
const routes = new Set([
  ...exportedRoutes.filter(route => !route.startsWith('/mcp/tools/') && !route.startsWith('/use-cases/')),
  ...toolRoutes, ...useCaseRoutes,
]);
const previous = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
const priorities = new Map([...previous.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => [
  new URL(body.match(/<loc>(.*?)<\/loc>/)[1]).pathname, body.match(/<priority>.*?<\/priority>/)?.[0] || '',
]));
const template = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...routes].sort().map(route => `  <url><loc>https://uoink.app${route === '/' ? '' : route}</loc><lastmod></lastmod>${priorities.get(route) || ''}</url>`).join('\n')}\n</urlset>\n`;
// Tool dates use source history or local edit times, with the registry sync date
// as a lower bound. A clean rebuild must not advance them.
const toolFileDates = new Map();
function toolLastmod(files) {
  const dates = [manifest.generated];
  for (const file of files) {
    if (!toolFileDates.has(file)) toolFileDates.set(file, seoLastmod([file]));
    dates.push(toolFileDates.get(file));
  }
  return dates.sort().at(-1);
}
const evidence = [];
const sitemap = template.replace(/<url>([\s\S]*?)<\/url>/g, (block, body) => {
  const route = new URL(body.match(/<loc>(.*?)<\/loc>/)[1]).pathname;
  const files = sourceFiles(route), date = route.startsWith('/mcp/tools/') ? toolLastmod(files) : seoRoutes.has(route) ? seoLastmod(files) : lastmod(files);
  evidence.push({ route, lastmod: date, files });
  return block.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${date}</lastmod>`);
});
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'out/sitemap.xml'), sitemap);
fs.mkdirSync(path.join(root, '_scratch/shots-hero'), { recursive: true });
fs.writeFileSync(path.join(root, '_scratch/shots-hero/sitemap-dates.json'), JSON.stringify(evidence, null, 2));
console.log(`sitemap: ${evidence.length} route dates from source history, with build-date fallback`);
fs.mkdirSync(path.join(root, '_scratch/shots-seo'), { recursive: true });
fs.writeFileSync(path.join(root, '_scratch/shots-seo/sitemap-dates.json'), JSON.stringify(evidence, null, 2));
