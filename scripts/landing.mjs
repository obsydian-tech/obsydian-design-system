// Renders site/index.html, filling its <!-- @placeholders --> from project/tokens and the voice rules.
// Every value on the landing page is read from the token files, so the page cannot disagree with the CSS.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readTokens } from './tokens.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------------------------------------------------------------- colour
const COLOUR_GROUPS = [
  ['Surfaces', 'Near-black does the lifting, in four steps.', ['obsydian', 'surface-1', 'surface-2', 'surface-3']],
  ['Bone', 'Every word on the site is bone at one of four strengths.', ['bone', 'bone-dim', 'bone-low', 'bone-faint']],
  ['Hairlines', 'Structure is drawn, never boxed.', ['hairline', 'hairline-strong', 'hairline-hover', 'hover-wash']],
  ['Violet', 'The one accent, and the alphas it is used at.', ['violet', 'violet-hover', 'violet-pressed', 'violet-hi', 'violet-deep', 'violet-glow', 'violet-wash', 'violet-ring', 'violet-haze', 'violet-line', 'violet-chip']],
  ['On violet', 'What sits on the primary button.', ['label-on-violet', 'violet-frame', 'selection-ink']],
  ['Glass', 'Only the nav and its menu are glass.', ['glass', 'glass-strong', 'scrim']],
  ['Fields', 'The recessed well, one step lighter than the page.', ['field-fill', 'field-fill-hover', 'field-fill-focus', 'field-edge', 'field-edge-hover', 'field-ring']],
  ['Invalid', 'The one colour outside the three, for a field that needs fixing and nothing else.', ['error-edge', 'error-ring', 'error-text']],
  ['The mark', 'The shard\'s outline and the spark that ignites it.', ['mark-outline', 'mark-spark']],
  ['Paper', 'The same system inverted for documents: ink on white, solid so it prints. Used by the templates.', ['paper', 'ink', 'ink-dim', 'ink-low', 'ink-rule', 'ink-rule-soft', 'ink-wash']],
  ['Scenes', 'Material colours for three.js. Never used in the interface.', ['scene-obsidian', 'scene-obsidian-dim', 'scene-groove', 'scene-lamp', 'scene-ember']],
];
const TEXTISH = /^(bone|violet-hi|error-text|label-on-violet)/;

function renderColour(t) {
  let count = 0;
  const html = COLOUR_GROUPS.map(([title, blurb, names]) => {
    const rows = names.filter((n) => t[n]).map((n) => {
      count++;
      const { value, note } = t[n];
      const sw = TEXTISH.test(n)
        ? `<span class="chip"><span style="color:var(--${n});font:var(--type-title-3);font-size:18px">Aa</span></span>`
        : `<span class="chip"><span class="chip-fill" style="background:var(--${n})"></span></span>`;
      return `<tr><td>${sw}</td><td><code class="tok">--${n}</code><span class="use">${esc(note)}</span></td><td><code class="hex">${esc(value)}</code></td></tr>`;
    }).join('');
    return `<div class="group"><div class="group-head"><h3>${title}</h3><p>${esc(blurb)}</p></div><div class="table-scroll"><table class="tokens">${rows}</table></div></div>`;
  }).join('');
  return { html, count };
}

// ---------------------------------------------------------------- type
const TYPE_ROWS = [
  ['Display', [['closing', 'Worth building?'], ['page', 'Engineering depth.'], ['hero', 'We build the platforms'], ['statement', 'Built for modern business.'], ['section', 'What we deliver'], ['stat', '30+']]],
  ['Titles', [['title-1', 'Enterprise Software Engineering'], ['title-2', 'Discovery and strategy'], ['title-3', 'Cloud and infrastructure'], ['prompt', 'Ready to scope an engagement?'], ['brief', 'What do you want built?'], ['wordmark', 'Obsydian Technologies']]],
  ['Reading', [['lede', 'Four practice areas. One team.'], ['body', 'Long-lived systems built by the team that will still be here in three years.'], ['body-sm', 'Custom software designed around your business.'], ['small', 'Your name'], ['meta', 'We reply within two business days.'], ['caption', 'Enter a valid email.']]],
  ['Labels', [['eyebrow', '01 What we do'], ['label', 'Partner enquiries'], ['action', 'Explore layer →']]],
];
function renderType(t) {
  let count = 0;
  const html = TYPE_ROWS.map(([group, rows]) => {
    const body = rows.filter(([r]) => t[`type-${r}`]).map(([r, sample]) => {
      count++;
      const v = t[`type-${r}`].value.replace(/ var\(--font-(display|body)\)/, '');
      const tr = t[`type-${r}-tracking`]?.value || t['type-reading-tracking'].value;
      return `<div class="type-row"><div class="type-meta"><code class="tok">--type-${r}</code><span class="spec">${esc(v)} · ${esc(tr)}</span><span class="use">${esc(t[`type-${r}`].note)}</span></div><div class="type-sample t-${r}">${esc(sample)}</div></div>`;
    }).join('');
    return `<div class="type-group"><h3 class="group-label">${group}</h3>${body}</div>`;
  }).join('');
  return { html, count };
}

