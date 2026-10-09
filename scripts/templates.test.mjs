// The downloadable templates: every file the landing page offers exists, opens, and says nothing off brand.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const T = join(ROOT, 'project/templates');
const manifest = JSON.parse(readFileSync(join(T, 'templates.json'), 'utf8'));
const items = manifest.groups.flatMap((g) => g.items);
const banned = JSON.parse(readFileSync(join(ROOT, 'project/guidelines/banned-words.json'), 'utf8')).words;
const text = (file) => {
  const parts = execFileSync('unzip', ['-Z1', file]).toString().split('\n').filter((p) => /\.xml$/.test(p) && /(document|slide\d+|sheet\d+|sharedStrings|header\d*|footer\d*)\.xml$/.test(p));
  return parts.map((p) => execFileSync('unzip', ['-p', file, p]).toString().replace(/<f>[^<]*<\/f>/g, ' ').replace(/<[^>]+>/g, ' ')).join(' ');
};

test('every template in the manifest has its file and its preview', () => {
  assert.ok(items.length >= 14);
  for (const i of items) {
    for (const f of i.files) assert.ok(existsSync(join(T, 'files', f)), f);
    assert.ok(existsSync(join(T, 'previews', `${i.id}.png`)), `${i.id} preview`);
  }
  assert.ok(existsSync(join(T, 'files/obsydian-templates-all.zip')));
});

test('office files are valid packages that say nothing off brand', () => {
  for (const i of items) {
    const f = join(T, 'files', i.files[0]);
    if (!/\.(docx|pptx|xlsx)$/.test(f)) continue;
    const listing = execFileSync('unzip', ['-Z1', f]).toString();
    assert.match(listing, /\[Content_Types\]\.xml/, `${i.id} is an Office package`);
    const words = text(f);
    assert.ok(!words.includes(String.fromCharCode(0x2014)), `${i.id} has an em dash`);
    for (const w of banned) assert.doesNotMatch(words, new RegExp(`\\b${w}\\b`, 'i'), `${i.id} says ${w}`);
    assert.doesNotMatch(words, /!/, `${i.id} has an exclamation mark`);
  }
});

test('the documents use General Sans and the brand ink', () => {
  for (const id of ['obsydian-tax-invoice', 'obsydian-proposal', 'obsydian-letterhead']) {
    const f = join(T, 'files', `${id}.docx`);
    const xml = execFileSync('unzip', ['-p', f, 'word/document.xml']).toString();
    assert.match(xml, /General Sans/, `${id} font`);
    assert.match(xml, /0A0A0B/, `${id} ink`);
  }
});

test('the invoice adds up: its totals are formulas, not typed numbers', () => {
  const f = join(T, 'files/obsydian-invoice-workbook.xlsx');
  const sheet = execFileSync('unzip', ['-p', f, 'xl/worksheets/sheet1.xml']).toString();
  for (const formula of ['SUM(F17:F24)', 'SUM(E17:E24)', 'F25+F26']) assert.ok(sheet.includes(formula), formula);
});

test('the email signature uses the lockup the design system serves', () => {
  const html = readFileSync(join(T, 'files/obsydian-email-signature.html'), 'utf8');
  assert.match(html, /obsydian-design-system\/templates\/assets\/logo-ink\.png/);
  assert.ok(existsSync(join(T, 'assets/logo-ink.png')));
});
