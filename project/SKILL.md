---
name: obsydian-design
description: Use this skill to design or build anything for Obsydian Technologies (the company website obsydiantechnologies.com, its emails, decks and any page that speaks for Obsydian), for production code or throwaway mocks. Holds the rules, tokens, type, motion, brand marks, components and the site's screens.
user-invocable: true
---

Read `readme.md` in this folder first, then the tokens (`tokens/`), the component you need (`components/`, each with a `.prompt.md`) and the screen nearest to what you are making (`ui_kits/website/`).

If you are making a visual artifact (a mock, a slide, a one-off page), copy what you need out of `assets/` and `tokens/` and build static HTML. If you are working on the website itself, compose from the components here and the tokens as SCSS (`dist/obsydian-tokens.scss` after `npm run build`); never invent a colour, a size, a radius, a curve or a shape the system does not have.

If you are invoked with no other guidance, ask what is being made and for whom, then act as the designer who keeps the house style.

Standing rules, in short:
- Black is the canvas, bone is the text, violet is the one accent. Never a new colour.
- Sections divide with hairlines. No boxed cards, no drop shadows for depth.
- One violet primary action per viewport. Never violet body text or a violet section.
- General Sans, one family, for everything. No monospace on the site.
- The shard mark comes from `assets/obsydian-mark.svg` only. Never redraw it.
- Every button or link that starts something shows a spinner on itself until it lands.
- Sentence case. No em dashes. No exclamation marks, no emoji, no banned words (`guidelines/banned-words.json`).
- Arrows in calls to action are the typed character →. Functional icons are Lucide, never decoration.
- Motion is slow and quiet, and everything has a reduced-motion state.
