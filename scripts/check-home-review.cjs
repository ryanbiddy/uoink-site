const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const moves = require('./fixtures/home-content-moves.json');

async function checkFooterOrder(page, label = page.url()) {
  const order = await page.evaluate(() => {
    const selectors = ['[data-final-cta]', '.family-footer', '.footer-grid', '.footer-bottom'];
    const nodes = selectors.map(selector => document.querySelector(selector));
    return {
      counts: selectors.map(selector => document.querySelectorAll(selector).length),
      dom: nodes.every((node, i) => node && (!i || (nodes[i - 1].compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING))),
      visual: nodes.every((node, i) => node && (!i || nodes[i - 1].getBoundingClientRect().bottom <= node.getBoundingClientRect().top + 1)),
      last: nodes[3] === document.querySelector('.site-footer')?.lastElementChild,
    };
  });
  assert.deepEqual(order.counts, [1, 1, 1, 1], `${label}: one of each footer section`);
  assert(order.dom && order.visual, `${label}: closing line, family strip, link columns, bottom line in DOM and visual order`);
  assert(order.last, `${label}: bottom line is final footer content`);
}

async function checkStructure(page) {
  await checkFooterOrder(page);
  const structure = await page.evaluate(() => {
    const parts = [], unexpected = [];
    function visit(el) {
      if (el.dataset.homePart) { parts.push(el.dataset.homePart); return; }
      if (el.tagName === 'SCRIPT' || el.matches('.story-motion-control')) return;
      if (!el.matches('.site-root, main, main > div, .hero-story')) { unexpected.push(el.outerHTML.slice(0,100)); return; }
      [...el.children].forEach(visit);
    }
    document.querySelectorAll('.site-root').forEach(visit);
    const footer = document.querySelector('.site-footer');
    const footerBottom = footer.getBoundingClientRect().bottom + scrollY;
    return {
      parts, unexpected,
      headers: document.querySelectorAll('.site-header').length,
      heroes: document.querySelectorAll('#u-opening').length,
      afterFooter: [...document.querySelectorAll('.site-header,.hero-story,#u-opening')].filter(el => footer.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING).length,
      extraSections: [...document.querySelectorAll('main section')].filter(el=>!el.closest('#u-film')&&!el.hasAttribute('data-home-part')).map(el=>el.outerHTML.slice(0,100)),
      height: document.documentElement.scrollHeight,
      footerBottom,
    };
  });
  assert.deepEqual(structure.parts,['header','first-screen','film','go-deeper','proof','sibling','closing','footer']);
  assert.deepEqual(structure.unexpected,[], 'No extra home sections or content outside the required order');
  assert.deepEqual(structure.extraSections,[], 'No old body sections nested inside Go deeper');
  assert.equal(structure.headers,1); assert.equal(structure.heroes,1);
  assert.equal(structure.afterFooter,0,'No header or hero after the family footer');
  assert(Math.abs(structure.height - structure.footerBottom) < 2,'Page ends at the site footer');
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  assert.equal(await page.locator('.site-header,#u-opening').evaluateAll(elements=>elements.some(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;})),false,'Header and hero do not escape at page bottom');
  await page.evaluate(()=>window.scrollTo(0,0));
  return structure.height;
}

async function checkMoves(page, out) {
  const routes = Object.fromEntries([...new Set([...moves.map(m=>m.route),'/developers','/sources'])].map(route=>[route,fs.readFileSync(path.join(out,route+'.html'),'utf8')]));
  const result = await page.evaluate(({moves,routes})=>{
    const parse=html=>new DOMParser().parseFromString(html,'text/html');
    const clean=doc=>{doc.querySelectorAll('script,style').forEach(el=>el.remove());return doc;};
    const normalize=text=>text.replace(/\s+/g,' ').trim();
    const targets=Object.fromEntries(Object.entries(routes).map(([route,html])=>[route,clean(parse(html))]));
    const failures=[], report=[];
    for(const move of moves) {
      const original=parse(move.html), blocks=[...original.querySelectorAll('h2,h3,p,pre,a,.eyebrow')];
      let count=0;
      for(const block of blocks) {
        const audience=move.label==='three audiences' && block.closest('a.doc-row')?.getAttribute('href');
        const route=audience || move.route, target=targets[route];
        const text=normalize(block.textContent);
        if(!normalize(target.body.textContent).includes(text)) failures.push(`${route}: ${text}`);
        if(block.matches('a') && ![...target.querySelectorAll('a')].some(a=>a.getAttribute('href')===block.getAttribute('href'))) failures.push(`${route}: link ${block.getAttribute('href')}`);
        count++;
      }
      // Text nodes cover labels, numbers and inline words outside the block list.
      const walker=original.createTreeWalker(original.body,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()) {
        const text=normalize(walker.currentNode.textContent);
        const row=move.label==='three audiences' ? walker.currentNode.parentElement.closest('a.doc-row') : null;
        const route=row?.getAttribute('href') || move.route;
        if(text&&!normalize(targets[route].body.textContent).includes(text)) failures.push(`${route}: text ${text}`);
      }
      report.push({block:move.label,route:move.route,checkedBlocks:count});
    }
    const install=targets['/install'];
    // The Mac heading is PRODUCT_STATUS.mac.heading; the fixture's Mac block matches it.
    for(const text of ['Mac preview.','Chrome Web Store approval is pending. Sideload the extension by loading the unpacked folder located at']) {
      const matches=[...install.querySelectorAll('h3,p')].filter(el=>normalize(el.textContent).startsWith(text) && (text.startsWith('Mac ') ? el.tagName==='H3' : true));
      if(matches.length!==1) failures.push(`Duplicate existing install copy: ${text} (${matches.length})`);
    }
    return {failures,report};
  },{moves,routes});
  assert.deepEqual(result.failures,[],'Every removed home text block and link exists on its target route');
  return result.report;
}

