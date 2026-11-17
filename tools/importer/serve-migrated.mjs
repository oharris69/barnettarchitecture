#!/usr/bin/env node
/**
 * Static server over stardust/migrated for the content import.
 * Resolves /x/y → /x/y/index.html (and /x/y.html), / → /index.html.
 * Usage: node tools/importer/serve-migrated.mjs [port]   (default 3110, binds 127.0.0.1)
 */
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname, normalize, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'stardust', 'migrated');
const PORT = Number(process.argv[2] || 3110);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

async function isFile(p) {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

async function resolvePath(pathname) {
  const rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const base = join(ROOT, rel);
  if (!base.startsWith(ROOT)) return null;
  const candidates = [base, join(base, 'index.html'), `${base.replace(/\/$/, '')}.html`];
  for (const c of candidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await isFile(c)) return c;
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const file = await resolvePath(pathname);
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
    return;
  }
  const body = await readFile(file);
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(body);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`serving ${ROOT} on http://127.0.0.1:${PORT}`);
});
