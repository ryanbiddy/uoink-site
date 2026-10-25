const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const moves = require('./fixtures/home-content-moves.json');

async function checkStructure(page) {
  const structure = await page.evaluate(() => {
    const parts = [], unexpected = [];
    function visit(el) {
      if (el.dataset.homePart) { parts.push(el.dataset.homePart); return; }
      if (el.tagName === 'SCRIPT' || el.matches('.story-motion-control')) return;
      if (!el.matches('.site-root, main, main > div, .hero-story')) { unexpected.push(el.outerHTML.slice(0,100)); return; }
      [...el.children].forEach(visit);
    }
    document.querySelectorAll('.site-root').forEach(visit);
    const footer = document.querySelector('.family-footer');
    const footerBottom = footer.getBoundingClientRect().bottom + scrollY;
    return {
      parts, unexpected,
      headers: document.querySelectorAll('.site-header').length,
      heroes: document.querySelectorAll('#u-opening').length,
      afterFooter: [...document.querySelectorAll('.site-header,.hero-story,#u-opening')].filter(el => footer.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING).length,
      lastFooterChild: footer === document.querySelector('.site-footer').lastElementChild,
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
  assert(structure.lastFooterChild,'Family strip is the final footer content');
  assert(Math.abs(structure.height - structure.footerBottom) < 2,'Page ends at the family footer');
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
    for(const text of ['No Mac build scheduled.','There is no Mac installer or scheduled Mac release.','Chrome Web Store approval is pending. Sideload the extension by loading the unpacked folder located at']) {
      const matches=[...install.querySelectorAll('h3,p')].filter(el=>normalize(el.textContent).startsWith(text));
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

module.exports={checkStructure,checkMoves,checkPause};
