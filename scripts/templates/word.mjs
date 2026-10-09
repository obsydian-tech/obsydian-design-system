// The paper system for Word. Every .docx template is built from these pieces, so they share one page, one type
// scale, one header and one footer.
//
//   Page        A4, 20mm sides, the lockup at the head, the legal line at the foot
//   Type        General Sans: 10pt body at 1.45, Medium for every heading, uppercase only for labels
//   Colour      ink on white, ink-dim for secondary text, ink-low for labels, one violet for rules and accents
//   Structure   hairlines, never boxes: tables rule their rows, totals sit under a rule

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  AlignmentType, BorderStyle, Document, Footer, Header, HorizontalPositionRelativeFrom, ImageRun, LevelFormat, PageNumber,
  Paragraph, ShadingType, Table, TableCell, TableLayoutType, TableRow, TabStopType, TextRun, VerticalAlign,
  VerticalPositionRelativeFrom, WidthType, PageBreak, TextWrappingType, HeightRule,
} from 'docx';
import { A4, C, COMPANY, FONT, MM, PT } from './brand.mjs';

const ASSETS = new URL('../../project/templates/assets/', import.meta.url).pathname;
const img = (f) => readFileSync(join(ASSETS, f));

export const MARGIN = { top: MM(30), bottom: MM(24), left: MM(20), right: MM(20), header: MM(12), footer: MM(10) };
export const BODY_W = A4.w - MARGIN.left - MARGIN.right; // usable width in twips

// ---------------------------------------------------------------- runs

/** A run of text. opts: size (pt), color (hex), font, bold, caps, spacing (pt, tracking), italics. */
export function t(text, o = {}) {
  return new TextRun({
    text, font: o.font || FONT.body, size: PT(o.size || 10), color: o.color || C.ink,
    bold: o.bold || false, italics: o.italics || false, allCaps: o.caps || false,
    characterSpacing: o.spacing != null ? Math.round(o.spacing * 20) : undefined,
    break: o.break,
  });
}
/** A placeholder: what to type here, in ink-low, in brackets. Replace it, never leave it. */
export const ph = (text, o = {}) => t(`[${text}]`, { color: C.inkLow, ...o });
/** A label run: 7.5pt uppercase, tracked, ink-low. */
export const lab = (text, o = {}) => t(text, { size: 7.5, caps: true, spacing: 0.9, color: C.inkLow, font: FONT.medium, ...o });

// ---------------------------------------------------------------- paragraphs

export function p(children, o = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [typeof children === 'string' ? t(children, o.run) : children],
    alignment: o.align, spacing: { before: o.before ?? 0, after: o.after ?? 120, line: o.line ?? 300 },
    border: o.rule ? { bottom: { style: BorderStyle.SINGLE, size: 4, color: o.ruleColor || C.rule, space: 6 } } : o.top ? { top: { style: BorderStyle.SINGLE, size: 4, color: o.ruleColor || C.rule, space: 8 } } : undefined,
    keepNext: o.keepNext, keepLines: o.keepLines, pageBreakBefore: o.pageBreakBefore, tabStops: o.tabs, indent: o.indent,
    numbering: o.numbering, style: o.style,
  });
}

/** The eyebrow: a 12mm violet rule, then the label. "01 Summary". */
export function eyebrow(text, o = {}) {
  return new Paragraph({
    spacing: { before: o.before ?? 0, after: o.after ?? 160 }, keepNext: true,
    children: [
      new ImageRun({ type: 'png', data: img('rule-violet.png'), transformation: { width: 34, height: 8 } }),
      t('   '), lab(text, { color: o.color || C.inkLow }),
    ],
  });
}

/** A two-line headline: the first line in ink, the second set back in ink-dim (or violet on a cover). */
export function headline(first, second, o = {}) {
  const size = o.size || 26;
  const runs = [t(first, { size, font: FONT.medium, spacing: -size * 0.03, color: o.color || C.ink })];
  if (second) runs.push(t(second, { size, font: FONT.medium, spacing: -size * 0.03, color: o.second || C.inkDim, break: 1 }));
  return new Paragraph({ children: runs, spacing: { before: o.before ?? 0, after: o.after ?? 240, line: Math.round(size * 20 * 1.08), lineRule: 'exact' }, keepNext: true });
}

/** A section heading inside a document: Medium 15pt. */
export const h2 = (text, o = {}) => new Paragraph({ children: [t(text, { size: 15, font: FONT.medium, spacing: -0.3 })], spacing: { before: o.before ?? 120, after: o.after ?? 120 }, keepNext: true });
/** A sub-heading: Medium 11pt. */
export const h3 = (text, o = {}) => new Paragraph({ children: [t(text, { size: 11, font: FONT.medium })], spacing: { before: o.before ?? 160, after: o.after ?? 60 }, keepNext: true });
/** Body copy in ink-dim, for the lede under a headline. */
export const lede = (children, o = {}) => p(Array.isArray(children) ? children : [t(children, { size: 12, color: C.inkDim })], { after: 240, line: 324, ...o });

