// Tell IndexNow (Bing, which feeds ChatGPT search and Copilot, plus Yandex,
// Seznam and Naver) which uoink.app pages changed. No account or secret: the
// key file in public/ proves ownership. See docs/indexnow.md.
//
//   node scripts/indexnow-ping.mjs              # pages with the newest lastmod
//   node scripts/indexnow-ping.mjs --since 2026-11-01
//   node scripts/indexnow-ping.mjs --all        # every sitemap URL
//   node scripts/indexnow-ping.mjs --dry-run    # print, do not send
//
// It reads the live sitemap, so run it after the production deploy finishes.
const HOST = 'uoink.app';
const KEY = '9b91f5a5988d705a3f25641817b2f574';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const sinceIndex = args.indexOf('--since');
const since = sinceIndex > -1 ? args[sinceIndex + 1] : null;

const key = (await (await fetch(KEY_LOCATION)).text()).trim();
if (key !== KEY) throw new Error(`Key file at ${KEY_LOCATION} does not match; deploy it before pinging`);

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
  url: body.match(/<loc>(.*?)<\/loc>/)[1],
  lastmod: body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? '',
}));
if (!entries.length) throw new Error('Sitemap has no URLs');
const newest = entries.map(entry => entry.lastmod).sort().at(-1);
const cutoff = flag('--all') ? '' : since ?? newest;
const urlList = entries.filter(entry => entry.lastmod >= cutoff).map(entry => entry.url);

console.log(`indexnow: ${urlList.length} of ${entries.length} sitemap URLs${cutoff ? ` with lastmod >= ${cutoff}` : ''}`);
if (flag('--dry-run')) { console.log(urlList.join('\n')); process.exit(0); }

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});
console.log(`indexnow: HTTP ${response.status} ${response.statusText}`);
// 200 OK and 202 Accepted both mean the submission was received.
if (![200, 202].includes(response.status)) process.exit(1);
