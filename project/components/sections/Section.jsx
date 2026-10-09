import React from 'react';
import { textStyle } from '../core/Text.jsx';
import { useIsPhone, useIsNarrow, usePrefersReducedMotion } from '../core/Interaction.jsx';
import { Button } from '../actions/Button.jsx';
import { InlineLink } from '../actions/Chip.jsx';

/** The page column: 1440px at most, with the gutter either side. */
export function Container({ children, style }) {
  return <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--gutter)', ...style }}>{children}</div>;
}

/** A section of a page. It breathes (96 to 200px top and bottom, 72px on a phone) and starts with a hairline,
    never a box. hairline={false} for the first section under a hero that already ends in one. */
export function Section({ id, hairline = true, children, style, pad }) {
  const phone = useIsPhone();
  return (
    <section id={id} style={{ padding: `${pad || (phone ? 'var(--section-pad-phone)' : 'var(--section-pad)')} 0`,
      borderTop: hairline ? '1px solid var(--hairline)' : 0, position: 'relative', ...style }}>
      <Container>{children}</Container>
    </section>
  );
}

/** The eyebrow: a 40px violet rule, then "01 What we do" in 12px uppercase bone-low. Sections on the home page are
    numbered with two digits and a space, never a dash; page heroes carry the page's name without a number.
    draw lets the rule draw itself in as it scrolls into view. */
export function Eyebrow({ number, children, hero = false, draw = false, style }) {
  const phone = useIsPhone();
  const reduced = usePrefersReducedMotion();
  const scroll = draw && !reduced;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--eyebrow-gap)',
      marginBottom: hero ? 'var(--eyebrow-after-hero)' : phone ? 32 : 'var(--eyebrow-after)', ...style }}>
      <span aria-hidden="true" style={{ width: 'var(--rule-w)', height: 1, flex: 'none', background: 'var(--violet)', transformOrigin: 'left center',
        animation: scroll ? 'obs-rule-draw linear both' : undefined, animationTimeline: scroll ? 'view()' : undefined, animationRange: scroll ? 'entry 5% cover 22%' : undefined }} />
      <span style={textStyle('eyebrow', 'var(--bone-low)')}>{number ? `${number} ` : ''}{children}</span>
    </div>
  );
}

/** A two-line headline: the first line in bone, the second set back. In a section h2 the second line is bone-dim;
    in a page's h1 and the closing call it is violet. Lines are given as an array. */
export function TwoTone({ lines, accent = 'dim' }) {
  return (
    <>
      {lines[0]}
      {lines.length > 1 ? <><br /><span style={{ color: accent === 'violet' ? 'var(--violet)' : 'var(--bone-dim)' }}>{lines[1]}</span></> : null}
    </>
  );
}

/** The head of a home section: the numbered eyebrow and a two-tone h2 at section size, 22ch at most. */
export function SectionHead({ number, eyebrow, lines, as = 'h2', style }) {
  const phone = useIsPhone();
  const Tag = as;
  return (
    <div style={style}>
      <Eyebrow number={number}>{eyebrow}</Eyebrow>
      <Tag style={{ margin: `0 0 ${phone ? 48 : 'var(--heading-after)'}`, ...textStyle(phone ? 'section-phone' : 'section', 'var(--bone)'),
        maxWidth: phone ? 'none' : '22ch', textWrap: 'balance' }}>
        <TwoTone lines={lines} />
      </Tag>
    </div>
  );
}

/** The top of an inner page. standard: a hairline, the page's eyebrow, a two-line h1 with the second line violet, and
    a lede; aside (the agent promo on Services and Contact) sits to the right at 240 to 320px.
    split: the h1 sits beside a stage (a three.js scene) that bleeds off the right edge; intro is a second, quieter
    paragraph. Heroes carry no buttons. */
