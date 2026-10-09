export const SHARD_FACE: string;
export const SHARD_EDGE: string;
export interface ShardMarkProps {
  /** px, or a CSS width such as "100%" to fill its box at 26:28. */
  size?: number | string;
  /** Assemble like the splash: outline, face, ignite, bloom, sheen. Reduced motion shows it finished. */
  animated?: boolean;
  /** Thinner strokes for splash sizes (0.32 and 0.9 instead of 0.75 and 1.5). */
  large?: boolean;
  /** Names the mark for a screen reader; without it the mark is decorative. */
  title?: string;
  style?: React.CSSProperties;
}
export function ShardMark(props: ShardMarkProps): JSX.Element;
