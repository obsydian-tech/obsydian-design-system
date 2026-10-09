// Renders brand HTML to PNG and PDF with Chromium, with General Sans loaded, so every image and print file a
// template carries uses the real face. Shared by the asset, business card and preview steps.

import { chromium } from 'playwright';

const FONTS = '<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=block">';
const BASE = `<style>*{box-sizing:border-box;margin:0;padding:0}html,body{background:transparent}body{font-family:'General Sans',sans-serif;-webkit-font-smoothing:antialiased}</style>`;

let browser;
async function page(w, h, scale = 1) {
  browser ||= await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  return ctx.newPage();
}
async function load(p, html) {
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8">${FONTS}${BASE}</head><body>${html}</body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
}

/** HTML at w by h CSS pixels to a PNG at scale times that. transparent keeps the alpha. */
export async function png(html, w, h, file, { scale = 1, transparent = false } = {}) {
  const p = await page(w, h, scale);
  await load(p, html);
  await p.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
  await p.context().close();
}

/** HTML to a print PDF of the given page size (CSS lengths such as "90mm"). */
export async function pdf(html, file, { width, height }) {
  const p = await page(1200, 1200);
  await load(p, html);
  await p.pdf({ path: file, width, height, printBackground: true, preferCSSPageSize: true });
  await p.context().close();
}

export async function close() { if (browser) await browser.close(); browser = null; }

// ---------------------------------------------------------------- the mark, as HTML

const FACE = 'M11 3 L23 6 L26 18 L20 28 L9 25 L5 14 Z';
const EDGE = 'M23 6 L26 18 L20 28';

/** The official shard. on: "dark" (outline in bone) or "light" (outline in ink). glow adds the violet bloom.
    stone draws it as scenery (covers, decks): strokes then hold their weight in pixels instead of growing. */
export function shard({ size, on = 'dark', glow = false, id = 's', stone = false }) {
  const outline = on === 'dark' ? 'rgba(245,244,239,0.22)' : 'rgba(10,10,11,0.22)';
  const unit = 26 / size; // viewBox units per pixel
  const small = !stone; // a logo keeps the official proportions at every size; a stone thins like the splash
  const hair = small ? 0.75 : Math.max(0.75 * 32 / 26, 1.4) * unit;
  const edge = small ? 1.5 : Math.min(1.5, Math.max(3, size / 140) * unit);
  return `<svg viewBox="2.5 1.5 26 28" width="${size}" height="${Math.round(size * 28 / 26)}" style="display:block;overflow:visible">
    <defs>
      <linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#26262B"/><stop offset="1" stop-color="#0A0A0B"/></linearGradient>
      <linearGradient id="${id}e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A53AFF"/><stop offset="0.5" stop-color="#9318FF"/><stop offset="1" stop-color="#7C0FE6"/></linearGradient>
      <filter id="${id}b" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="${(small ? 0.8 : 14 * unit).toFixed(3)}"/></filter>
    </defs>
    <path d="${FACE}" fill="url(#${id}f)" stroke="${outline}" stroke-width="${hair.toFixed(4)}" stroke-linejoin="round"/>
    ${glow ? `<path d="${EDGE}" stroke="#9318FF" stroke-width="${(edge * 3).toFixed(4)}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.45" filter="url(#${id}b)"/>` : ''}
    <path d="${EDGE}" stroke="url(#${id}e)" stroke-width="${edge.toFixed(4)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`;
}

/** The lockup: shard, 8 units, "Obsydian Technologies" in 600 at -0.02em. */
export function lockup({ height, on = 'dark', name = 'Obsydian Technologies' }) {
  const word = Math.round(height * 17 / 22);
  const colour = on === 'dark' ? '#F5F4EF' : '#0A0A0B';
  return `<div style="display:inline-flex;align-items:center;gap:${Math.round(height * 8 / 22)}px">${shard({ size: Math.round(height * 26 / 28), on, id: 'l' + on })}
    <span style="font-weight:600;font-size:${word}px;letter-spacing:-0.02em;color:${colour};white-space:nowrap;line-height:1">${name}</span></div>`;
}

const GRAIN = `background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");background-size:180px 180px`;

/** A dark ground: obsydian, a violet haze where the shard sits, the shard itself at stone size, film grain. */
export function ground({ w, h, shardSize, shardX, shardY, haze = 0.16, shardOpacity = 1 }) {
  return `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:#0A0A0B">
    <div style="position:absolute;inset:0;background:radial-gradient(${Math.round(w * 0.5)}px ${Math.round(w * 0.5)}px at ${shardX + shardSize * 0.55}px ${shardY + shardSize * 0.5}px, rgba(147,24,255,${haze}), transparent 70%)"></div>
    ${shardSize ? `<div style="position:absolute;left:${shardX}px;top:${shardY}px;opacity:${shardOpacity}">${shard({ size: shardSize, glow: true, id: 'g', stone: true })}</div>` : ''}
    <div style="position:absolute;inset:0;opacity:0.05;mix-blend-mode:overlay;${GRAIN}"></div>
  </div>`;
}
