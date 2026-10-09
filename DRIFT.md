# Drift: where the website differs from the system

The system is the reference. Each line names what the site does today (`main`, website PR #13, 9 October 2026), where it does it, and what the system says instead. Paths are in the website repository. Fixing a line is a website change; it changes the system only if we decide the site was right, and then the system changes first.

## Colour

- **Purple glows.** The hero void and the closing glow (`features/home/sections/hero/hero.component.scss`, `closing-cta/closing-cta.component.scss`) and the hero's unused dot use `rgba(168, 85, 247, …)`, a stock purple.
  - **System:** violet, `--violet-wash` and `--violet-haze`.
- **One-off strengths.** About thirty bone and violet alphas exist with no token: bone at .012, .02, .025, .03, .04, .05, .06, .1, .12, .22, .26, .28, .34, .52, .55, .72, .78, .82; violet at .06, .1, .12, .13, .14, .26, .28, .45.
  - **System:** bone 100/62/40/18%, hairlines 8/14/22%, a 2% wash, and violet at 8/18/22/35/60%.
  - **Worst offenders:** the Operate signal wall (.28 and .34 bone text) and the SVG fallbacks.
- **Scene bodies disagree.** Strata uses `#121216`, the systems stack `#141418`, and the planes `#0B0B0E` versus `#0B0B0D`.
  - **System:** `--scene-obsidian` and `--scene-obsidian-dim`.
- **Status colours on the sign-in page.** `features/auth/auth.component.scss` uses a stock red `rgba(239, 68, 68, …)` and green `rgba(34, 197, 94, …)`.
  - **System:** the one red (`--error-*`) for an invalid field; success is a sentence; other errors are a Notice.
- **Spinner whites.** The contact, blueprint and auth spinners use `#fff` and `rgba(255, 255, 255, .3 to .35)`.
  - **System:** one spinner in `currentColor`.
- **Literal hex in templates.** Shards in the nav, footer, auth and dashboard; the PrimeNG preset (`app.config.ts`, including untokened primary 800 to 950 and surface 300 to 950); the thinking orb's colour attributes; the email verification code box (`amplify/scripts/verification-email.ts`).
  - **System:** tokens; the shard through `obs-shard-mark`.
- **Violet in running copy.**
  - Privacy links are `$violet-hi`.
  - Agent transcript lines and empty states are violet-hi text.
  - The dashboard's error notice is violet-hi text.
  - **System:** links are bone over a hairline and violet only on hover; text is bone.
- **Hero rake text** is `#ffffff`, not bone.

## Type and copy

- **Headline weight.** Auth, the dashboard and `/intro` set headlines at 600.
  - **System:** 500; 600 is for the wordmark and small strong titles.
- **Tiny uppercase labels.**
  - **Sign-in:** 10px field labels and 10px errors.
  - **Auth hero:** 9px stat labels.
  - **Agent:** 10px sidebar labels, a 12px uppercase profile line and 10px transcript roles.
  - **Dashboard:** 9 to 11px eyebrows, facts and status labels.
  - **System:** form labels are 15px sentence case; labels are 11px.
- **Label tracking.**
  - Credentials use 0.18em.
  - The footer app label uses 0.14em.
  - Platform card CTAs use 0.1em.
  - The footer column labels are 10px.
  - **System:** labels 11px at 0.12em; action lines 11px at 0.08em.
- **Em dashes.**
  - **Pages:** the Operate copy (`OPERATE_PAGE`, the signal summaries and the practices), the auth hero body, the dashboard ledes and its eyebrows, which put an em dash between the number and the word.
  - **Email:** the blueprint subject line, the cost report subject, the email footer.
  - **Blueprint:** the truncation note.
  - **System:** none, anywhere.
- **Unsupported claims.** The auth hero shows "10× Faster to production", "60% Lower build cost" and "24/7 Agents running".
- **Repetition.** Contact says "within two business days" four times.

## Shape

- **Hero hairline side.** Services, Contact and Privacy rule the hero's bottom; the other pages rule its top.
  - **System:** top.
- **Hero measures.** Headline max-width is 12, 14 or 16ch; lede max-width is 42, 46, 48, 52 or 58ch.
  - **System:** 16ch and 52ch; split heroes 12ch and 42ch.
- **Off-scale radii.**
  - App Store badge 14px.
  - Focus outlines 4px.
  - Auth email highlight 4px.
  - Visualiser 26 and 28px, with a 12px inner panel.
  - Email card 14px.
  - **System:** 5/6/10/16/18/22/pill.
- **The `/intro` primary** is a pill with its own gradient and bone text.
  - **System:** the primary button.
- **Boxed inputs on sign-in.** Flat surface-1 boxes with no well or ring.
  - **System:** `Field`.
- **Email header mark** is a gradient square.
  - **System:** the shard as an image.

## Components

- **Four spinners** (contact `.obs-spinner`, blueprint `.bs-spinner` and `.bc-spinner`, auth `.auth-spinner`) beside the global `.obs-btn-spinner`.
  - **System:** one.
- **Shard copies.** The nav and footer paste the SVG inline; auth and the dashboard draw their own (with an untokened `#2A2A30` face stop). `obs-shard-mark` uses a 26% outline where the logo files use 22%.
  - **System:** `obs-shard-mark` everywhere, at 22%.
- **The orb fallback** (`public/shard.svg`) is a different stone from the mark. That is fine for a fallback, but it must never be used as the logo.
- **Two more shard drawings.**
  - `public/wordmark.svg` is used nowhere and draws its own shard (`M11 1 L23 5 …`) with a 600 wordmark. Delete it.
  - `public/favicon.svg` shifts the shard a unit (`M11 4 L23 7 L26 18 L20 27 …`) inside its tile. Redraw it from the mark's own path.
- **Logo opacities.**
  - The home band uses .42 to .78.
  - Platforms cards use .55 to .9.
  - The tech grid uses .62 to .9 on home and .66 to .92 on its own page.
  - **System:** cells .62 to .9 (native .72 to .95); the band .42 to .78.
- **Platforms cards** are the one filled card on the site (surface-1, hairline, 10px).
  - **System:** a hairline cell grid of `LogoCell`s, or keep the card and add it to the system first.
- **Section footer links** leave the → outside its `.arrow` span, so it does not nudge.
- **Raw durations.**
  - 400ms on the platforms cards and logos.
  - 180ms on the agent controls.
  - **System:** 250ms.

## Behaviour and accessibility

- **The desktop nav never shows the current page.** It styles `.active` but `routerLinkActive` sets `is-active`.
- **The mobile menu** has no focus trap, does not move focus in or return it, and the hamburger has no `aria-controls`.
- **No visible keyboard focus.**
  - Capability rows and signal panels show none.
  - The SVG fallbacks rely on a stroke change.
  - Blueprint schematic nodes cannot be reached by keyboard at all.
- **Field errors** are not tied to their field: no `aria-describedby` and no `aria-invalid`. Contact, auth and the blueprint refine field are affected; the refine field also has no visible label.
- **Sign-in success messages are wiped.** `switchMode()` clears them.
- **The dashboard's "Connecting…" branch** is unreachable, so its start button shows no spinner.
- **Reduced motion is ignored by:**
  - section reveals (`.reveal`);
  - the drafting steps;
  - `bc-in` and `.bc-spinner`;
  - the visualiser's frame and dots;
  - the dashboard pulse;
  - the footer toast.
- **The work band** shows a grab cursor but has no drag.
- **Dead styles.** The hero meta and eyebrow, `.obs-nav-login`, the credentials `.obs-section`, the closing ghost rule, `.is-dimmed` on the systems stack, and a `transform` transition on location cards that never moves.

## Elsewhere

- **The old design system bundle.** `public/Obsydian Design System (standalone).html` in the website repo is the June bundle. It is public at obsydiantechnologies.com and now out of date. Remove it, or link to this system's site instead.
