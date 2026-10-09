import React from 'react';

/** The one busy spinner. A 14px ring in currentColor with its right side open, turning every 700ms (1.6s under
    reduced motion, never still, because a still ring reads as broken). It only ever appears on the control that
    started the work; it is never a page loader on its own. */
export function Spinner({ size = 14, style }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-block', flex: 'none', width: size, height: size, boxSizing: 'border-box',
      border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', opacity: 0.85,
      animation: 'obs-spin var(--dur-spin) linear infinite', ...style }} />
  );
}
