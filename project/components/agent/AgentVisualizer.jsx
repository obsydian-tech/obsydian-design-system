import React, { useEffect, useRef, useState } from 'react';
import { textStyle } from '../core/Text.jsx';
import { Button } from '../actions/Button.jsx';
import { usePrefersReducedMotion } from '../core/Interaction.jsx';

const GRID_N = 15;
const GRID_C = Math.floor(GRID_N / 2);

function sequenceFor(state) {
  const seq = [];
  if (state === 'thinking') {
    for (let x = 0; x < GRID_N; x++) seq.push([x, GRID_C]);
    for (let x = GRID_N - 1; x >= 0; x--) seq.push([x, GRID_C]);
  } else if (state === 'listening') {
    for (let s = 0; s < 12; s++) {
      const a = (s / 12) * Math.PI * 2 - Math.PI / 2;
      seq.push([Math.round(GRID_C + 4 * Math.cos(a)), Math.round(GRID_C + 4 * Math.sin(a))]);
    }
  } else if (state === 'speaking') {
    seq.push([GRID_C, GRID_C]);
  } else {
    const r = 5, t = GRID_C - r, b = GRID_C + r;
    for (let x = t; x <= b; x++) seq.push([x, t]);
    for (let y = t + 1; y <= b; y++) seq.push([b, y]);
    for (let x = b - 1; x >= t; x--) seq.push([x, b]);
    for (let y = b - 1; y > t; y--) seq.push([t, y]);
  }
  return seq;
}

/** The voice agent's face: a rounded frame with a point of violet light running round it, and a 15 by 15 grid of
    dots inside. idle and connecting walk one dot round a square; listening circles; thinking scans the middle row;
    speaking lights the dots near the centre in violet-hi, as far out as the voice is loud (level, 0 to 1).
    One step every 90ms. Reduced motion holds one dot still and stops the light on the frame. */
export function AgentVisualizer({ state = 'idle', level = 0, size = 280, session = false, style }) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const seq = useRef(sequenceFor(state));
  useEffect(() => { seq.current = sequenceFor(state); setStep(0); }, [state]);
  useEffect(() => {
    if (reduced) return undefined;
    const t = setInterval(() => setStep((s) => (s + 1) % seq.current.length), 90);
    return () => clearInterval(t);
  }, [reduced, state]);
  const [px, py] = seq.current[step % seq.current.length] || [GRID_C, GRID_C];
  const glow = state === 'speaking' && level >= 0.025 ? Math.min(1, 0.35 + ((level - 0.025) / 0.325) * 0.65) : 0;
  const reach = Math.ceil(glow * 5);
  return (
    <div style={{ position: 'relative', width: size, maxWidth: '100%', aspectRatio: '1', ...style }}>
      <svg viewBox="0 0 100 100" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <rect x="1" y="1" width="98" height="98" rx="7.5" style={{ fill: 'none', stroke: 'var(--hairline-strong)', strokeWidth: 0.65 }} />
        <rect x="1" y="1" width="98" height="98" rx="7.5" pathLength="100"
          style={{ fill: 'none', stroke: 'var(--violet-hi)', strokeWidth: session ? 1.3 : 1.15, strokeLinecap: 'round', strokeDasharray: session ? '12 88' : '10 90',
            filter: 'drop-shadow(0 0 6px var(--violet))', animation: reduced ? 'none' : `obs-comet ${session ? '4.2s' : '5s'} linear infinite` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 18, borderRadius: 'var(--radius-md)', background: 'var(--obsydian)' }} />
      <div style={{ position: 'absolute', inset: 18, display: 'grid', gridTemplateColumns: `repeat(${GRID_N}, 1fr)`, gap: 6, padding: 6 }}>
        {Array.from({ length: GRID_N * GRID_N }, (_, i) => {
          const x = i % GRID_N, y = Math.floor(i / GRID_N);
          const speak = glow > 0 && Math.max(Math.abs(x - GRID_C), Math.abs(y - GRID_C)) <= reach;
          const lit = !speak && x === px && y === py;
          return (
            <span key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-dot)',
              background: speak ? 'var(--violet-hi)' : lit ? 'var(--hairline-hover)' : 'var(--hairline)',
              transform: speak ? 'scale(1.22)' : lit ? 'scale(1.1)' : 'none',
              boxShadow: speak ? '0 0 8px 1px var(--violet-glow), 0 0 18px 3px var(--violet-ring)' : 'none',
              transition: 'background 70ms ease-out, transform 70ms ease-out' }} />
          );
        })}
      </div>
    </div>
  );
}

/** "Talk to Obsydian": the visualiser on a soft violet glow, one line on what to ask, and the primary action.
    It sits in the aside of the Services and Contact heroes. */
export function AgentPromo({ lead = 'Ask about our services, locations, and how we work.', href = '/agent', busy = false }) {
  return (
    <aside aria-label="Talk to Obsydian" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20, padding: 'clamp(8px, 2vw, 16px) 0' }}>
      <a href={href} aria-label="Talk to Obsydian" style={{ position: 'relative', width: 'min(100%, 280px)', aspectRatio: '1', display: 'block' }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: '-18%', pointerEvents: 'none',
          background: 'radial-gradient(circle at center, var(--violet-ring) 0%, var(--violet-wash) 42%, transparent 68%)' }} />
        <AgentVisualizer size="100%" style={{ position: 'relative' }} />
      </a>
      <p style={{ margin: 0, ...textStyle('meta', 'var(--bone-dim)'), maxWidth: '26ch' }}>{lead}</p>
      <Button variant="primary" arrow href={href} busy={busy} busyLabel={busy ? 'Connecting' : undefined} style={{ minWidth: 220 }}>Talk to Obsydian</Button>
    </aside>
  );
}
