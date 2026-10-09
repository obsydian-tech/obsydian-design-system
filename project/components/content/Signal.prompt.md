How the site draws a figure over time.

- **Sparkline:** one line and nothing else (no axes, no grid), 1.5px, in quiet bone. It turns violet-hi with a faint violet fill when its panel is in focus, and draws itself in once.
- **SignalTile:** one panel of the operate wall: a label and its change, the figure (violet-hi when selected), the line, and "View detail" or "Selected".

The figures on the operate wall are illustrative, and the page says so.

```jsx
<SignalTile label="Platform uptime" value="99.97%" delta="+0.02% 30d" values={[.6,.7,.65,.8,.9]} />
```
