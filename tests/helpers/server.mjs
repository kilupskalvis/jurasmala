// Tiny static server for the tests. Behaves like GitHub Pages for what the site relies on:
// files from the repo root, "/" -> index.html, and 404.html with status 404 for anything missing.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.json': 'application/json', '.svg': 'image/svg+xml',
};

async function fileFor(root, urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  let p = path.join(root, clean);
  if (!p.startsWith(root)) return null;
  try {
    if ((await stat(p)).isDirectory()) p = path.join(p, 'index.html');
    await stat(p);
    return p;
  } catch {
    return null;
  }
}

export function startServer(root = repoRoot) {
  const server = http.createServer(async (req, res) => {
    const file = await fileFor(root, req.url);
    if (file) {
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
      return;
    }
    const notFound = path.join(root, '404.html');
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    res.end(await readFile(notFound).catch(() => 'Not found'));
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ url: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(() => r())) });
    });
  });
}
