// The Word templates. Each returns a docx Document built from word.mjs. Text in [brackets] is a placeholder:
// replace it, never send it. Sample figures are there to show the layout and add up correctly.

import { AlignmentType, TabStopType } from 'docx';
import { C, COMPANY, FONT, MM } from './brand.mjs';
import {
  BODY_W, bullet, cover, details, document, eyebrow, h2, h3, headline, lab, lede, p, pageBreak, ph, signatures, spacer, t,
  table, totals,
} from './word.mjs';

const R = AlignmentType.RIGHT;
const from = () => [t(COMPANY.legal, { font: FONT.medium }), t(`ABN ${COMPANY.abn}`, { color: C.inkDim, break: 1 }), ph('Street address, City STATE Postcode', { break: 1 }), t(COMPANY.email, { color: C.inkDim, break: 1 })];
const billTo = () => [ph('Client company name', { color: C.ink }), ph('Attention: contact name', { break: 1 }), ph('Street address, City STATE Postcode', { break: 1 }), ph('ABN, if they have one', { break: 1 })];
const money = (n) => '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------------------------------------------------------------- letterhead

export function letterhead() {
  return document({ title: 'Letterhead', kind: 'Letter', sections: [[
    details([['From', from()], ['Date', [ph('9 October 2026')]], ['Our reference', [ph('OBS-2026-001')]]], { columns: 3, widths: [0.5, 0.25, 0.25] }),
    spacer(18),
    p([ph('Recipient name')], { after: 0 }), p([ph('Title, Company')], { after: 0 }), p([ph('Street address')], { after: 0 }), p([ph('City STATE Postcode')], { after: 360 }),
    p([t('Dear '), ph('first name'), t(',')], { after: 240 }),
    headline('A subject line that says what the letter is for.', null, { size: 15, after: 200 }),
    p([t('Open with the point. One or two short sentences that tell the reader why you are writing and what you need from them, before any background.')], { after: 200 }),
    p([t('Then give what they need to act: the facts, the dates, the figures. Keep paragraphs short. Write as "we" when you speak for Obsydian, and say plainly what happens next.')], { after: 200 }),
    p([t('Close with the next step and when it happens: "We will call you on Thursday to agree the start date."')], { after: 400 }),
    p([t('Kind regards,')], { after: 720 }),
    p([ph('Your name')], { after: 0 }), p([ph('Your title')], { after: 0, run: { color: C.inkDim } }),
    p([t(COMPANY.name, { color: C.inkDim })], { after: 0 }), p([ph('you@obsydiantechnologies.com')], { after: 0 }),
  ]] });
}

// ---------------------------------------------------------------- tax invoice

const ITEMS = [
  ['Discovery and architecture', 'Workshops, current state review and target architecture', 1, 18500],
  ['Platform build: sprint 1 to 3', 'Six weeks of engineering, two engineers and a lead', 3, 24000],
  ['Cloud environment', 'AWS landing zone, pipelines and observability, monthly', 1, 3200],
];

export function invoice() {
  const sub = ITEMS.reduce((s, [, , q, r]) => s + q * r, 0);
  const gst = sub * 0.1;
  return document({ title: 'Tax invoice', kind: 'Tax invoice', sections: [[
    headline('Tax invoice', null, { size: 30, after: 320 }),
    details([['Invoice no.', [ph('INV-0001')]], ['Issued', [ph('9 Oct 2026')]], ['Due', [ph('23 Oct 2026')]], ['Amount due (AUD)', [t(money(sub + gst), { font: FONT.medium })]]], { columns: 4 }),
    spacer(6),
    details([['Bill to', billTo()], ['From', from()]], { columns: 2 }),
    spacer(10),
    table([{ label: 'Description', width: 0.52 }, { label: 'Qty', width: 0.08, align: R }, { label: 'Rate', width: 0.13, align: R }, { label: 'GST', width: 0.12, align: R }, { label: 'Amount', width: 0.15, align: R }],
      ITEMS.map(([name, note, q, r]) => [[p([t(name, { font: FONT.medium })], { after: 20, line: 276 }), p([t(note, { color: C.inkDim, size: 9 })], { after: 0, line: 276 })],
        String(q), money(r), money(q * r * 0.1), money(q * r)]), { closeWith: C.rule }),
    spacer(6),
    totals([['Subtotal', money(sub)], ['GST 10%', money(gst)], ['Total AUD', money(sub + gst)]]),
    spacer(24),
    eyebrow('How to pay'),
    details([['Account name', [t(COMPANY.legal)]], ['BSB', [ph('000-000')]], ['Account', [ph('0000 0000')]], ['Reference', [ph('INV-0001')]]], { columns: 4 }),
    p([t('Payment is due within 14 days. Please use the invoice number as your reference. Questions about this invoice: ', { color: C.inkDim, size: 9 }), t(COMPANY.email, { size: 9 }), t('.', { color: C.inkDim, size: 9 })], { after: 0 }),
  ]] });
}

