import React, { useId } from 'react';
import { textStyle } from '../core/Text.jsx';
import { useInteraction, usePrefersReducedMotion, focusRing } from '../core/Interaction.jsx';

/** A line with no axes and no grid: one series in bone-faint, 1.5px, that turns violet-hi with a faint violet fill
    when its panel is in focus. It draws itself in once. Values are 0 to 1. */
export function Sparkline({ values, lit = false, height = 48, draw = true, delay = 0 }) {
  const reduced = usePrefersReducedMotion();
  const clip = 'obs-spark-' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const w = 200, h = 48;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - v * h * 0.82 - h * 0.08]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const play = draw && !reduced;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', width: '100%', height, marginTop: 'auto', overflow: 'visible' }}>
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="-4" width={w} height={h + 8} style={{ transformBox: 'fill-box', transformOrigin: 'left center',
            animation: play ? `obs-rule-draw 1.2s ease-out ${delay}ms both` : undefined }} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <path d={`${line} L${w} ${h} L0 ${h} Z`} style={{ fill: 'var(--violet-wash)', opacity: lit ? 1 : 0, transition: 'opacity var(--dur-nav) var(--ease-out)' }} />
        <path d={line} vectorEffect="non-scaling-stroke"
          style={{ fill: 'none', stroke: lit ? 'var(--violet-hi)' : 'var(--bone-faint)', strokeWidth: 1.5, transition: 'stroke var(--dur-nav) var(--ease-out)' }} />
      </g>
    </svg>
  );
}

/** One signal on the operate wall: a label and its change, a figure that turns violet-hi when selected, a sparkline,
    and a status word ("View detail", "Selected"). Selected takes the violet ring and a violet wash; under the pointer,
    the 3px bar. */
export function SignalTile({ label, value, delta, values, selected = false, onSelect }) {
  const { hover, focusVisible, handlers } = useInteraction();
  const lit = hover || selected;
  return (
    <button type="button" aria-pressed={selected} onClick={onSelect} {...handlers}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 148, padding: '20px 22px 18px', textAlign: 'left', border: 0, font: 'inherit', color: 'inherit',
        cursor: 'pointer', background: selected ? 'var(--violet-wash)' : hover ? 'var(--hover-wash)' : 'transparent',
        boxShadow: selected ? 'inset 0 0 0 1px var(--violet-ring)' : hover ? 'inset var(--select-bar) 0 0 var(--violet)' : 'none',
        transition: 'background-color var(--dur-nav) var(--ease-out), box-shadow var(--dur-nav) var(--ease-out)', ...focusRing(focusVisible), outlineOffset: -2 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ ...textStyle('label', 'var(--bone-low)'), fontSize: 10, letterSpacing: '0.1em' }}>{label}</span>
        <span style={{ ...textStyle('label', selected ? 'var(--bone-dim)' : 'var(--bone-low)'), fontSize: 10, letterSpacing: '0.06em', textTransform: 'none' }}>{delta}</span>
      </span>
      <span style={{ ...textStyle('stat'), fontSize: 'clamp(28px, 3vw, 36px)', color: selected ? 'var(--violet-hi)' : 'var(--bone)' }}>{value}</span>
      <Sparkline values={values} lit={lit} />
      <span style={{ ...textStyle('action', 'var(--bone-low)'), fontSize: 9, letterSpacing: '0.1em' }}>{selected ? 'Selected' : 'View detail'}</span>
    </button>
  );
}
