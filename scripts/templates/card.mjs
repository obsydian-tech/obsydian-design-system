// Business card and email signature.
//   Card: 90 by 55mm trimmed, drawn at 96 by 61mm so 3mm bleeds off every edge. Front is the stone on obsydian;
//   back is the person on paper. Edit the back in PowerPoint or Keynote, export to PDF, send that to the printer.
//   Signature: one HTML table that pastes into Gmail, Outlook and Apple Mail, images served from the design system.

import pptxgen from 'pptxgenjs';
import { C, COMPANY, FONT } from './brand.mjs';

const ASSETS = new URL('../../project/templates/assets/', import.meta.url).pathname;
const MMI = (mm) => mm / 25.4;
const W = MMI(96), H = MMI(61), B = MMI(3); // with bleed
const SAFE = MMI(3 + 5); // 5mm inside the trim

export function makeCard() {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: 'CARD', width: W, height: H });
  pptx.layout = 'CARD';
  pptx.author = COMPANY.name; pptx.title = 'Obsydian business card';

  const front = pptx.addSlide();
  front.background = { color: C.obsydian };
  front.addImage({ path: ASSETS + 'deck-title.png', x: -MMI(30), y: -MMI(11.5), w: MMI(150), h: MMI(84.4) });
  front.addImage({ path: ASSETS + 'logo-bone.png', x: SAFE, y: SAFE + MMI(1), w: MMI(40), h: MMI(40) * 136 / 1460 });
  front.addText(COMPANY.web.toUpperCase(), { x: SAFE, y: H - SAFE - MMI(3), w: MMI(50), h: MMI(3), fontFace: FONT.medium, fontSize: 5, color: C.boneDim, charSpacing: 1.2, margin: 0 });
  front.addNotes('Front. 96 x 61mm including 3mm bleed; trims to 90 x 55mm. Keep everything 5mm inside the trim.');

  const back = pptx.addSlide();
  back.background = { color: C.paper };
  back.addText('[Your name]', { x: SAFE, y: SAFE, w: MMI(70), h: MMI(6), fontFace: FONT.medium, fontSize: 11, color: C.ink, charSpacing: -0.2, margin: 0 });
  back.addText('[Your title]', { x: SAFE, y: SAFE + MMI(6.2), w: MMI(70), h: MMI(4), fontFace: FONT.body, fontSize: 7, color: C.inkDim, margin: 0 });
  back.addShape('line', { x: SAFE, y: SAFE + MMI(13), w: MMI(12), h: 0, line: { color: C.violet, width: 1 } });
  const rows = [['Email', '[you@obsydiantechnologies.com]'], ['Mobile', '[+61 400 000 000]'], ['Web', COMPANY.web]];
  rows.forEach(([k, v], i) => {
    const y = SAFE + MMI(17) + i * MMI(5);
    back.addText(k.toUpperCase(), { x: SAFE, y, w: MMI(14), h: MMI(3.4), fontFace: FONT.medium, fontSize: 4.5, color: C.inkLow, charSpacing: 1, margin: 0, valign: 'middle' });
    back.addText(v, { x: SAFE + MMI(14), y, w: MMI(55), h: MMI(3.4), fontFace: FONT.body, fontSize: 6.5, color: C.ink, margin: 0, valign: 'middle' });
  });
  back.addImage({ path: ASSETS + 'mark.png', x: W - SAFE - MMI(6), y: H - SAFE - MMI(6.5), w: MMI(6), h: MMI(6) * 274 / 256 });
  back.addText(COMPANY.legal.toUpperCase(), { x: SAFE, y: H - SAFE - MMI(3), w: MMI(60), h: MMI(3), fontFace: FONT.medium, fontSize: 4, color: C.inkLow, charSpacing: 1, margin: 0 });
  back.addNotes('Back. Replace the bracketed text. Export both slides to PDF for the printer: 90 x 55mm, 3mm bleed, 350gsm uncoated or soft-touch.');
  return pptx;
}

const PAGES = 'https://obsydian-tech.github.io/obsydian-design-system/templates/assets';

/** The email signature, as one HTML table with inline styles: what every mail client keeps. */
export function signatureHtml() {
  const f = "'General Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Obsydian email signature</title>
<style>body{margin:0;padding:48px;background:#F5F4EF;font-family:${f};color:#0A0A0B}.how{max-width:640px;margin:48px 0 0;font-size:14px;line-height:1.6;color:#676768}.how b{color:#0A0A0B;font-weight:500}.sig{background:#fff;padding:32px;display:inline-block;border:1px solid #EBEBEB}</style></head>
<body>
<div class="sig">
<!-- Copy from here -->
<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:${f};color:#0A0A0B">
  <tr><td style="padding:0 0 2px;font-size:15px;line-height:20px;font-weight:500;letter-spacing:-0.2px;color:#0A0A0B">[Your name]</td></tr>
  <tr><td style="padding:0 0 14px;font-size:13px;line-height:18px;color:#676768">[Your title]</td></tr>
  <tr><td style="padding:0 0 12px"><table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr><td style="width:28px;height:2px;background:#9318FF;font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>
  <tr><td style="padding:0 0 3px;font-size:13px;line-height:18px"><a href="mailto:[you@obsydiantechnologies.com]" style="color:#0A0A0B;text-decoration:none">[you@obsydiantechnologies.com]</a></td></tr>
  <tr><td style="padding:0 0 16px;font-size:13px;line-height:18px;color:#676768">[+61 400 000 000]&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://${COMPANY.web}" style="color:#676768;text-decoration:none">${COMPANY.web}</a></td></tr>
  <tr><td style="padding:0 0 8px"><a href="https://${COMPANY.web}"><img src="${PAGES}/logo-ink.png" width="170" height="16" alt="${COMPANY.name}" style="display:block;border:0;width:170px;height:16px"></a></td></tr>
  <tr><td style="font-size:9px;line-height:14px;letter-spacing:1px;text-transform:uppercase;color:#9D9D9D">${COMPANY.legal} · ABN ${COMPANY.abn}</td></tr>
</table>
<!-- Copy to here -->
</div>
<div class="how">
<p><b>To use it.</b> Open this file in a browser, replace the bracketed text by editing the file, then select everything inside the white box and copy it.</p>
<p><b>Gmail:</b> Settings, See all settings, Signature, Create new, paste. <b>Outlook:</b> Settings, Mail, Compose and reply, Email signature, paste. <b>Apple Mail:</b> Settings, Signatures, add one, paste, then untick "Always match my default message font".</p>
<p>No quotes, banners, social icons or legal disclaimers under it. The lockup image is served from the design system, so it stays up to date.</p>
</div>
</body></html>
`;
}
