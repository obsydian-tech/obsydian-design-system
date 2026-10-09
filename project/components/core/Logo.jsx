import React from 'react';
import { ShardMark } from './ShardMark.jsx';
import { textStyle } from './Text.jsx';

const SIZES = {
  nav: { mark: 22, word: 17 },     // the nav at the top of the page
  pill: { mark: 20, word: 15 },    // the scrolled nav pill, and the nav card on a phone
  footer: { mark: 24, word: 17 },  // the footer's brand block
};

/** The lockup: the shard, then "Obsydian Technologies" in General Sans 600 at -0.02em, 8px apart.
    The wordmark is set in type, never an image, so it is always the live font. markOnly keeps the shard alone
    and names it for a screen reader. */
export function Logo({ size = 'nav', markOnly = false, name = 'Obsydian Technologies', style }) {
  const s = SIZES[size] || SIZES.nav;
  if (markOnly) return <ShardMark size={s.mark} title={name} style={style} />;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--bone)', ...style }}>
      <ShardMark size={s.mark} />
      <span style={{ ...textStyle('wordmark'), fontSize: s.word, whiteSpace: 'nowrap',
        transition: 'font-size var(--dur-nav) var(--ease-out)' }}>{name}</span>
    </span>
  );
}