// ---------------------------------------------------------------- receipt

export function receipt() {
  const amount = 103070; // INV-0001 in full: 93,700 plus GST
  return document({ title: 'Receipt', kind: 'Receipt', sections: [[
    headline('Receipt', 'Payment received. Thank you.', { size: 30, after: 320 }),
    details([['Receipt no.', [ph('REC-0001')]], ['Paid on', [ph('20 Oct 2026')]], ['For invoice', [ph('INV-0001')]], ['Method', [ph('Bank transfer')]]], { columns: 4 }),
    spacer(6),
    details([['Received from', billTo()], ['Received by', from()]], { columns: 2 }),
    spacer(10),
    table([{ label: 'Description', width: 0.6 }, { label: 'GST', width: 0.2, align: R }, { label: 'Amount', width: 0.2, align: R }],
      [[[p([t('Payment against invoice ', { font: FONT.medium }), ph('INV-0001', { font: FONT.medium })], { after: 20, line: 276 }), p([t('Discovery, platform build and cloud environment', { color: C.inkDim, size: 9 })], { after: 0, line: 276 })], money(amount / 11), money(amount)]], { closeWith: C.rule }),
    spacer(6),
    totals([['Includes GST', money(amount / 11)], ['Balance remaining', money(0)], ['Paid AUD', money(amount)]]),
    spacer(24),
    p([t('Keep this receipt for your records. It is issued by ', { color: C.inkDim, size: 9 }), t(`${COMPANY.legal}, ABN ${COMPANY.abn}.`, { size: 9 })], { after: 0 }),
  ]] });
}

// ---------------------------------------------------------------- quote

export function quote() {
  const lines = [['Discovery and architecture', 'Two weeks: workshops, review and a target architecture you keep', 18500],
    ['Build: first release', 'Eight weeks: two engineers and a lead, fortnightly demos', 96000],
    ['Launch and handover', 'Two weeks: production cut-over, runbooks and training', 14000]];
  const sub = lines.reduce((s, l) => s + l[2], 0);
  return document({ title: 'Quote', kind: 'Quote', sections: [[
    headline('Quote', 'For [project name].', { size: 28, after: 260 }),
    details([['Quote no.', [ph('QUO-0001')]], ['Issued', [ph('9 Oct 2026')]], ['Valid until', [ph('8 Nov 2026')]], ['Total (AUD, incl. GST)', [t(money(sub * 1.1), { font: FONT.medium })]]], { columns: 4 }),
    spacer(6),
    details([['Prepared for', billTo()], ['Prepared by', [ph('Your name'), ph('Your title', { break: 1 }), t(COMPANY.legal, { color: C.inkDim, break: 1 }), ph('you@obsydiantechnologies.com', { break: 1 })]]], { columns: 2 }),
    eyebrow('What this covers'),
    p([t('A short paragraph in the client\'s words: what they asked for, and the outcome this quote delivers. Two or three sentences.')], { after: 160 }),
    table([{ label: 'Item', width: 0.7 }, { label: 'Amount (ex GST)', width: 0.3, align: R }],
      lines.map(([n, d, a]) => [[p([t(n, { font: FONT.medium })], { after: 20, line: 276 }), p([t(d, { color: C.inkDim, size: 9 })], { after: 0, line: 276 })], money(a)]), { closeWith: C.rule }),
    spacer(6),
    totals([['Subtotal', money(sub)], ['GST 10%', money(sub * 0.1)], ['Total AUD', money(sub * 1.1)]]),
    spacer(10),
    eyebrow('Terms'),
    bullet('50% on acceptance, 50% at launch. Invoices are due within 14 days.'),
    bullet('Prices are fixed for the scope above. Changes are quoted before work starts.'),
    bullet('This quote is valid for 30 days from the date it was issued.'),
    spacer(8),
    eyebrow('Acceptance'),
    p([t('To accept, sign below and return a copy, or reply to the email this came with.', { color: C.inkDim })], { after: 200, keepNext: true }),
    signatures(['For the client', `For ${COMPANY.name}`]),
  ]] });
}

