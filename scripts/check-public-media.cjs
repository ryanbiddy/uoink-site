// Hashes identify reviewed source imagery; they do not replace visual review of new assets.
const fs = require('node:fs');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const manifest = require('../app/content/family-media.json');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const files = execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(file=>file&&fs.existsSync(file));
const forbiddenName=String.fromCharCode(83,119,121,120);
const issues=[];
// Block every reviewed source frame, including the former OG cover.
const blocked=new Set(manifest.blockedMediaSha256);
const pending=new Set(manifest.pendingReshootSha256);
const pendingReshoot=[];
for(const file of files) {
 const bytes=fs.readFileSync(file);
 const digest=hash(bytes);
 if(bytes.toString('utf8').toLowerCase().includes(forbiddenName.toLowerCase())) issues.push({file,reason:'Forbidden guest name'});
 if(blocked.has(digest)) issues.push({file,reason:'Reviewed source imagery still present'});
 if(pending.has(digest)) pendingReshoot.push(file);
}
fs.mkdirSync('_scratch/shots-hero',{recursive:true});
fs.writeFileSync('_scratch/shots-hero/public-media-review.json',JSON.stringify({issues,pendingReshoot},null,2));
if(pendingReshoot.length) console.warn(`WARN: ${pendingReshoot.length} legacy media files pending re-shoot: ${pendingReshoot.join(', ')}`);
if(issues.length) {console.error('FAIL: public media review',issues);process.exitCode=1;}
else console.log('PASS: no forbidden guest name or blocked source frames in repository files.');
