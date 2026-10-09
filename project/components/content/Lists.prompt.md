Lists drawn on hairlines. None of them is a card.

- **Steps:** a numbered process. "01" in violet, a title and a paragraph, each row ruled top and bottom. `compact` is the three-step preview on the home page; the full form is How we work.
- **NextSteps:** the short list beside a form, "What happens next". 13px bone-low numbers and 15px lines. `reveal` shows them one by one while something is drafted.
- **CapabilityRows:** the services on the home page. The whole row links; on hover it steps in 12px and the name and arrow turn violet. Its numbers are bone-low because the row itself carries the accent.
- **StatStrip:** figures with a violet 11px label and a sentence.
- **CapabilityList:** "Capabilities include", then short lines each led by a 6 by 1 violet dash. Two columns on Services, one beside a selected layer.
- **SectionFoot:** the "View all … →" link under a section.

```jsx
<Steps compact steps={[{ title: 'Discovery and strategy', body: '...' }]} />
<NextSteps items={['You tell us what you are building and where it stands today.']} />
<CapabilityRows rows={[{ name: 'Enterprise Software Engineering', desc: '...', href: '/services#enterprise-software' }]} />
```
