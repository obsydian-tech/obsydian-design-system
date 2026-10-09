export const NAV_LINKS: { label: string; href: string }[];
export interface NavProps {
  links?: { label: string; href: string }[];
  /** The label of the current page's link. */
  active?: string;
  /** Force a state; otherwise it follows the scroll (pill past 80px). */
  state?: 'full' | 'pill';
  /** Force a layout; otherwise it follows the viewport (phone below 820px). */
  layout?: 'desktop' | 'phone';
  announce?: boolean;
  /** Draw inside the parent, for a card or a kit screen. */
  contained?: boolean;
  menuOpen?: boolean;
  onMenu?: (open: boolean) => void;
}
export function Nav(props: NavProps): JSX.Element;
export function AnnounceBar(props: { text?: string; link?: string; href?: string; hidden?: boolean; contained?: boolean }): JSX.Element;
export function MobileMenu(props: { open: boolean; links?: { label: string; href: string }[]; active?: string; contained?: boolean }): JSX.Element;
