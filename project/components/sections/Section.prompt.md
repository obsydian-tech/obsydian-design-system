The frame every page is built from.

- **Container:** 1440px at most, with the gutter either side.
- **Section:** breathes 96 to 200px (72px on a phone) and starts with a hairline.
- **Eyebrow:** a 40px violet rule, then 12px uppercase bone-low.
  - Home sections are numbered with two digits and a space: "01 What we do". Never a dash between the number and the word.
  - Page heroes name the page without a number: "Services".
- **SectionHead:** the eyebrow and a two-line h2. The second line is bone-dim.
- **HomeHero:**
  - The top of the home page: a full-height slab with the headline at hero size and its second line in bone-dim.
  - Then one sentence, the primary and a link.
  - The orb sits behind at 76% across. Without WebGL it is `assets/shard.svg`.
- **PageHero:**
  - Every page starts with a hairline, the eyebrow, a two-line h1 with its second line in violet, and a lede.
  - `standard` takes an aside (the agent promo).
  - `split` sits beside a three.js stage that bleeds off the right edge.
  - Heroes carry no buttons.
- **CtaBand:** the foot of every inner page but Privacy. One question, then "Start a project →".
- **ClosingCall:** the end of the home page: centred, the closing size, a violet second line, the large primary, and the addresses on a hairline.

```jsx
<PageHero eyebrow="Services" lines={['Engineering depth.', 'Practical delivery.']} lede="Four practice areas. One team." aside={<AgentPromo />} />
<Section><SectionHead number="03" eyebrow="Services" lines={['What we deliver', 'across the partnership.']} />...</Section>
<CtaBand prompt="Ready to scope an engagement?" />
```
