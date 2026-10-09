#!/usr/bin/env node
// Builds every template into project/templates/files: `npm run templates`.
// The files are committed, so the design system's build only copies them; run this after changing a template.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Packer } from 'docx';
import { renderAssets } from './assets.mjs';
import { WORD_TEMPLATES } from './docs.mjs';
import { close } from './render.mjs';
import { makeDeck } from './deck.mjs';
import { makeWorkbook } from './workbook.mjs';
import { makeCard, signatureHtml } from './card.mjs';

const ROOT = new URL('../../project/templates/', import.meta.url).pathname;
const FILES = join(ROOT, 'files');
const only = process.argv[2];

mkdirSync(FILES, { recursive: true });
if (!only || only === 'assets') await renderAssets(join(ROOT, 'assets'));
for (const [name, make] of Object.entries(WORD_TEMPLATES)) {
  if (only && only !== 'word' && only !== name) continue;
  writeFileSync(join(FILES, `${name}.docx`), await Packer.toBuffer(make()));
  console.log(`  ${name}.docx`);
}
if (!only || only === 'deck') {
  await makeDeck().writeFile({ fileName: join(FILES, 'obsydian-client-deck.pptx') });
  console.log('  obsydian-client-deck.pptx');
}
if (!only || only === 'workbook') {
  await (await makeWorkbook()).xlsx.writeFile(join(FILES, 'obsydian-invoice-workbook.xlsx'));
  console.log('  obsydian-invoice-workbook.xlsx');
}
if (!only || only === 'card') {
  await makeCard().writeFile({ fileName: join(FILES, 'obsydian-business-card.pptx') });
  writeFileSync(join(FILES, 'obsydian-email-signature.html'), signatureHtml());
  console.log('  obsydian-business-card.pptx, obsydian-email-signature.html');
}
await close();

// ---------------------------------------------------------------- previews, logo pack, everything zip
// Previews need LibreOffice and poppler (brew install --cask libreoffice; brew install poppler).
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { png, close as closeRender } from './render.mjs';

if (!only || only === 'pack') {
  const tmp = join(ROOT, '.pack'); rmSync(tmp, { recursive: true, force: true }); mkdirSync(join(tmp, 'Obsydian logo pack'), { recursive: true });
  const L = join(tmp, 'Obsydian logo pack');
  const A = new URL('../../project/assets/', import.meta.url).pathname;
  cpSync(join(A, 'obsydian-mark.svg'), join(L, 'obsydian-mark.svg'));
  cpSync(join(A, 'obsydian-logo.svg'), join(L, 'obsydian-lockup-on-dark.svg'));
  cpSync(join(A, 'obsydian-logo-light.svg'), join(L, 'obsydian-lockup-on-light.svg'));
  cpSync(join(A, 'obsydian-favicon.svg'), join(L, 'obsydian-app-tile.svg'));
  cpSync(join(ROOT, 'assets/mark.png'), join(L, 'obsydian-mark.png'));
  cpSync(join(ROOT, 'assets/logo-bone.png'), join(L, 'obsydian-lockup-on-dark.png'));
  cpSync(join(ROOT, 'assets/logo-ink.png'), join(L, 'obsydian-lockup-on-light.png'));
  writeFileSync(join(L, 'README.txt'), [
    'Obsydian logo pack', '',
    'obsydian-lockup-on-light   the shard and the name, for white or light grounds (documents, invoices)',
    'obsydian-lockup-on-dark    the same for black grounds (decks, social, the web)',
    'obsydian-mark              the shard alone, for small spaces and avatars',
    'obsydian-app-tile          the shard on its black tile, for app icons and favicons', '',
    'Use the files as they are. Never redraw, recolour, stretch, rotate or outline the shard, never put it on a',
    'gradient square, and never set the name in another font. Leave clear space around the lockup at least the',
    'height of the shard. Smallest sizes: lockup 30mm or 120px wide; mark 6mm or 20px.', '',
    'More: https://obsydian-tech.github.io/obsydian-design-system/#brand', '',
  ].join('\n'));
  rmSync(join(FILES, 'obsydian-logo-pack.zip'), { force: true });
  execFileSync('zip', ['-qrX', join(FILES, 'obsydian-logo-pack.zip'), 'Obsydian logo pack'], { cwd: tmp });
  rmSync(tmp, { recursive: true, force: true });
  console.log('  obsydian-logo-pack.zip');
}

