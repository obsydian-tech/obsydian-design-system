Pills you press, in sentence case, 14px bone-dim on a hairline.

- **Choice** (`selected` true or false): toggles, and goes violet-wash with a violet edge when chosen. Put choices in a `ChipGroup legend="What can we help with?"`.
- **Starter** (no `selected`): fills something in once, with no chosen state. Use `ChipGroup label="Or start from an example"`.
- **InlineLink:** a link inside a sentence or a meta row. It is bone with a hairline beneath and violet only on hover; violet at rest would compete with the one action.

```jsx
<ChipGroup legend="What can we help with?">
  <Chip selected={on} onClick={toggle}>A new platform</Chip>
</ChipGroup>
<ChipGroup label="Or start from an example"><Chip onClick={fill}>Fleet operations</Chip></ChipGroup>
```
