Calls to action. There are four, and nothing else is a button:

- **primary:** the violet gradient with a gloss, a 3px dark frame and a glow, radius 18 (22 at `lg`), label white 600. There is one per viewport. It is always the thing we want next: "Start a project", "Send enquiry", "Draft the blueprint".
- **ghost:** a hairline pill, for the quiet second choice: "Replay", "Back to home", "Redraft".
- **link:** text over a hairline whose violet underline grows on hover: "Our services", "View all platforms →".
- **nav:** the "Start a project" pill in the nav. It turns violet on hover.

**Busy (every platform, every button that starts something):**
- **A submit** passes `busyLabel`. The spinner leads a present-tense label: "Sending", "Drafting", "Connecting".
- **A navigation** keeps its own label, because the word tells you which button you pressed. The spinner takes the arrow's place.
- **Either way** it is `aria-busy` and ignores a second press.

```jsx
<Button arrow href="/contact">Start a project</Button>
<Button type="submit" arrow busy={sending} busyLabel="Sending">Send enquiry</Button>
<Button variant="ghost">Back to home</Button>
<Button variant="link" arrow href="/platforms">View all platforms</Button>
<Button variant="primary" size="lg" arrow>Start a conversation</Button>
```
