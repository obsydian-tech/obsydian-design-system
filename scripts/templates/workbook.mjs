// The invoice workbook: an invoice and a receipt in Excel, with the arithmetic done by formulas. Type the line
// items; the amounts, GST and totals follow. The receipt reads the invoice, so paying one fills the other.

import ExcelJS from 'exceljs';
import { readFileSync } from 'node:fs';
import { C, COMPANY, FONT } from './brand.mjs';

const ASSETS = new URL('../../project/templates/assets/', import.meta.url).pathname;
const argb = (hex) => 'FF' + hex;
const font = (o = {}) => ({ name: o.font || FONT.body, size: o.size || 10, color: { argb: argb(o.color || C.ink) }, bold: false });
const hair = (hex = C.ruleSoft) => ({ style: 'thin', color: { argb: argb(hex) } });
const AUD = '"$"#,##0.00';

function sheet(wb, name, kind) {
  const ws = wb.addWorksheet(name, {
    views: [{ showGridLines: false }],
    pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: 0.6, right: 0.6, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 } },
    headerFooter: { oddFooter: `&L&"${FONT.medium}"&7&K9D9D9D${COMPANY.legal.toUpperCase()}  ·  ABN ${COMPANY.abn}  ·  ${COMPANY.web.toUpperCase()}&R&"${FONT.medium}"&7&K9D9D9D&P / &N` },
  });
  ws.columns = [{ width: 2 }, { width: 42 }, { width: 8 }, { width: 15 }, { width: 14 }, { width: 18 }, { width: 2 }];
  const logo = wb.addImage({ buffer: readFileSync(ASSETS + 'logo-ink.png'), extension: 'png' });
  ws.addImage(logo, { tl: { col: 1, row: 1 }, ext: { width: 230, height: 22 } });
  ws.getCell('F2').value = kind.toUpperCase();
  ws.getCell('F2').font = font({ size: 7.5, color: C.inkLow, font: FONT.medium });
  ws.getCell('F2').alignment = { horizontal: 'right' };
  ws.getRow(2).height = 22;
  return ws;
}
const label = (ws, ref, text, align) => { const c = ws.getCell(ref); c.value = text.toUpperCase(); c.font = font({ size: 7.5, color: C.inkLow, font: FONT.medium }); if (align) c.alignment = { horizontal: align }; };
const val = (ws, ref, v, o = {}) => { const c = ws.getCell(ref); c.value = v; c.font = font(o); if (o.fmt) c.numFmt = o.fmt; if (o.align) c.alignment = { horizontal: o.align, vertical: 'top', wrapText: o.wrap }; else c.alignment = { vertical: 'top', wrapText: o.wrap }; return c; };
const ph = (ws, ref, text) => val(ws, ref, `[${text}]`, { color: C.inkLow });

