import React from 'react';
import { useInteraction, focusRing } from '../core/Interaction.jsx';
import { Arrow, textStyle } from '../core/Text.jsx';
import { Spinner } from '../feedback/Spinner.jsx';

function look(variant, size, hover, down) {
  switch (variant) {
    case 'primary': return {
      background: hover ? 'var(--fill-primary-hover)' : 'var(--fill-primary)',
      color: 'var(--label-on-violet)', fontWeight: 'var(--weight-strong)', textShadow: 'var(--shadow-label)',
      padding: size === 'lg' ? '18px 32px' : '14px 26px',
      borderRadius: size === 'lg' ? 'var(--radius-button-lg)' : 'var(--radius-button)',
      border: 'var(--frame-w) solid var(--violet-frame)',
      boxShadow: down ? 'var(--shadow-primary-active)' : hover ? 'var(--shadow-primary-hover)' : 'var(--shadow-primary)',
      overflow: 'hidden', isolation: 'isolate',
    };
    case 'ghost': return {
      background: hover ? 'var(--surface-1)' : 'transparent', color: 'var(--bone)', padding: '14px 24px',
      borderRadius: 'var(--radius-pill)', border: '1px solid', borderColor: hover ? 'var(--hairline-hover)' : 'var(--hairline-strong)',
    };
    case 'nav': return {
      ...textStyle('nav'), fontWeight: 'var(--weight-medium)', fontSize: size === 'sm' ? 13 : 14,
      background: hover ? 'var(--violet-wash)' : 'transparent', color: hover ? 'var(--violet)' : 'var(--bone)',
      padding: size === 'sm' ? '8px 14px' : '9px 18px', borderRadius: 'var(--radius-pill)',
      border: '1px solid', borderColor: hover ? 'var(--violet)' : 'var(--hairline-strong)',
    };
    case 'link': return {
      background: 'none', color: hover ? 'var(--violet)' : 'var(--bone)', padding: '14px 4px', borderRadius: 0, border: 0,
      borderBottom: '1px solid var(--hairline-strong)', position: 'relative',
    };
    default: return {};
  }
}

/** A call to action. primary is the glossy violet button, one per viewport. ghost is the quiet pill beside it.
    link is an underlined line whose violet underline grows on hover. nav is the pill in the nav.
    Every button that starts something takes busy until it lands: a submit passes busyLabel ("Sending") and the
    spinner leads it; a navigation keeps its label and the spinner takes the arrow's place. While busy it is
    aria-busy and a second press does nothing. href renders a link that looks the same. */
export function Button({ variant = 'primary', size = 'md', arrow = false, busy = false, busyLabel, disabled = false,
  fullWidth = false, href, onClick, type = 'button', children, style, ...rest }) {
  const inert = disabled || busy;
  const { hover, down, focusVisible, handlers } = useInteraction({ inert });
  const live = hover && !inert;
  const submitting = busy && busyLabel;
  const s = look(variant, size, live, down);
  const Tag = href ? 'a' : 'button';
  const tagProps = href
    ? { href: inert ? undefined : href, 'aria-disabled': inert || undefined, onClick: inert ? (e) => e.preventDefault() : onClick }
    : { type, disabled, onClick: inert ? undefined : onClick };
  return (
    <Tag {...tagProps} aria-busy={busy || undefined} {...handlers} {...rest}
      style={{ position: 'relative', display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap', textDecoration: 'none',
        ...textStyle(size === 'lg' ? 'button-lg' : 'button'), cursor: busy ? 'progress' : disabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !busy ? 0.5 : busy ? 0.75 : 1, userSelect: 'none',
        transition: 'background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        ...s, ...focusRing(focusVisible), ...style }}>
      {variant === 'primary' ? (
        <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 6, right: 6, height: '45%', zIndex: 1, pointerEvents: 'none',
          background: 'var(--fill-primary-gloss)', borderRadius: 'calc(var(--radius-button) - 4px) calc(var(--radius-button) - 4px) 0 0' }} />
      ) : null}
      {variant === 'link' ? (
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: -1, height: 1, background: 'var(--violet)',
          right: live ? 0 : '100%', transition: 'right var(--dur-reveal) var(--ease-out)' }} />
      ) : null}
      <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {submitting ? <Spinner /> : null}
        <span>{submitting ? busyLabel : children}</span>
        {busy && !submitting ? <Spinner /> : arrow && !submitting ? <Arrow nudge={live} /> : null}
      </span>
    </Tag>
  );
}