export function PageHero({ variant = 'standard', eyebrow, lines, lede, intro, aside, stage, children }) {
  const phone = useIsPhone();
  const narrow = useIsNarrow();
  const split = variant === 'split';
  const twoCol = (split && stage) || (!split && aside);
  return (
    <section style={{ padding: split
        ? `${phone ? '104px' : 'var(--split-hero-pad-top)'} 0 var(--split-hero-pad-bottom)`
        : 'var(--page-hero-pad-top) 0 var(--page-hero-pad-bottom)',
      borderTop: '1px solid var(--hairline)', overflow: split ? 'hidden' : undefined }}>
      <Container style={{ display: 'grid', alignItems: 'center',
        gridTemplateColumns: twoCol && !narrow ? (split ? 'minmax(0, 0.9fr) minmax(0, 1.1fr)' : 'minmax(0, 1fr) minmax(240px, 320px)') : 'minmax(0, 1fr)',
        gap: split ? 'clamp(28px, 4vw, 48px)' : 'clamp(28px, 4vw, 56px)' }}>
        <div>
          <Eyebrow hero>{eyebrow}</Eyebrow>
          <h1 style={{ margin: '0 0 24px', ...textStyle(split ? 'page-split' : 'page', 'var(--bone)'),
            maxWidth: phone ? 'none' : split ? '12ch' : 'var(--measure-headline)', textWrap: 'balance' }}>
            <TwoTone lines={lines} accent="violet" />
          </h1>
          {lede ? <p style={{ margin: split ? '0 0 20px' : 0, ...textStyle('lede', 'var(--bone-dim)'), maxWidth: split ? '42ch' : 'var(--measure-lede)' }}>{lede}</p> : null}
          {intro ? <p style={{ margin: 0, ...textStyle('small', 'var(--bone-low)'), lineHeight: 1.6, maxWidth: '40ch' }}>{intro}</p> : null}
          {children}
        </div>
        {split && stage ? (
          <div style={{ position: 'relative', aspectRatio: '1.08 / 1', width: narrow ? '100%' : 'calc(100% + clamp(0px, 4vw, 64px))',
            maxWidth: narrow ? 640 : undefined, margin: narrow ? '0 auto' : '0 calc(-1 * clamp(0px, 4vw, 64px)) 0 0' }}>{stage}</div>
        ) : null}
        {!split && aside ? <div style={narrow ? { paddingTop: 'clamp(32px, 6vw, 48px)', borderTop: '1px solid var(--hairline)', marginTop: 8 } : undefined}>{aside}</div> : null}
      </Container>
    </section>
  );
}

/** The foot of an inner page: one question at prompt size, then the primary action. Every inner page but Privacy ends
    with one, always "Start a project" to /contact. */
export function CtaBand({ prompt, action = 'Start a project', href = '/contact' }) {
  return (
    <section style={{ padding: 'var(--band-pad-top) 0 var(--band-pad-bottom)', borderTop: '1px solid var(--hairline)' }}>
      <Container>
        <p style={{ margin: '0 0 28px', ...textStyle('prompt', 'var(--bone)') }}>{prompt}</p>
        <Button variant="primary" arrow href={href}>{action}</Button>
      </Container>
    </section>
  );
}

/** A labelled value in a row of them: the label in 11px uppercase bone-low, the value a link or a line of text. */
export function MetaItem({ label, children, href, align = 'left' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: align, minWidth: 0 }}>
      <span style={textStyle('label', 'var(--bone-low)')}>{label}</span>
      <span style={{ ...textStyle('small', 'var(--bone)'), letterSpacing: '-0.005em' }}>
        {href ? <InlineLink href={href}>{children}</InlineLink> : children}
      </span>
    </div>
  );
}

/** The last word on the home page: a centred two-line headline at closing size with the second line violet, one
    sentence, the large primary action and a link, then the addresses on a hairline. A violet haze rises behind it. */
export function ClosingCall({ lines = ['Have a platform', 'worth building?'], sub = 'Tell us about the product, platform or system you need to build next.',
  action = 'Start a conversation', href = '/contact', link = 'Explore services', linkHref = '/services', meta = [
    { label: 'Partner enquiries', value: 'partner@obsydiantechnologies.com', href: 'mailto:partner@obsydiantechnologies.com' },
    { label: 'Press', value: 'press@obsydiantechnologies.com', href: 'mailto:press@obsydiantechnologies.com' }] }) {
  const phone = useIsPhone();
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: `${phone ? '80px' : 'var(--closing-pad)'} 0`, borderTop: '1px solid var(--hairline)',
      textAlign: phone ? 'left' : 'center' }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(50% 60% at 50% 80%, var(--violet-haze), transparent 70%), radial-gradient(80% 50% at 50% 100%, var(--violet-wash), transparent 60%)' }} />
      <Container style={{ position: 'relative' }}>
        <h2 style={{ margin: `0 0 ${phone ? 20 : 32}px`, ...textStyle('closing', 'var(--bone)'), ...(phone ? { fontSize: 'clamp(32px, 9vw, 44px)' } : {}) }}>
          <TwoTone lines={lines} accent="violet" />
        </h2>
        <p style={{ margin: `0 0 ${phone ? 32 : 48}px`, ...textStyle('lede', 'var(--bone-dim)'), fontSize: phone ? 16 : 'clamp(17px, 1.5vw, 22px)' }}>{sub}</p>
        <div style={{ display: 'flex', flexDirection: phone ? 'column' : 'row', alignItems: phone ? 'stretch' : 'center', justifyContent: 'center',
          flexWrap: 'wrap', gap: phone ? 12 : 18, marginBottom: phone ? 56 : 96 }}>
          <Button variant="primary" size="lg" arrow href={href} fullWidth={phone}>{action}</Button>
          <Button variant="link" href={linkHref} style={phone ? { alignSelf: 'flex-start' } : undefined}>{link}</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: phone ? 'column' : 'row', justifyContent: 'center', gap: phone ? 24 : 64, paddingTop: 32,
          borderTop: '1px solid var(--hairline)', maxWidth: 720, margin: '0 auto' }}>
          {meta.map((m) => <MetaItem key={m.label} label={m.label} href={m.href}>{m.value}</MetaItem>)}
        </div>
      </Container>
    </section>
  );
}

