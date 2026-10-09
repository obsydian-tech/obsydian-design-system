import React from 'react';
import { textStyle } from '../core/Text.jsx';
import { useInteraction, useIsPhone, useIsNarrow, usePrefersReducedMotion, focusRing } from '../core/Interaction.jsx';

/** A grid drawn from hairlines alone: the grid rules its top and left, each cell its right and bottom, so every line
    is 1px and none doubles. columns steps down to two below 980px and one below 820px (pass narrow and phone to change
    that). No fills, no radius. */
export function CellGrid({ columns = 3, narrow = 2, phone = 1, role, ariaLabel, children, style }) {
  const isPhone = useIsPhone();
  const isNarrow = useIsNarrow();
  const n = isPhone ? phone : isNarrow ? narrow : columns;
  return (
    <div role={role} aria-label={ariaLabel} style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
      borderTop: '1px solid var(--hairline)', borderLeft: '1px solid var(--hairline)', ...style }}>
      {children}
    </div>
  );
}

const cellRule = { borderRight: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' };

/** A cell you can select, in a CellGrid: a violet category label, a title, a summary, and an action line at the foot
    ("Explore layer →"; "Selected" once chosen). Under the pointer the cell takes a faint wash and a 3px violet bar
    down its left; selected, a violet ring sits inside its edge. The stack layers, the systems, the offices.
    Without onSelect it is a static cell: a practice, or the overview at the end of a list. */
export function Tile({ label, title, summary, action, selected = false, hovered = false, onSelect, children, minHeight = 200, style }) {
  const phone = useIsPhone();
  const { hover, focusVisible, handlers } = useInteraction({ inert: !onSelect });
  const pressable = Boolean(onSelect);
  const lit = pressable && (hover || hovered);
  const Tag = pressable ? 'button' : 'article';
  const shadow = selected ? 'inset 0 0 0 1px var(--violet-ring)' : lit ? 'inset var(--select-bar) 0 0 var(--violet)' : 'none';
  return (
    <Tag type={pressable ? 'button' : undefined} aria-pressed={pressable ? selected : undefined} onClick={onSelect} {...(pressable ? handlers : {})}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', minHeight: phone ? 0 : minHeight, padding: 'var(--cell-pad)',
        background: lit || selected ? 'var(--hover-wash)' : 'transparent', border: 0, ...cellRule, boxShadow: shadow, color: 'inherit',
        font: 'inherit', cursor: pressable ? 'pointer' : 'default', transition: 'background-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        ...focusRing(focusVisible), outlineOffset: -2, ...style }}>
      {label ? <span style={textStyle('label', 'var(--violet)')}>{label}</span> : null}
      {title ? <span style={textStyle('title-3', 'var(--bone)')}>{title}</span> : null}
      {summary ? <span style={{ ...textStyle('meta', 'var(--bone-dim)'), lineHeight: 1.55, marginTop: 4, flex: 1 }}>{summary}</span> : null}
      {children}
      {action ? <span style={{ ...textStyle('action', 'var(--bone-low)'), marginTop: 8 }}>{selected ? 'Selected' : <>{action}&nbsp;→</>}</span> : null}
    </Tag>
  );
}

/** A logo in a CellGrid, linked out. Logos are drawn white (brightness 0, invert 1) at 62% and come up to 90% under
    the pointer, so no partner's colour competes with violet; native keeps a mark whose colour is its identity, at 72%
    to 95%. Without src, the name stands in. */
export function LogoCell({ name, src, href, native = false, minHeight = 124, style }) {
  const phone = useIsPhone();
  const { hover, focusVisible, handlers } = useInteraction();
  const rest = native ? 0.72 : 0.62;
  const up = native ? 0.95 : 0.9;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${name} (opens in new tab)`} {...handlers}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: phone ? 96 : minHeight, padding: 20, ...cellRule,
        background: hover ? 'var(--hover-wash)' : 'transparent', textDecoration: 'none', transition: 'background-color var(--dur-base) var(--ease-out)',
        ...focusRing(focusVisible), outlineOffset: -2, ...style }}>
      {src ? (
        <img src={src} alt={name} loading="lazy" decoding="async"
          style={{ height: 'clamp(24px, 2vw, 34px)', width: 'auto', maxWidth: 140, objectFit: 'contain', filter: native ? 'none' : 'brightness(0) invert(1)',
            opacity: hover ? up : rest, transition: 'opacity var(--dur-base) var(--ease-out)' }} />
      ) : (
        <span style={{ ...textStyle('wordmark'), fontSize: 18, color: 'var(--bone)', opacity: hover ? up : rest, transition: 'opacity var(--dur-base) var(--ease-out)' }}>{name}</span>
      )}
    </a>
  );
}

/** The platforms we built, marching slowly left between two hairlines, fading out at both edges. Logos are white at
    42%, coming up to 78% under the pointer; the band pauses while the pointer is on it. Reduced motion stops it and
    lets it scroll by hand. Without src, the name stands in. */
export function LogoBand({ items, label = 'A selection of platforms built by Obsydian Technologies' }) {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = React.useState(false);
  const row = reduced ? items : [...items, ...items];
  const fade = (dir) => ({ position: 'absolute', top: 0, bottom: 0, [dir]: 0, width: 'clamp(48px, 10vw, 120px)', zIndex: 1, pointerEvents: 'none',
    background: `linear-gradient(${dir === 'left' ? 90 : 270}deg, var(--obsydian) 0%, transparent 100%)` });
  return (
    <div aria-label={label} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      style={{ position: 'relative', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', padding: 'clamp(48px, 8vw, 80px) 0', overflow: 'hidden' }}>
      <span aria-hidden="true" style={fade('left')} /><span aria-hidden="true" style={fade('right')} />
      <div style={{ overflowX: reduced ? 'auto' : 'hidden', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', width: 'max-content', alignItems: 'center', gap: 'clamp(72px, 12vw, 160px)', padding: reduced ? '0 24px' : '0 clamp(48px, 8vw, 120px)',
          margin: reduced ? '0 auto' : undefined, animation: reduced ? 'none' : 'obs-marquee 28s linear infinite', animationPlayState: paused ? 'paused' : 'running' }}>
          {row.map((it, i) => <BandItem key={i} item={it} hiddenCopy={i >= items.length} />)}
        </div>
      </div>
    </div>
  );
}

function BandItem({ item, hiddenCopy }) {
  const { hover, handlers } = useInteraction();
  const o = item.native ? (hover ? 0.92 : 0.5) : hover ? 0.78 : 0.42;
  const inner = item.src
    ? <img src={item.src} alt="" style={{ maxWidth: 'min(220px, 28vw)', height: 'clamp(40px, 5vw, 56px)', objectFit: 'contain', filter: item.native ? 'none' : 'brightness(0) invert(1)', opacity: o, transition: 'opacity 400ms var(--ease-out)' }} />
    : <span style={{ ...textStyle('wordmark'), fontSize: 'clamp(20px, 2vw, 28px)', color: 'var(--bone)', opacity: o, transition: 'opacity 400ms var(--ease-out)' }}>{item.name}</span>;
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${item.name} (opens in new tab)`} aria-hidden={hiddenCopy || undefined} tabIndex={hiddenCopy ? -1 : undefined} {...handlers}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 'clamp(140px, 18vw, 220px)', textDecoration: 'none' }}>{inner}</a>
  );
}
