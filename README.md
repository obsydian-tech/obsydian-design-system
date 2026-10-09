# Obsydian Design System

Tokens, type, motion, the mark, components and screens for **Obsydian Technologies**, as obsydiantechnologies.com ships them.

**Live: [obsydian-tech.github.io/obsydian-design-system](https://obsydian-tech.github.io/obsydian-design-system/)**. It reads on a phone as well as on a desktop.

| What | Where |
|---|---|
| **The design system** | [Landing page](https://obsydian-tech.github.io/obsydian-design-system/): rules, brand, colour, type, shape, motion, voice, live components, screens, decisions |
| **Screens** | [The website kit](https://obsydian-tech.github.io/obsydian-design-system/ui_kits/website/): Home, Services, How we work, Stack, Contact and Blueprint, built only from the system |
| Tokens, the source of truth for code | [`project/tokens/`](project/tokens), imported together by [`project/styles.css`](project/styles.css); `npm run build` also writes them as SCSS (`dist/obsydian-tokens.scss`) |
| Components | [`project/components/`](project/components): React primitives, each with a `.d.ts` and a usage note |
| Content and visual rules | [`project/readme.md`](project/readme.md) |
| Where the site differs today | [`DRIFT.md`](DRIFT.md) |
| Skill for coding and design agents | [`project/SKILL.md`](project/SKILL.md) |

---

## For coding agents

**Read `project/tokens/` and `project/readme.md` before introducing any colour, type, spacing, radius, shadow or motion on an Obsydian surface.** Components use the tokens by name, never a hex or an rgba. `npm test` fails if one appears.

### The rules that govern everything

1. **Black is the canvas.** Near-black surfaces do the work, bone `#F5F4EF` is the text and violet `#9318FF` is the one accent. Never a new colour; the only exception is a muted red on a field that needs fixing.
2. **Hairlines, not boxes.** Sections, lists and grids are drawn with 1px bone lines. Nothing wraps content in a card. Only what floats (the nav pill, menus, toasts) casts a shadow.
3. **One violet action per viewport.** The glossy primary is the next thing we want someone to do. Everything else is a ghost pill or an underlined link.
4. **Every button shows it is working.** From the press until it lands, the control carries a spinner, is `aria-busy` and ignores a second press.
   - **A submit** says what it is doing ("Sending").
   - **A navigation** keeps its own label.
5. **Fields look like fields.** Recessed wells, with sentence-case labels above and placeholders that ask the question. No card around a form.
6. **One typeface.**
   - **The family:** General Sans for everything. No monospace on the site.
   - **Headlines:** 500, tight and balanced.
   - **Uppercase:** only for eyebrows, labels and action lines.
7. **The mark is the mark.** Only the official shard (`project/assets/obsydian-mark.svg`), drawn by one component. Never redrawn.
8. **The pointer is the lamp.** Light on the hero and in every scene follows the pointer. Violet only rims from behind.
9. **Motion is slow, quiet and optional.** Every loop and rise has a reduced-motion state.
10. **Say it plainly.**
    - Short sentences, concrete nouns, sentence case.
    - No em dashes, no exclamation marks, no emoji.
    - None of the words in `project/guidelines/banned-words.json`.

### Type
- **General Sans** (Fontshare), standing in for Söhne. Headlines 500 at -0.035em (display) to -0.02em (titles); the wordmark 600 at -0.02em; reading text 400 at -0.01em, 17px body.
- **Eyebrows:** "01 What we do", 12px uppercase at 0.12em in bone at 40%, after a 40px violet rule. Never a dash between the number and the word.

### Icons
**Lucide**, for function only (mic, close, password, sign out), imported per component at stroke 1.5. The arrow at the end of a call to action is the typed **→**, not an icon. The shard, the agent's dot grid and the diagrams are drawn for their job.

---

## Adopting it in the website (Angular)

The website keeps these tokens as SCSS variables with the same names in `src/styles/_variables.scss`.

- **Tokens.** After `npm run build`, copy the values you need from `dist/obsydian-tokens.scss`. New tokens (the field, glass, violet alphas, the one red) replace the raw values listed in [`DRIFT.md`](DRIFT.md).
- **Components.** Each React component here has an Angular twin on the site, or should. A new pattern is added here first, then ported. Never style a one-off in a feature.
- **The check.** The site has no design check yet. A `verify:design` like One Link's, failing on raw colours, off-scale radii and font families outside the tokens, is the next step.

---

## Building and publishing

```bash
npm ci
npm run preview        # checks the rules, builds dist/ and serves it at http://localhost:4400
npm test               # the rules on their own
```

`project/` is the source. `scripts/build.mjs`:

- **Checks the rules first** (`scripts/lint.mjs`):
  - every component has its types, its note and a card;
  - no literal colour, font or radius in a component or a screen;
  - no em dashes;
  - no banned words.
- **Compiles the components** once into `_ds_bundle.js`, and each kit's screens beside its page, so nothing compiles in the browser.
- **Renders the landing page** from `site/`, with every token table read from `project/tokens`. The page cannot disagree with the CSS.
- **Writes `obsydian-tokens.scss`** for the website.

Pushing to `main` builds and deploys GitHub Pages (`.github/workflows/pages.yml`). Pull requests run the same build and tests (`.github/workflows/ci.yml`).

---

## Source layout

```
project/                 ← the design system itself
├── styles.css           ← imports every token file; start here for code
├── tokens/              ← colors, typography, shape, motion, spacing, fonts, base
├── guidelines/          ← foundation specimen cards, banned-words.json
├── components/          ← React primitives (.jsx, .d.ts, .prompt.md) and one card per folder
├── ui_kits/website/     ← the site's pages, built only from the components
├── assets/              ← the mark, the logos, the favicon, the orb's fallback stone
├── readme.md            ← content rules, visual foundations, iconography, index
└── SKILL.md             ← agent skill entry point
site/                    ← landing page template and its live demos
scripts/                 ← build, lint, token reader, landing renderer, local server, tests
DRIFT.md                 ← where the website differs from the system today
```

## Attribution

- **Type:** [General Sans](https://www.fontshare.com/fonts/general-sans) by the Indian Type Foundry, free for commercial use under the ITF Free Font Licence.
- **Icons:** [Lucide](https://lucide.dev), ISC.
- **Thinking orb** (on the site's Blueprint page, documented here): [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) by Jakub Antalik, MIT.
