// The brand as office documents need it: the design system's tokens turned into the units Word, PowerPoint and
// Excel take. Every template generator reads from here, so a letterhead, a deck and an invoice cannot disagree.
//
// On screen Obsydian is bone on black. On paper it is the same system inverted: ink on white, with the same
// hairlines, the same one violet, and the black kept for covers and decks.

export const COMPANY = {
  name: 'Obsydian Technologies',
  legal: 'Obsydian Technologies Pty Ltd',
  abn: '70 682 110 363',
  web: 'obsydiantechnologies.com',
  email: 'hello@obsydiantechnologies.com',
  partner: 'partner@obsydiantechnologies.com',
  press: 'press@obsydiantechnologies.com',
  cities: 'Melbourne · Perth · Cape Town · Johannesburg · Harare',
  tagline: 'Modern software, cloud infrastructure and intelligent systems for growth.',
};

/** Hex without the #, as Word and PowerPoint want it. */
export const C = {
  obsydian: '0A0A0B',   // --obsydian: covers, decks
  surface1: '131316',
  surface2: '1C1C20',
  bone: 'F5F4EF',       // --bone: text on black; the warm paper tint
  boneDim: '9C9B98',    // bone at 62% over obsydian
  boneLow: '686866',    // bone at 40% over obsydian
  violet: '9318FF',     // --violet: one accent, rules, the edge
  violetHi: 'B25CFF',   // --violet-hi: violet that must read on black
  violetDeep: '6A0BD0',
  // Paper: obsydian at the bone strengths, over white. --ink-* in project/tokens/colors.css.
  paper: 'FFFFFF',
  ink: '0A0A0B',        // 100%
  inkDim: '676768',     // 62%
  inkLow: '9D9D9D',     // 40%
  rule: 'DDDDDD',       // 14%, a hairline that must print
  ruleSoft: 'EBEBEB',   // 8%
  wash: 'F8F8F8',       // the one tint a table row may take
};

export const FONT = { body: 'General Sans', medium: 'General Sans Medium', strong: 'General Sans Semibold' };

/** A4 in twips (Word's DXA) and margins: 20mm sides, room above for the lockup, below for the legal line. */
export const A4 = { w: 11906, h: 16838 };
export const MM = (mm) => Math.round(mm * 56.6929); // millimetres to twips
export const PT = (pt) => Math.round(pt * 2);        // points to half-points (docx font sizes)
