if (process.argv.includes('--static')) { require('./check-seo-static.cjs').check('field-notes'); process.exit(0); }
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const http = require('node:http');
let chromium;
try { ({chromium} = require('playwright-core')); }
catch { ({chromium} = require('E:/AI/projects/zing-site/node_modules/playwright-core')); }
const root = path.resolve(__dirname, '..'), out = path.join(root, 'out');
const route = '/blog/loop-engineering';
const shots = path.join(root, '_scratch/shots-seo');
fs.mkdirSync(shots, {recursive:true});
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const server = http.createServer((req,res) => {
  let file = path.resolve(out, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if (!file.startsWith(out + path.sep) && file !== out) return res.writeHead(403).end();
  if (fs.existsSync(file+'.html')) file += '.html';
  else if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,colorScheme:'light'});
    await page.route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
    const errors=[];
    page.on('pageerror', e => errors.push(e.message));
    assert.equal((await page.goto(origin+route)).status(),200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(),1);
    const banner=page.getByLabel('Draft notice');
    assert(await banner.isVisible());
    assert.equal(await banner.innerText(),'Draft: two lines in this post become true after Ryan saves the three links in Uoink and edits the post.');
    assert((await banner.boundingBox()).y < (await page.locator('h1').boundingBox()).y);
    const body=await page.locator('.article-body').innerText();
    assert(!body.includes('Editor note'));
    assert(!(await page.locator('body').innerText()).includes('\u2014'));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const schema=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.flatMap(n=>JSON.parse(n.textContent)));
    assert.deepEqual(schema.find(s=>s['@type']==='Article'),JSON.parse(fs.readFileSync('content/blog/loop-engineering.jsonld','utf8')));
    assert(!/"(?:aggregateRating|review|reviews)"/.test(JSON.stringify(schema)));
    const links=[...new Set(await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))))];
    let internal=0;
    for (const href of links) {
      const url=new URL(href,origin);
      if (![origin,'https://uoink.app'].includes(url.origin)) continue;
      const response=await page.request.get(origin+url.pathname+url.search);
      assert(response.ok(),`${href}: ${response.status()}`);
      if (url.hash) assert((await response.text()).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),href);
      internal++;
    }
    await page.screenshot({path:path.join(shots,'field-notes-390-light.png'),fullPage:true});
    await page.screenshot({path:path.join(shots,'field-notes-390-viewport.png')});
    assert((await (await page.request.get(origin+'/blog')).text()).includes(route));
    const evidence=JSON.parse(fs.readFileSync(path.join(root,'_scratch/shots-hero/sitemap-dates.json'),'utf8')).find(item=>item.route===route);
    assert(evidence && evidence.files.includes('content/blog/loop-engineering.md'));
    assert((await (await page.request.get(origin+'/sitemap.xml')).text()).includes(`${route}</loc><lastmod>${evidence.lastmod}</lastmod>`));
    await page.goto(origin);
    assert.equal(await page.locator('[data-scene-link="4"]').getAttribute('href'),route);
    assert.equal(errors.length,0,errors.join('\n'));
    const receipts=[...new Set([...fs.readFileSync('content/blog/loop-engineering.md','utf8').matchAll(/\]\((https?:[^)]+)\)/g)].map(m=>m[1]))];
    const results=[];
    await Promise.all(receipts.map(async url => {
      try {
        const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
        results.push({url,status:response.status,ok:response.ok});
        await response.body?.cancel();
      } catch(e) {results.push({url,ok:false,error:e.message});}
    }));
    fs.writeFileSync(path.join(shots,'field-notes-check.json'),JSON.stringify({internal,receipts:results},null,2));
    console.log(`PASS: route, one h1, supplied JSON-LD, draft banner, index, sitemap, scene 4, ${internal} internal links, 390 px overflow, browser errors, screenshot.`);
    console.log(JSON.stringify(results,null,2));
    assert(results.every(r=>r.ok),'Some external receipt links could not be verified; see field-notes-check.json');
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