// ---------------------------------------------------------------- proposal

export function proposal() {
  return document({ title: 'Proposal', kind: 'Proposal',
    coverSection: cover({ kind: 'Proposal', title: '[Project name]', second: 'for [Client name]', meta: [['Prepared for', '[Client name]'], ['Prepared by', COMPANY.name], ['Date', '[October 2026]']] }),
    sections: [[
      eyebrow('01 Summary'),
      headline('What we heard,', 'and what we propose.', { size: 24 }),
      lede('One paragraph a busy reader can stop after. What the client wants to achieve, what we will build, how long it takes, and what it costs. If they read nothing else, they know the shape of the deal.'),
      details([['Outcome', [ph('The change the client will see')]], ['Timeline', [ph('12 weeks')]], ['Investment', [ph('$128,500 + GST')]]], { columns: 3 }),
      spacer(12),
      eyebrow('02 Where you are today'),
      h2('The situation, in their words'),
      p([t('Describe the current state the way the client described it to us: what works, what does not, and what it is costing them. Quote them where you can. This is where they decide we listened.')]),
      bullet([t('A specific problem, with a number if there is one')]),
      bullet([t('A second problem, and who it affects')]),
      bullet([t('The constraint we must work within: a date, a system, a team')]),
      spacer(12),
      eyebrow('03 Our approach'),
      h2('How we will do it'),
      table([{ label: '', width: 0.1 }, { label: 'Step', width: 0.3 }, { label: 'What happens', width: 0.6 }], [
        [t('01', { color: C.violet, font: FONT.medium }), t('Discovery and strategy', { font: FONT.medium }), 'We map the business goals, the systems in place and what must not break.'],
        [t('02', { color: C.violet, font: FONT.medium }), t('Architecture and planning', { font: FONT.medium }), 'A target architecture and a plan you can hold us to, with the risks named.'],
        [t('03', { color: C.violet, font: FONT.medium }), t('Build and delivery', { font: FONT.medium }), 'Fortnightly releases you can see working, built by the team you met.'],
        [t('04', { color: C.violet, font: FONT.medium }), t('Deployment and operations', { font: FONT.medium }), 'Launch, monitoring and runbooks, so your team can run it with confidence.'],
      ], { noHead: true }),
      spacer(12),
      eyebrow('04 Scope'),
      h2('What you get'),
      table([{ label: 'Deliverable', width: 0.4 }, { label: 'Description', width: 0.6 }], [
        [t('Target architecture', { font: FONT.medium }), 'A document and diagrams you own, whoever builds it.'],
        [t('First release', { font: FONT.medium }), 'The platform in production, with the features listed in the appendix.'],
        [t('Runbooks and training', { font: FONT.medium }), 'How to operate, support and change it, and two sessions with your team.'],
      ]),
      spacer(6),
      h3('Not included'),
      p([t('Say what is out of scope as plainly as what is in it. It prevents the hardest conversations later.', { color: C.inkDim })]),
      spacer(12),
      eyebrow('05 Timeline'),
      h2('Twelve weeks, in four phases'),
      table([{ label: 'Phase', width: 0.34 }, { label: 'Weeks', width: 0.16 }, { label: 'You will see', width: 0.5 }], [
        [t('Discovery', { font: FONT.medium }), '1 to 2', 'The target architecture and the delivery plan'],
        [t('Build: release one', { font: FONT.medium }), '3 to 8', 'A working build every fortnight'],
        [t('Hardening', { font: FONT.medium }), '9 to 10', 'Load, security and failure testing'],
        [t('Launch and handover', { font: FONT.medium }), '11 to 12', 'Production, runbooks and training'],
      ]),
      spacer(12),
      eyebrow('06 Team'),
      h2('Who you will work with'),
      table([{ label: 'Role', width: 0.34 }, { label: 'Name', width: 0.26 }, { label: 'What they own', width: 0.4 }], [
        [t('Engagement lead', { font: FONT.medium }), ph('Name'), 'Scope, plan, and your single point of contact'],
        [t('Lead engineer', { font: FONT.medium }), ph('Name'), 'Architecture and technical decisions'],
        [t('Engineer', { font: FONT.medium }), ph('Name'), 'Build, tests and the pipeline'],
      ]),
      spacer(12),
      eyebrow('07 Investment'),
      h2('What it costs'),
      table([{ label: 'Phase', width: 0.7 }, { label: 'Amount (ex GST)', width: 0.3, align: R }], [
        [t('Discovery and architecture', { font: FONT.medium }), money(18500)], [t('Build: release one', { font: FONT.medium }), money(96000)], [t('Launch and handover', { font: FONT.medium }), money(14000)],
      ], { closeWith: C.rule }),
      spacer(4),
      totals([['Subtotal', money(128500)], ['GST 10%', money(12850)], ['Total AUD', money(141350)]]),
      spacer(12),
      eyebrow('08 Assumptions'),
      bullet('You provide a product owner who can make decisions within two working days.'),
      bullet('We have access to your AWS account and existing systems from week one.'),
      bullet('Third-party licences and cloud running costs are billed to you directly.'),
      spacer(12),
      eyebrow('09 Next steps'),
      h2('To get started'),
      table([{ label: '', width: 0.1 }, { label: '', width: 0.9 }], [
        [t('01', { color: C.violet, font: FONT.medium }), 'Reply to confirm the scope, or tell us what to change.'],
        [t('02', { color: C.violet, font: FONT.medium }), 'We send a statement of work for signature.'],
        [t('03', { color: C.violet, font: FONT.medium }), 'Discovery starts the following Monday.'],
      ], { noHead: true }),
      spacer(18),
      details([['Contact', [ph('Your name'), ph('you@obsydiantechnologies.com', { break: 1, color: C.inkDim })]], ['Partnerships', [t(COMPANY.partner)]], ['Web', [t(COMPANY.web)]]], { columns: 3, widths: [0.38, 0.38, 0.24] }),
    ]] });
}

