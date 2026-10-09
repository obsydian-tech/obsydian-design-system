import React, { useId } from 'react';
import { usePrefersReducedMotion } from './Interaction.jsx';

/** The official geometry, from assets/obsydian-mark.svg. Never redraw it. */
export const SHARD_FACE = 'M11 3 L23 6 L26 18 L20 28 L9 25 L5 14 Z';
export const SHARD_EDGE = 'M23 6 L26 18 L20 28';

/** The Obsydian shard: a tilted obsidian fragment with one molten violet edge. At rest it is exactly the logo file.
    animated assembles it the way the splash does: the outline traces (150ms), the face fills (550ms), the edge ignites
    top to bottom behind a bright point (900ms), the glow blooms (1150ms) and one sheen crosses the polish (1300ms).
    large thins the strokes for splash sizes, where the logo's 0.75 and 1.5 unit strokes turn heavy. */
/** size is px, or any CSS width ("100%") to fill its box at the mark's 26:28 aspect. */
export function ShardMark({ size = 24, animated = false, large = false, title, style }) {
  const fluid = typeof size !== 'number';
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (k) => `obs-${k}-${raw}`;
  const reduced = usePrefersReducedMotion();
  const play = animated && !reduced;
  const hairline = large ? 0.32 : 0.75;
  const edgeW = large ? 0.9 : 1.5;
  const anim = (name, dur, ease, delay) => (play ? `${name} ${dur} ${ease} ${delay} forwards` : 'none');
  const traced = (on) => (on ? { strokeDasharray: 1, strokeDashoffset: 1 } : {});
  return (
    <svg viewBox="2.5 1.5 26 28" width={fluid ? '100%' : size} height={fluid ? undefined : Math.round(size * 28 / 26)} fill="none"
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}
      style={{ display: 'block', flex: 'none', overflow: 'visible', aspectRatio: fluid ? '26 / 28' : undefined, ...style }}>
      <defs>
        <linearGradient id={id('face')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--surface-3)' }} />
          <stop offset="1" style={{ stopColor: 'var(--obsydian)' }} />
        </linearGradient>
        <linearGradient id={id('edge')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--violet-hover)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--violet)' }} />
          <stop offset="1" style={{ stopColor: 'var(--violet-pressed)' }} />
        </linearGradient>
        <linearGradient id={id('sheen')} x1="0" y1="0" x2="1" y2="0">
          {[[0.2, 0], [0.32, 0.05], [0.44, 0.11], [0.5, 0.14], [0.56, 0.11], [0.68, 0.05], [0.8, 0]].map(([o, a]) => (
            <stop key={o} offset={o} style={{ stopColor: 'var(--bone)', stopOpacity: a }} />
          ))}
        </linearGradient>
        <clipPath id={id('clip')}><path d={SHARD_FACE} /></clipPath>
        <filter id={id('blur')} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="0.8" /></filter>
        <filter id={id('soft')} x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="1.3" /></filter>
      </defs>
      <path d={SHARD_FACE} fill={`url(#${id('face')})`}
        style={{ opacity: play ? 0 : 1, animation: anim('obs-mark-fade', '500ms', 'var(--ease-out)', '550ms') }} />
      {play ? (
        <g clipPath={`url(#${id('clip')})`}>
          <g transform="skewX(-18)">
            <rect x="-6" y="-2" width="12" height="36" fill={`url(#${id('sheen')})`} filter={`url(#${id('soft')})`}
              style={{ opacity: 0, animation: anim('obs-mark-sheen', '1000ms', 'var(--ease-sweep)', '1300ms') }} />
          </g>
        </g>
      ) : null}
      <path d={SHARD_FACE} strokeWidth={hairline} strokeLinejoin="round" pathLength="1"
        style={{ stroke: 'var(--mark-outline)', ...traced(play), animation: anim('obs-mark-draw', '700ms', 'var(--ease-draw)', '150ms') }} />
      <path d={SHARD_EDGE} strokeWidth={edgeW * 1.8} strokeLinecap="round" strokeLinejoin="round"
        filter={`url(#${id('blur')})`} pathLength="1"
        style={{ stroke: 'var(--violet)', opacity: play ? 0 : animated ? 0.3 : 0, ...traced(play),
          animation: play ? 'obs-mark-draw 650ms var(--ease-ignite) 900ms forwards, obs-mark-bloom 1100ms var(--ease-out) 1150ms forwards' : 'none' }} />
      <path d={SHARD_EDGE} stroke={`url(#${id('edge')})`} strokeWidth={edgeW} strokeLinecap="round" strokeLinejoin="round" pathLength="1"
        style={{ ...traced(play), animation: anim('obs-mark-draw', '650ms', 'var(--ease-ignite)', '900ms') }} />
      {play ? (
        <path d={SHARD_EDGE} strokeWidth={edgeW} strokeLinecap="round" pathLength="1"
          style={{ stroke: 'var(--mark-spark)', strokeDasharray: '0.04 1.2', strokeDashoffset: 0.04, opacity: 0, animation: anim('obs-mark-spark', '760ms', 'var(--ease-ignite)', '900ms') }} />
      ) : null}
    </svg>
  );
}
