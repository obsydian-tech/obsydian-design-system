#!/usr/bin/env node
// Builds the published Obsydian design system into dist/.
//
//   npm run build     then   npm run serve
//
// project/ is the source of truth. Its pages compile React components in the
// browser with Babel, which is slow on a phone, so the build:
//   1. checks the rules that would make the published system lie (lint.mjs)
//   2. copies project/ to dist/
//   3. compiles every component into dist/_ds_bundle.js (window.ObsydianDS)
//   4. compiles each UI kit's screens into a bundle beside its index.html
//   5. rewrites every page: production React, no Babel, scripts precompiled
//   6. renders the landing page from site/, with token tables generated from
//      project/tokens, so the page cannot disagree with the CSS
//   7. writes dist/obsydian-tokens.scss, the same tokens as SCSS variables,
//      for the website to vendor
//
// Nothing in dist/ is hand-edited output.

import { cpSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';
import { renderLanding } from './landing.mjs';
import { lint } from './lint.mjs';
import { tokensToScss } from './tokens.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'project');
const SITE = join(ROOT, 'site');
const DIST = join(ROOT, 'dist');

const CDN = {
  react: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  reactDom: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  lucide: 'https://unpkg.com/lucide@1.39.0/dist/umd/lucide.min.js',
};
const HOOKS = 'const {useState,useRef,useEffect,useLayoutEffect,useMemo,useCallback,useId,useReducer}=React;';

const read = (p) => readFileSync(p, 'utf8');
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

function jsx(code, file) {
  try {
    return transformSync(code, {
      loader: 'jsx', jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment',
      target: 'es2020', minify: true, legalComments: 'none',
    }).code;
  } catch (e) {
    throw new Error(`${file}: ${e.message}`);
  }
}

// Mirrors components/_loader.js: strip import lines, turn `export function|const` into plain declarations.
const unmodule = (src) => src.replace(/^import[^\n]*$/gm, '').replace(/^export\s+(function|const|let)/gm, '$1');
const topLevelNames = (src) => [...new Set([...src.matchAll(/^(?:function|const|let)\s+([A-Za-z_]\w*)/gm)].map((m) => m[1]))];

// ---------------------------------------------------------------- 1. rules
const problems = lint(ROOT);
if (problems.length) {
  throw new Error(`The design system breaks its own rules:\n  ${problems.join('\n  ')}`);
}

// ---------------------------------------------------------------- 2. copy
rmSync(DIST, { recursive: true, force: true });
cpSync(SRC, DIST, { recursive: true, filter: (p) => !p.endsWith('.thumbnail') && !p.includes('.DS_Store') });

// ---------------------------------------------------------------- 3. component bundle
const loaderSrc = read(join(SRC, 'components/_loader.js'));
const files = JSON.parse(loaderSrc.match(/var FILES = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
let dsSource = '';
for (const f of files) dsSource += unmodule(read(join(SRC, 'components', f))) + '\n';
const dsNames = topLevelNames(dsSource);
writeFileSync(
  join(DIST, '_ds_bundle.js'),
  `/* Obsydian design system components, compiled from project/components. */\n` +
  jsx(`(function(){${HOOKS}\n${dsSource}\nwindow.ObsydianDS={${dsNames.join(',')}};})();`, 'components'),
);

// The loader already prefers a compiled bundle for components; teach loadKit to prefer a compiled kit.
writeFileSync(
  join(DIST, 'components/_loader.js'),
  loaderSrc.replace(
    'window.loadKit = async function (dsBase, kitBase, kitFiles) {',
    'window.loadKit = async function (dsBase, kitBase, kitFiles) {\n    if (window.ObsydianKIT) { var D = await window.loadDS(dsBase); return Object.assign({}, D, window.ObsydianKIT); }',
  ),
);

// ---------------------------------------------------------------- 4 + 5. pages
const cards = [];
for (const file of walk(DIST).filter((p) => p.endsWith('.html'))) {
  const rel = relative(DIST, file);
  let html = read(file);

  const meta = html.match(/<!--\s*@dsCard\s+([^>]*?)-->/);
  if (meta) {
    const attrs = Object.fromEntries([...meta[1].matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
    const [w, h] = (attrs.viewport || '700x400').split('x').map(Number);
    cards.push({ path: rel, name: attrs.name, group: attrs.group, subtitle: attrs.subtitle, width: w, height: h });
  }

  // Compile the UI kit a page loads, and put it beside the page.
  const kit = html.match(/loadKit\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*(\[[^\]]*\])/);
  if (kit) {
    const kitBase = join(dirname(join(SRC, rel)), kit[2]);
    const kitFiles = JSON.parse(kit[3].replace(/'/g, '"'));
    let kitSource = '';
    for (const f of kitFiles) kitSource += unmodule(read(join(kitBase, f))) + '\n';
    const bundleName = rel.replace(/[\\/]/g, '_').replace(/\.html$/, '') + '.kit.js';
    writeFileSync(
      join(dirname(file), bundleName),
      jsx(`(function(){const {${dsNames.join(',')}}=window.ObsydianDS;${HOOKS}\n${kitSource}\nwindow.ObsydianKIT={${topLevelNames(kitSource).join(',')}};})();`, rel),
    );
    html = html.replace(/(<script src="[^"]*_ds_bundle\.js"[^>]*><\/script>)/, `$1\n<script src="./${bundleName}"></script>`);
  }

  html = html
    .replace(/https:\/\/unpkg\.com\/react@[^/]+\/umd\/react\.development\.js/g, CDN.react)
    .replace(/https:\/\/unpkg\.com\/react-dom@[^/]+\/umd\/react-dom\.development\.js/g, CDN.reactDom)
    .replace(/https:\/\/unpkg\.com\/lucide@[^/]+\/dist\/umd\/lucide\.min\.js/g, CDN.lucide)
    .replace(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"><\/script>/g, '')
    .replace(/<script type="text\/babel">([\s\S]*?)<\/script>/g, (_, code) => `<script>${jsx(code, rel)}</script>`);

  if (!/name="viewport"/.test(html)) {
    html = html.replace(/<meta charset="utf-8">/i, '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">');
  }
  writeFileSync(file, html);
}

// ---------------------------------------------------------------- 6. landing page
const landing = renderLanding({ src: SRC, site: SITE, cards, cdn: CDN });
writeFileSync(join(DIST, 'index.html'), landing.html);
writeFileSync(join(DIST, 'landing.js'), `/* Obsydian design system landing page demos. */\n` + jsx(read(join(SITE, 'landing.jsx')), 'site/landing.jsx'));
cpSync(join(SRC, 'assets/obsydian-favicon.svg'), join(DIST, 'favicon.svg'));
writeFileSync(join(DIST, 'cards.json'), JSON.stringify(cards, null, 2));
writeFileSync(join(DIST, '.nojekyll'), '');

// ---------------------------------------------------------------- 7. SCSS for the website
writeFileSync(join(DIST, 'obsydian-tokens.scss'), tokensToScss(join(SRC, 'tokens')));

console.log(`Built dist/: ${dsNames.length} components, ${cards.length} cards, landing ${Math.round(landing.html.length / 1024)} kB.`);
