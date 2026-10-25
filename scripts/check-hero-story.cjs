// Run after npm run build. Chrome, a fresh profile, and local requests only.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync, spawnSync } = require('node:child_process');
let chromium;
try { ({chromium} = require('playwright-core')); }
catch { ({chromium} = require('E:/AI/projects/zing-site/node_modules/playwright-core')); }
const root = path.resolve(__dirname, '..'), out = path.join(root, 'out');
const shots = path.join(root, '_scratch/shots-hero');
fs.mkdirSync(shots, {recursive:true});
const story = require('../app/content/hero-story.json');
const labels = require('../public/media/hero/labels.json');
const {slots,folder} = require('./hero-media.cjs');
const {checkStructure,checkMoves,checkPause} = require('./check-home-review.cjs');
const resolveLabels = text => text.replace(/\{\{([\w.]+)\}\}/g, (_, key) => key.split('.').reduce((node,part)=>node[part],labels));
const media = require('../app/content/family-media.json');
const home = fs.readFileSync(path.join(out,'index.html'),'utf8');
const html = home.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
assert(!html.includes(String.fromCharCode(8212)), 'No em dash in exported home');
assert(!/<(?:img|video)\b|\b(?:src|poster)=/.test(story.html), 'Hero content must get media from its manifest');
assert(!/url\s*\(/i.test(fs.readFileSync('app/hero-story.css','utf8')), 'No CSS media outside manifest');
assert(!/https?:|\.(?:png|jpg|webp|mp4|webm)/i.test(fs.readFileSync('public/hero-story.js','utf8')), 'No JS media outside manifest');
const heroMedia = slots.filter(slot=>fs.existsSync(path.join(folder,slot.name+'.mp4')) && fs.statSync(path.join(folder,slot.name+'.mp4')).size>0).map(slot=>'/media/hero/'+slot.name+'.mp4');
const mediaBytes = heroMedia.reduce((total, file) => total + fs.statSync(path.join(root,'public',file)).size,0);
assert(mediaBytes <= 1500000);
assert(!/\{\{[\w.]+\}\}/.test(html), 'No unresolved labels');
require('./check-hero-sources.cjs')(home);
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
for (const scene of story.scenes) assert(fs.existsSync(path.join(out,scene.href+'.html')), `Missing scene route ${scene.href}`);
// Removed home text and links are checked on their target routes below.
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
const results=[], fitIssues=[];
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
  const staticContext=await context(390,'light','reduce',{javaScriptEnabled:false});
  const staticPage=await staticContext.newPage(); await staticPage.goto(origin);
  await checkStructure(staticPage);
  const movedContent = await checkMoves(staticPage,out);
  for(const scene of story.scenes) {
   const text=await staticPage.locator('#'+scene.id).textContent();
   for(const value of scene.strings) assert(text.includes(resolveLabels(value)),`Static scene ${scene.id}: ${resolveLabels(value)}`);
   assert.equal(await staticPage.locator(`#${scene.id} [data-scene-link]`).first().getAttribute('href'),scene.href);
  }
  assert((await staticPage.locator('p.source-disclosure').textContent()).includes(resolveLabels(story.disclosure)));
  const sceneLinks=[['0','Get Uoink','/install'],['1','How evidence cards work','/features/evidence-panel'],['2','Everything Uoink can save','/sources'],['3','How capture works','/how-it-works'],['4','Read the field notes','/blog/loop-engineering'],['5','Your library stays on your machine','/privacy'],['6','Connect your AI','/developers'],['7','Writing Studio','/features/writing-studio'],['7-zing','Meet Zing','https://myzing.app']];
  for(const [number,text,href] of sceneLinks) {
    const link=staticPage.locator(`[data-scene-link="${number}"]`);
    assert.equal(await link.getAttribute('href'),href);
    assert((await link.textContent()).startsWith(text));
  }
  assert.deepEqual(await staticPage.locator('.go-deeper-grid>a').evaluateAll(links=>links.map(a=>[a.textContent.trim(),a.getAttribute('href')])),[['Sources','/sources'],['How it works','/how-it-works'],['Features','/features'],['MCP','/mcp'],['Creators','/creators'],['Field notes','/blog']]);
  assert.equal(await staticPage.locator('.source-entry img,.source-entry video,.receipt-detail img,.receipt-detail video,.saved-source img').count(),0,'Source cards stay text-only');
  for(const [key,id] of [['lesson','source-lesson'],['podcast','source-podcast'],['x','source-x-video']]) {
    const text=await staticPage.locator('#'+id).textContent();
    for(const field of ['title','date','length']) assert(text.includes(labels.sources[key][field]),`${id}: editable ${field}`);
  }
  await staticContext.close();
  for(const [width,theme,motion,filename] of [[390,'light','no-preference','home-390-light.png'],[390,'dark','no-preference','home-390-dark.png'],[1440,'light','no-preference','home-1440-light.png'],[390,'light','reduce','home-390-reduced.png']]) {
   const ctx=await context(width,theme,motion), page=await ctx.newPage(), errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(origin); await page.locator('.hero-story.enhanced').waitFor(); await page.evaluate(()=>document.fonts.ready);
   const pageHeight = await checkStructure(page);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No horizontal overflow');
   const sources=await page.locator('.hero-story video').evaluateAll(videos=>videos.map(video=>new URL(video.src).pathname));
   assert.deepEqual(sources,heroMedia,'All rendered hero media comes from manifest');
   for(const slot of slots) {
    const rendered=page.locator(`[data-media-slot="${slot.name}"]`);
    assert.equal(await rendered.count(),1);
    assert.equal(await rendered.locator('video,.hero-media-placeholder').count(),1);
    const filled=heroMedia.includes('/media/hero/'+slot.name+'.mp4');
    assert.equal(await rendered.getAttribute('data-media-state'),filled?'filled':'missing');
    if(!filled) {
      assert((await rendered.textContent()).includes('Your video here'));
      const ratio=await rendered.locator('.hero-media-placeholder').evaluate(el=>{const r=el.getBoundingClientRect();return r.width/r.height;});
      assert(Math.abs(ratio-16/9)<.01,'Placeholder preserves 16:9');
    }
   }
   if(width===390&&theme==='light'&&motion==='no-preference') {
    await checkPause(page);
     await page.locator('.hero-media-gallery').evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-20));
     await page.screenshot({path:path.join(shots,'media-390-light.png')});
     await page.evaluate(()=>window.scrollTo(0,0));
   }
   await page.screenshot({path:path.join(shots,filename),fullPage:true});
   await page.screenshot({path:path.join(shots,filename.replace('home-','viewport-'))});
   if(width===390&&theme==='light'&&motion==='no-preference') {
    await page.screenshot({path:path.join(shots,'opening-390.png')});
    await page.locator('.u-opening [data-receipt="goal"]').tap();
    assert(await page.locator('[data-receipt-card="goal"]').isVisible());
    assert(!(await page.locator('[data-receipt-card="job"]').isVisible()));
    await page.locator('[data-receipt-card="goal"] [data-jump]').tap();
    assert.equal(await page.evaluate(()=>document.activeElement.id),'receipt-line-goal');
    await page.screenshot({path:path.join(shots,'receipt-390.png')});
    await page.locator('.back-to-draft').tap();
    await page.waitForFunction(()=>document.activeElement.dataset.receipt==='goal');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.receipt),'goal');
    await page.locator('#draft-thread-tab').focus(); await page.keyboard.press('ArrowRight');
    assert(await page.locator('#draft-blog').isVisible());
    await page.keyboard.press('Home'); assert(await page.locator('#draft-tweet').isVisible());
    await page.locator('#transcript-lesson-tab').focus(); await page.keyboard.press('ArrowRight');
    assert(await page.locator('#transcript-podcast').isVisible());
    await page.keyboard.press('End'); assert(await page.locator('#transcript-x').isVisible());
    await page.locator('.library-answer [data-receipt="learn"]').tap();
    assert.equal(await page.locator('.back-to-draft [data-return-label="answer"]').isVisible(),true);
    await page.locator('.back-to-draft').tap();
    await page.waitForFunction(()=>document.activeElement.dataset.receipt==='learn');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.receipt),'learn');
    for(const scene of story.scenes.slice(1)) {
      await page.locator('#'+scene.id).scrollIntoViewIfNeeded();
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      const geometry = await page.locator(`#${scene.id} .scene-sticky`).evaluate(el=>({height:el.getBoundingClientRect().height,viewport:innerHeight,children:[...el.children].map(child=>({class:child.className,height:child.getBoundingClientRect().height}))}));
      if(geometry.height>geometry.viewport+1) fitIssues.push({scene:scene.id,...geometry});
      await page.waitForTimeout(1600);
      await page.screenshot({path:path.join(shots,scene.id+'.png')});
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('.tab-panel:visible').count(),6);
    assert.equal(await page.locator('.receipt-detail:visible').count(),3);
    assert.equal(await page.locator('.scene-sticky').first().evaluate(el=>getComputedStyle(el).position),'relative');
   }
   if(motion==='reduce') {assert.equal(await page.locator('.tab-panel:visible').count(),6); assert.equal(await page.locator('.receipt-detail:visible').count(),3);}
   assert.deepEqual(errors,[]);results.push({width,theme,motion,pageHeight,errors}); await ctx.close();
  }
  assert.deepEqual(fitIssues,[], 'Every scene must fit the phone viewport');
  if(!process.argv.includes('--no-record')) {
   const ctx=await context(390,'light');
   const page=await ctx.newPage();await page.goto(origin);await page.locator('.hero-story.enhanced').waitFor();await page.evaluate(()=>document.fonts.ready);
   const cdp=await ctx.newCDPSession(page), frames=[];
   const frameDir=path.join(shots,'recording-frames');fs.mkdirSync(frameDir,{recursive:true});
   cdp.on('Page.screencastFrame', event=>{
    const file=path.join(frameDir,`frame-${String(frames.length).padStart(5,'0')}.jpg`);
    fs.writeFileSync(file,Buffer.from(event.data,'base64'));
    frames.push({file,time:Date.now()/1000});
    cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{});
   });
   await cdp.send('Page.startScreencast',{format:'jpeg',quality:85,maxWidth:390,maxHeight:844,everyNthFrame:1});
   const start=Date.now();
   await page.waitForTimeout(3000);await page.locator('.u-opening [data-receipt="goal"]').tap();
   await page.waitForTimeout(2000);await page.locator('[data-receipt-card="goal"] [data-jump]').tap();
   await page.waitForTimeout(2500);
   // Give the receipt and source cards time to read within the 20-second proof.
   for(let i=2;i<=3;i++) {
    for(let swipe=0;swipe<4;swipe++) {
      const distance=await page.locator(`#u-scene-${i}`).evaluate(el=>el.getBoundingClientRect().top);
      if(distance<25) break;
      const travel=Math.min(540,distance+16);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:740}]});
      for(let step=1;step<=24;step++) {
        await page.waitForTimeout(18);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:740-travel*step/24}]});
      }
      await page.waitForTimeout(100);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    }
    await page.waitForTimeout(3000);
   }
   const elapsed=Date.now()-start;
   if(elapsed<18500) await page.waitForTimeout(18500-elapsed);
   const finalScroll=await page.evaluate(()=>scrollY);
   assert(finalScroll>2000,`Recording must reach the saved-source scene: ${finalScroll}`);
   await cdp.send('Page.stopScreencast');
   const endTime=Date.now()/1000;
   const list=frames.map((frame,i)=>`file '${frame.file.replaceAll('\\','/')}'\nduration ${Math.max(.01,(frames[i+1]?.time??endTime)-frame.time)}`).join('\n')+`\nfile '${frames.at(-1).file.replaceAll('\\','/')}'\n`;
   const input=path.join(frameDir,'frames.txt');fs.writeFileSync(input,list+'\n');
   await ctx.close();
   const ffmpeg=process.env.FFMPEG_PATH||'E:/AI/tools/ffmpeg-8.1.2-essentials/bin/ffmpeg.exe';
   const conversion=spawnSync(ffmpeg,['-y','-f','concat','-safe','0','-i',input,'-t','19.5','-an','-vf','fps=24,scale=390:844','-c:v','libx264','-pix_fmt','yuv420p',path.join(shots,'rec-hero-uoink.mp4')],{encoding:'utf8'});
   assert.equal(conversion.status,0,conversion.stderr);
   results.push({recording:'rec-hero-uoink.mp4',width:390,height:844,receiptTap:true,finalScroll});
  }
  fs.writeFileSync(path.join(shots,'results.json'),JSON.stringify({strings:story.scenes.reduce((n,s)=>n+s.strings.length,0),mediaBytes,movedContent,results},null,2));
  console.log(`PASS: exact home order, all moved text/links on target routes, Pause motion, footer boundary, ${story.scenes.reduce((n,s)=>n+s.strings.length,0)} static scene strings, 9 exact scene links, 6 Go deeper cards, no em dashes, folder-based hero media (${mediaBytes} bytes), no missing exported media, editable text-only source cards, receipt tap/keyboard/tabs, reduced motion, no JS, phone/desktop, local-only Chrome, proof saved. Run check-public-media.cjs separately for the repository-wide media gate.`);
 } finally {for(const ctx of contexts) await ctx.close().catch(()=>{});server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
