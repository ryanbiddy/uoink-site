import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDate = new Date().toISOString().slice(0, 10);
const relative = file => path.relative(root, file).replaceAll('\\', '/');
function sourceFiles(route) {
  let entry = route === '/' ? 'app/page.tsx' : `app${route}/page.tsx`;
  if (route.startsWith('/mcp/tools/')) entry = 'app/mcp/tools/[tool]/page.tsx';
  if (route === '/blog/rss.xml') entry = 'app/blog/rss.xml/route.ts';
  if (!fs.existsSync(path.join(root, entry))) {
    entry = route.startsWith('/features/') ? 'app/features/[slug]/page.tsx' : 'app/blog/[slug]/page.tsx';
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
  if (route.startsWith('/blog/') && route !== '/blog/rss.xml') visit(path.join(root, `content${route}.md`));
  if (route === '/') visit(path.join(root, 'public/hero-story.js'));
  return [...found].map(relative);
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
// Reconcile tool URLs on every build, including removals after a release sync.
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/mcp/manifest.json'), 'utf8'));
const toolEntries = manifest.tools.map(tool => `  <url><loc>https://uoink.app/mcp/tools/${tool.name}</loc><lastmod>${manifest.generated}</lastmod></url>`).join('\n');
const template = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8')
  .replace(/^[ \t]*<url><loc>https:\/\/uoink\.app\/mcp\/tools\/[^<]+<\/loc>[\s\S]*?<\/url>\r?\n/gm, '')
  .replace('</urlset>', `${toolEntries}\n</urlset>`);
// Tool page lastmod reflects source history or actual local edit times, never
// the date a clean rebuild happened. The manifest's sync date is a lower bound.
const toolFileDates = new Map();
function toolLastmod(files) {
  const dates = [manifest.generated];
  for (const file of files) {
    if (toolFileDates.has(file)) { dates.push(toolFileDates.get(file)); continue; }
    const dirty = execFileSync('git', ['status', '--porcelain', '--', file], { cwd: root, encoding: 'utf8' }).trim();
    const committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: root, encoding: 'utf8' }).trim();
    const date = dirty || !committed ? fs.statSync(path.join(root, file)).mtime.toISOString().slice(0, 10) : committed;
    toolFileDates.set(file, date);
    dates.push(date);
  }
  return dates.sort().at(-1);
}
const evidence = [];
const sitemap = template.replace(/<url>([\s\S]*?)<\/url>/g, (block, body) => {
  const route = new URL(body.match(/<loc>(.*?)<\/loc>/)[1]).pathname;
  const files = sourceFiles(route), date = route.startsWith('/mcp/tools/') ? toolLastmod(files) : lastmod(files);
  evidence.push({ route, lastmod: date, files });
  return block.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${date}</lastmod>`);
});
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'out/sitemap.xml'), sitemap);
fs.mkdirSync(path.join(root, '_scratch/shots-hero'), { recursive: true });
fs.writeFileSync(path.join(root, '_scratch/shots-hero/sitemap-dates.json'), JSON.stringify(evidence, null, 2));
console.log(`sitemap: ${evidence.length} route dates from source history, with build-date fallback`);

fs.mkdirSync(path.join(root, '_scratch/shots-seo'), { recursive: true });
fs.writeFileSync(path.join(root, '_scratch/shots-seo/sitemap-dates.json'), JSON.stringify(evidence.filter(row => row.route.startsWith('/mcp/tools/')), null, 2) + '\n');