/** The top of the home page: a full-height slab of obsidian. The headline sits left at hero size with its second line
    set back in bone-dim, then one sentence and two actions (the primary and a link). The orb, a three.js scene, sits
    behind at 76% across; without WebGL it is assets/shard.svg at 70%. "Scroll" waits at the foot. On a phone the
    orb drops to the lower right at 45% and the actions stack. */
export function HomeHero({ lines = ['We build the platforms', 'serious businesses run on.'],
  sub = 'Modern software engineering, cloud infrastructure and intelligent systems for organisations building for growth. We architect, modernise and scale the platforms your business depends on.',
  action = 'Start a project', href = '/contact', link = 'Our services', linkHref = '/services', stage, fallbackSrc = 'assets/shard.svg', minHeight = '100vh' }) {
  const phone = useIsPhone();
  const reduced = usePrefersReducedMotion();
  return (
    <section style={{ position: 'relative', minHeight: phone ? '100svh' : minHeight, display: 'flex', alignItems: phone ? 'center' : undefined,
      padding: phone ? 'calc(110px + env(safe-area-inset-top)) 0 88px' : '140px 0 120px', overflow: 'hidden', isolation: 'isolate' }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -3,
        background: 'radial-gradient(60% 60% at 75% 50%, var(--violet-wash), transparent 70%), radial-gradient(80% 80% at 50% 30%, var(--hover-wash), transparent 65%), var(--obsydian)' }} />
      <div aria-hidden="true" style={phone
        ? { position: 'absolute', right: '-55%', bottom: 0, width: '115vw', aspectRatio: '1', opacity: 0.45, zIndex: -1, pointerEvents: 'none' }
        : { position: 'absolute', left: '76%', top: '50%', width: 'min(900px, 68vw, 132svh)', aspectRatio: '1', transform: 'translate(-50%, -50%)', zIndex: -1, pointerEvents: 'none' }}>
        {stage || <img src={fallbackSrc} alt="" style={{ width: '70%', margin: '15%', opacity: 0.7, display: 'block' }} />}
      </div>
      <Container style={{ width: '100%' }}>
        <div style={{ maxWidth: phone ? '100%' : 'min(78%, 980px)' }}>
          <h1 style={{ margin: `0 0 ${phone ? 24 : 36}px`, ...textStyle(phone ? 'hero-phone' : 'hero', 'var(--bone)'), textWrap: 'balance' }}><TwoTone lines={lines} /></h1>
          <p style={{ margin: `0 0 ${phone ? 32 : 48}px`, ...textStyle('lede', 'var(--bone-dim)'), fontSize: phone ? 16 : 'clamp(17px, 1.4vw, 20px)', maxWidth: '62ch', width: phone ? '100%' : 'min(70%, 660px)' }}>{sub}</p>
          <div style={{ display: 'flex', flexDirection: phone ? 'column' : 'row', alignItems: phone ? 'stretch' : 'center', flexWrap: 'wrap', gap: phone ? 12 : 'var(--cta-gap)', marginBottom: phone ? 40 : 88 }}>
            <Button variant="primary" arrow href={href} fullWidth={phone}>{action}</Button>
            <Button variant="link" href={linkHref} style={phone ? { alignSelf: 'flex-start', padding: '12px 0' } : undefined}>{link}</Button>
          </div>
        </div>
      </Container>
      {phone ? null : (
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={textStyle('label', 'var(--bone-low)')}>Scroll</span>
          <span style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--hairline-strong), transparent)', transformOrigin: 'top center',
            animation: reduced ? 'none' : 'obs-scroll-pulse 2.4s var(--ease-in-out) infinite' }} />
        </div>
      )}
    </section>
  );
}
