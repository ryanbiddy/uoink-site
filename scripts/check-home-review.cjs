const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const release = require('../content/release.json');
// Release-specific links in the fixture are written as {{version}}.
const moves = require('./fixtures/home-content-moves.json').map(move => ({...move, html: move.html.replaceAll('{{version}}', release.version)}));

// The product-first homepage: header, hero with both downloads and the product
// flow, three sections, Connect your AI, Go deeper, the Zing card, then the footer.
const HOME_PARTS = ['header', 'first-screen', 'save', 'find', 'write', 'connect', 'go-deeper', 'sibling', 'closing', 'footer'];
const SECTION_TITLES = ['Save it.', 'Find it.', 'Write with receipts.'];
const DOWNLOADS = {
  windows: `https://github.com/ryanbiddy/uoink/releases/download/v${release.version}/Uoink-Setup-${release.version}.exe`,
  mac: `https://github.com/ryanbiddy/uoink/releases/download/v${release.version}/Uoink-${release.version}-macos-arm64.dmg`,
};
// The old 7-chapter story ran about 12,000 px at 1440 and 11,000 px at 390.
const MAX_HEIGHT = { desktop: 5000, phone: 7000 };

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
      if (el.tagName === 'SCRIPT') return;
      if (!el.matches('.site-root, main, main > div')) { unexpected.push(el.outerHTML.slice(0,100)); return; }
      [...el.children].forEach(visit);
    }
    document.querySelectorAll('.site-root').forEach(visit);
    const footer = document.querySelector('.site-footer');
    const footerBottom = footer.getBoundingClientRect().bottom + scrollY;
    const text = el => el.textContent.replace(/\s+/g, ' ').trim();
    const hero = document.querySelector('#u-opening');
    const flow = document.querySelector('#u-flow');
    const box = el => { const r = el.getBoundingClientRect(); return {top: r.top + scrollY, bottom: r.bottom + scrollY, height: r.height, width: r.width}; };
    const headings = [...document.querySelectorAll('main h1, main h2')].map(text);
    return {
      parts, unexpected,
      headers: document.querySelectorAll('.site-header').length,
      heroes: document.querySelectorAll('#u-opening').length,
      h1: [...document.querySelectorAll('h1')].map(text),
      afterFooter: [...document.querySelectorAll('.site-header,.hm-hero,#u-opening')].filter(el => footer.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING).length,
      extraSections: [...document.querySelectorAll('main section')].filter(el => !el.hasAttribute('data-home-part')).map(el => el.outerHTML.slice(0,100)),
      downloads: [...hero.querySelectorAll('a[data-download]')].map(a => ({kind: a.dataset.download, href: a.getAttribute('href'), label: text(a), ...box(a)})),
      heroLinks: hero.querySelectorAll('a[href]').length,
      steps: [...flow.children].map(step => ({tag: step.tagName, number: text(step.querySelector('.hm-cap .hm-num')), caption: [...step.querySelector('.hm-cap').childNodes].filter(node => !node.matches?.('.hm-num')).map(node => node.textContent).join('').trim()})),
      flowTop: box(flow).top,
      video: !!flow.querySelector('.hm-step-watch .hm-video img[src="/media/hero/source-lesson.jpg"]') && /^Uoink$/.test(text(flow.querySelector('.hm-step-watch .hm-pill'))),
      savedRow: !!flow.querySelector('.hm-step-save .hm-lib-row .hm-row-title') && /^Done/.test(text(flow.querySelector('.hm-step-save .hm-row-state'))),
      minutes: ['.hm-step-watch .hm-video-time b', '.hm-step-save .hm-reader-time', '.hm-step-ask .hm-receipt b'].map(selector => text(flow.querySelector(selector))),
      receiptHrefs: [...flow.querySelectorAll('.hm-step-save .hm-reader-time, .hm-step-ask .hm-receipt')].map(a => a.getAttribute('href')),
      sectionTitles: [...document.querySelectorAll('[data-home-part="save"] h2, [data-home-part="find"] h2, [data-home-part="write"] h2')].map(text),
      examples: ['save', 'find', 'write'].map(part => document.querySelector(`[data-home-part="${part}"] .hm-tag`)?.textContent.trim()),
      duplicateHeadings: headings.filter((heading, i) => headings.indexOf(heading) !== i),
      connect: [...document.querySelectorAll('[data-home-part="connect"] a')].map(a => a.getAttribute('href')),
      clients: [...document.querySelectorAll('[data-home-part="connect"] .hm-clients li')].map(text),
      zing: [...document.querySelectorAll('main a[href="https://myzing.app"]')].map(a => a.closest('[data-home-part]').dataset.homePart),
      oldStory: /Keep scrolling|\b0[1-7] \/ 07\b|Three weeks ago|Pause motion|Resume motion/.test(document.body.innerText),
      media: document.querySelectorAll('main video, main audio, main iframe').length,
      height: document.documentElement.scrollHeight,
      footerBottom,
      viewport: {width: innerWidth, height: innerHeight},
    };
  });
  assert.deepEqual(structure.parts, HOME_PARTS);
  assert.deepEqual(structure.unexpected,[], 'No extra home sections or content outside the required order');
  assert.deepEqual(structure.extraSections,[], 'Every home section is one of the named parts');
  assert.equal(structure.headers,1); assert.equal(structure.heroes,1);
  assert.deepEqual(structure.h1, ['Uoink that shit.'], 'One h1: the headline');
  // Hero: two downloads, Windows and the Mac preview DMG, both above the fold.
  assert.deepEqual(structure.downloads.map(d => [d.kind, d.href, d.label]), [['windows', DOWNLOADS.windows, 'Download for Windows'], ['mac', DOWNLOADS.mac, 'Download for Mac (preview)']]);
  for (const d of structure.downloads) {
    assert(d.height >= 44 && d.width >= 44, `${d.kind} download is a 44 px target`);
    assert(d.bottom <= structure.viewport.height, `${d.kind} download is above the fold at ${structure.viewport.width} px`);
  }
  // Hero visual: the real flow, in order, starting above the fold.
  assert.deepEqual(structure.steps.map(s => s.tag), ['LI', 'LI', 'LI'], 'Three flow steps');
  assert.deepEqual(structure.steps.map(s => [s.number, s.caption]), [['1', 'Click Uoink while you watch'], ['2', 'Saved to your library, transcript included'], ['3', 'Your AI quotes it, with the minute']]);
  assert(structure.flowTop < structure.viewport.height, 'The product flow starts above the fold');
  assert(structure.video, 'Step 1: the saved video with the Uoink button');
  assert(structure.savedRow, 'Step 2: a saved Library row');
  assert(new Set(structure.minutes).size === 1 && /^\d\d:\d\d$/.test(structure.minutes[0]), `One minute threads through the flow: ${structure.minutes}`);
  assert(structure.receiptHrefs.length === 2 && structure.receiptHrefs.every(href => href === structure.receiptHrefs[0] && /[?&]t=\d+s$/.test(href)), 'Transcript line and answer receipt link to the same minute');
  // Exactly three short sections, each with its labelled example.
  assert.deepEqual(structure.sectionTitles, SECTION_TITLES);
  assert.deepEqual(structure.examples, ['Example', 'Example', 'Example'], 'Each section labels its worked example');
  assert.deepEqual(structure.duplicateHeadings, [], 'No duplicate headings');
  assert.equal(structure.oldStory, false, 'No chapter story, scroll bars or motion toggle');
  assert.equal(structure.media, 0, 'The homepage plays no video');
  assert.deepEqual(structure.connect, ['/developers'], 'Connect your AI links to /developers');
  assert.deepEqual(structure.clients, ['Claude Desktop', 'Claude Code', 'Cursor', 'Codex']);
  assert.deepEqual(structure.zing, ['sibling'], 'Zing is one card near the footer');
  const limit = structure.viewport.width >= 1000 ? MAX_HEIGHT.desktop : MAX_HEIGHT.phone;
  assert(structure.height <= limit, `Home stays short: ${structure.height} px at ${structure.viewport.width} (limit ${limit})`);
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

