export function Container(props: { style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
export function Section(props: { id?: string; hairline?: boolean; pad?: string; style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
export function Eyebrow(props: { number?: string; hero?: boolean; draw?: boolean; style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
/** lines: [first, second]. accent "violet" for a page h1 and the closing call; "dim" (default) for a section h2. */
export function TwoTone(props: { lines: React.ReactNode[]; accent?: 'dim' | 'violet' }): JSX.Element;
export function SectionHead(props: { number?: string; eyebrow: string; lines: React.ReactNode[]; as?: 'h1' | 'h2'; style?: React.CSSProperties }): JSX.Element;
export interface PageHeroProps {
  variant?: 'standard' | 'split';
  eyebrow: string;
  lines: React.ReactNode[];
  lede?: string;
  /** split only: a quieter second paragraph. */
  intro?: string;
  /** standard only: the right column (the agent promo). */
  aside?: React.ReactNode;
  /** split only: the scene. */
  stage?: React.ReactNode;
  children?: React.ReactNode;
}
export function PageHero(props: PageHeroProps): JSX.Element;
export function CtaBand(props: { prompt: string; action?: string; href?: string }): JSX.Element;
export function MetaItem(props: { label: string; href?: string; align?: 'left' | 'center'; children?: React.ReactNode }): JSX.Element;
export function ClosingCall(props: { lines?: React.ReactNode[]; sub?: string; action?: string; href?: string; link?: string; linkHref?: string;
  meta?: { label: string; value: string; href?: string }[] }): JSX.Element;
export function HomeHero(props: { lines?: React.ReactNode[]; sub?: string; action?: string; href?: string; link?: string; linkHref?: string;
  /** The three.js orb. Without it the fallback image shows. */ stage?: React.ReactNode; fallbackSrc?: string; minHeight?: string }): JSX.Element;
