// The rules that would make the published design system lie about itself.
// The build refuses to run while any of them fails, and `npm test` runs them too.
//
//   - every component the loader lists exists, with its .d.ts, its .prompt.md and a card
//   - components and kit screens draw from tokens: no hex, rgb() or hsl() literals,
//     no font-family names, no px radii outside the radius tokens
//   - no em dashes, and no spaced en dashes used like them, in anything written here
//   - no banned word in any copy a card, a kit screen or the landing page shows
//   - every token the components use exists

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { readTokens } from './tokens.mjs';

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  if (n === 'node_modules' || n === 'dist' || n.startsWith('.')) return [];
  return statSync(p).isDirectory() ? walk(p) : [p];
});

/** Files that draw the brand itself, and so may carry literal colour: the mark's gradients. */
const LITERAL_COLOUR_OK = new Set([
  'project/assets/obsydian-mark.svg', 'project/assets/obsydian-logo.svg', 'project/assets/obsydian-logo-light.svg',
  'project/assets/obsydian-favicon.svg', 'project/assets/shard.svg',
]);

export function lint(root) {
  const problems = [];
  const at = (p) => relative(root, p);
  const src = join(root, 'project');
  const comps = join(src, 'components');

  // ---- components are complete
  const loader = readFileSync(join(comps, '_loader.js'), 'utf8');
  const listed = JSON.parse(loader.match(/var FILES = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
  for (const f of listed) if (!existsSync(join(comps, f))) problems.push(`components/_loader.js lists ${f}, which does not exist`);
  const jsxFiles = walk(comps).filter((p) => p.endsWith('.jsx'));
  for (const p of jsxFiles) {
    const rel = relative(comps, p);
    if (!listed.includes(rel)) problems.push(`${at(p)} is not listed in components/_loader.js`);
    for (const ext of ['.d.ts', '.prompt.md']) {
      if (!existsSync(p.replace(/\.jsx$/, ext))) problems.push(`${at(p)} has no ${basename(p, '.jsx')}${ext}`);
    }
  }
  for (const dir of new Set(jsxFiles.map(dirname))) {
    if (!readdirSync(dir).some((n) => n.endsWith('.card.html'))) problems.push(`${at(dir)} has no card (*.card.html)`);
  }

  // ---- components and screens use tokens
  const tokens = readTokens(join(src, 'tokens'));
  const drawn = [...jsxFiles, ...walk(join(src, 'ui_kits')).filter((p) => p.endsWith('.jsx'))];
  for (const p of drawn) {
    const code = readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '');
    const hex = code.match(/#[0-9a-fA-F]{3,8}\b/g);
    if (hex) problems.push(`${at(p)} uses literal colour ${[...new Set(hex)].join(', ')}; use a colour token`);
    const fn = code.match(/\b(?:rgba?|hsla?)\(/g);
    if (fn) problems.push(`${at(p)} uses ${fn[0]}...); use a colour token`);
    const family = code.match(/fontFamily\s*:\s*['"](?!var\()[^'"]+['"]/g);
    if (family) problems.push(`${at(p)} names a font family (${family[0]}); use var(--font-display) or var(--font-body)`);
    const radius = code.match(/borderRadius\s*:\s*(?:(?!0\b)\d+|['"](?!0px)\d+px['"])/g);
    if (radius) problems.push(`${at(p)} sets a literal radius (${radius[0]}); use a radius token`);
    for (const m of code.matchAll(/var\(--([\w-]+)/g)) {
      if (m[1].endsWith('-')) continue; // a templated name, var(--type-${role}), checked by the components' own tests
      if (!tokens[m[1]] && !m[1].startsWith('local-')) problems.push(`${at(p)} uses --${m[1]}, which is not a token`);
    }
  }

  // ---- no em dashes, anywhere we write
  const written = [...readdirSync(root).filter((n) => n.endsWith('.md')).map((n) => join(root, n)), ...walk(src), ...walk(join(root, 'site')), ...walk(join(root, 'scripts'))]
    .filter((p) => /\.(md|html|jsx|js|mjs|css|json|ts)$/.test(p));
  for (const p of written) {
    const text = readFileSync(p, 'utf8');
    text.split('\n').forEach((line, i) => {
      if (line.includes(String.fromCharCode(0x2014))) problems.push(`${at(p)}:${i + 1} has an em dash`);
      if (new RegExp('\\s' + String.fromCharCode(0x2013) + '\\s').test(line)) problems.push(`${at(p)}:${i + 1} has a spaced en dash used as a dash`);
    });
  }

  // ---- literal colour outside tokens, kit screens and components is limited to the brand files
  for (const p of walk(join(src, 'assets'))) {
    if (p.endsWith('.svg') && !LITERAL_COLOUR_OK.has(at(p))) problems.push(`${at(p)} is a new asset; add it to LITERAL_COLOUR_OK in scripts/lint.mjs once checked against the mark`);
  }

  // ---- banned words in shown copy
  const banned = JSON.parse(readFileSync(join(src, 'guidelines/banned-words.json'), 'utf8'));
  const shown = [...drawn, ...walk(join(src, 'guidelines')).filter((p) => p.endsWith('.html')), join(root, 'site/index.html')];
  for (const p of shown) {
    const text = readFileSync(p, 'utf8').replace(/<[^>]+>/g, ' ');
    for (const w of banned.words) {
      const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (re.test(text) && !banned.allowIn?.includes(at(p))) problems.push(`${at(p)} says "${w}", which the voice rules ban`);
    }
  }

  return problems;
}