// The page has one short entrance (under 2.5 s) and then holds still, so it
// needs no pause control. Reduced motion gets no animation at all.
async function checkStill(page) {
  assert.equal(await page.getByRole('button', {name: /^(Pause|Resume) motion$/}).count(), 0, 'No motion toggle');
  await page.waitForTimeout(2600);
  const state = await page.evaluate(() => ({
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    animations: document.getAnimations().map(a => ({name: a.animationName || a.constructor.name, state: a.playState, iterations: a.effect?.getComputedTiming().iterations, end: a.effect?.getComputedTiming().endTime})),
    playing: [...document.querySelectorAll('video,audio')].filter(v => !v.paused).length,
  }));
  assert.equal(state.playing, 0, 'Nothing plays');
  assert.deepEqual(state.animations.filter(a => a.state === 'running' || a.iterations === Infinity || a.end > 2500), [], 'No looping or long-running motion');
  if (state.reduced) assert.deepEqual(state.animations, [], 'Reduced motion: no animation');
  return state.animations.length;
}

module.exports={checkStructure,checkMoves,checkStill,checkFooterOrder};

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
  const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.woff':'font/woff','.woff2':'font/woff2','.jpg':'image/jpeg','.png':'image/png'};
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
  const heights = {};
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
        await page.locator('#u-opening').waitFor();
        await page.evaluate(() => document.fonts.ready);
        heights[`${width}-${colorScheme}`] = await checkStructure(page);
        if (width === 390 && colorScheme === 'light') {
          await checkMoves(page, out);
          await checkStill(page);
          const shots = path.resolve(__dirname, '../_scratch/shots-hero');
          fs.mkdirSync(shots, {recursive:true});
          await page.screenshot({path:path.join(shots, 'home-390-light.png'), fullPage:true});
          await page.locator('.site-footer').screenshot({path:path.join(shots, 'footer-390-light.png'), style:'.site-header { visibility: hidden !important; }'});
        }
      } finally { await context.close(); }
    }
    console.log(`PASS: footer DOM and visual order on ${routes.length} routes at 390/1440 in light/dark; home parts ${HOME_PARTS.length}, two downloads above the fold, three-step product flow on one minute, three sections, Connect, Zing card, height ${JSON.stringify(heights)}; moved content; no looping motion; mobile screenshots refreshed.`);
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
