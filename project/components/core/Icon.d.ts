export interface IconProps {
  /** Lucide name in kebab case: "mic", "mic-off", "x", "eye", "eye-off", "log-out", "check". */
  name: string;
  /** 18 in controls, 16 inline, 14 in menus. */
  size?: number;
  /** 1.5 everywhere; 2.4 only for the check in the toast. */
  stroke?: number;
  color?: string;
  title?: string;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