export function spacer(pts = 12) { return new Paragraph({ children: [], spacing: { before: 0, after: 0, line: Math.round(pts * 20), lineRule: 'exact' } }); }
export function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

// ---------------------------------------------------------------- lists

export const NUMBERING = {
  config: [
    { reference: 'dash', levels: [{ level: 0, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
      style: { run: { color: C.violet, font: FONT.body }, paragraph: { indent: { left: 340, hanging: 280 } } } }] },
    { reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL_ZERO, text: '%1', alignment: AlignmentType.LEFT,
      style: { run: { color: C.violet, font: FONT.medium, size: PT(9) }, paragraph: { indent: { left: 560, hanging: 560 } } } }] },
  ],
};
/** A list led by a short violet dash, like a capability list on the site. */
export const bullet = (children, o = {}) => p(Array.isArray(children) ? children : [t(children, { color: o.color || C.ink })], { numbering: { reference: 'dash', level: 0 }, after: 80 });

// ---------------------------------------------------------------- tables

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const HAIR = (color = C.ruleSoft) => ({ style: BorderStyle.SINGLE, size: 4, color });

function cell(content, width, o = {}) {
  const kids = (Array.isArray(content) ? content : [content]).map((c) =>
    c instanceof Paragraph ? c : p(typeof c === 'string' ? [t(c, o.run)] : [c], { after: 0, align: o.align, line: 276 }));
  return new TableCell({
    children: kids, width: { size: width, type: WidthType.DXA }, verticalAlign: o.valign || VerticalAlign.TOP,
    margins: { top: o.padY ?? 110, bottom: o.padY ?? 110, left: o.padL ?? 0, right: o.padR ?? 120 },
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    columnSpan: o.span,
    borders: { top: o.top || NONE, bottom: o.bottom || HAIR(), left: NONE, right: NONE },
  });
}

/** A table on hairlines: a label row, then rows ruled underneath. cols: [{ label, width (fraction), align }].
    rows: arrays of strings or runs. */
export function table(cols, rows, o = {}) {
  const total = o.width || BODY_W;
  const widths = cols.map((c) => Math.round(c.width * total));
  widths[widths.length - 1] += total - widths.reduce((a, b) => a + b, 0);
  const head = new TableRow({ tableHeader: true, children: cols.map((c, i) =>
    cell(lab(c.label), widths[i], { align: c.align, bottom: HAIR(C.ink), padY: 80, padR: i === cols.length - 1 ? 0 : 120 })) });
  const body = rows.map((r, ri) => new TableRow({ cantSplit: true, children: r.map((v, i) =>
    cell(v, widths[i], { align: cols[i].align, run: { color: i === 0 ? C.ink : C.inkDim }, padR: i === cols.length - 1 ? 0 : 120,
      bottom: ri === rows.length - 1 && o.closeWith ? HAIR(o.closeWith) : HAIR() })) }));
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE }, rows: o.noHead ? body : [head, ...body] });
}

/** Label and value pairs in columns, for document details: "Invoice no. INV-0001". */
export function details(pairs, o = {}) {
  const n = o.columns || pairs.length;
  const total = o.width || BODY_W;
  const fr = o.widths || Array.from({ length: n }, () => 1 / n);
  const widths = fr.map((f) => Math.round(f * total));
  widths[n - 1] = total - widths.slice(0, n - 1).reduce((a, b) => a + b, 0);
  const rows = [];
  for (let i = 0; i < pairs.length; i += n) {
    const chunk = pairs.slice(i, i + n);
    while (chunk.length < n) chunk.push(['', '']);
    rows.push(new TableRow({ children: chunk.map(([k, v], j) => new TableCell({
      width: { size: widths[j], type: WidthType.DXA }, margins: { top: 0, bottom: 160, left: 0, right: 160 },
      borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
      children: [p([lab(k)], { after: 40 }), p(Array.isArray(v) ? v : [typeof v === 'string' ? t(v) : v], { after: 0 })] })) }));
  }
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE }, rows });
}

