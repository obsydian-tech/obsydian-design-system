The first-visit splash. The shard assembles, "Obsydian Technologies" appears once, a hairline loader fills; at 2400ms it blurs 14px and scales to 1.08 as it fades, and it is gone at 3120ms.

- **When:** once per session, on the first full load only.
- **Never:** on a navigation inside the site, or on `/login`, `/signup`, `/dashboard` or `/intro`.
- **Reduced motion:** the finished mark, for 900ms.

```jsx
<Splash contained hold />
```
