#!/usr/bin/env node
// watch.mjs – builds and watches for changes, then serves public/
import { context } from 'esbuild';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ctx = await context({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'public/bundle.js',
  alias: {
    '@/api': './src/api',
    '@/ui': './src/ui',
    '@/routes': './src/routes',
    '@/store': './src/store',
    '@/utils': './src/utils',
  },
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"development"' },
  sourcemap: true,
  logLevel: 'info',
});

await ctx.watch();

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.map': 'application/json',
};

const PORT = 3000;
createServer((req, res) => {
  let filePath = join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  if (!existsSync(filePath)) filePath = join(__dirname, 'public', 'index.html');
  const ext = extname(filePath) || '.html';
  res.writeHead(200, { 'Content-Type': mime[ext] ?? 'text/plain' });
  res.end(readFileSync(filePath));
}).listen(PORT, () => {
  console.log(`\n🏕️  Cabin Organiser running at http://localhost:${PORT}\n`);
});
