// Run after npm run build. Chrome, a fresh profile, and local requests only.
// Checks the product-first homepage: structure (via check-home-review), exact
// source quotes and minutes (via check-hero-sources), cleared media only, no
// clips, readable phone layout, tap targets, keyboard order and still motion.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
let chromium;
try { ({chromium} = require('playwright-core')); }
catch { ({chromium} = require('E:/AI/projects/zing-site/node_modules/playwright-core')); }
const root = path.resolve(__dirname, '..'), out = path.join(root, 'out');
const shots = path.join(root, '_scratch/shots-hero');
fs.mkdirSync(shots, {recursive:true});
const labels = require('../public/media/hero/labels.json');
const {slots} = require('./hero-media.cjs');
const {checkStructure,checkMoves,checkStill} = require('./check-home-review.cjs');
const media = require('../app/content/family-media.json');
const home = fs.readFileSync(path.join(out,'index.html'),'utf8');
const html = home.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
assert(main.length > 0, 'Exported home has a main element');
assert(!html.includes(String.fromCharCode(8212)), 'No em dash in exported home');
assert(!/\{\{[\w.]+\}\}/.test(html), 'No unresolved labels');
require('./check-hero-sources.cjs')(home);

// Media: the homepage shows only the cleared covers, as thumbnails, and plays no clips.
// The podcast cover frame catches the host mid-word, so its row uses the product's
// neutral kind block instead.
const clearedCovers = slots.map(slot => `/media/hero/${slot.name}.jpg`);
const homeCovers = ['/media/hero/source-lesson.jpg', '/media/hero/source-x-video.jpg'];
assert(homeCovers.every(cover => clearedCovers.includes(cover)), 'Home covers belong to the cleared slots');
assert(fs.readFileSync(path.join(root, 'public/media/hero/README.md'), 'utf8').includes('matching `.jpg` covers are cleared'), 'Media README records the cleared covers');
assert(!/url\s*\(/i.test(fs.readFileSync(path.join(root, 'app/home.css'),'utf8')), 'No CSS media on the homepage');
assert(!/<(?:video|audio|iframe|source)\b/.test(main), 'No clips on the homepage');
assert(!/\.(?:mp4|webm|mov)\b/.test(main), 'No clip files referenced on the homepage');
const images = [...main.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
assert(images.length >= 3, 'Hero and Library rows show cleared thumbnails');
for (const src of images) {
  assert(homeCovers.includes(src), `Only cleared covers on the homepage: ${src}`);
  assert(fs.existsSync(path.join(out, src)), `Exported cover ${src}`);
}
function walk(dir) {return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
for (const file of walk(out).filter(file=>file.endsWith('.html'))) {
 const exported=fs.readFileSync(file,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 for (const [,url] of exported.matchAll(/\b(?:src|poster)="(\/[^"?#]+\.(?:mp4|webm|jpg|jpeg|png|webp|svg))"/g)) assert(fs.existsSync(path.join(out,url)),`${file} references missing media ${url}`);
}
const repoFiles = execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(file=>file && fs.existsSync(file));
const forbiddenName = String.fromCharCode(83,119,121,120);
for (const file of repoFiles) {
  const bytes=fs.readFileSync(file);
  assert(!bytes.toString('utf8').toLowerCase().includes(forbiddenName.toLowerCase()), `Forbidden guest name: ${file}`);
}
for (const entry of media.legacyAssets) {
  assert(media.pendingReshootSha256.includes(entry.sha256));
  assert(!media.blockedMediaSha256.includes(entry.sha256));
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(entry.path)).digest('hex'),entry.sha256,`Unreviewed legacy asset: ${entry.path}`);
}
for (const entry of media.approvedAssets) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(entry.path)).digest('hex'),entry.sha256,`Unreviewed asset: ${entry.path}`);

// Where each part sends people next. Every target must be an exported page.
const partLinks = [['first-screen','/install'],['save','/sources'],['find','/features/evidence-panel'],['write','/features/writing-studio'],['write','/blog/loop-engineering'],['connect','/developers'],['sibling','https://myzing.app']];
for (const [, href] of partLinks) if (href.startsWith('/')) assert(fs.existsSync(path.join(out, href + '.html')), `Missing route ${href}`);

const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(out,'.'+pathname);
  if(!file.startsWith(out+path.sep)&&file!==out) return res.writeHead(403).end();
  if(fs.existsSync(file+'.html')) file+='.html';
  else if(fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if(!fs.existsSync(file)) return res.writeHead(404).end();
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const results=[];
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 const contexts=[];
 try {
  async function context(width,colorScheme,reducedMotion='no-preference',extra={}) {
   const profile=fs.mkdtempSync(path.join(shots,'chrome-profile-'));
   const ctx=await chromium.launchPersistentContext(profile,{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,viewport:{width,height:844},deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390,colorScheme,reducedMotion,serviceWorkers:'block',args:['--disable-background-networking','--disable-component-update','--no-first-run'],...extra});
   contexts.push(ctx);
   await ctx.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
   return ctx;
  }
  // No JavaScript: the whole page is static HTML and CSS.
  const staticContext=await context(390,'light','reduce',{javaScriptEnabled:false});
  const staticPage=await staticContext.newPage(); await staticPage.goto(origin);
  await checkStructure(staticPage);
  const movedContent = await checkMoves(staticPage,out);
  for (const [part, href] of partLinks) assert.equal(await staticPage.locator(`[data-home-part="${part}"] a[href="${href}"]`).count(), 1, `${part} links to ${href}`);
  assert.deepEqual(await staticPage.locator('.go-deeper-grid>a').evaluateAll(links=>links.map(a=>[a.textContent.trim(),a.getAttribute('href')])),[['Sources','/sources'],['How it works','/how-it-works'],['Features','/features'],['MCP','/mcp'],['Creators','/creators'],['Field notes','/blog']]);
  const saveText = await staticPage.locator('[data-home-part="save"]').textContent();
  for (const key of ['lesson','podcast','x']) assert(saveText.includes(labels.sources[key].title), `Library shows the saved ${key}: ${labels.sources[key].title}`);
  assert((await staticPage.locator('#u-flow').textContent()).includes(labels.sources.lesson.length), 'Hero video shows the lesson length');
  assert((await staticPage.locator('[data-home-part="write"] .hm-disclosure').textContent()).includes(labels.example.disclosure), 'Example disclosure');
  const receipts = await staticPage.locator('main a[href*="t="]').evaluateAll(links => links.map(a => ({label: a.getAttribute('aria-label'), target: a.target, rel: a.rel, visible: a.getBoundingClientRect().height > 0})));
  assert(receipts.length >= 8, `Receipts on the page: ${receipts.length}`);
  for (const r of receipts) {
    assert(/^Open (YC talk|How I AI) at \d\d:\d\d$/.test(r.label), `Receipt name: ${r.label}`);
    assert.equal(r.target, '_blank'); assert.equal(r.rel, 'noreferrer'); assert(r.visible, 'Receipts render without JavaScript');
  }
  await staticContext.close();

  for(const [width,theme,motion,filename] of [[390,'light','no-preference','home-390-light.png'],[390,'dark','no-preference','home-390-dark.png'],[1440,'light','no-preference','home-1440-light.png'],[390,'light','reduce','home-390-reduced.png'],[1440,'light','reduce','home-1440-reduced.png']]) {
   const ctx=await context(width,theme,motion), page=await ctx.newPage(), errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('console',message=>{ if (message.type()==='error') errors.push(message.text()); });
   await page.goto(origin); await page.locator('#u-opening').waitFor(); await page.evaluate(()=>document.fonts.ready);
   const pageHeight = await checkStructure(page);
   const animations = await checkStill(page);
   // Load the lazy thumbnails, then measure.
   await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}scrollTo(0,0);});
   await page.waitForFunction(()=>[...document.querySelectorAll('main img')].every(img=>img.complete));
   const layout = await page.evaluate(() => {
     const visible = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden'; };
     return {
       overflow: document.documentElement.scrollWidth - innerWidth,
       brokenImages: [...document.querySelectorAll('main img')].filter(img => !img.naturalWidth).map(img => img.src),
       // Text that runs past its box. Row titles and source lines truncate on
       // purpose, as in the app; decorative shapes hold no text.
       clipped: [...document.querySelectorAll('.hm-win, .hm-win *')].filter(el => visible(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && el.scrollWidth > el.clientWidth + 1 && !el.matches('.hm-row-title, .hm-row-source')).map(el => `${el.className || el.tagName}: ${el.textContent.trim().slice(0, 30)}`),
       smallText: [...document.querySelectorAll('#u-flow *')].filter(el => visible(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 11).map(el => el.textContent.trim().slice(0, 30)),
       smallTargets: [...document.querySelectorAll('main a[href], main button')].filter(visible).filter(el => { const r = el.getBoundingClientRect(); return el.matches('.btn, button') ? r.height < 44 || r.width < 44 : r.height < 24; }).map(el => `${el.textContent.trim().slice(0, 30)} ${Math.round(el.getBoundingClientRect().height)}`),
     };
   });
   assert.equal(layout.overflow, 0, `${width}: no horizontal scroll`);
   assert.deepEqual(layout.brokenImages, [], 'Every thumbnail loads');
   assert.deepEqual(layout.clipped, [], `${width}: nothing clipped inside the product windows`);
   assert.deepEqual(layout.smallText, [], `${width}: hero visual text is 11 px or larger`);
   assert.deepEqual(layout.smallTargets, [], `${width}: buttons are 44 px; links are at least 24 px`);
   // Keyboard: after the header, the first stop in the page is the Windows download.
   const firstInMain = await page.evaluate(() => {
     const focusables = [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.getBoundingClientRect().height > 0);
     return focusables.find(el => el.closest('main'))?.dataset.download;
   });
   assert.equal(firstInMain, 'windows', 'First focus stop in the page is Download for Windows');
   if (width === 390 && theme === 'light' && motion === 'no-preference') {
     await page.screenshot({path:path.join(shots,'opening-390.png')});
     await page.locator('#u-flow').screenshot({path:path.join(shots,'flow-390.png')});
   }
   await page.screenshot({path:path.join(shots,filename),fullPage:true});
   await page.screenshot({path:path.join(shots,filename.replace('home-','viewport-'))});
   assert.deepEqual(errors,[]);
   results.push({width,theme,motion,pageHeight,animations,errors});
   await ctx.close();
  }
  fs.writeFileSync(path.join(shots,'results.json'),JSON.stringify({images,movedContent,results},null,2));
  console.log(`PASS: product-first home order, two downloads, three-step flow, three sections, all moved text/links on target routes, ${partLinks.length} part links, 6 Go deeper cards, ${receipts.length} receipts with names, no em dashes, cleared covers only (${images.length}), no clips, no missing exported media, no JS needed, no clipped or tiny hero text, 44 px buttons, keyboard order, still motion, phone/desktop, local-only Chrome, proof saved. Run check-public-media.cjs separately for the repository-wide media gate.`);
 } finally {for(const ctx of contexts) await ctx.close().catch(()=>{});server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
