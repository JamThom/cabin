#!/usr/bin/env node
// build.mjs – bundles src/index.tsx → public/bundle.js using esbuild
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'public/bundle.js',
  alias: {
    '@/api': './src/api',
    '@/ui': './src/ui',
    '@/routes': './src/routes',
    '@/store': './src/store',
  },
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"development"' },
  sourcemap: true,
  logLevel: 'info',
});
