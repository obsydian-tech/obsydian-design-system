import React from 'react';
import { useInteraction, focusRing } from '../core/Interaction.jsx';
import { textStyle } from '../core/Text.jsx';

/** A pill you press. With selected (true or false) it is a choice that toggles, aria-pressed, and goes violet when
    chosen: "What can we help with?". Without selected it is a starter that fills something in once and has no
    chosen state: "Wholesale marketplace". 14px, bone-dim, a hairline pill; sentence case, always. */
export function Chip({ selected, onClick, disabled = false, children, style, ...rest }) {
  const toggles = typeof selected === 'boolean';
  const { hover, focusVisible, handlers } = useInteraction({ inert: disabled });
  const on = toggles && selected;
  return (
    <button type="button" aria-pressed={toggles ? selected : undefined} disabled={disabled} onClick={onClick} {...handlers} {...rest}
      style={{ ...textStyle('meta'), letterSpacing: 'normal', padding: '9px 16px', borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
        color: on || hover ? 'var(--bone)' : 'var(--bone-dim)', background: on ? 'var(--violet-wash)' : 'transparent',
        border: '1px solid', borderColor: on ? 'var(--violet-chip)' : hover ? 'var(--bone-faint)' : 'var(--hairline-strong)',
        transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        ...focusRing(focusVisible), ...style }}>
      {children}
    </button>
  );
}

/** A row of chips under a question. For choices it is a fieldset whose legend is the question, in the form label
    style. For starters, pass label inline and it sits before the chips in bone-low. */
export function ChipGroup({ legend, label, children, style }) {
  if (legend) {
    return (
      <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0, ...style }}>
        <legend style={{ ...textStyle('small', 'var(--bone-dim)'), padding: 0 }}>{legend}</legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--chip-gap)', marginTop: 14 }}>{children}</div>
      </fieldset>
    );
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--chip-gap)', ...style }}>
      {label ? <span style={{ ...textStyle('meta', 'var(--bone-low)'), marginRight: 6 }}>{label}</span> : null}
      {children}
    </div>
  );
}

/** Text that links inside a sentence or a meta row: bone, a strong hairline beneath, violet on hover. Never violet at
    rest, because violet in running copy competes with the one action. */
export function InlineLink({ href, children, external = false, style, ...rest }) {
  const { hover, focusVisible, handlers } = useInteraction();
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} {...handlers} {...rest}
      style={{ color: hover ? 'var(--violet)' : 'var(--bone)', borderBottom: '1px solid', borderColor: hover ? 'var(--violet)' : 'var(--hairline-strong)',
        textDecoration: 'none', transition: 'color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        ...focusRing(focusVisible), ...style }}>
      {children}
    </a>
  );
}
