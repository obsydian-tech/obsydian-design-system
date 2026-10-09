A grid drawn from hairlines alone.

- **CellGrid:** the grid rules its top and left and each cell its right and bottom, so every line is 1px. Columns go 3, 2, 1 at 980px and 820px.
- **Tile:** a cell you select (stack layers, systems, offices).
  - Under the pointer it takes a faint wash and a 3px violet bar down its left.
  - Selected, it gets a violet ring inside its edge, and its action line reads "Selected".
  - Without `onSelect` it is a static cell: a practice, or the overview at the end of the list.
- **LogoCell:** a partner logo drawn white at 62%, rising to 90% under the pointer. `native` keeps a mark whose colour is its identity.

- **LogoBand:** the platforms we built, marching slowly left between two hairlines and fading at both edges. Logos are white at 42%, rising to 78%. It pauses under the pointer, and under reduced motion it stops and scrolls by hand.

```jsx
<CellGrid>
  <Tile label="01 Foundation" title="Cloud and infrastructure" summary="..." action="Explore layer" selected={id==='foundation'} onSelect={() => pick('foundation')} />
</CellGrid>
```
