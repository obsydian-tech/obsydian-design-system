import React from 'react';

/* Every type role in tokens/typography.css, as inline style. `textStyle('section')` returns the font shorthand,
   its tracking and, for labels, the uppercase. Reading roles share --type-reading-tracking. */
const TRACKED = ['hero', 'hero-phone', 'closing', 'page', 'page-split', 'statement', 'section', 'stat', 'title-1', 'title-2', 'title-3', 'prompt', 'brief', 'wordmark', 'eyebrow', 'label', 'action', 'button', 'button-lg', 'nav'];
const READING = ['lede', 'body', 'body-sm', 'small', 'meta'];
const UPPER = ['eyebrow', 'label', 'action'];
const TRACKING_ALIAS = { 'section-phone': 'section', 'button-lg': 'button' };

/** Inline style for a type role, with an optional colour token. */
export function textStyle(role, color) {
  const s = { font: `var(--type-${role})` };
  if (TRACKED.includes(role) || TRACKING_ALIAS[role]) s.letterSpacing = `var(--type-${TRACKING_ALIAS[role] || role}-tracking)`;
  else if (READING.includes(role)) s.letterSpacing = 'var(--type-reading-tracking)';
  if (UPPER.includes(role)) s.textTransform = 'uppercase';
  if (color) s.color = color;
  return s;
}

const TONES = { primary: 'var(--bone)', dim: 'var(--bone-dim)', low: 'var(--bone-low)', faint: 'var(--bone-faint)', violet: 'var(--violet)', 'violet-hi': 'var(--violet-hi)' };

/** Text in one of the system's roles. tone is a bone strength or violet; as picks the element. */
export function Text({ role = 'body', tone, as = 'span', balance = false, style, children, ...rest }) {
  const Tag = as;
  return (
    <Tag style={{ margin: 0, ...textStyle(role, TONES[tone]), textWrap: balance ? 'balance' : undefined, ...style }} {...rest}>{children}</Tag>
  );
}

/** The typed arrow every call to action ends with. It nudges right when its control is hovered. */
export function Arrow({ nudge = false, style }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-block', transform: nudge ? 'translateX(var(--nudge-arrow))' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)', ...style }}>→</span>
  );
}