// ---------------------------------------------------------------- statement of work

export function sow() {
  return document({ title: 'Statement of work', kind: 'Statement of work',
    coverSection: cover({ kind: 'Statement of work', title: '[Project name]', second: 'SOW [OBS-SOW-001]', meta: [['Client', '[Client legal name]'], ['Supplier', COMPANY.legal], ['Effective', '[Date]']] }),
    sections: [[
      eyebrow('01 Parties'),
      details([['Client', [ph('Client legal name'), ph('ABN', { break: 1 }), ph('Address', { break: 1 })]], ['Supplier', [t(COMPANY.legal), t(`ABN ${COMPANY.abn}`, { color: C.inkDim, break: 1 }), ph('Address', { break: 1 })]]], { columns: 2 }),
      p([t('This statement of work is made under the ', { color: C.inkDim }), ph('Master services agreement dated'), t(' between the parties. Where they differ, that agreement prevails.', { color: C.inkDim })]),
      spacer(10),
      eyebrow('02 Background'),
      p([t('Two or three sentences: why this work exists and what it must achieve. Reference the proposal it came from.')]),
      spacer(10),
      eyebrow('03 Scope of work'),
      table([{ label: 'Workstream', width: 0.32 }, { label: 'Activities', width: 0.68 }], [
        [t('Discovery', { font: FONT.medium }), 'Stakeholder workshops; review of current systems; target architecture.'],
        [t('Build', { font: FONT.medium }), 'Design, engineering and testing of the first release in fortnightly increments.'],
        [t('Launch', { font: FONT.medium }), 'Production deployment, monitoring, runbooks and two training sessions.'],
      ]),
      spacer(10),
      eyebrow('04 Deliverables and acceptance'),
      table([{ label: 'Deliverable', width: 0.3 }, { label: 'Acceptance criteria', width: 0.5 }, { label: 'Due', width: 0.2 }], [
        [t('Target architecture', { font: FONT.medium }), 'Reviewed and signed off by the client product owner', ph('Week 2')],
        [t('Release one', { font: FONT.medium }), 'Passes the agreed acceptance tests in staging', ph('Week 8')],
        [t('Production launch', { font: FONT.medium }), 'Live, monitored, with runbooks handed over', ph('Week 12')],
      ]),
      p([t('A deliverable is accepted when the client signs it off, or five business days after delivery if no written defects are raised.', { color: C.inkDim, size: 9 })], { before: 120 }),
      spacer(10),
      eyebrow('05 Out of scope'),
      bullet('Anything not listed in section 03.'),
      bullet('Data migration from systems not named in the background.'),
      bullet('Ongoing support after the handover period, which is offered separately.'),
      spacer(10),
      eyebrow('06 Fees and payment'),
      table([{ label: 'Milestone', width: 0.5 }, { label: 'Invoiced', width: 0.25 }, { label: 'Amount (ex GST)', width: 0.25, align: R }], [
        [t('Signing of this SOW', { font: FONT.medium }), 'On signature', money(64250)], [t('Production launch', { font: FONT.medium }), 'On acceptance', money(64250)],
      ], { closeWith: C.rule }),
      spacer(4),
      totals([['Subtotal', money(128500)], ['GST 10%', money(12850)], ['Total AUD', money(141350)]]),
      spacer(10),
      eyebrow('07 Assumptions and dependencies'),
      bullet('The client provides a product owner and access to systems from week one.'),
      bullet('Decisions are made within two business days; delays move dates by the same amount.'),
      spacer(10),
      eyebrow('08 Changes'),
      p([t('Either party may request a change in writing. We will reply within five business days with the effect on scope, time and fees. No change takes effect until both parties sign it.')]),
      spacer(18),
      eyebrow('09 Signatures'),
      p([t('Signed by the authorised representatives of each party.', { color: C.inkDim })], { after: 280, keepNext: true }),
      signatures(['For the client', `For ${COMPANY.legal}`]),
    ]] });
}

