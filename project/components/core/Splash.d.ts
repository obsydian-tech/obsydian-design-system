export interface SplashProps {
  /** Draw inside the parent instead of over the page. */
  contained?: boolean;
  /** Hold the last frame (for a preview); never dismiss. */
  hold?: boolean;
  /** Change to replay. */
  playKey?: number;
  onDone?: () => void;
}
export function Splash(props: SplashProps): JSX.Element | null;