export async function makeWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = COMPANY.name; wb.company = COMPANY.legal; wb.title = 'Obsydian invoice and receipt';

  // ---------------------------------------------------------------- invoice
  const ws = sheet(wb, 'Invoice', 'Tax invoice');
  val(ws, 'B5', 'Tax invoice', { size: 28, font: FONT.medium }); ws.getRow(5).height = 40;
  [['B7', 'Invoice no.'], ['D7', 'Issued'], ['E7', 'Due'], ['F7', 'Amount due (AUD)']].forEach(([r, l]) => label(ws, r, l, r === 'F7' ? 'right' : undefined));
  ph(ws, 'B8', 'INV-0001'); val(ws, 'D8', new Date(Date.UTC(2026, 9, 9)), { fmt: 'd mmm yyyy', color: C.inkDim });
  val(ws, 'E8', { formula: 'D8+14' }, { fmt: 'd mmm yyyy', color: C.inkDim });
  val(ws, 'F8', { formula: 'F27' }, { fmt: AUD, font: FONT.medium, align: 'right' });
  label(ws, 'B10', 'Bill to'); label(ws, 'D10', 'From');
  ph(ws, 'B11', 'Client company name'); ph(ws, 'B12', 'Attention: contact name'); ph(ws, 'B13', 'Street address, City STATE Postcode'); ph(ws, 'B14', 'ABN, if they have one');
  val(ws, 'D11', COMPANY.legal, { font: FONT.medium }); val(ws, 'D12', `ABN ${COMPANY.abn}`, { color: C.inkDim }); ph(ws, 'D13', 'Street address'); val(ws, 'D14', COMPANY.email, { color: C.inkDim });

  const head = 16;
  [['B', 'Description'], ['C', 'Qty'], ['D', 'Rate'], ['E', 'GST'], ['F', 'Amount']].forEach(([col, l], i) => {
    label(ws, `${col}${head}`, l, i ? 'right' : undefined);
    ws.getCell(`${col}${head}`).border = { bottom: hair(C.ink) };
  });
  const items = [['Discovery and architecture', 1, 18500], ['Platform build: sprint 1 to 3', 3, 24000], ['Cloud environment, monthly', 1, 3200]];
  for (let i = 0; i < 8; i++) {
    const r = head + 1 + i;
    const it = items[i];
    val(ws, `B${r}`, it ? it[0] : null, { font: it ? FONT.medium : undefined });
    val(ws, `C${r}`, it ? it[1] : null, { align: 'right', color: C.inkDim });
    val(ws, `D${r}`, it ? it[2] : null, { fmt: AUD, align: 'right', color: C.inkDim });
    val(ws, `E${r}`, { formula: `IF(C${r}*D${r}=0,"",ROUND(C${r}*D${r}*0.1,2))` }, { fmt: AUD, align: 'right', color: C.inkDim });
    val(ws, `F${r}`, { formula: `IF(C${r}*D${r}=0,"",C${r}*D${r})` }, { fmt: AUD, align: 'right', color: C.inkDim });
    ['B', 'C', 'D', 'E', 'F'].forEach((c) => { ws.getCell(`${c}${r}`).border = { bottom: hair() }; });
    ws.getRow(r).height = 22;
  }
  // rows 17 to 24 are items; totals below
  ws.mergeCells('D25:E25'); val(ws, 'D25', 'Subtotal', { color: C.inkDim }); val(ws, 'F25', { formula: 'SUM(F17:F24)' }, { fmt: AUD, align: 'right' });
  ws.mergeCells('D26:E26'); val(ws, 'D26', 'GST 10%', { color: C.inkDim }); val(ws, 'F26', { formula: 'SUM(E17:E24)' }, { fmt: AUD, align: 'right' });
  ws.mergeCells('D27:E27'); label(ws, 'D27', 'Total AUD'); ws.getCell('D27').font = font({ size: 7.5, font: FONT.medium }); ws.getCell('D27').alignment = { vertical: 'middle' };
  val(ws, 'F27', { formula: 'F25+F26' }, { fmt: AUD, align: 'right', size: 14, font: FONT.medium });
  ws.getCell('F27').alignment = { horizontal: 'right', vertical: 'middle' };
  ['D27', 'F27'].forEach((c) => { ws.getCell(c).border = { top: hair(C.ink) }; });
  ws.getRow(27).height = 30;

  label(ws, 'B30', 'How to pay');
  ws.getCell('B30').border = { bottom: hair() };
  [['B31', 'Account name', COMPANY.legal], ['C31', 'BSB', '[000-000]'], ['E31', 'Account', '[0000 0000]']].forEach(([r, l, v]) => {
    label(ws, r, l); const below = r.replace('31', '32'); v.startsWith('[') ? ph(ws, below, v.slice(1, -1)) : val(ws, below, v);
  });
  label(ws, 'F31', 'Reference', 'right'); val(ws, 'F32', { formula: 'B8' }, { align: 'right', color: C.inkDim });
  val(ws, 'B34', 'Payment is due within 14 days. Please use the invoice number as your reference.', { color: C.inkDim, size: 9 });
  ws.getColumn('B').alignment = { vertical: 'top' };

  // ---------------------------------------------------------------- receipt
  const rs = sheet(wb, 'Receipt', 'Receipt');
  val(rs, 'B5', 'Receipt', { size: 28, font: FONT.medium }); rs.getRow(5).height = 40;
  val(rs, 'B6', 'Payment received. Thank you.', { size: 14, color: C.inkDim });
  [['B8', 'Receipt no.'], ['D8', 'Paid on'], ['E8', 'For invoice'], ['F8', 'Method']].forEach(([r, l]) => label(rs, r, l, r === 'F8' ? 'right' : undefined));
  ph(rs, 'B9', 'REC-0001'); val(rs, 'D9', new Date(Date.UTC(2026, 9, 20)), { fmt: 'd mmm yyyy', color: C.inkDim });
  val(rs, 'E9', { formula: 'Invoice!B8' }, { color: C.inkDim }); ph(rs, 'F9', 'Bank transfer'); rs.getCell('F9').alignment = { horizontal: 'right' };
  label(rs, 'B11', 'Received from'); label(rs, 'D11', 'Received by');
  val(rs, 'B12', { formula: 'Invoice!B11' }, {}); val(rs, 'B13', { formula: 'Invoice!B12' }, { color: C.inkLow });
  val(rs, 'D12', COMPANY.legal, { font: FONT.medium }); val(rs, 'D13', `ABN ${COMPANY.abn}`, { color: C.inkDim });
  [['B', 'Description'], ['E', 'GST'], ['F', 'Amount']].forEach(([col, l], i) => { label(rs, `${col}15`, l, i ? 'right' : undefined); rs.getCell(`${col}15`).border = { bottom: hair(C.ink) }; });
  ['C15', 'D15'].forEach((c) => { rs.getCell(c).border = { bottom: hair(C.ink) }; });
  val(rs, 'B16', { formula: '"Payment against invoice "&Invoice!B8' }, { font: FONT.medium });
  val(rs, 'E16', { formula: 'Invoice!F26' }, { fmt: AUD, align: 'right', color: C.inkDim });
  val(rs, 'F16', { formula: 'Invoice!F27' }, { fmt: AUD, align: 'right', color: C.inkDim });
  ['B', 'C', 'D', 'E', 'F'].forEach((c) => { rs.getCell(`${c}16`).border = { bottom: hair(C.rule) }; });
  rs.getRow(16).height = 22;
  rs.mergeCells('D18:E18'); val(rs, 'D18', 'Includes GST', { color: C.inkDim }); val(rs, 'F18', { formula: 'E16' }, { fmt: AUD, align: 'right' });
  rs.mergeCells('D19:E19'); val(rs, 'D19', 'Balance remaining', { color: C.inkDim }); val(rs, 'F19', { formula: 'Invoice!F27-F16' }, { fmt: AUD, align: 'right' });
  rs.mergeCells('D20:E20'); label(rs, 'D20', 'Paid AUD'); rs.getCell('D20').font = font({ size: 7.5, font: FONT.medium }); rs.getCell('D20').alignment = { vertical: 'middle' };
  val(rs, 'F20', { formula: 'F16' }, { fmt: AUD, align: 'right', size: 14, font: FONT.medium });
  rs.getCell('F20').alignment = { horizontal: 'right', vertical: 'middle' };
  ['D20', 'F20'].forEach((c) => { rs.getCell(c).border = { top: hair(C.ink) }; }); rs.getRow(20).height = 30;
  val(rs, 'B23', `Keep this receipt for your records. Issued by ${COMPANY.legal}, ABN ${COMPANY.abn}.`, { color: C.inkDim, size: 9 });

  // ---------------------------------------------------------------- how to use
  const hs = wb.addWorksheet('How to use', { views: [{ showGridLines: false }] });
  hs.columns = [{ width: 2 }, { width: 90 }];
  val(hs, 'B2', 'How to use this workbook', { size: 18, font: FONT.medium });
  ['Fill the bracketed cells on the Invoice sheet: invoice number, client details and bank details.',
    'Type up to eight line items: a description, a quantity and a rate. GST, amounts and totals calculate themselves.',
    'The due date is 14 days after the issue date (D8). Change the formula in E8 if the terms differ.',
    'When the client pays, fill the receipt number, date and method on the Receipt sheet. Everything else follows the invoice.',
    'To send: File, Export (or Save as), PDF. Send the PDF, never the workbook.',
    'Install General Sans first (free from fontshare.com) so the type matches the brand.',
    'Rates include no GST. If Obsydian is not registered for GST on this work, set the 0.1 in column E to 0 and call it an invoice, not a tax invoice.',
  ].forEach((line, i) => { val(hs, `B${4 + i}`, `${String(i + 1).padStart(2, '0')}   ${line}`, { color: i % 1 === 0 ? C.ink : C.inkDim, wrap: true }); hs.getRow(4 + i).height = 30; });
  return wb;
}