// ---------------------------------------------------------------- status report

export function statusReport() {
  return document({ title: 'Project status report', kind: 'Status report', sections: [[
    eyebrow('Status report'),
    headline('[Project name]', 'Week 6 of 12.', { size: 26 }),
    details([['Period', [ph('29 Sep to 10 Oct 2026')]], ['Overall', [t('On track', { font: FONT.medium, color: C.violet })]], ['Prepared by', [ph('Your name')]], ['For', [ph('Client name')]]], { columns: 4 }),
    spacer(6),
    eyebrow('01 Summary'),
    lede('Three sentences: where the project stands, the most important thing that happened, and anything the client must decide. Lead with what needs their attention.'),
    eyebrow('02 Progress'),
    table([{ label: 'Workstream', width: 0.28 }, { label: 'Status', width: 0.16 }, { label: 'This period', width: 0.56 }], [
      [t('Platform build', { font: FONT.medium }), t('On track', { color: C.ink }), 'Sprint 3 demoed; payments flow working end to end in staging.'],
      [t('Cloud environment', { font: FONT.medium }), t('On track', { color: C.ink }), 'Production account and pipelines in place; monitoring dashboards live.'],
      [t('Data migration', { font: FONT.medium }), t('At risk', { color: C.violet, font: FONT.medium }), 'Legacy export is two weeks late. See risks.'],
    ]),
    spacer(10),
    eyebrow('03 Milestones'),
    table([{ label: 'Milestone', width: 0.46 }, { label: 'Planned', width: 0.18 }, { label: 'Forecast', width: 0.18 }, { label: 'State', width: 0.18 }], [
      [t('Target architecture signed off', { font: FONT.medium }), 'Week 2', 'Week 2', 'Done'],
      [t('Release one in staging', { font: FONT.medium }), 'Week 8', 'Week 8', 'On track'],
      [t('Production launch', { font: FONT.medium }), 'Week 12', 'Week 12', 'On track'],
    ]),
    spacer(10),
    eyebrow('04 Risks and issues'),
    table([{ label: 'Risk', width: 0.46 }, { label: 'Impact', width: 0.14 }, { label: 'What we are doing', width: 0.4 }], [
      [t('Legacy data export is late', { font: FONT.medium }), 'High', 'Building the importer against sample data; need the full export by week 8.'],
      [t('Key stakeholder on leave in week 9', { font: FONT.medium }), 'Medium', 'Bringing the hardening review forward to week 8.'],
    ]),
    spacer(10),
    eyebrow('05 Decisions we need from you'),
    table([{ label: '', width: 0.1 }, { label: '', width: 0.9 }], [
      [t('01', { color: C.violet, font: FONT.medium }), 'Confirm who signs off release one, by 15 October.'],
      [t('02', { color: C.violet, font: FONT.medium }), 'Approve the extra environment for load testing (estimate attached).'],
    ], { noHead: true }),
    spacer(10),
    eyebrow('06 Next period'),
    bullet('Sprint 4: reporting and notifications.'),
    bullet('Start load testing against the staging environment.'),
  ]] });
}

