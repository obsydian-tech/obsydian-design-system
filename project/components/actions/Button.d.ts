export interface ButtonProps {
  /** primary: the glossy violet button, one per viewport. ghost: the quiet hairline pill. link: an underlined line.
      nav: the pill in the nav. */
  variant?: 'primary' | 'ghost' | 'link' | 'nav';
  /** lg is the closing call and the mobile menu (radius 22). nav takes sm when scrolled. */
  size?: 'md' | 'lg' | 'sm';
  /** End with the typed →, which nudges 3px on hover. */
  arrow?: boolean;
  /** Mandatory while what it started is under way. */
  busy?: boolean;
  /** For a submit: the present-tense label while busy ("Sending"). Leave it out for a navigation. */
  busyLabel?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  onClick?: (e: any) => void;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
