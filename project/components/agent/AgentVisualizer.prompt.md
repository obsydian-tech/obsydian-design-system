The voice agent's face: a rounded frame with a point of violet light running round it, and a 15 by 15 grid of dots.

**States:**
- **Idle and connecting:** one dot walks a square.
- **Listening:** it circles.
- **Thinking:** it scans the middle row.
- **Speaking:** the dots near the centre light violet-hi, as far out as the voice is loud.

Under reduced motion it holds still.

`AgentPromo` is the "Talk to Obsydian" aside on the Services and Contact heroes: the visualiser on a soft glow, one line, and the primary action.

```jsx
<AgentVisualizer state="listening" />
<AgentPromo />
```
