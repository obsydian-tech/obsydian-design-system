The site's header, in three states.

- **Full**, at the top of the page: full width under the announcement bar ("Selective partnerships at the bleeding edge. Discuss your work →").
- **Pill**, past 80px of scroll: a 920px glass pill (surface-1 at 72%, blur 20px) with a soft shadow.
- **Phone**, below 820px: a glass card with a hamburger. The menu is five hairline rows in display type with "Start a project →" at the foot.

Links are bone-dim, turning bone on hover and on the current page. The only action is the "Start a project" pill. Escape closes the menu.

```jsx
<Nav active="Services" />
<Nav state="pill" contained />
<Nav layout="phone" menuOpen contained />
```
