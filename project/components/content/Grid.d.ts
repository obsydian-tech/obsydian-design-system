export function CellGrid(props: { columns?: number; narrow?: number; phone?: number; role?: string; ariaLabel?: string; style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
export interface TileProps {
  /** A violet category: "01 Foundation", "Africa". */
  label?: string;
  title?: string;
  summary?: string;
  /** The foot line: "Explore layer". Shows "Selected" once chosen. */
  action?: string;
  selected?: boolean;
  /** Lit from outside, as when the matching object in a scene is under the pointer. */
  hovered?: boolean;
  /** Makes it a pressable tile (aria-pressed). Leave it out for a static cell. */
  onSelect?: () => void;
  minHeight?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function Tile(props: TileProps): JSX.Element;
export function LogoCell(props: { name: string; src?: string; href: string; native?: boolean; minHeight?: number; style?: React.CSSProperties }): JSX.Element;
export function LogoBand(props: { items: { name: string; src?: string; href?: string; native?: boolean }[]; label?: string }): JSX.Element;
