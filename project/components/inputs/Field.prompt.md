The text field: a recessed well, one step lighter than the page, with a full hairline and a faint inner shadow, so it reads as sunk in rather than raised like a button. Fields sit on the page; no card ever wraps a form.

- **Label:** above the well, sentence case, 15px bone-dim. "Optional" sits beside it in 13px bone-low. There are no asterisks.
- **Placeholder:** guides the answer: "What are you building or changing, where does it stand today, and is there a date that matters?"
- **States:**
  - Hover warms the edge.
  - Focus lights it violet, with a 4px violet ring and a violet-hi caret.
  - Invalid takes the one red edge, and its sentence in the error colour is tied on with `aria-describedby` and `aria-invalid`.
- **Brief** (`size="brief"`):
  - The question becomes the label at display size.
  - The well rounds to 16px and the text grows to 18 to 21px.
  - A `KeyHint` sits inside its lower right. It is hidden on touchscreens.

```jsx
<Field label="Your name" placeholder="First and last name" autoComplete="name" />
<Field label="Company" optional placeholder="Where you work" />
<Field label="Work email" placeholder="you@company.com" error="Enter a valid email." />
<Field size="brief" label="What do you want built?" placeholder="Type a sentence or two: what it does, who uses it, and what matters most."
  keyHint={<KeyHint keys={['⌘', '↵']}>to draft</KeyHint>} />
```
