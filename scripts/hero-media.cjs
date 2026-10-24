const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const slots = [
  { name: 'source-lesson', shapes: ['16:9'], audio: false },
  { name: 'source-podcast', shapes: ['16:9', '1:1'], audio: false },
  { name: 'source-x-video', shapes: ['16:9', '1:1'], audio: false },
];
const limit = 600000, totalLimit = 1500000;
const folder = path.resolve(__dirname, '../public/media/hero');
function findTool(name) {
  for (const candidate of [name, `E:/AI/tools/ffmpeg-8.1.2/bin/${name}.exe`]) {
    if (spawnSync(candidate, ['-version'], { windowsHide: true, stdio: 'ignore' }).status === 0) return candidate;
  }
  return null;
}
function probe(file, ffprobe) {
  const result = spawnSync(ffprobe, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,sample_aspect_ratio:stream_side_data=rotation:format=duration', '-of', 'json', file], { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error('Could not read this video. Try another MP4.');
  const data = JSON.parse(result.stdout), stream = data.streams?.[0];
  if (!stream?.width || !stream.height || !(Number(data.format?.duration) > 0)) throw new Error('No readable video or length found.');
  const [sarW, sarH] = (stream.sample_aspect_ratio || '1:1').split(':').map(Number);
  let width = stream.width * (sarW > 0 && sarH > 0 ? sarW / sarH : 1), height = stream.height;
  if (Math.abs(stream.side_data_list?.find(s => s.rotation !== undefined)?.rotation || 0) % 180 === 90) [width, height] = [height, width];
  return { width, height, duration: Number(data.format.duration) };
}
function shapeOf(info, shapes) {
  return shapes.find(shape => { const [w,h] = shape.split(':').map(Number); return Math.abs(info.width / info.height - w/h) / (w/h) < .025; });
}
function renderSlot(slot, directory = folder) {
  const file = path.join(directory, slot.name + '.mp4');
  const exists = fs.existsSync(file) && fs.statSync(file).size > 0;
  const poster = path.join(directory, slot.name + '.jpg');
  // Native video sizing preserves both accepted shapes without requiring tools at build time.
  const placeholder = `<div class="hero-media-placeholder" style="aspect-ratio:${slot.shapes[0].replace(':','/')}" role="img" aria-label="Your video here: ${slot.name}, ${slot.shapes[0]}"><strong>Your video here</strong><span>${slot.name}</span><small>${slot.shapes[0]}</small></div>`;
  return `<div class="hero-media-slot" data-media-slot="${slot.name}" data-media-state="${exists ? 'filled' : 'missing'}">${exists ? `<video controls muted loop playsinline preload="metadata" src="/media/hero/${slot.name}.mp4"${fs.existsSync(poster) && fs.statSync(poster).size > 0 ? ` poster="/media/hero/${slot.name}.jpg"` : ''} aria-label="${slot.name}"></video>` : placeholder}</div>`;
}
function shrink(file, slot, info, ffmpeg, ffprobe, budget) {
  const shape = shapeOf(info, slot.shapes) || slot.shapes[0];
  const [w,h] = shape === '1:1' ? [480,480] : [640,360];
  const original = file.replace(/\.mp4$/, '.orig.mp4');
  // Never overwrite the first backup, even on a second run.
  if (!fs.existsSync(original)) fs.copyFileSync(file, original, fs.constants.COPYFILE_EXCL);
  const temporary = file.replace(/\.mp4$/, '.shrink.mp4');
  let bitrate = Math.floor(budget * 8 * .86 / info.duration);
  try {
    for (let attempt = 0; attempt < 4; attempt++) {
      const result = spawnSync(ffmpeg, ['-hide_banner','-loglevel','error','-y','-i',file,'-map','0:v:0','-an','-vf',`scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24`,'-c:v','libx264','-preset','slow','-b:v',String(Math.max(1000,bitrate)),'-pix_fmt','yuv420p','-movflags','+faststart',temporary], { encoding: 'utf8', windowsHide: true });
      if (result.status !== 0) throw new Error('Could not shrink this video. The original is safe.');
      const bytes = fs.statSync(temporary).size;
      if (bytes <= budget) {
        const checked = probe(temporary, ffprobe);
        if (!shapeOf(checked, slot.shapes) || Math.abs(checked.duration-info.duration) > .15) throw new Error('The smaller copy did not pass the shape and length check.');
        fs.renameSync(temporary, file);
        return;
      }
      bitrate = Math.floor(bitrate * budget / bytes * .85);
    }
    throw new Error('Still too big. Use a shorter clip; the original is safe.');
  } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}
function report(directory = folder, shrinkRequested = false) {
  const ffmpeg = findTool('ffmpeg'), ffprobe = findTool('ffprobe');
  console.log('Hero media: 600 KB per loop; 1.5 MB altogether.');
  if (!ffmpeg) console.log('ffmpeg is missing. Posters and smaller copies cannot be made. Checked PATH and E:/AI/tools/ffmpeg-8.1.2/bin/.');
  if (!ffprobe) console.log('ffprobe is missing. Shape and length cannot be checked. Checked PATH and E:/AI/tools/ffmpeg-8.1.2/bin/.');
  const present = slots.filter(s => fs.existsSync(path.join(directory,s.name+'.mp4')));
  const totalBefore = present.reduce((n,s) => n+fs.statSync(path.join(directory,s.name+'.mp4')).size,0);
  let total = 0, failures = false;
  for (const slot of slots) {
    const file = path.join(directory,slot.name+'.mp4'), poster = path.join(directory,slot.name+'.jpg');
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) { console.log(`${slot.name}.mp4: missing (${slot.shapes.join(' or ')})`); continue; }
    let bytes = fs.statSync(file).size, info;
    try {
      if (ffprobe) info = probe(file, ffprobe);
      const budget = Math.min(limit, totalBefore > totalLimit ? Math.floor(totalLimit * bytes / totalBefore) : limit);
      if (shrinkRequested && bytes > budget && ffmpeg && info) {
        shrink(file, slot, info, ffmpeg, ffprobe, budget);
        bytes = fs.statSync(file).size; info = probe(file,ffprobe);
        console.log(`${slot.name}.mp4: smaller copy saved; original kept as ${slot.name}.orig.mp4`);
      }
      const problems = [];
      if (bytes > limit) problems.push('too big');
      if (info && !shapeOf(info,slot.shapes)) problems.push('wrong shape');
      failures ||= problems.length > 0;
      console.log(`${slot.name}.mp4: ${problems.join(', ') || 'filled'} (${(bytes/1000).toFixed(1)} KB${info ? `; ${info.width} x ${info.height}; ${info.duration.toFixed(2)} seconds` : '; shape and length unchecked'})`);
      if (!fs.existsSync(poster) && ffmpeg) {
        const result = spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',file,'-frames:v','1','-q:v','3',poster],{encoding:'utf8',windowsHide:true});
        if (result.status === 0) console.log(`  Made ${slot.name}.jpg from the first frame.`);
        else { if (fs.existsSync(poster)) fs.unlinkSync(poster); console.log('  Could not make a poster. The video can still be used without one.'); }
      }
    } catch (error) { console.log(`${slot.name}.mp4: wrong shape or unreadable video. ${error.message}`); failures = true; }
    total += bytes;
  }
  console.log(`Total: ${(total/1000).toFixed(1)} KB / 1500 KB${total > totalLimit ? ' (too big)' : ''}`);
  return failures || total > totalLimit ? 1 : 0;
}
module.exports = { slots, limit, totalLimit, folder, findTool, probe, shapeOf, renderSlot, report };
if (require.main === module) process.exitCode = report(folder, process.argv.includes('--shrink'));