async function checkPause(page) {
  const toggle=page.locator('#story-motion-toggle');
  assert.equal(await page.getByRole('button',{name:'Pause motion',exact:true}).count(),1);
  const geometry=await toggle.evaluate(el=>{const parent=el.closest('.hero-story').getBoundingClientRect(),box=el.getBoundingClientRect(),style=getComputedStyle(el);return {right:parent.right-box.right,top:box.top-parent.top,height:box.height,radius:style.borderRadius};});
  assert.deepEqual(geometry,{right:20,top:12,height:48,radius:'10px'},'Match Zing motion control placement and family style');
  // Exercise actual playback even when all public video slots are placeholders.
  await page.evaluate(async()=>{
    const canvas=document.createElement('canvas');canvas.width=16;canvas.height=16;
    canvas.getContext('2d').fillRect(0,0,16,16);
    const video=document.createElement('video');video.id='motion-test-video';video.muted=true;
    video.srcObject=canvas.captureStream(1);document.querySelector('#u-film').append(video);
    const playback=video.play();
    canvas.getContext('2d').fillRect(0,0,16,16);
    video.srcObject.getVideoTracks()[0].requestFrame();
    await Promise.race([playback,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Synthetic video did not start')),5000))]);
    document.querySelector('#u-headline').animate([{opacity:.5},{opacity:1}],{duration:10000,iterations:Infinity});
  });
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-pressed'),'true');
  assert.equal(await toggle.textContent(),'Resume motion');
  const assertStopped=async()=>{
    await page.waitForTimeout(100);
    const state=await page.evaluate(()=>({running:document.getAnimations().filter(a=>a.playState==='running').length,playing:[...document.querySelectorAll('video,audio')].filter(v=>!v.paused).length}));
    assert.deepEqual(state,{running:0,playing:0},'Pause stops all moving content');
  };
  await assertStopped();
  await page.evaluate(()=>{document.querySelector('#motion-test-video').play().catch(()=>{});});
  await assertStopped();
  for(const id of ['u-scene-2','u-scene-3','u-scene-6']) {await page.locator('#'+id).scrollIntoViewIfNeeded();await assertStopped();}
  await page.locator('#ask-library').click();await assertStopped();
  await page.getByRole('button',{name:'Send the charge',exact:true}).click();
  const charge=page.locator('.charge-handle'), position=await charge.getAttribute('style');
  await page.waitForTimeout(400);assert.equal(await charge.getAttribute('style'),position,'Footer motion is also stopped');
  await page.evaluate(()=>{const video=document.querySelector('#motion-test-video');video.srcObject.getTracks().forEach(t=>t.stop());video.remove();});
  await page.getByRole('button',{name:'Resume motion',exact:true}).click();
  assert.equal(await toggle.getAttribute('aria-pressed'),'false');
  assert.equal(await page.locator('.hero-story').evaluate(el=>el.classList.contains('no-motion')),false);
  await page.getByRole('button',{name:'Send it back',exact:true}).click();
  await page.waitForTimeout(400);
  await page.evaluate(()=>window.scrollTo(0,0));
}

module.exports={checkStructure,checkMoves,checkPause,checkFooterOrder};

// Direct invocation checks every exported site route and refreshes mobile proof.
if (require.main === module) (async () => {
  const http = require('node:http');
  let chromium;
  try { ({chromium} = require('playwright-core')); }
  catch { ({chromium} = require('E:/AI/projects/zing-site/node_modules/playwright-core')); }
  const out = path.resolve(__dirname, '../out');
  const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
  const routes = walk(out).filter(file => file.endsWith('.html') && fs.readFileSync(file, 'utf8').includes('class="site-header family-header"'))
    .map(file => '/' + path.relative(out, file).replaceAll('\\', '/').replace(/index\.html$/, '').replace(/\.html$/, ''));
  assert(routes.includes('/'), 'Built site routes exist');
  const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
  const server = http.createServer((req, res) => {
    let file = path.resolve(out, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(out + path.sep) && file !== out) return res.writeHead(403).end();
    if (fs.existsSync(file + '.html')) file += '.html';
    else if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true});
    for (const width of [390, 1440]) for (const colorScheme of ['light', 'dark']) {
      const context = await browser.newContext({viewport:{width,height:844}, deviceScaleFactor:1, isMobile:width===390, hasTouch:width===390, colorScheme, serviceWorkers:'block'});
      try {
        await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
        const page = await context.newPage();
        for (const route of routes) {
          await page.goto(origin + route);
          await page.evaluate(() => document.fonts.ready);
          await checkFooterOrder(page, `${width} ${colorScheme} ${route}`);
        }
        await page.goto(origin);
        await page.locator('.hero-story.enhanced').waitFor();
        await page.evaluate(() => document.fonts.ready);
        await checkStructure(page);
        if (width === 390 && colorScheme === 'light') {
          await checkMoves(page, out);
          await checkPause(page);
          const shots = path.resolve(__dirname, '../_scratch/shots-hero');
          fs.mkdirSync(shots, {recursive:true});
          await page.screenshot({path:path.join(shots, 'home-390-light.png'), fullPage:true});
          await page.locator('.site-footer').screenshot({path:path.join(shots, 'footer-390-light.png'), style:'.site-header { visibility: hidden !important; }'});
        }
      } finally { await context.close(); }
    }
    console.log(`PASS: footer DOM and visual order on ${routes.length} routes at 390/1440 in light/dark; home structure, moved content, motion controls; mobile screenshots refreshed.`);
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
