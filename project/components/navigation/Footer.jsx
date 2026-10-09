import React from 'react';
import { Logo } from '../core/Logo.jsx';
import { textStyle } from '../core/Text.jsx';
import { useInteraction, useIsPhone, useIsNarrow, focusRing } from '../core/Interaction.jsx';

export const FOOTER_COLUMNS = [
  { label: 'Company', links: [['Services', '/services'], ['Platforms', '/platforms'], ['Technology partners', '/technology-partners'], ['How we work', '/how-we-work'], ['About', '/#approach'], ['Privacy', '/privacy']] },
  { label: 'Explore', links: [['Stack', '/stack'], ['Systems', '/systems'], ['Operate', '/operate'], ['Locations', '/locations'], ['Talk to Obsydian', '/agent']] },
  { label: 'Social', links: [['LinkedIn', 'https://au.linkedin.com/company/obsydian-technologies'], ['X / Twitter', 'https://x.com/obsydiantech']] },
  { label: 'Contact', links: [['Partner enquiry form', '/contact'], ['partner@obsydiantechnologies.com', 'mailto:partner@obsydiantechnologies.com'], ['press@obsydiantechnologies.com', 'mailto:press@obsydiantechnologies.com']] },
];
export const LOCATIONS_LINE = 'Melbourne · Perth · Cape Town · Johannesburg · Harare · Remote';

function FooterLink({ label, href }) {
  const { hover, focusVisible, handlers } = useInteraction();
  const external = /^https?:/.test(href);
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} {...handlers}
      style={{ ...textStyle('meta'), letterSpacing: '-0.005em', textDecoration: 'none', color: hover ? 'var(--bone)' : 'var(--bone-dim)',
        transition: 'color var(--dur-base) var(--ease-out)', overflowWrap: 'anywhere', ...focusRing(focusVisible) }}>{label}</a>
  );
}

/** The foot of every page: the lockup and one line on what we do, four columns of links, then a legal line in
    uppercase meta (the name, the cities, the ABN, the year). Hairline above, nothing boxed. extra sits under the
    tagline (the site puts its app badge there). */
export function Footer({ columns = FOOTER_COLUMNS, tagline = 'Modern software, cloud infrastructure and intelligent systems for growth.', year = 2026, extra, style }) {
  const phone = useIsPhone();
  const narrow = useIsNarrow();
  const grid = phone ? '1fr 1fr' : narrow ? '1fr 1fr 1fr' : '2fr 1fr 1fr 1fr 1.4fr';
  return (
    <footer style={{ padding: '80px 0 40px', borderTop: '1px solid var(--hairline)', background: 'var(--obsydian)', ...style }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 'clamp(32px, 4vw, 48px)', marginBottom: 64 }}>
          <div style={{ gridColumn: narrow ? '1 / -1' : undefined }}>
            <Logo size="footer" />
            <p style={{ margin: '16px 0 0', ...textStyle('meta', 'var(--bone-low)'), letterSpacing: '-0.005em', maxWidth: '36ch' }}>{tagline}</p>
            {extra}
          </div>
          {columns.map((c) => (
            <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
              <div style={{ ...textStyle('label', 'var(--bone-low)'), marginBottom: 6 }}>{c.label}</div>
              {c.links.map(([l, h]) => <FooterLink key={l} label={l} href={h} />)}
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: 'var(--hairline)', marginBottom: 28 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, ...textStyle('action', 'var(--bone-low)') }}>
          <span style={{ color: 'var(--bone)', letterSpacing: '0.04em' }}>Obsydian Technologies</span>
          <a href="/locations" style={{ color: 'inherit', textDecoration: 'none' }}>{LOCATIONS_LINE}</a>
          <span>ABN 70 682 110 363</span>
          <span>© {year}</span>
        </div>
      </div>
    </footer>
  );
}