// ---------------------------------------------------------------- shape
function renderShape(t) {
  const radii = Object.entries(t).filter(([k]) => k.startsWith('radius-')).map(([k, { value, note }]) =>
    `<figure class="radius"><div class="radius-box" style="border-radius:var(--${k})"></div><figcaption><code class="tok">--${k}</code><span class="spec">${esc(value)}</span><span class="use">${esc(note)}</span></figcaption></figure>`).join('');
  const SHADOWS = { 'shadow-pill': 'var(--glass)', 'shadow-field': 'var(--field-fill)', 'shadow-primary': 'var(--fill-primary)', 'shadow-violet': 'var(--fill-mark-edge)' };
  const shadows = Object.entries(SHADOWS).map(([k, bg]) =>
    `<figure class="shadow"><div class="shadow-box" style="box-shadow:var(--${k});background:${bg}${k === 'shadow-primary' ? ';border:3px solid var(--violet-frame);border-radius:var(--radius-button)' : ''}"></div><figcaption><code class="tok">--${k}</code><span class="use">${esc(t[k]?.note || '')}</span></figcaption></figure>`).join('');
  const count = Object.keys(t).filter((k) => /^(radius|shadow|fill|glow|blur)-/.test(k)).length;
  return { radii, shadows, count };
}

// ---------------------------------------------------------------- motion
function cubic(v) {
  const m = v.match(/cubic-bezier\(([^)]*)\)/); if (!m) return null;
  const [x1, y1, x2, y2] = m[1].split(',').map(parseFloat);
  const bez = (s, a, b) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  return Array.from({ length: 41 }, (_, i) => {
    const x = i / 40; let lo = 0, hi = 1;
    for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; (bez(mid, x1, x2) < x ? (lo = mid) : (hi = mid)); }
    return bez((lo + hi) / 2, y1, y2);
  });
}
function renderMotion(t) {
  const curves = [['ease-out', 'var(--violet)', 2.5], ['ease-page', 'var(--bone)', 1.5], ['ease-draw', 'var(--bone-low)', 1.5], ['ease-sweep', 'var(--violet-hi)', 1.5]];
  const X0 = 40, X1 = 544, Y0 = 219, Y1 = 38;
  const y = (v) => (Y0 - (Y0 - Y1) * v).toFixed(1);
  const paths = curves.map(([k, c, w]) => {
    const pts = cubic(t[k]?.value || '') || [0, 1];
    const d = pts.map((v, i) => `${i ? 'L' : 'M'}${(X0 + ((X1 - X0) * i) / (pts.length - 1)).toFixed(1)},${y(v)}`).join('');
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`;
  }).join('');
  const grid = [0, 0.5, 1].map((v) => `<line x1="${X0}" x2="${X1}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="32" y="${+y(v) + 4}" text-anchor="end" class="axis">${v.toFixed(1)}</text>`).join('');
  const svg = `<svg class="ease-chart" viewBox="0 0 560 260" role="img" aria-label="Easing curves: progress from 0 to 1 over the duration">${grid}
    <text x="${X0}" y="250" class="axis">0</text><text x="${X1}" y="250" text-anchor="end" class="axis">duration</text>${paths}</svg>`;
  const legend = curves.map(([k, c]) => `<li><span class="legend-line" style="background:${c}"></span><code class="tok">--${k}</code><span class="use">${esc(t[k]?.note || '')}</span></li>`).join('');
  const durations = Object.entries(t).filter(([k]) => /^(dur|rise|nudge)-/.test(k)).map(([k, { value, note }]) =>
    `<div class="dur"><span class="dur-v">${esc(value)}</span><code class="tok">--${k}</code><span class="use">${esc(note)}</span></div>`).join('');
  return { svg, legend, durations, count: Object.keys(t).filter((k) => /^(ease|dur|rise|nudge)-/.test(k)).length };
}

// ---------------------------------------------------------------- space
function renderSpace(t) {
  return Object.entries(t).filter(([, v]) => v.file === 'spacing.css').map(([k, { value, note }]) =>
    `<tr><td><code class="tok">--${k}</code></td><td><code class="hex">${esc(value)}</code></td><td><span class="use">${esc(note)}</span></td></tr>`).join('');
}

// ---------------------------------------------------------------- cards
function renderCards(cards) {
  const order = ['Colour', 'Type', 'Layout', 'Shape', 'Motion', 'Brand', 'Voice', 'Iconography', 'Scenes', 'Email', 'Components', 'Screens'];
  const groups = {};
  for (const c of cards) (groups[c.group || 'Other'] ||= []).push(c);
  return Object.keys(groups).sort((a, b) => order.indexOf(a) - order.indexOf(b)).map((g) =>
    `<div class="card-group"><h3 class="group-label">${esc(g)}</h3><ul class="card-links">${groups[g].map((c) =>
      `<li><a class="card-row" href="${esc(c.path)}"><span class="card-name">${esc(c.name || c.path)}</span><span class="use">${esc(c.subtitle || '')}</span><span class="card-arrow" aria-hidden="true">→</span></a></li>`).join('')}</ul></div>`).join('');
}

// ---------------------------------------------------------------- templates
const KIND = { docx: 'Word', pptx: 'PowerPoint', xlsx: 'Excel', html: 'HTML', zip: 'ZIP' };
function renderTemplates(src) {
  const m = JSON.parse(readFileSync(join(src, 'templates/templates.json'), 'utf8'));
  let count = 0;
  const html = m.groups.map((g) => `<div class="tpl-group"><h3 class="group-label">${esc(g.title)}</h3><div class="tpl-grid">${g.items.map((i) => {
    count++;
    const f = i.files[0];
    const ext = f.split('.').pop();
    const wide = /pptx$|html$|zip$/.test(f) && !/card/.test(i.id);
    return `<article class="tpl"><a class="tpl-preview${wide ? ' wide' : ''}" href="templates/files/${esc(f)}" download aria-label="Download ${esc(i.name)}"><img src="templates/previews/${esc(i.id)}.png" alt="" loading="lazy"></a>
      <div class="tpl-body"><span class="tpl-kind">${KIND[ext] || ext}</span><h4>${esc(i.name)}</h4><p>${esc(i.use)}</p>
      <a class="tpl-dl" href="templates/files/${esc(f)}" download>Download ${esc(f.replace(/^obsydian-/, ''))}&nbsp;→</a></div></article>`;
  }).join('')}</div></div>`).join('');
  return { html, count };
}

export function renderLanding({ src, site, cards, cdn }) {
  const t = readTokens(join(src, 'tokens'));
  const colour = renderColour(t);
  const type = renderType(t);
  const shape = renderShape(t);
  const motion = renderMotion(t);
  const banned = JSON.parse(readFileSync(join(src, 'guidelines/banned-words.json'), 'utf8')).words;
  const components = cards.filter((c) => /components\//.test(c.path)).length;
  const fill = {
    colour: colour.html, type: type.html, radii: shape.radii, shadows: shape.shadows,
    'motion-chart': motion.svg, 'motion-legend': motion.legend, 'motion-durations': motion.durations,
    templates: renderTemplates(src).html, space: renderSpace(t), banned: banned.map((w) => `<li>${esc(w)}</li>`).join(''), cards: renderCards(cards),
  };
  const counts = {
    tokens: String(Object.keys(t).length), colour: String(colour.count), type: String(type.count), shape: String(shape.count),
    motion: String(motion.count), cards: String(cards.length), components: String(components), templates: String(renderTemplates(src).count),
  };
  let html = readFileSync(join(site, 'index.html'), 'utf8');
  html = html.replace(/<!--\s*@([\w-]+)\s*-->/g, (m, k) => (k in fill ? fill[k] : m));
  html = html.replace(/\{\{count\.([\w-]+)\}\}/g, (m, k) => counts[k] ?? m);
  html = html.replace(/\{\{cdn\.([\w-]+)\}\}/g, (m, k) => cdn[k] ?? m);
  return { html };
}
