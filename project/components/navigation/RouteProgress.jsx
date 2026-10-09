import React from 'react';

/** The 2px bar across the top of the window while a route loads. It shows only after 150ms, so fast navigations
    never flash it, and creeps to 85% over 8s; it never claims to finish. The control that started the navigation
    shows its own spinner at the same time. */
export function RouteProgress({ active = false, contained = false }) {
  return (
    <div aria-hidden="true" style={{ position: contained ? 'absolute' : 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 10001,
      transformOrigin: 'left center', background: 'var(--fill-progress)', boxShadow: '0 0 8px var(--violet-glow)',
      opacity: active ? 1 : 0, transform: active ? 'scaleX(0.85)' : 'scaleX(0)',
      transition: active ? 'opacity 120ms ease, transform 8s var(--ease-progress)' : 'opacity 200ms ease, transform 300ms ease' }} />
  );
}
