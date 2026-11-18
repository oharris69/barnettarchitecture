#!/usr/bin/env node
/**
 * Static server over stardust/prototypes for the home variant b import (/index-b).
 * Same resolution as serve-migrated.mjs (/x → /x/index.html, /x.html); paths the prototypes
 * do not hold fall back to stardust/migrated (the /projects index the parsers read facets from),
 * /_jsonld/<name>.json serves the home's served structured data (stardust/.work/eds/jsonld), and
 * /_content/<path>.plain.html serves a local content document read-only (e.g. the home's JSON-LD row).
 * Usage: node tools/importer/serve-prototypes.mjs [port]   (default 3120, binds 127.0.0.1)
 */
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import {
  join, extname, normalize, dirname,
} from 'path';
import { fileURLToPath } from 'url';

const STARDUST = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'stardust');
const ROOTS = [join(STARDUST, 'prototypes'), join(STARDUST, 'migrated')];
const JSONLD = join(STARDUST, '.work', 'eds', 'jsonld');
const CONTENT = join(STARDUST, '..', 'content');
const PORT = Number(process.argv[2] || 3120);
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
};

async function isFile(p) {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

async function resolvePath(pathname) {
  const rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const jl = /^\/_jsonld\/([\w-]+\.json)$/.exec(rel);
  if (jl) {
    const f = join(JSONLD, jl[1]);
    return (await isFile(f)) ? f : null;
  }
  const doc = /^\/_content\/([\w/-]+\.plain\.html)$/.exec(rel);
  if (doc) {
    const f = join(CONTENT, doc[1]);
    return f.startsWith(CONTENT) && (await isFile(f)) ? f : null;
  }
  for (const root of ROOTS) {
    const base = join(root, rel);
    if (!base.startsWith(root)) return null;
    const candidates = [base, join(base, 'index.html'), `${base.replace(/\/$/, '')}.html`];
    for (const c of candidates) {
      // eslint-disable-next-line no-await-in-loop
      if (await isFile(c)) return c;
    }
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
  console.log(`serving ${ROOTS.join(' + ')} on http://127.0.0.1:${PORT}`);
});
