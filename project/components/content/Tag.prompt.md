Labels nobody presses.

- **Tag (pill):** a capability under a blueprint. 14px bone-dim in a hairline pill.
- **Tag (square):** a connection on the systems page. 11px uppercase on a 6px hairline box.
- **StatusPill:** the state of something live: Ready, Connecting, Live, Reconnecting. `live` turns it violet-hi with a pulsing 5px dot. The word carries the meaning, never the colour alone.

```jsx
<Tag>Offline sync</Tag>
<Tag shape="square">Identity</Tag>
<StatusPill live>Live</StatusPill>
```
