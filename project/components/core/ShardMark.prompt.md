The Obsydian shard, drawn from the official geometry in `assets/obsydian-mark.svg`: face `M11 3 L23 6 L26 18 L20 28 L9 25 L5 14 Z`, edge `M23 6 L26 18 L20 28`. At rest it is exactly the logo file.

Never redraw it, never invent a new shard (the splash once drew a cube-like hexagon, and that was wrong). Every use goes through this component, or through `obs-shard-mark` on the site.

```jsx
<ShardMark size={22} />
<ShardMark size="100%" animated large />
```
