const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {slots,renderSlot,report,findTool,probe,shapeOf,limit,totalLimit} = require('./hero-media.cjs');
const scratch = path.resolve(__dirname,'../_scratch');
fs.mkdirSync(scratch,{recursive:true});
const temp = fs.mkdtempSync(path.join(scratch,'media-check-'));
const modulePath = path.resolve(__dirname,'hero-media.cjs');
const runReport = shrink => spawnSync(process.execPath,['-e',`process.exitCode=require(${JSON.stringify(modulePath)}).report(${JSON.stringify(temp)},${shrink})`],{encoding:'utf8'});
try {
  const empty=runReport(false);
  assert.equal(empty.status,0,empty.stderr);
  for(const slot of slots) {
    assert(empty.stdout.includes(`${slot.name}.mp4: missing`));
    const rendered=renderSlot(slot,temp);
    assert(rendered.includes('Your video here') && rendered.includes('16:9'));
    assert(!/\b(src|poster)=/.test(rendered));
  }
  const ffmpeg=findTool('ffmpeg'), ffprobe=findTool('ffprobe');
  if(ffmpeg && ffprobe) {
    const generate = (name,size) => {
      const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-f','lavfi','-i',`testsrc2=size=${size}:rate=24`,'-f','lavfi','-i','sine=frequency=440','-t','4','-c:v','libx264','-preset','ultrafast','-crf','0','-c:a','aac',path.join(temp,name+'.mp4')],{encoding:'utf8',windowsHide:true});
      assert.equal(result.status,0,result.stderr);
    };
    generate('source-lesson','640x360');
    generate('source-podcast','640x640');
    generate('source-x-video','360x640');
    const before=runReport(false);
    assert.equal(before.status,1);
    assert(before.stdout.includes('too big'));
    assert(before.stdout.includes('wrong shape'));
    for(const slot of slots) {
      assert(fs.existsSync(path.join(temp,slot.name+'.jpg')),'Missing first-frame poster');
      assert(renderSlot(slot,temp).includes(' poster='));
    }
    fs.unlinkSync(path.join(temp,'source-lesson.jpg'));
    assert(!renderSlot(slots[0],temp).includes(' poster='),'Optional poster must not be referenced');
    const smaller=runReport(true);
    assert.equal(smaller.status,0,smaller.stdout+smaller.stderr);
    let total=0;
    for(const slot of slots) {
      const file=path.join(temp,slot.name+'.mp4'), original=path.join(temp,slot.name+'.orig.mp4');
      assert(fs.existsSync(original));
      assert(fs.statSync(file).size<=limit);
      total+=fs.statSync(file).size;
      const info=probe(file,ffprobe);
      assert(shapeOf(info,slot.shapes));
      assert(Math.abs(info.duration-4)<.15,'Shrinking preserves length');
      const streams=JSON.parse(spawnSync(ffprobe,['-v','error','-show_streams','-of','json',file],{encoding:'utf8'}).stdout).streams;
      assert.equal(streams.length,1,'Silent slots lose audio');
      assert.equal(streams[0].codec_name,'h264');
    }
    assert(total<=totalLimit);
    assert.equal(shapeOf(probe(path.join(temp,'source-podcast.mp4'),ffprobe),['1:1']),'1:1');
    const backup=fs.readFileSync(path.join(temp,'source-lesson.orig.mp4'));
    assert.equal(runReport(true).status,0);
    assert.deepEqual(fs.readFileSync(path.join(temp,'source-lesson.orig.mp4')),backup,'Never overwrite the original');
    console.log('PASS: ffprobe sizes/shapes/lengths; ffmpeg first-frame posters; shrinking, H.264, no audio, total budget, square preservation, original backup.');
  } else console.log('SKIP: encoding checks need ffmpeg and ffprobe. Empty-folder and rendering checks passed.');
  // Simulate missing tools in memory without changing the local installation.
  const vm=require('node:vm');
  const log=[];
  const sandbox={module:{exports:{}},__dirname,console:{log:line=>log.push(line)},require:name=>name==='node:child_process'?{spawnSync:()=>({status:null})}:require(name)};
  vm.runInNewContext(fs.readFileSync(modulePath,'utf8'),sandbox);
  fs.writeFileSync(path.join(temp,'source-lesson.mp4'),'unprobed clip');
  sandbox.module.exports.report(temp);
  assert(log.some(line=>line.includes('ffmpeg is missing')));
  assert(log.some(line=>line.includes('ffprobe is missing')));
  assert(log.some(line=>line.includes('shape and length unchecked')));
  for(const slot of slots) assert(log.some(line=>line.startsWith(slot.name+'.mp4:')));
  console.log('PASS: empty folder exits 0 and lists every missing slot; no missing media/poster references; missing tools still report files.');
} finally {
  assert(temp.startsWith(scratch+path.sep));
  fs.rmSync(temp,{recursive:true,force:true});
}
