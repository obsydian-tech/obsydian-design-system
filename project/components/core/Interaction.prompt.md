Hooks every component shares, because components style themselves inline.

- `useInteraction()` gives hover (mouse and pen only), press (pointer, Space, Enter) and keyboard-only focus. Spread `handlers` on the element.
- `focusRing(focusVisible)` is the one focus ring: 2px violet, offset 2px, and never for a mouse click.
- `useIsPhone()` (below 820px) and `useIsNarrow()` (below 980px) are the site's two breakpoints.
- `usePrefersReducedMotion()`: drop rises, nudges, loops and drift; keep colour and opacity fades.

```jsx
const { hover, focusVisible, handlers } = useInteraction();
<a {...handlers} style={{ color: hover ? 'var(--bone)' : 'var(--bone-dim)', ...focusRing(focusVisible) }}>Services</a>
```
