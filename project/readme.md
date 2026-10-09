# Obsydian Design System

**Obsydian Technologies** designs, builds and operates software platforms for organisations building for growth: enterprise software, cloud infrastructure, CRM and customer platforms, and AI and automation. Its public face is **obsydiantechnologies.com**: a marketing site, a voice agent (`/agent`), a drafting engine (`/blueprint`) and a sign-in for the team. This system is how that site looks and behaves, written down so every new page, email and agent brief matches it.

The look targets the same category as apple.com, linear.app and stripe.com: restrained, confident, obviously expensive. Black is the canvas. Content is the only light.

## Sources
- **The website, `main`.** This version was rebuilt from the site as it shipped on 9 October 2026 (website PR #13), page by page. Where the site was consistent, the system copies it exactly. Where it had several versions of one thing, the system picked one and lists the rest in `../DRIFT.md`.
- **Decisions taken while building the site** (website PRs #3 to #11, September and October 2026): the orb, the editorial forms, recessed fields, the three.js scenes, the official shard in the splash, and progress on every click. See Decisions on the landing page.
- **The brand voice rules** in the website's own instructions, and `guidelines/banned-words.json`.

## Content fundamentals
- **Plain and concrete.** Short sentences. Concrete nouns. First person plural: "We design, build and operate…". State what we do; don't oversell. British spelling (organisation, modernise).
- **Sentence case everywhere.** Headlines, buttons, labels and chips. Uppercase comes only from CSS, on eyebrows, labels and action lines. The four practice areas keep their title-case names.
- **Two-line headlines.** The first line states the subject; the second, set back, says the point: "Engineering depth. / Practical delivery." In a section h2 the second line is bone-dim. In a page's h1 and in the closing call it is violet.
- **Numbering.** Two digits and a space: "01 What we do". Never a dash between the number and the word.
- **Calls to action.** A verb and what follows, ending in the typed →: "Start a project →", "Send enquiry →". Busy labels are present tense: "Sending", "Drafting", "Connecting". A navigation keeps its own label while it loads.
- **Placeholders ask the question the field answers**: "What are you building or changing, where does it stand today, and is there a date that matters?" Never "Enter your message".
- **Errors say what to do**: "Enter a valid email." Never a code, never blame.
- **Never.**
  - Em dashes, or spaced en dashes doing their job.
  - Exclamation marks and emoji.
  - The banned words: cutting-edge, innovative, transformative, synergy, empower, unlock, leverage, solutions (as a noun on its own), next-generation, world-class.
  - Unsupported figures.

## Visual foundations

### Colour
- **The palette.** Near-black does the lifting, in four surfaces (`--obsydian` #0A0A0B to `--surface-3` #26262B). Bone #F5F4EF is the text, at four strengths (100%, 62%, 40%, 18%). Violet #9318FF is the one accent.
- **Violet goes on:**
  - the primary button;
  - the eyebrow rule and step numbers;
  - small labels on tiles and figures;
  - a selected edge, hover and focus;
  - the second line of a page's h1 and of the closing call;
  - the glows behind the hero, the globe and the closing call.
- **Violet never goes on:**
  - body copy, or links at rest;
  - a section background;
  - two filled violet buttons side by side;
  - a status that has no word.
- **The one red.** It is outside the three colours and used for an invalid field only: its edge, its focus ring and its sentence. There is no green and no amber.
  - **Success** is a sentence: the form gives way to "Thank you, we have your note."
  - **An error about the whole form** is a Notice: bone-dim words on a 2px violet bar.
- **The rule for code.** Components use semantic tokens only. No hex or rgba in a component; `npm test` fails if one appears.

### Type
- **The family.** General Sans (Fontshare), standing in for Söhne until the licence exists. One family. No monospace on the site: the mono typeface was retired in July 2026.
- **Headlines** are 500 with negative tracking (-0.035em at display sizes, -0.02em for titles) and balance across lines. The wordmark is 600 at -0.02em.
- **Reading text** is 400 at -0.01em: 17px body (16px on a phone), ledes 17 to 20px.
- **Labels** are 11 to 12px uppercase at 0.12em, and action lines 11px at 0.08em.
- **Figures** that line up are tabular.

### Shape and depth
- **Radius.** 6 (tags, notices), 10 (fields, menus), 16 (the brief well, the schematic, toasts), the pill (ghost buttons, chips, the nav), and the primary button alone at 18 (22 large). Keys in a hint are 5.
- **Hairlines carry structure.** 1px bone at 8%, 14% for edges that must read, 22% under the pointer.
  - Sections start with one.
  - Lists rule each row.
  - Grids are drawn from them alone: the grid rules its top and left, each cell its right and bottom.
- **No boxes around content.** No card around a form.
- **Shadows** only for what floats (the nav pill, menus, toasts), for the primary button's gloss, and for a field's inner shadow.

### Motion
- **Curves and durations.** `--ease-out` carries nearly everything. 180ms for chips and fields, 250ms for hovers, 350ms for the nav and selection, 600ms for a section rising 20px into view (once).
- **Moving between pages.** Routes crossfade in 450ms with the view transition API, and the nav, the hero and the primary call to action morph between pages. The site never runs a transition on the first load or while the splash is up.
- **Scroll.** Lists stagger in by scroll position where the browser supports scroll-driven animation. Film grain drifts over the page at 3.8%.
- **Reduced motion.**
  - Nothing rises, drifts or loops.
  - The orb stops turning and the stagger stops.
  - The splash shows the finished mark.
  - Colour and opacity still fade.
  - A busy spinner slows to 1.6s rather than stopping.

### Interaction
- **Every action shows it is working.** From the press until it lands, the control shows a spinner, is `aria-busy` and ignores a second press.
  - A submit changes to a present-tense label.
  - A navigation keeps its label, with the spinner where the arrow was.
  - Navigations slower than 150ms also draw a 2px violet route bar across the top.
- **Focus.** Keyboard focus is a 2px violet outline, offset 2px. It never shows for a mouse click.
- **Hover.** Hover is quiet:
  - links go bone to violet;
  - rows step in 12px;
  - cells take a 2% wash and a 3px violet bar;
  - the arrow nudges 3px.

### Layout
- **The column.** 1440px with a 20 to 40px gutter.
- **Breakpoints.** Below 980px, two-column layouts stack. Below 820px, everything is one column, the nav becomes a glass card with a hamburger, and sections drop to 72px.
- **Spacing.** Sections breathe 96 to 200px; cramping kills the premium feel.
- **Page anatomy:**
  1. The nav.
  2. A hero:
     - the home hero;
     - a standard page hero, with the agent promo as its aside on Services and Contact;
     - or a split page hero beside a three.js scene.
  3. Sections, each opening with an eyebrow and a two-line heading.
  4. A call-to-action band on every inner page but Privacy, or the closing call on home.
  5. The footer.

### Imagery and scenes
- **No stock photos and no illustration.**
- **The three.js scenes** are the imagery: the orb, the stack and the systems.
  - **Material:** polished obsidian.
  - **Light:** a bone lamp that follows the pointer (the pointer is the lamp), with violet only from behind.
  - **Loading:** lazily, after first paint; rendering pauses off screen.
  - **Fallback:** without WebGL, each is a flat SVG.
- **The agent** is a dot grid in a rounded frame.
- **Logos of partners and platforms** are drawn white and dimmed, and brighten under the pointer.
- **The globe** on Locations is `cobe`, in bone with violet markers.

## Iconography
- **Lucide only**, imported per component (`@lucide/angular` on the site), at stroke 1.5. For function only: mic, mic-off, x, eye, eye-off, log-out, check. On the signed-in pages a few more mark what a bench does.
- **Arrows in calls to action** are the typed →, never an icon. ↗ marks a row that leaves for another site on the /intro link page. ⌘ and ↵ sit in keys.
- **Never icons.** The shard, the agent's dot grid, the blueprint schematic and the stack and systems diagrams are drawn for their job.
- **The mark.** `assets/obsydian-mark.svg` (face `M11 3 L23 6 L26 18 L20 28 L9 25 L5 14 Z`, edge `M23 6 L26 18 L20 28`). Never redrawn.

## Index
- **Tokens:** `styles.css` imports `tokens/`: fonts, colors, typography, shape, motion, spacing, base. Typography also ships `.t-*` classes for static pages.
- **Guidelines:** specimen cards in `guidelines/` for colour, type, space, shape, motion, brand, voice, icons, scenes and email. `banned-words.json` is read by the build.
- **Components** in `components/`, each with a `.d.ts` and a `.prompt.md`, and one card per folder:
  - `core/`: Interaction (useInteraction, focusRing, useIsPhone, useIsNarrow, usePrefersReducedMotion), Icon, Text (textStyle, Arrow), ShardMark, Logo, Splash
  - `actions/`: Button (primary, ghost, link, nav; busy), Chip (choice and starter), ChipGroup, InlineLink
  - `inputs/`: Field (default and brief), KeyHint
  - `feedback/`: Spinner, Notice, Callout, Toast
  - `content/`: Tag, StatusPill, Steps, NextSteps, CapabilityRows, CapabilityList, StatStrip, SectionFoot, CellGrid, Tile, LogoCell, LogoBand, Sparkline, SignalTile
  - `sections/`: Container, Section, Eyebrow, TwoTone, SectionHead, HomeHero, PageHero, CtaBand, MetaItem, ClosingCall
  - `navigation/`: Nav (with AnnounceBar and MobileMenu), Footer, RouteProgress
  - `agent/`: AgentVisualizer, AgentPromo
- **Screens:** `ui_kits/website/` holds the site's pages built only from the components: Home, Services, How we work, Stack, Contact, Blueprint, with their states. Open any of them with `?screen=&state=`.
- **Assets:** `assets/` holds the mark, the logo for dark and light grounds, the favicon, and `shard.svg` (the orb's fallback stone).
- **Agents:** `SKILL.md` is the entry point.

## Not in the system (yet)
- **The thinking orb** on Blueprint is a vendored library (thinking-orbs, MIT), coloured violet and violet-hi. It is documented here but not reproduced.
- **The blueprint schematic and canvas** follow the scene and hairline rules but are not components.
- **The signed-in pages** follow these rules where they agree, and are listed in `../DRIFT.md` where they do not.