// ---------------------------------------------------------------- meeting notes

export function meeting() {
  return document({ title: 'Meeting agenda and notes', kind: 'Meeting notes', sections: [[
    eyebrow('Agenda and notes'),
    headline('[Meeting name]', '[Client name] and Obsydian.', { size: 24 }),
    details([['Date', [ph('Tue 14 Oct 2026')]], ['Time', [ph('10:00 to 11:00 AEDT')]], ['Where', [ph('Video call / address')]], ['Chair', [ph('Name')]]], { columns: 4 }),
    details([['Attendees', [ph('Name, Company · Name, Company · Name, Obsydian')]], ['Apologies', [ph('Names, or none')]]], { columns: 2 }),
    spacer(6),
    eyebrow('01 Purpose'),
    p([t('One sentence: what this meeting must decide or produce.')]),
    spacer(6),
    eyebrow('02 Agenda'),
    table([{ label: '', width: 0.08 }, { label: 'Item', width: 0.6 }, { label: 'Lead', width: 0.18 }, { label: 'Time', width: 0.14, align: R }], [
      [t('01', { color: C.violet, font: FONT.medium }), 'Progress since last meeting', ph('Name'), '10 min'],
      [t('02', { color: C.violet, font: FONT.medium }), 'Demo of the latest release', ph('Name'), '20 min'],
      [t('03', { color: C.violet, font: FONT.medium }), 'Decisions needed', ph('Name'), '20 min'],
      [t('04', { color: C.violet, font: FONT.medium }), 'Actions and next meeting', ph('Name'), '10 min'],
    ]),
    spacer(10),
    eyebrow('03 Notes'),
    p([t('Write notes against the agenda numbers. Record what was decided and why, not a transcript.', { color: C.inkDim })], { after: 1200 }),
    eyebrow('04 Decisions'),
    table([{ label: '', width: 0.08 }, { label: 'Decision', width: 0.7 }, { label: 'Made by', width: 0.22 }], [
      [t('01', { color: C.violet, font: FONT.medium }), ph('What was decided'), ph('Name')], [t('02', { color: C.violet, font: FONT.medium }), ph('What was decided'), ph('Name')]]),
    spacer(10),
    eyebrow('05 Actions'),
    table([{ label: 'Action', width: 0.56 }, { label: 'Owner', width: 0.22 }, { label: 'Due', width: 0.22 }], [
      [ph('What will be done'), ph('Name'), ph('Date')], [ph('What will be done'), ph('Name'), ph('Date')], [ph('What will be done'), ph('Name'), ph('Date')]]),
    spacer(10),
    details([['Next meeting', [ph('Date, time and place')]]], { columns: 1 }),
  ]] });
}

