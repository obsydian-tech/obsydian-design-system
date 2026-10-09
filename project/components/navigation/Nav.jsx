import React, { useEffect, useState } from 'react';
import { Logo } from '../core/Logo.jsx';
import { Arrow, textStyle } from '../core/Text.jsx';
import { useInteraction, useIsPhone, usePrefersReducedMotion, focusRing } from '../core/Interaction.jsx';
import { Button } from '../actions/Button.jsx';

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Platforms', href: '/platforms' },
  { label: 'Partners', href: '/technology-partners' },
  { label: 'How we work', href: '/how-we-work' },
  { label: 'Blueprint', href: '/blueprint' },
];

function NavLink({ link, active, pill }) {
  const { hover, focusVisible, handlers } = useInteraction();
  return (
    <a href={link.href} aria-current={active ? 'page' : undefined} {...handlers}
      style={{ ...textStyle('nav'), fontSize: pill ? 13 : 14, padding: pill ? '4px 2px' : '6px 2px', textDecoration: 'none',
        color: active || hover ? 'var(--bone)' : 'var(--bone-dim)', transition: 'color var(--dur-base) var(--ease-out)', ...focusRing(focusVisible) }}>
      {link.label}
    </a>
  );
}

/** The bar above the nav at the top of the page: one line and one link. It slides away once the page scrolls. */
export function AnnounceBar({ text = 'Selective partnerships at the bleeding edge.', link = 'Discuss your work', href = '/contact', hidden = false, contained = false }) {
  const { hover, handlers } = useInteraction();
  return (
    <div style={{ position: contained ? 'absolute' : 'fixed', top: 0, left: 0, right: 0, zIndex: 51, height: 'var(--announce-h)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 var(--gutter)',
      background: 'var(--surface-1)', borderBottom: '1px solid var(--hairline)', transform: hidden ? 'translateY(-100%)' : 'none',
      transition: 'transform var(--dur-nav) var(--ease-out)' }}>
      <p style={{ margin: 0, ...textStyle('caption', 'var(--bone-dim)'), letterSpacing: '-0.005em' }}>{text}</p>
      <a href={href} {...handlers} style={{ ...textStyle('caption'), fontWeight: 'var(--weight-medium)', textDecoration: 'none',
        color: hover ? 'var(--violet)' : 'var(--bone)', transition: 'color var(--dur-base) var(--ease-out)' }}>{link}&nbsp;<Arrow /></a>
    </div>
  );
}

function Hamburger({ open, onClick }) {
  const { focusVisible, handlers } = useInteraction();
  const line = { display: 'block', width: 14, height: 1, background: 'var(--bone)', transition: 'transform var(--dur-base) var(--ease-out)' };
  return (
    <button type="button" aria-expanded={open} aria-controls="obs-mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={onClick} {...handlers}
      style={{ width: 40, height: 40, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
        borderRadius: 'var(--radius-pill)', border: '1px solid', borderColor: open ? 'var(--hairline-hover)' : 'var(--hairline-strong)',
        background: open ? 'var(--surface-2)' : 'transparent', cursor: 'pointer', transition: 'border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
        ...focusRing(focusVisible) }}>
      <span style={{ ...line, transform: open ? 'translateY(3px) rotate(45deg)' : 'none' }} />
      <span style={{ ...line, transform: open ? 'translateY(-3px) rotate(-45deg)' : 'none' }} />
    </button>
  );
}

/** The menu a phone opens: the page goes dark, five hairline rows in display type, and the one primary action at the
    foot. Rows rise in 45ms apart; the active row is violet-hi with its arrow showing. Escape closes it. */