const manifest = JSON.parse(readFileSync(join(ROOT, 'templates.json'), 'utf8'));
const items = manifest.groups.flatMap((g) => g.items);

if (!only || only === 'previews') {
  const soffice = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
  const PREV = join(ROOT, 'previews'); mkdirSync(PREV, { recursive: true });
  const tmp = join(ROOT, '.render'); rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp);
  const office = items.filter((i) => /\.(docx|pptx|xlsx)$/.test(i.files[0]));
  if (existsSync(soffice)) {
    execFileSync(soffice, ['--headless', '--convert-to', 'pdf', '--outdir', tmp, ...office.map((i) => join(FILES, i.files[0]))], { stdio: 'ignore' });
    for (const i of office) {
      execFileSync('pdftoppm', ['-png', '-r', '96', '-f', '1', '-l', '1', '-singlefile', join(tmp, `${i.id}.pdf`), join(PREV, i.id)]);
    }
  } else console.log('  (LibreOffice not found: office previews skipped)');
  rmSync(tmp, { recursive: true, force: true });
  // The signature and the logo pack are previewed from their own HTML.
  const logo = 'data:image/png;base64,' + readFileSync(join(ROOT, 'assets/logo-ink.png')).toString('base64');
  await png(readFileSync(join(FILES, 'obsydian-email-signature.html'), 'utf8').replace(/<div class="how">[\s\S]*?<\/div>/, '')
    .replace(/https:\/\/obsydian-tech\.github\.io\/obsydian-design-system\/templates\/assets\/logo-ink\.png/, logo)
    .replace('padding:48px;background:#F5F4EF', 'padding:56px 80px;background:#F5F4EF'), 794, 420, join(PREV, 'obsydian-email-signature.png'));
  const { lockup, shard } = await import('./render.mjs');
  await png(`<div style="width:794px;height:562px;display:grid;grid-template-columns:1fr 1fr">
    <div style="background:#fff;display:grid;place-items:center">${lockup({ height: 34, on: 'light' })}</div>
    <div style="background:#0A0A0B;display:grid;place-items:center">${lockup({ height: 34, on: 'dark' })}</div>
    <div style="background:#F5F4EF;display:grid;place-items:center">${shard({ size: 120, on: 'light', id: 'pa' })}</div>
    <div style="background:#131316;display:grid;place-items:center">${shard({ size: 120, id: 'pb' })}</div></div>`, 794, 562, join(PREV, 'obsydian-logo-pack.png'));
  console.log(`  previews for ${items.length} templates`);
}

if (!only || only === 'pack' || only === 'all-zip') {
  const tmp = join(ROOT, '.all'); rmSync(tmp, { recursive: true, force: true });
  const dir = join(tmp, 'Obsydian templates'); mkdirSync(dir, { recursive: true });
  for (const i of items) for (const f of i.files) cpSync(join(FILES, f), join(dir, f));
  writeFileSync(join(dir, 'READ ME FIRST.txt'), [
    'Obsydian templates', '',
    '1. Install General Sans before you open anything: free from https://www.fontshare.com/fonts/general-sans',
    '   (download, unzip, install every file in the OTF folder). Without it Word and PowerPoint substitute a font',
    '   and nothing will look right.',
    '2. Save a copy before you edit. Never edit the original.',
    '3. Replace every [bracketed] placeholder. Search the document for "[" before you send it.',
    '4. Send PDFs to clients, not Word or PowerPoint files: File, Export, PDF.', '',
    'Writing: short sentences, sentence case, no exclamation marks, no em dashes. State what we do; do not oversell.',
    'Money: amounts in AUD with GST shown separately. Check GST before you send.', '',
    'Every template and its preview: https://obsydian-tech.github.io/obsydian-design-system/#templates', '',
  ].join('\n'));
  rmSync(join(FILES, 'obsydian-templates-all.zip'), { force: true });
  execFileSync('zip', ['-qrX', join(FILES, 'obsydian-templates-all.zip'), 'Obsydian templates'], { cwd: tmp });
  rmSync(tmp, { recursive: true, force: true });
  console.log('  obsydian-templates-all.zip');
}
await closeRender();
