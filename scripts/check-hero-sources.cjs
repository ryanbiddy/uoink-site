// Public-safe snapshots of the supplied final source JSON and spoken podcast receipts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const final = require('./fixtures/UOINK-SOURCES-FINAL.json');
const podcast = require('./fixtures/receipts.json');
const labels = require('../public/media/hero/labels.json');
const decode = text => text.replace(/&(?:amp|quot|apos|lt|gt|#x27|#39);/g, entity => ({'&amp;':'&','&quot;':'"','&apos;':"'",'&#x27;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>'}[entity]));
function check(home) {
  assert(!/ThursdAI/i.test(home), 'Removed source must not appear in exported home');
  assert(!/who to contact when it breaks|escalation path/i.test(home), 'No unsupported escalation claim');
  const html = home.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  for (const property of ['og:image:alt','twitter:image:alt']) assert(html.includes(`${property}" content="Uoink: Save what you watch. Your AI writes from it, with receipts."`), `Exported ${property}`);
  for (const [property,value] of [['og:image:width','1200'],['og:image:height','630']]) assert(html.includes(`${property}" content="${value}"`), `Exported ${property}`);
  const receipts = [...final.sources[0].receipts, ...Object.values(podcast).map(r => ({quote:r.verbatim, link:r.deep_link}))];
  const byLink = new Map(receipts.map(r => [r.link, r.quote]));
  for (const [key, slot] of [['lesson','lesson'],['podcast','podcast'],['x','x-video']]) {
    const expected = final.sources.find(s => s.slot === slot), actual = labels.sources[key];
    for (const field of ['title','who','length','url']) assert.equal(actual[field], expected[field], `${key}: ${field}`);
    const date = new Date(expected.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).replace(',','');
    assert.equal(actual.date, date);
  }
  for (const source of ['lesson','podcast']) for (const receipt of Object.values(labels.sources[source].receipts)) {
    assert(byLink.has(receipt.link), `Unapproved receipt: ${receipt.link}`);
    assert.equal(receipt.quote, byLink.get(receipt.link), 'Exact source quotation');
    const seconds = receipt.time.split(':').reduce((n,part) => n*60+Number(part),0);
    assert.equal(new URL(receipt.link).searchParams.get('t'), `${seconds}s`, 'Displayed minute matches link');
  }
  for (const [i,key] of ['agreementGoal','agreementSchedule','agreementImprove'].entries()) assert.equal(labels.drafts[key],final.where_they_agree[i].line);
  let count = 0;
  for (const [,attrs,body] of html.matchAll(/<a\b([^>]+)>([\s\S]*?)<\/a>/g)) {
    const href = decode(attrs.match(/\bhref="([^"]+)"/)?.[1] || '');
    const isReceipt = /\bclass="[^"]*\b(?:citation|hm-receipt|hm-reader-time)\b/.test(attrs) || /[?&]t=/.test(href);
    if (!isReceipt) continue;
    count++;
    // Every receipt opens the source at its minute; none points inside the page.
    assert(!href.startsWith('#'), `Receipt must link to the source minute: ${href}`);
    assert(byLink.has(href), `Exported receipt URL is not in final sources: ${href}`);
    // The minute a receipt shows is the minute it opens.
    const shown = body.replace(/<[^>]*>/g, ' ').match(/\b(\d{1,2}):(\d\d)\b/);
    assert(shown, `Receipt shows its minute: ${href}`);
    assert.equal(`${Number(shown[1]) * 60 + Number(shown[2])}s`, new URL(href).searchParams.get('t'), `Shown minute ${shown[0]} matches ${href}`);
  }
  assert(count > 0, 'Export must contain receipts');
  const quoted = [...html.matchAll(/<(mark|p)\b[^>]*data-source-quote="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)];
  for (const [, ,id,text] of quoted) {
    const [source,key] = id.split('.');
    assert.equal(decode(text), labels.sources[source].receipts[key].quote, `Exported quote ${id}`);
  }
  assert(quoted.length >= 6, 'Expected caption excerpts are exported');
  for (const receipt of final.sources[0].receipts) {
    assert(html.includes(receipt.link.replaceAll('&','&amp;')), `Missing lesson receipt ${receipt.time}`);
    assert(quoted.some(m => decode(m[3]) === receipt.quote), `Missing exact lesson line ${receipt.time}`);
  }
  assert(!Object.keys(labels.sources.x).some(key => /quote|receipts/i.test(key)), 'X stays paraphrase only');
  assert(!/data-source-quote="x\./.test(html));
  console.log(`PASS: ${count} exported receipt links match final sources; exact quotes, dates, times and agreement lines; no removed source.`);
}
module.exports = check;
if (require.main === module) check(fs.readFileSync(path.join(__dirname,'../out/index.html'),'utf8'));
