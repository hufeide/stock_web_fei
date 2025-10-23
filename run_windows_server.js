#!/usr/bin/env node
// Simple static server meant to be runnable from Windows CMD via the included run_windows.bat
// Usage: node run_windows_server.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2] || process.env.PORT || 8080);
const root = path.resolve(__dirname, 'frontend');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function safeJoin(rootDir, uriPath){
  const decoded = decodeURIComponent(uriPath.split('?')[0]);
  const fullPath = path.join(rootDir, decoded);
  if (!fullPath.startsWith(rootDir)) return null;
  return fullPath;
}

const server = http.createServer((req, res) => {
  try{
    let reqPath = req.url === '/' ? '/frontend/index.html' : req.url;
    // if url starts with /frontend or /, allow direct mapping
    if (reqPath === '/' || reqPath.startsWith('/frontend')){
      // normalize leading slash
      if (reqPath.startsWith('/')) reqPath = reqPath.slice(1);
      const filePath = safeJoin(root, reqPath.replace(/^frontend\//, ''));
      if (!filePath){ res.statusCode = 400; res.end('Bad request'); return; }
      const statPath = fs.existsSync(filePath) ? filePath : (fs.existsSync(filePath + '.html') ? filePath + '.html' : null);
      if (!statPath){ res.statusCode = 404; res.end('Not found'); return; }
      const ext = path.extname(statPath).toLowerCase();
      const ct = mime[ext] || 'application/octet-stream';
      res.statusCode = 200;
      res.setHeader('Content-Type', ct);
      const stream = fs.createReadStream(statPath);
      stream.pipe(res);
      stream.on('error', err => { res.statusCode = 500; res.end('Server error'); });
      return;
    }
    // fallback: try to serve from frontend folder directly
    const fp = safeJoin(root, req.url.replace(/^\//,''));
    if (fp && fs.existsSync(fp)){
      const ext = path.extname(fp).toLowerCase();
      res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
      fs.createReadStream(fp).pipe(res);
      return;
    }
    res.statusCode = 404; res.end('Not found');
  }catch(e){ res.statusCode=500; res.end('Server error'); }
});

server.listen(port, () => {
  console.log(`Static server serving ${root}`);
  console.log(`Open in your browser: http://localhost:${port}/frontend/index.html`);
  console.log('To stop the server: Ctrl+C');
});
