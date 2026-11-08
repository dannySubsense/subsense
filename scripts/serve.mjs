// Test the same /subsense/ base path used by GitHub project Pages.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root = resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith('/subsense/')) throw new Error('Wrong base path');
    const path = resolve(root, pathname.slice('/subsense/'.length) || 'index.html');
    if (!path.startsWith(root + sep)) throw new Error('Outside public root');
    const info = await stat(path);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Content-Length': info.size });
    if (request.method === 'HEAD') response.end();
    else createReadStream(path).pipe(response);
  } catch { response.writeHead(404); response.end('Not found'); }
}).listen(4173, '127.0.0.1');
