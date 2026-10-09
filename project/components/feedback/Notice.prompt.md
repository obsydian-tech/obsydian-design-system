How the site speaks up.

- **Notice:** a 2px violet bar and bone-dim words. Use it for an error that is not about one field ("The drafting engine could not complete that request. Try rephrasing, or try again shortly."), and for counsel on a blueprint. It is calm, never red, and never a box.
- **Callout:** something carried in from elsewhere, at the top of a form: "Blueprint attached".
- **Toast:** a short confirmation, low and centred, for 3.8s, with a check on a violet tile. No action in it.

Success on a form is typographic: the form is replaced by a display-size sentence ("Thank you, we have your note."), a line and a ghost button. There is no green.

```jsx
<Notice alert>The blueprint service is not available in this environment.</Notice>
<Callout label="Blueprint attached" title="Harvest Ledger">Your brief and plan are pre-filled below. Edit anything before sending.</Callout>
<Toast title="Coming soon">The Obsydian iOS app is on its way.</Toast>
```