export function MobileMenu({ open, links = NAV_LINKS, active, contained = false }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div id="obs-mobile-menu" role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden={!open}
      style={{ position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 56, display: 'flex', flexDirection: 'column',
        padding: 'calc(76px + env(safe-area-inset-top)) 20px calc(20px + env(safe-area-inset-bottom))', background: 'var(--obsydian)',
        opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden', pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity var(--dur-nav) var(--ease-out), visibility var(--dur-nav) var(--ease-out)' }}>
      <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 'min(420px, 90vw)', height: 240,
        background: 'radial-gradient(ellipse at center top, var(--violet-haze) 0%, transparent 72%)', pointerEvents: 'none' }} />
      <p style={{ margin: '0 0 20px', ...textStyle('label', 'var(--bone-low)') }}>Navigate</p>
      <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, borderTop: '1px solid var(--hairline)' }}>
        {links.map((l, i) => {
          const on = l.label === active;
          return (
            <a key={l.href} href={l.href} aria-current={on ? 'page' : undefined}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '16px 0', textDecoration: 'none',
                borderBottom: '1px solid var(--hairline)', color: on ? 'var(--violet-hi)' : 'var(--bone)',
                opacity: open || reduced ? 1 : 0, transform: open || reduced ? 'none' : 'translateY(10px)',
                transition: `color var(--dur-base) var(--ease-out), opacity 380ms var(--ease-out) ${60 + i * 45}ms, transform 380ms var(--ease-out) ${60 + i * 45}ms` }}>
              <span style={{ font: 'var(--type-title-3)', fontSize: 20, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{l.label}</span>
              <span aria-hidden="true" style={{ ...textStyle('body-sm'), color: on ? 'var(--violet-hi)' : 'var(--bone-low)', opacity: on ? 1 : 0 }}>→</span>
            </a>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 24, opacity: open || reduced ? 1 : 0, transform: open || reduced ? 'none' : 'translateY(12px)',
        transition: 'opacity 420ms var(--ease-out) 320ms, transform 420ms var(--ease-out) 320ms' }}>
        <Button variant="primary" size="lg" arrow fullWidth href="/contact">Start a project</Button>
      </div>
    </div>
  );
}

/** The site's header. At the top of the page it runs full width under the announcement bar; past 80px of scroll it
    floats as a 920px glass pill; on a phone it is a glass card with a hamburger. state forces "full" or "pill"
    (otherwise it follows the scroll); layout forces "desktop" or "phone" (otherwise it follows the viewport);
    contained draws it inside its parent for a card. The CTA is always "Start a project", always the nav pill. */
export function Nav({ links = NAV_LINKS, active, state, layout, announce = true, contained = false, menuOpen, onMenu }) {
  const vpPhone = useIsPhone();
  const phone = layout ? layout === 'phone' : vpPhone;
  const [y, setY] = useState(0);
  const [openLocal, setOpenLocal] = useState(false);
  const open = typeof menuOpen === 'boolean' ? menuOpen : openLocal;
  const toggle = () => (onMenu ? onMenu(!open) : setOpenLocal(!open));
  useEffect(() => {
    if (state || contained) return undefined;
    const on = () => setY(window.scrollY); on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [state, contained]);
  useEffect(() => {
    if (!open) return undefined;
    const key = (e) => { if (e.key === 'Escape') toggle(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open]);
  const pill = state ? state === 'pill' : y >= 80;
  const barShowing = announce && !phone && !pill && (state ? true : y < 40);
  const inner = phone
    ? { maxWidth: 'none', margin: '0 12px', padding: '10px 14px 10px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--glass-strong)',
        backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', border: '1px solid var(--hairline)', boxShadow: 'var(--shadow-pill)' }
    : pill
      ? { maxWidth: 'var(--nav-pill-max)', margin: '0 auto', padding: '10px 10px 10px 22px', borderRadius: 'var(--radius-pill)', background: 'var(--glass)',
          backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', border: '1px solid var(--hairline)', boxShadow: 'var(--shadow-pill)' }
      : { maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--gutter)', border: '1px solid transparent' };
  return (
    <>
      {announce && !phone ? <AnnounceBar hidden={!barShowing} contained={contained} /> : null}
      <nav aria-label="Main" style={{ position: contained ? 'absolute' : 'fixed', left: 0, right: 0, zIndex: phone ? 60 : 50,
        top: barShowing ? 'var(--announce-h)' : 0, paddingTop: phone ? 'max(12px, env(safe-area-inset-top))' : pill ? 16 : 22,
        transition: 'top var(--dur-nav) var(--ease-out), padding var(--dur-nav) var(--ease-out)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          transition: 'max-width var(--dur-nav) var(--ease-out), padding var(--dur-nav) var(--ease-out), background var(--dur-nav) var(--ease-out), border-radius var(--dur-nav) var(--ease-out)', ...inner }}>
          <a href="/" aria-label="Obsydian Technologies home" style={{ textDecoration: 'none' }}><Logo size={pill || phone ? 'pill' : 'nav'} /></a>
          {phone ? null : (
            <div style={{ display: 'flex', gap: pill ? 22 : 28 }}>
              {links.map((l) => <NavLink key={l.href} link={l} active={l.label === active} pill={pill} />)}
            </div>
          )}
          {phone ? <Hamburger open={open} onClick={toggle} /> : <Button variant="nav" size={pill ? 'sm' : 'md'} href="/contact">Start a project</Button>}
        </div>
      </nav>
      {phone ? <MobileMenu open={open} links={links} active={active} contained={contained} /> : null}
    </>
  );
}
