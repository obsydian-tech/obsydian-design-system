// The design system's own checks: run by `npm test` in CI and before every deploy.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';
import { lint } from './lint.mjs';
import { readTokens, tokensToScss } from './tokens.mjs';
import { renderLanding } from './landing.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'project');
const tokens = readTokens(join(SRC, 'tokens'));
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

test('the system obeys its own rules', () => {
  assert.deepEqual(lint(ROOT), []);
});

test('the core palette is the website palette', () => {
  // These are the values in the website's src/styles/_variables.scss on main. Changing one is a brand decision.
  const site = {
    obsydian: '#0A0A0B', 'surface-1': '#131316', 'surface-2': '#1C1C20', 'surface-3': '#26262B', bone: '#F5F4EF',
    'bone-dim': 'rgba(245, 244, 239, 0.62)', 'bone-low': 'rgba(245, 244, 239, 0.40)', 'bone-faint': 'rgba(245, 244, 239, 0.18)',
    hairline: 'rgba(245, 244, 239, 0.08)', 'hairline-strong': 'rgba(245, 244, 239, 0.14)',
    violet: '#9318FF', 'violet-hover': '#A53AFF', 'violet-pressed': '#7C0FE6', 'violet-hi': '#B25CFF', 'violet-deep': '#6A0BD0',
    'violet-glow': 'rgba(147, 24, 255, 0.32)', 'violet-wash': 'rgba(147, 24, 255, 0.08)',
    'radius-sm': '6px', 'radius-md': '10px', 'radius-lg': '16px', 'radius-pill': '999px',
    'ease-out': 'cubic-bezier(0.2, 0.8, 0.2, 1)', 'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'dur-fast': '180ms', 'dur-base': '250ms', 'dur-nav': '350ms', 'dur-reveal': '600ms', 'content-max': '1440px',
    'shadow-pill': '0 8px 32px rgba(0, 0, 0, 0.4)', 'shadow-violet': '0 8px 32px rgba(147, 24, 255, 0.28)',
  };
  for (const [k, v] of Object.entries(site)) assert.equal(tokens[k]?.value, v, `--${k}`);
});

test('the field tokens are the website field recipe', () => {
  const field = { 'field-fill': '#111114', 'field-fill-hover': '#141417', 'field-fill-focus': '#15151A', 'field-edge': 'rgba(245, 244, 239, 0.16)',
    'field-edge-hover': 'rgba(245, 244, 239, 0.26)', 'field-ring': 'rgba(147, 24, 255, 0.18)', 'error-edge': 'rgba(245, 120, 120, 0.65)' };
  for (const [k, v] of Object.entries(field)) assert.equal(tokens[k]?.value, v, `--${k}`);
});

test('every token has a note saying what it is for', () => {
  const silent = Object.entries(tokens).filter(([k, v]) => !v.note && !/-tracking$/.test(k) && !/^(type|weight|font)-/.test(k) && k !== 'numeric');
  assert.deepEqual(silent.map(([k]) => k), []);
});

test('the SCSS export has every token, with nothing left unresolved', () => {
  const scss = tokensToScss(join(SRC, 'tokens'));
  for (const k of Object.keys(tokens)) assert.match(scss, new RegExp(`^\\$${k}: `, 'm'), `$${k}`);
  assert.doesNotMatch(scss, /var\(--/);
});

test('the shard is drawn from the official geometry', () => {
  const asset = read('project/assets/obsydian-mark.svg');
  const comp = read('project/components/core/ShardMark.jsx');
  const face = comp.match(/SHARD_FACE = '([^']+)'/)[1];
  const edge = comp.match(/SHARD_EDGE = '([^']+)'/)[1];
  assert.ok(asset.includes(`d="${face}"`), 'face path matches obsydian-mark.svg');
  assert.ok(asset.includes(`d="${edge}"`), 'edge path matches obsydian-mark.svg');
  assert.ok(read('project/assets/obsydian-logo.svg').includes(`d="${face}"`), 'the logo carries the same face');
});

test('every component file compiles, and the bundle has no clashing names', () => {
  const loader = read('project/components/_loader.js');
  const files = JSON.parse(loader.match(/var FILES = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
  const names = new Map();
  for (const f of files) {
    const src = read(join('project/components', f));
    transformSync(src, { loader: 'jsx' });
    for (const m of src.matchAll(/^(?:export\s+)?(?:function|const|let)\s+([A-Za-z_]\w*)/gm)) {
      assert.ok(!names.has(m[1]), `${m[1]} is declared in both ${names.get(m[1])} and ${f}`);
      names.set(m[1], f);
    }
  }
});

test('kit screens only use components the system exports', () => {
  const loader = read('project/components/_loader.js');
  const files = JSON.parse(loader.match(/var FILES = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
  const exported = new Set(files.flatMap((f) => [...read(join('project/components', f)).matchAll(/^export\s+(?:function|const)\s+([A-Za-z_]\w*)/gm)].map((m) => m[1])));
  const kit = readdirSync(join(SRC, 'ui_kits/website')).filter((n) => n.endsWith('.jsx')).map((n) => read(join('project/ui_kits/website', n))).join('\n');
  const local = new Set([...kit.matchAll(/^(?:export\s+)?(?:function|const)\s+([A-Za-z_]\w*)/gm)].map((m) => m[1]));
  const used = new Set([...kit.matchAll(/<([A-Z]\w*)/g)].map((m) => m[1]));
  const unknown = [...used].filter((n) => !exported.has(n) && !local.has(n));
  assert.deepEqual(unknown, []);
});

test('the landing page fills every placeholder', () => {
  const { html } = renderLanding({ src: SRC, site: join(ROOT, 'site'), cards: [{ path: 'guidelines/x.html', name: 'X', group: 'Colour', subtitle: '' }], cdn: { react: 'r', reactDom: 'd', lucide: 'l' } });
  assert.doesNotMatch(html, /<!--\s*@[\w-]+\s*-->/);
  assert.doesNotMatch(html, /\{\{[\w.]+\}\}/);
  for (const w of JSON.parse(read('project/guidelines/banned-words.json')).words) assert.ok(html.includes(`<li>${w}</li>`), `lists ${w}`);
});

test('every card the build will find has a name, a group and a viewport', () => {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  const pages = walk(SRC).filter((p) => p.endsWith('.html') && !p.includes('/templates/'));
  assert.ok(pages.length >= 20, `${pages.length} pages`);
  for (const p of pages) {
    const meta = readFileSync(p, 'utf8').match(/<!--\s*@dsCard\s+([^>]*?)-->/);
    assert.ok(meta, `${p} has an @dsCard comment`);
    for (const a of ['name', 'group', 'viewport', 'subtitle']) assert.match(meta[1], new RegExp(`${a}="[^"]+"`), `${p} ${a}`);
  }
});

test('the old standalone bundle is gone', () => {
  assert.ok(!existsSync(join(ROOT, 'index.html')));
});
