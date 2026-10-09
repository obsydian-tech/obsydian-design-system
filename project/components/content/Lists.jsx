import React from 'react';
import { textStyle } from '../core/Text.jsx';
import { useInteraction, useIsPhone, usePrefersReducedMotion, focusRing } from '../core/Interaction.jsx';
import { Button } from '../actions/Button.jsx';

const pad2 = (n) => String(n).padStart(2, '0');
const rowRule = (i, n) => ({ borderTop: '1px solid var(--hairline)', borderBottom: i === n - 1 ? '1px solid var(--hairline)' : 0 });

/** A numbered process on hairlines: "01" in violet, a title, a paragraph. compact is the three-step preview on the
    home page; the full form is the How we work page. Rows are ruled top and bottom, never boxed. */
export function Steps({ steps, compact = false, start = 1, style }) {
  const phone = useIsPhone();
  const col = phone ? 48 : compact ? 64 : 72;
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, ...style }}>
      {steps.map((s, i) => (
        <li key={i} style={{ display: 'grid', gridTemplateColumns: `${col}px 1fr`, gap: phone ? 20 : compact ? 32 : 'clamp(24px, 4vw, 48px)',
          padding: phone ? (compact ? '28px 0' : '32px 0') : compact ? 'var(--step-pad) 0' : 'clamp(40px, 6vw, 64px) 0', ...rowRule(i, steps.length) }}>
          <span style={{ ...textStyle('eyebrow', 'var(--violet)'), fontWeight: 'var(--weight-regular)', textTransform: 'none', paddingTop: 6, fontVariantNumeric: 'tabular-nums' }}>{pad2(start + i)}</span>
          <div>
            <h3 style={{ margin: '0 0 12px', ...textStyle('title-2', 'var(--bone)'), ...(compact ? {} : { fontSize: 'clamp(26px, 2.8vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.025em' }) }}>{s.title}</h3>
            <p style={{ margin: 0, ...textStyle('body', 'var(--bone-dim)'), fontSize: phone ? 16 : 17, maxWidth: compact ? '62ch' : '64ch' }}>{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A short numbered list beside a form: "What happens next" on Contact, the drafting steps on Blueprint.
    Two-digit numbers in 13px bone-low, 15px lines in bone-dim, hairlines above and below each.
    reveal shows the lines one after another, 700ms apart, while something is being made. */
export function NextSteps({ items, reveal = false, style }) {
  const reduced = usePrefersReducedMotion();
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--hairline)', ...style }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 8, padding: '16px 0', borderBottom: '1px solid var(--hairline)',
          ...textStyle('small', 'var(--bone-dim)'), letterSpacing: 'normal', lineHeight: 1.5,
          animation: reveal && !reduced ? `obs-rise 400ms ease-out ${i * 700}ms both` : undefined }}>
          <span style={{ ...textStyle('caption', 'var(--bone-low)'), fontVariantNumeric: 'tabular-nums', paddingTop: 2 }}>{pad2(i + 1)}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
  );
}

function CapabilityRow({ n, row, i, count, phone }) {
  const { hover, focusVisible, handlers } = useInteraction();
  return (
    <a href={row.href} {...handlers}
      style={{ display: 'grid', gridTemplateColumns: phone ? '36px 1fr 28px' : '50px 280px 1fr 40px', gap: phone ? 16 : 32, alignItems: 'baseline',
        padding: phone ? '24px 0' : 'var(--row-pad) 0', paddingLeft: hover && !phone ? 12 : 0, textDecoration: 'none', color: 'inherit',
        transition: 'padding-left var(--dur-nav) var(--ease-out)', ...rowRule(i, count), ...focusRing(focusVisible) }}>
      <span style={{ ...textStyle('eyebrow', 'var(--bone-low)'), fontWeight: 'var(--weight-regular)', textTransform: 'none', fontVariantNumeric: 'tabular-nums' }}>{pad2(n)}</span>
      <div style={{ display: phone ? 'flex' : 'contents', flexDirection: 'column', gap: 8 }}>
        <span style={{ ...textStyle('title-2'), fontSize: 'clamp(22px, 1.8vw, 30px)', color: hover ? 'var(--violet)' : 'var(--bone)', transition: 'color var(--dur-nav) var(--ease-out)' }}>{row.name}</span>
        <span style={{ ...textStyle('body-sm', 'var(--bone-dim)'), maxWidth: '64ch' }}>{row.desc}</span>
      </div>
      <span aria-hidden="true" style={{ justifySelf: 'end', alignSelf: phone ? 'start' : undefined, fontSize: 22, color: hover ? 'var(--violet)' : 'var(--bone-low)',
        transform: hover ? 'translateX(8px)' : 'none', transition: 'color var(--dur-nav) var(--ease-out), transform var(--dur-nav) var(--ease-out)' }}>→</span>
    </a>
  );
}

/** Service rows on the home page: number, name, one line, arrow. The whole row is the link; on hover it steps in
    12px and the name and arrow turn violet. Numbers here are bone-low, because the row itself carries the accent. */
export function CapabilityRows({ rows, style }) {
  const phone = useIsPhone();
  return <div style={style}>{rows.map((r, i) => <CapabilityRow key={i} n={i + 1} row={r} i={i} count={rows.length} phone={phone} />)}</div>;
}

/** Figures with a word and a sentence each, in a row of three: the credentials under the hero. Hairline above each,
    no cards. The label is the only violet text, and it is 11px. */
export function StatStrip({ stats, style }) {
  const phone = useIsPhone();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: phone ? '1fr' : `repeat(${stats.length}, 1fr)`, gap: phone ? 32 : 48, ...style }}>
      {stats.map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 28, borderTop: '1px solid var(--hairline)' }}>
          <span style={textStyle('stat', 'var(--bone)')}>{s.figure}</span>
          <span style={{ ...textStyle('label', 'var(--violet)'), marginTop: 4 }}>{s.label}</span>
          <span style={{ ...textStyle('body-sm', 'var(--bone-dim)'), lineHeight: 1.6, maxWidth: '34ch' }}>{s.body}</span>
        </div>
      ))}
    </div>
  );
}

/** A section's way onward, under its last row: the link button with an arrow, 40px below. */
export function SectionFoot({ href, children }) {
  return <div style={{ paddingTop: 40 }}><Button variant="link" arrow href={href}>{children}</Button></div>;
}

/** What a practice includes: "Capabilities include", then short lines each led by a 6 by 1 violet dash.
    Two columns on the Services page (one below 820px), one column beside a selected layer. */
export function CapabilityList({ items, label = 'Capabilities include', columns = 2, style }) {
  const phone = useIsPhone();
  return (
    <div style={style}>
      {label ? <div style={{ ...textStyle('label', 'var(--bone-low)'), fontWeight: 'var(--weight-regular)', marginBottom: 20 }}>{label}</div> : null}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: phone ? '1fr' : `repeat(${columns}, minmax(0, 1fr))`, gap: '12px 32px', maxWidth: '72ch' }}>
        {items.map((t) => (
          <li key={t} style={{ position: 'relative', paddingLeft: 16, ...textStyle('small', 'var(--bone-dim)'), lineHeight: 1.45 }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: '0.55em', width: 6, height: 1, background: 'var(--violet)' }} />{t}
          </li>
        ))}
      </ul>
    </div>
  );
}
