// The client deck: 16:9, dark, built on four slide masters so a new slide starts on brand.
//   OBS Title     the stone on obsydian, for the first slide
//   OBS Section   a plain dark ground with a large number, between parts
//   OBS Content   the lockup small at the head, the legal line and page number at the foot
//   OBS Closing   the stone, smaller, for the last slide
// Example slides show every pattern a client conversation needs; delete what you do not use.

import pptxgen from 'pptxgenjs';
import { C, COMPANY, FONT } from './brand.mjs';

const ASSETS = new URL('../../project/templates/assets/', import.meta.url).pathname;
const W = 13.333, H = 7.5, M = 0.75; // inches
const BODY = W - M * 2;

const txt = (o = {}) => ({ fontFace: o.font || FONT.body, fontSize: o.size || 14, color: o.color || C.bone, margin: 0, valign: 'top', ...o.extra });

function eyebrow(s, text, x, y, color = C.boneDim) {
  s.addShape('line', { x, y: y + 0.075, w: 0.42, h: 0, line: { color: C.violet, width: 1.25 } });
  s.addText(text.toUpperCase(), { x: x + 0.58, y, w: 6, h: 0.16, ...txt({ size: 9, color, font: FONT.medium }), charSpacing: 1.6, valign: 'middle' });
}
function headline(s, first, second, { x = M, y, w = BODY, size = 44, color = C.bone, accent = C.boneDim, h } = {}) {
  s.addText([
    { text: first, options: { color, breakLine: Boolean(second) } },
    ...(second ? [{ text: second, options: { color: accent } }] : []),
  ], { x, y, w, h: h || size * 0.03 * (second ? 2.2 : 1.2), ...txt({ size, font: FONT.medium }), charSpacing: -size * 0.03, lineSpacingMultiple: 0.98, fit: 'none' });
}
function hair(s, x, y, w, color = '2A2A2E') { s.addShape('line', { x, y, w, h: 0, line: { color, width: 0.75 } }); }

