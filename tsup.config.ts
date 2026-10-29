import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // npm package: ESM + CommonJS with type declarations for both.
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
    platform: 'neutral',
    splitting: false,
    treeshake: true,
  },
  {
    // Script-tag bundle: <script src=".../stellards.global.min.js"></script> exposes window.StellarDS.
    entry: { stellards: 'src/browser.ts' },
    format: ['iife'],
    globalName: 'StellarDS',
    footer: { js: 'StellarDS = StellarDS.default;' },
    outExtension: () => ({ js: '.global.min.js' }),
    minify: true,
    sourcemap: true,
    target: 'es2020',
    platform: 'browser',
    dts: false,
    clean: false,
  },
  {
    entry: { stellards: 'src/browser.ts' },
    format: ['iife'],
    globalName: 'StellarDS',
    footer: { js: 'StellarDS = StellarDS.default;' },
    outExtension: () => ({ js: '.global.js' }),
    target: 'es2020',
    platform: 'browser',
    dts: false,
    clean: false,
  },
]);
