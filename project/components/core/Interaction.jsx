import React, { useEffect, useRef, useState } from 'react';

/* Shared interaction hooks. Components use inline styles, so pseudo-classes (:hover, :active, :focus-visible)
   and media queries are mirrored in React state here. One approach everywhere:
   - hover: pointerenter/leave from a mouse or pen (touch never leaves a hover stuck)
   - press: pointerdown/up/leave/cancel plus Space/Enter keydown/keyup
   - focus ring: onFocus checks el.matches(':focus-visible'), so pointer clicks never show a ring
   - reduced motion: matchMedia('(prefers-reduced-motion: reduce)'), live-updating */

function obsMatchMedia(query) {
  try { return typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query) : null; } catch (e) { return null; }
}

/** Live boolean for a CSS media query. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => { const mq = obsMatchMedia(query); return mq ? mq.matches : false; });
  useEffect(() => {
    const mq = obsMatchMedia(query); if (!mq) return undefined;
    const on = () => setMatches(mq.matches); on();
    if (mq.addEventListener) { mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); }
    mq.addListener(on); return () => mq.removeListener(on);
  }, [query]);
  return matches;
}

/** true when the OS asks for reduced motion. Drop rises, nudges, drift and loops; keep colour and opacity fades. */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** true below the phone breakpoint (820px): one column, the nav becomes a card. */
export function useIsPhone() {
  return useMediaQuery('(max-width: 820px)');
}

/** true below the narrow breakpoint (980px): two-column layouts stack. */
export function useIsNarrow() {
  return useMediaQuery('(max-width: 980px)');
}

/** Hover, press and keyboard-focus state for a pressable element. Spread `handlers` onto the element. */
export function useInteraction({ inert = false } = {}) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const inertRef = useRef(inert); inertRef.current = inert;
  useEffect(() => { if (inert) setDown(false); }, [inert]);
  const handlers = {
    onPointerEnter: (e) => { if (e.pointerType !== 'touch') setHover(true); },
    onPointerLeave: () => { setHover(false); setDown(false); },
    onPointerDown: (e) => { if (e.button === 0 && !inertRef.current) setDown(true); },
    onPointerUp: () => setDown(false),
    onPointerCancel: () => { setHover(false); setDown(false); },
    onKeyDown: (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat && !inertRef.current) setDown(true); },
    onKeyUp: (e) => { if (e.key === ' ' || e.key === 'Enter') setDown(false); },
    onFocus: (e) => {
      let visible = true;
      try { visible = e.currentTarget.matches(':focus-visible'); } catch (err) { visible = true; }
      setFocusVisible(visible);
    },
    onBlur: () => { setFocusVisible(false); setDown(false); },
  };
  return { hover, down: down && !inert, focusVisible, handlers };
}

/** The keyboard focus ring every control shares: 2px violet, offset 2px, only for keyboard focus. */
export function focusRing(on) {
  return on ? { outline: '2px solid var(--violet)', outlineOffset: 2 } : { outline: 'none' };
}