export function makeDeck() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = COMPANY.name; pptx.company = COMPANY.legal; pptx.title = 'Obsydian client deck';
  pptx.theme = { headFontFace: FONT.medium, bodyFontFace: FONT.body };

  const legal = { text: `${COMPANY.legal.toUpperCase()}  ·  ${COMPANY.web.toUpperCase()}`, options: { x: M, y: H - 0.48, w: 7, h: 0.2, fontFace: FONT.medium, fontSize: 7.5, color: C.boneLow, charSpacing: 1.4, margin: 0 } };
  pptx.defineSlideMaster({ title: 'OBS Title', background: { path: ASSETS + 'deck-title.png' },
    objects: [{ image: { x: M, y: 0.6, w: 2.7, h: 0.25, path: ASSETS + 'logo-bone.png' } }] });
  pptx.defineSlideMaster({ title: 'OBS Section', background: { path: ASSETS + 'deck-plain.png' },
    objects: [{ image: { x: M, y: 0.6, w: 2.16, h: 0.2, path: ASSETS + 'logo-bone.png' } }] });
  pptx.defineSlideMaster({ title: 'OBS Content', background: { path: ASSETS + 'deck-plain.png' },
    objects: [{ image: { x: M, y: 0.6, w: 2.16, h: 0.2, path: ASSETS + 'logo-bone.png' } }, { text: legal },
      { line: { x: M, y: H - 0.66, w: BODY, h: 0, line: { color: '232327', width: 0.75 } } }],
    slideNumber: { x: W - M - 0.6, y: H - 0.5, w: 0.6, h: 0.22, fontFace: FONT.medium, fontSize: 8, color: C.boneLow, align: 'right' } });
  pptx.defineSlideMaster({ title: 'OBS Closing', background: { path: ASSETS + 'deck-close.png' },
    objects: [{ image: { x: M, y: 0.6, w: 2.7, h: 0.25, path: ASSETS + 'logo-bone.png' } }] });

  // 1. Title
  let s = pptx.addSlide({ masterName: 'OBS Title' });
  eyebrow(s, 'Proposal', M, 2.55);
  headline(s, '[Project name]', 'for [Client name]', { y: 2.95, w: 7.2, size: 54, accent: C.violetHi, h: 1.9 });
  [['Prepared for', '[Client name]'], ['Prepared by', COMPANY.name], ['Date', '[October 2026]']].forEach(([k, v], i) => {
    s.addText(k.toUpperCase(), { x: M + i * 2.6, y: 5.75, w: 2.4, h: 0.18, ...txt({ size: 8, color: C.boneLow, font: FONT.medium }), charSpacing: 1.4 });
    s.addText(v, { x: M + i * 2.6, y: 6.0, w: 2.4, h: 0.3, ...txt({ size: 12, color: C.bone }) });
  });
  s.addNotes('Title slide. Replace the bracketed text. Keep the second line short: it sets in violet.');

  // 2. Agenda
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'Agenda', M, 1.35);
  headline(s, 'What we will', 'cover today.', { y: 1.7, w: 5, size: 40 });
  ['Where you are today', 'What we propose', 'How we will deliver it', 'Timeline and investment', 'Next steps'].forEach((item, i) => {
    const y = 1.75 + i * 0.82;
    hair(s, 6.6, y, 6.0);
    s.addText(String(i + 1).padStart(2, '0'), { x: 6.6, y: y + 0.24, w: 0.6, h: 0.3, ...txt({ size: 12, color: C.violetHi, font: FONT.medium }) });
    s.addText(item, { x: 7.3, y: y + 0.2, w: 5.3, h: 0.4, ...txt({ size: 20, font: FONT.medium }), charSpacing: -0.4 });
  });
  hair(s, 6.6, 1.75 + 5 * 0.82, 6.0);

  // 3. Section
  s = pptx.addSlide({ masterName: 'OBS Section' });
  s.addText('01', { x: M, y: 1.6, w: 4, h: 1.6, ...txt({ size: 120, color: C.violet, font: FONT.medium }), charSpacing: -4 });
  headline(s, 'Where you', 'are today.', { y: 3.6, w: 9, size: 64, h: 2.6 });

  // 4. Statement
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'What we heard', M, 1.35);
  headline(s, '\u201CWe cannot see our position', 'until the end of the month.\u201D', { y: 1.75, w: 11.5, size: 46, h: 2.2 });
  s.addText('Two or three sentences on the situation, in the client\'s own words where you can. This is the slide where they decide we listened.', { x: M, y: 4.35, w: 7.5, h: 1.2, ...txt({ size: 18, color: C.boneDim }), lineSpacingMultiple: 1.25 });
  s.addText('[Name, Title, Client]', { x: M, y: 5.6, w: 6, h: 0.3, ...txt({ size: 11, color: C.boneLow }) });

  // 5. Three columns
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'What we propose', M, 1.35);
  headline(s, 'Three things,', 'in this order.', { y: 1.7, w: 9, size: 40 });
  const cols = [['01', 'A foundation that lasts', 'A cloud platform, pipelines and observability your team can run with confidence.'],
    ['02', 'The first release', 'The workflow that matters most, live in production in twelve weeks.'],
    ['03', 'A team that stays', 'We operate, measure and improve it with you after launch.']];
  cols.forEach(([n, h, b], i) => {
    const x = M + i * (BODY / 3);
    hair(s, x, 3.7, BODY / 3 - 0.3);
    s.addText(n, { x, y: 3.9, w: 1, h: 0.3, ...txt({ size: 11, color: C.violetHi, font: FONT.medium }) });
    s.addText(h, { x, y: 4.3, w: BODY / 3 - 0.4, h: 0.5, ...txt({ size: 22, font: FONT.medium }), charSpacing: -0.5 });
    s.addText(b, { x, y: 4.95, w: BODY / 3 - 0.5, h: 1.1, ...txt({ size: 14, color: C.boneDim }), lineSpacingMultiple: 1.3 });
  });

  // 6. Process
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'How we work', M, 1.35);
  headline(s, 'From discovery', 'to long-term partnership.', { y: 1.7, w: 9, size: 40 });
  [['Discovery and strategy', 'Clarity on the problem, the architecture and the outcome.'], ['Architecture and planning', 'A plan you can hold us to, with the risks named.'],
    ['Build and delivery', 'Releases you can see working every fortnight.'], ['Deployment and operations', 'Launch, monitoring and runbooks for your team.']].forEach(([h, b], i) => {
    const y = 3.55 + i * 0.68;
    hair(s, M, y, BODY);
    s.addText(String(i + 1).padStart(2, '0'), { x: M, y: y + 0.2, w: 0.7, h: 0.3, ...txt({ size: 12, color: C.violetHi, font: FONT.medium }) });
    s.addText(h, { x: M + 0.9, y: y + 0.16, w: 4.4, h: 0.38, ...txt({ size: 18, font: FONT.medium }), charSpacing: -0.3 });
    s.addText(b, { x: M + 5.6, y: y + 0.2, w: 6.2, h: 0.36, ...txt({ size: 14, color: C.boneDim }) });
  });
  hair(s, M, 3.55 + 4 * 0.68, BODY);

  // 7. Figures
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'Why Obsydian', M, 1.35);
  headline(s, 'Built by people', 'who have done it before.', { y: 1.7, w: 9, size: 40 });
  [['30+', 'Years combined', 'Our founding engineers bring over three decades of platform builds and operations.'],
    ['Multi-sector', 'Industries served', 'Finance, fintech, hospitality and regulated markets.'], ['Proven impact', 'Outcomes over outputs', 'Every engagement is tracked to business results.']].forEach(([f, l, b], i) => {
    const x = M + i * (BODY / 3);
    hair(s, x, 3.7, BODY / 3 - 0.3);
    s.addText(f, { x, y: 3.95, w: BODY / 3 - 0.3, h: 0.8, ...txt({ size: 44, font: FONT.medium }), charSpacing: -1.3 });
    s.addText(l.toUpperCase(), { x, y: 4.85, w: 3.6, h: 0.2, ...txt({ size: 9, color: C.violetHi, font: FONT.medium }), charSpacing: 1.4 });
    s.addText(b, { x, y: 5.2, w: BODY / 3 - 0.5, h: 0.9, ...txt({ size: 13, color: C.boneDim }), lineSpacingMultiple: 1.3 });
  });

  // 8. Timeline
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'Timeline', M, 1.35);
  headline(s, 'Twelve weeks,', 'in four phases.', { y: 1.7, w: 9, size: 40 });
  const phases = [['Discovery', 2, 'Target architecture and plan'], ['Build: release one', 6, 'A working build every fortnight'], ['Hardening', 2, 'Load, security and failure tests'], ['Launch', 2, 'Production, runbooks, training']];
  let px = M; const unit = BODY / 12;
  phases.forEach(([n, wk, b], i) => {
    const w = wk * unit;
    s.addShape('rect', { x: px, y: 3.75, w: w - 0.06, h: 0.06, fill: { color: i === 1 ? C.violet : '3A3A40' }, line: { type: 'none' } });
    s.addText(n, { x: px, y: 4.0, w: w - 0.15, h: 0.35, ...txt({ size: 15, font: FONT.medium }) });
    s.addText(`${wk} weeks`, { x: px, y: 4.4, w: w - 0.15, h: 0.25, ...txt({ size: 11, color: C.boneLow }) });
    s.addText(b, { x: px, y: 4.75, w: w - 0.2, h: 0.8, ...txt({ size: 12, color: C.boneDim }), lineSpacingMultiple: 1.25 });
    px += w;
  });

  // 9. Team
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'Your team', M, 1.35);
  headline(s, 'The people', 'you will work with.', { y: 1.7, w: 9, size: 40 });
  [['[Name]', 'Engagement lead', 'Scope, plan and your single point of contact.'], ['[Name]', 'Lead engineer', 'Architecture and technical decisions.'],
    ['[Name]', 'Engineer', 'Build, tests and the delivery pipeline.'], ['[Name]', 'Cloud engineer', 'Environments, security and operations.']].forEach(([n, r, b], i) => {
    const x = M + i * (BODY / 4);
    hair(s, x, 3.7, BODY / 4 - 0.25);
    s.addText(n, { x, y: 3.95, w: 2.6, h: 0.4, ...txt({ size: 20, font: FONT.medium }) });
    s.addText(r.toUpperCase(), { x, y: 4.45, w: 2.8, h: 0.2, ...txt({ size: 9, color: C.violetHi, font: FONT.medium }), charSpacing: 1.4 });
    s.addText(b, { x, y: 4.8, w: BODY / 4 - 0.4, h: 0.9, ...txt({ size: 13, color: C.boneDim }), lineSpacingMultiple: 1.3 });
  });

  // 10. Case study
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'Case study', M, 1.35);
  headline(s, '[Client or platform]', '[The outcome, in one line.]', { y: 1.7, w: 6.2, size: 34, h: 1.6 });
  [['The challenge', 'What was broken, slow or missing, and what it cost.'], ['What we built', 'The platform, in a sentence a buyer understands.'], ['The result', 'A number: time saved, revenue kept, costs gone.']].forEach(([k, v], i) => {
    const y = 3.75 + i * 0.85;
    hair(s, M, y, 5.9);
    s.addText(k.toUpperCase(), { x: M, y: y + 0.18, w: 2, h: 0.2, ...txt({ size: 9, color: C.boneLow, font: FONT.medium }), charSpacing: 1.4 });
    s.addText(v, { x: M + 2, y: y + 0.13, w: 3.9, h: 0.6, ...txt({ size: 13, color: C.boneDim }) });
  });
  s.addShape('rect', { x: 7.35, y: 1.35, w: 5.25, h: 4.9, fill: { color: C.surface1 }, line: { color: '2A2A2E', width: 0.75 } });
  s.addText('Screenshot or product photo\n(replace this frame)', { x: 7.35, y: 1.35, w: 5.25, h: 4.9, ...txt({ size: 12, color: C.boneLow }), align: 'center', valign: 'middle' });

  // 11. Investment
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'Investment', M, 1.35);
  headline(s, 'What it costs,', 'and what you get for it.', { y: 1.7, w: 9, size: 40 });
  const rows = [['Discovery and architecture', '2 weeks', '$18,500'], ['Build: release one', '8 weeks', '$96,000'], ['Launch and handover', '2 weeks', '$14,000']];
  const head = [['Phase', 'Duration', 'Amount (ex GST)']].map((r) => r.map((c, i) => ({ text: c.toUpperCase(), options: { fontFace: FONT.medium, fontSize: 9, color: C.boneLow, charSpacing: 1.4, align: i === 2 ? 'right' : 'left', border: [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: C.bone }, { type: 'none' }] } })));
  const body = rows.map((r) => r.map((c, i) => ({ text: c, options: { fontFace: i ? FONT.body : FONT.medium, fontSize: 16, color: i ? C.boneDim : C.bone, align: i === 2 ? 'right' : 'left', border: [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: '2A2A2E' }, { type: 'none' }] } })));
  const total = [['', 'Total ex GST', '$128,500']].map((r) => r.map((c, i) => ({ text: c, options: { fontFace: FONT.medium, fontSize: i === 2 ? 26 : 12, color: C.bone, align: i === 2 ? 'right' : 'left', valign: 'middle', border: [{ type: 'none' }, { type: 'none' }, { type: 'none' }, { type: 'none' }] } })));
  s.addTable([...head, ...body, ...total], { x: M, y: 3.55, w: BODY, colW: [6.6, 2.6, BODY - 9.2], rowH: [0.42, 0.58, 0.58, 0.58, 0.75], margin: [0.08, 0, 0.08, 0] });

  // 12. Content
  s = pptx.addSlide({ masterName: 'OBS Content' });
  eyebrow(s, 'Section label', M, 1.35);
  headline(s, 'A headline that says', 'the point of the slide.', { y: 1.7, w: 9, size: 40 });
  s.addText('Body copy at 16pt in bone-dim. One idea per slide. If it needs more than three short paragraphs, it is two slides.', { x: M, y: 3.7, w: 7.4, h: 1.6, ...txt({ size: 16, color: C.boneDim }), lineSpacingMultiple: 1.35 });

  // 13. Closing
  s = pptx.addSlide({ masterName: 'OBS Closing' });
  eyebrow(s, 'Next steps', M, 1.9);
  headline(s, 'Have a platform', 'worth building?', { y: 2.3, w: 7.5, size: 60, accent: C.violetHi, h: 2.2 });
  [['Contact', '[Your name]\n[you@obsydiantechnologies.com]'], ['Partnerships', COMPANY.partner], ['Web', COMPANY.web]].forEach(([k, v], i) => {
    s.addShape('line', { x: M + i * 3.4, y: 5.35, w: 3.0, h: 0, line: { color: '2A2A2E', width: 0.75 } });
    s.addText(k.toUpperCase(), { x: M + i * 3.4, y: 5.55, w: 3, h: 0.2, ...txt({ size: 8, color: C.boneLow, font: FONT.medium }), charSpacing: 1.4 });
    s.addText(v, { x: M + i * 3.4, y: 5.85, w: 3.2, h: 0.7, ...txt({ size: 12, color: C.bone }), lineSpacingMultiple: 1.3 });
  });
  return pptx;
}
