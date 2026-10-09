import React from 'react';
import { textStyle } from '../core/Text.jsx';

/** A label that is not pressed. pill (default) is a capability: 14px bone-dim in a hairline pill.
    square is a connection on the systems page: 11px uppercase on a 6px hairline box. */
export function Tag({ shape = 'pill', children, style }) {
  const pill = shape === 'pill';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--bone-dim)',
      ...(pill
        ? { ...textStyle('meta'), letterSpacing: 'normal', padding: '7px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--hairline-strong)' }
        : { ...textStyle('label'), fontWeight: 'var(--weight-regular)', letterSpacing: '0.06em', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline)' }),
      ...style }}>
      {children}
    </span>
  );
}

/** What state something live is in, as a word in a pill. live turns it violet-hi with a pulsing dot; everything
    else is bone-low on a hairline. The word does the work, never the colour alone: Ready, Connecting, Live. */
export function StatusPill({ live = false, children, style }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, ...textStyle('label'), fontSize: 10, letterSpacing: '0.14em',
      padding: '4px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid', whiteSpace: 'nowrap',
      color: live ? 'var(--violet-hi)' : 'var(--bone-low)', borderColor: live ? 'var(--violet-line)' : 'var(--hairline-strong)', ...style }}>
      {live ? <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--violet-hi)', animation: 'obs-pulse 1.8s var(--ease-in-out) infinite' }} /> : null}
      {children}
    </span>
  );
}