// ---------------------------------------------------------------- capability statement

export function capability() {
  return document({ title: 'Capability statement', kind: 'Capability statement', sections: [[
    eyebrow('Capability statement'),
    headline('We build the platforms', 'serious businesses run on.', { size: 26 }),
    lede('Modern software engineering, cloud infrastructure and intelligent systems for organisations building for growth. We architect, modernise and scale the platforms your business depends on.'),
    details([['Years combined', [t('30+', { size: 20, font: FONT.medium, spacing: -0.6 })]], ['Industries', [t('Multi-sector', { size: 20, font: FONT.medium, spacing: -0.6 })]], ['Approach', [t('Outcomes', { size: 20, font: FONT.medium, spacing: -0.6 })]]], { columns: 3 }),
    eyebrow('What we deliver', { before: 120 }),
    table([{ label: '', width: 0.36 }, { label: '', width: 0.64 }], [
      [t('Enterprise Software Engineering', { font: FONT.medium }), 'Custom software designed around your business, from internal operational systems to customer-facing digital platforms.'],
      [t('Cloud and Infrastructure Architecture', { font: FONT.medium }), 'Modern cloud foundations designed for performance, resilience and growth.'],
      [t('CRM and Customer Experience Platforms', { font: FONT.medium }), 'Connected customer systems built for service, operations and long-term growth.'],
      [t('AI, Automation and Digital Experiences', { font: FONT.medium }), 'Practical AI designed around real business workflows.'],
    ], { noHead: true }),
    spacer(12),
    eyebrow('How we work'),
    table([{ label: '', width: 0.1 }, { label: '', width: 0.9 }], [
      [t('01', { color: C.violet, font: FONT.medium }), [p([t('Discovery and strategy', { font: FONT.medium })], { after: 0, line: 276 }), p([t('Clarity on the problem, the architecture and the outcome before we build.', { color: C.inkDim, size: 9 })], { after: 0, line: 276 })]],
      [t('02', { color: C.violet, font: FONT.medium }), [p([t('Build and delivery', { font: FONT.medium })], { after: 0, line: 276 }), p([t('Hands-on engineering with releases you can see working every fortnight.', { color: C.inkDim, size: 9 })], { after: 0, line: 276 })]],
      [t('03', { color: C.violet, font: FONT.medium }), [p([t('Long-term partnership', { font: FONT.medium })], { after: 0, line: 276 }), p([t('We stay to operate, optimise and grow what we build.', { color: C.inkDim, size: 9 })], { after: 0, line: 276 })]],
    ], { noHead: true }),
    spacer(12),
    details([['Partner enquiries', [t(COMPANY.partner)]], ['Web', [t(COMPANY.web)]], ['Offices', [t(COMPANY.cities, { size: 9, color: C.inkDim })]]], { columns: 3, widths: [0.4, 0.27, 0.33] }),
  ]] });
}

export const WORD_TEMPLATES = {
  'obsydian-letterhead': letterhead, 'obsydian-tax-invoice': invoice, 'obsydian-receipt': receipt, 'obsydian-quote': quote,
  'obsydian-proposal': proposal, 'obsydian-statement-of-work': sow, 'obsydian-status-report': statusReport,
  'obsydian-meeting-notes': meeting, 'obsydian-capability-statement': capability,
};
