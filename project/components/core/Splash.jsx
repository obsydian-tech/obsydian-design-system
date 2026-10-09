import React, { useEffect, useState } from 'react';
import { ShardMark } from './ShardMark.jsx';
import { textStyle } from './Text.jsx';
import { usePrefersReducedMotion } from './Interaction.jsx';

/** The first-visit splash. The shard assembles, the name appears once, a hairline loader fills, then the whole
    thing dissolves into the hero (blur 14px, scale 1.08) at 2400ms and is gone at 3120ms. Once per session, never on
    an in-site navigation, never on /login, /signup, /dashboard or /intro. Reduced motion shows the finished mark and
    leaves after 900ms. contained draws it inside its parent instead of over the page; playKey replays it. */
export function Splash({ contained = false, hold = false, playKey = 0, onDone }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState('in');
  useEffect(() => {
    setPhase('in');
    if (hold) return undefined;
    const holdMs = reduced ? 900 : 2400;
    const exitMs = reduced ? 450 : 720;
    const a = setTimeout(() => setPhase('out'), holdMs);
    const b = setTimeout(() => { setPhase('gone'); if (onDone) onDone(); }, holdMs + exitMs);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [playKey, hold, reduced]);
  if (phase === 'gone') return null;
  const out = phase === 'out';
  const enter = (name, dur, delay) => (reduced ? 'none' : `${name} ${dur} var(--ease-out) ${delay} both`);
  return (
    <div aria-hidden="true" style={{ position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: contained ? 1 : 10000,
      display: 'grid', placeItems: 'center', overflow: 'hidden', background: 'var(--obsydian)',
      opacity: out ? 0 : 1, filter: out && !reduced ? 'blur(14px)' : 'none',
      transition: reduced ? 'opacity 450ms var(--ease-out)' : 'opacity var(--dur-splash-exit) var(--ease-out), filter var(--dur-splash-exit) var(--ease-out)' }}>
      <div key={playKey} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36,
        transform: out && !reduced ? 'scale(1.08)' : 'none', transition: 'transform 700ms var(--ease-out)' }}>
        <div style={{ position: 'relative', width: 'clamp(100px, 13vw, 124px)', animation: enter('obs-mark-rise', '900ms', '80ms') }}>
          <span style={{ position: 'absolute', top: '18%', right: '4%', width: '46%', height: '70%', borderRadius: '50%',
            background: 'radial-gradient(closest-side, var(--violet-ring), transparent)', filter: 'blur(18px)',
            opacity: reduced ? 0.3 : undefined, animation: reduced ? 'none' : 'obs-ember 1200ms var(--ease-out) 1100ms both' }} />
          <ShardMark size="100%" animated large />
        </div>
        <span style={{ ...textStyle('wordmark', 'var(--bone)'), fontSize: 'clamp(20px, 3vw, 26px)', animation: enter('obs-lift', '700ms', '1150ms') }}>Obsydian Technologies</span>
        <span style={{ position: 'relative', width: 160, height: 1, marginTop: -12, background: 'var(--hairline-strong)', overflow: 'hidden',
          animation: enter('obs-mark-fade', '400ms', '200ms') }}>
          <span style={{ position: 'absolute', inset: 0, transformOrigin: 'left center', background: 'linear-gradient(90deg, var(--violet-ring), var(--violet-hi) 70%, var(--bone))',
            animation: reduced ? 'none' : 'obs-rule-draw 1900ms var(--ease-sweep) 300ms both' }} />
        </span>
      </div>
    </div>
  );
}
