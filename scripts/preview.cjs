const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../out');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.mp4':'video/mp4' };
if (!fs.existsSync(root)) { console.error('Run npm run build first.'); process.exit(1); }
http.createServer((req,res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); }
  catch { return res.writeHead(400).end(); }
  if (!file.startsWith(root + path.sep) && file !== root) return res.writeHead(403).end();
  if (fs.existsSync(file+'.html')) file += '.html';
  else if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  const size = fs.statSync(file).size;
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Accept-Ranges','bytes');
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if (range) {
    const start = Number(range[1]), end = Math.min(range[2] ? Number(range[2]) : size-1,size-1);
    if (start > end) return res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();
    res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.setHeader('Content-Length',size); fs.createReadStream(file).pipe(res); }
}).listen(Number(process.env.PORT || 3000),'127.0.0.1',function () {
  console.log(`Preview: http://127.0.0.1:${this.address().port}`);
});