/** The totals block, right-aligned: lines of label and amount, the last one large under an ink rule. */
export function totals(lines, o = {}) {
  const total = BODY_W;
  const widths = [Math.round(total * 0.55), Math.round(total * 0.25), total - Math.round(total * 0.55) - Math.round(total * 0.25)];
  const rows = lines.map(([k, v], i) => {
    const last = i === lines.length - 1;
    return new TableRow({ children: [
      new TableCell({ width: { size: widths[0], type: WidthType.DXA }, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE }, children: [p('', { after: 0 })] }),
      cell(last ? lab(k, { color: C.ink }) : t(k, { color: C.inkDim }), widths[1], { top: last ? HAIR(C.ink) : NONE, bottom: NONE, padY: last ? 140 : 60 }),
      cell(last ? t(v, { size: 16, font: FONT.medium, spacing: -0.4 }) : t(v), widths[2], { align: AlignmentType.RIGHT, top: last ? HAIR(C.ink) : NONE, bottom: NONE, padY: last ? 110 : 60, padR: 0 }),
    ] });
  });
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE }, rows });
}

/** Signature lines: one column per party, with a rule to sign on and name, title and date under it. */
export function signatures(parties) {
  const total = BODY_W;
  const gap = MM(12);
  const w = Math.floor((total - gap * (parties.length - 1)) / parties.length);
  const widths = parties.flatMap((_, i) => (i ? [gap, w] : [w]));
  const cells = parties.flatMap((party, i) => {
    const c = new TableCell({ width: { size: w, type: WidthType.DXA }, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      children: [p([lab(party)], { after: 560 }),
        p([lab('Signature')], { top: true, ruleColor: C.ink, after: 200 }),
        p([lab('Name')], { top: true, after: 200 }), p([lab('Title')], { top: true, after: 200 }), p([lab('Date')], { top: true, after: 0 })] });
    return i ? [new TableCell({ width: { size: gap, type: WidthType.DXA }, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE }, children: [p('', { after: 0 })] }), c] : [c];
  });
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE }, rows: [new TableRow({ cantSplit: true, children: cells })] });
}

// ---------------------------------------------------------------- header and footer

/** The head of every page: the lockup on the left, the document's kind on the right in a label. */
export function header(kind) {
  return new Header({ children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: BODY_W }],
    children: [new ImageRun({ type: 'png', data: img('logo-ink.png'), transformation: { width: 190, height: 18 } }), t('\t'), lab(kind)],
  })] });
}

/** The foot of every page: the legal line, and the page count on the right. */
export function footer() {
  return new Footer({ children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: BODY_W }],
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.ruleSoft, space: 8 } },
    children: [lab(`${COMPANY.legal}  ·  ABN ${COMPANY.abn}  ·  ${COMPANY.web}`, { size: 6.5 }), t('\t'),
      new TextRun({ children: [PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES], font: FONT.medium, size: PT(6.5), color: C.inkLow, characterSpacing: 18 })],
  })] });
}

// ---------------------------------------------------------------- the cover

/** A dark cover: the stone on obsydian, the lockup in bone, the kind as an eyebrow, a two-line title with its
    second line in violet, and the details at the foot. A section of its own, with no header or footer. */
export function cover({ kind, title, second, meta = [] }) {
  const bg = new ImageRun({ type: 'png', data: img('cover-a4.png'), transformation: { width: 794, height: 1123 },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
      verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 }, behindDocument: true,
      wrap: { type: TextWrappingType.NONE } } });
  const children = [
    new Paragraph({ children: [bg, new ImageRun({ type: 'png', data: img('logo-bone.png'), transformation: { width: 220, height: 21 } })], spacing: { after: MM(70) * 1 } }),
    eyebrow(kind, { color: C.boneDim, after: 280 }),
    headline(title, second, { size: 34, color: C.bone, second: C.violetHi, after: 480 }),
    details(meta.map(([k, v]) => [k, typeof v === 'string' ? [t(v, { color: C.bone })] : v]), { columns: Math.min(meta.length, 3), width: Math.round(BODY_W * 0.86) }),
  ];
  return {
    properties: { page: { size: { width: A4.w, height: A4.h }, margin: { top: MM(24), bottom: MM(20), left: MM(20), right: MM(20) } } },
    children,
  };
}

// ---------------------------------------------------------------- the document

/** A whole document: sections with the shared styles, numbering, header and footer. */
export function document({ title, kind, sections, coverSection }) {
  const page = { size: { width: A4.w, height: A4.h }, margin: MARGIN };
  const secs = sections.map((children, i) => ({ properties: { page }, headers: { default: header(kind) }, footers: { default: footer() }, children }));
  return new Document({
    creator: COMPANY.name, title, description: `${COMPANY.name} ${kind}`,
    styles: {
      default: { document: { run: { font: FONT.body, size: PT(10), color: C.ink }, paragraph: { spacing: { line: 300 } } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT.medium, size: PT(15), color: C.ink }, paragraph: { spacing: { before: 120, after: 120 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT.medium, size: PT(11), color: C.ink }, paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 1 } },
      ],
    },
    numbering: NUMBERING,
    sections: coverSection ? [coverSection, ...secs] : secs,
  });
}

export { AlignmentType, TabStopType, HeightRule };
