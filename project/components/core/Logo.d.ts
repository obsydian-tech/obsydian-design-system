export interface LogoProps {
  /** nav 22px mark + 17px name; pill 20 + 15 (scrolled, and on a phone); footer 24 + 17. */
  size?: 'nav' | 'pill' | 'footer';
  /** The shard alone, named for a screen reader. */
  markOnly?: boolean;
  name?: string;
  style?: React.CSSProperties;
}
export function Logo(props: LogoProps): JSX.Element;
