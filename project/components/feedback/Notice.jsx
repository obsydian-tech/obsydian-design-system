import React, { useEffect, useState } from 'react';
import { textStyle } from '../core/Text.jsx';
import { Icon } from '../core/Icon.jsx';
import { usePrefersReducedMotion } from '../core/Interaction.jsx';

/** A sentence that needs setting apart: a 2px violet bar down its left, the words in bone-dim. Errors that are not
    about one field read this way ("The drafting engine could not complete that request. Try rephrasing."), calmly,
    never in red; so does counsel on a blueprint. alert announces it. counsel is the larger reading size. */
export function Notice({ children, alert = false, counsel = false, style }) {
  return (
    <p role={alert ? 'alert' : undefined} style={{ margin: 0, borderLeft: 'var(--bar-w) solid var(--violet)', paddingLeft: counsel ? 20 : 14,
      ...textStyle(counsel ? 'small' : 'meta', 'var(--bone-dim)'), lineHeight: counsel ? 1.6 : 1.5, maxWidth: counsel ? '68ch' : '60ch', ...style }}>
      {children}
    </p>
  );
}

/** Something carried over from one place to the next, at the top of a form: "Blueprint attached". A hairline box on a
    violet wash, a violet label, a title and one line on what to do with it. Announced as status. */
export function Callout({ label, title, children, style }) {
  return (
    <div role="status" style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', background: 'var(--violet-wash)', padding: '16px 18px', ...style }}>
      <div style={{ ...textStyle('label', 'var(--violet)'), letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      {title ? <div style={{ font: 'var(--type-title-3)', fontSize: 22, letterSpacing: '-0.02em', color: 'var(--bone)', marginBottom: 4 }}>{title}</div> : null}
      <div style={{ ...textStyle('meta', 'var(--bone-dim)') }}>{children}</div>
    </div>
  );
}

/** A short confirmation that something happened, low and centred, for 3.8s. A violet tile with a check, a title and
    one sentence; it never carries an action. contained keeps it inside its parent for a card. */
export function Toast({ title, children, open = true, contained = false, duration = 3800, onClose }) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(open);
  useEffect(() => {
    setShown(open);
    if (!open || !duration) return undefined;
    const t = setTimeout(() => { setShown(false); if (onClose) onClose(); }, duration);
    return () => clearTimeout(t);
  }, [open, duration]);
  if (!shown) return null;
  return (
    <div role="status" aria-live="polite" style={{ position: contained ? 'absolute' : 'fixed', bottom: 28, left: '50%', translate: '-50% 0', zIndex: 1000,
      display: 'flex', alignItems: 'center', gap: 13, maxWidth: 'min(420px, calc(100vw - 32px))', width: 'max-content', padding: '15px 20px 15px 16px',
      background: 'var(--surface-1)', border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-pill)',
      animation: reduced ? undefined : 'obs-lift var(--dur-base) var(--ease-out) both' }}>
      <span aria-hidden="true" style={{ flex: 'none', width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-md)',
        background: 'var(--fill-mark-edge)', boxShadow: 'var(--shadow-violet)', color: 'var(--label-on-violet)' }}>
        <Icon name="check" size={18} stroke={2.4} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--type-title-3)', fontSize: 15, fontWeight: 'var(--weight-strong)', letterSpacing: 'normal', color: 'var(--bone)' }}>{title}</span>
        <span style={{ ...textStyle('caption', 'var(--bone-dim)') }}>{children}</span>
      </span>
    </div>
  );
}
