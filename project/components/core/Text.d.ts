export type TypeRole = 'hero' | 'hero-phone' | 'closing' | 'page' | 'page-split' | 'statement' | 'section' | 'section-phone' | 'stat'
  | 'title-1' | 'title-2' | 'title-3' | 'prompt' | 'brief' | 'wordmark' | 'lede' | 'body' | 'body-sm' | 'small' | 'meta' | 'caption'
  | 'eyebrow' | 'label' | 'action' | 'button' | 'button-lg' | 'nav';
/** Inline style for a type role: the font shorthand, its tracking, uppercase for labels, and an optional colour. */
export function textStyle(role: TypeRole, color?: string): React.CSSProperties;
export interface TextProps {
  role?: TypeRole;
  tone?: 'primary' | 'dim' | 'low' | 'faint' | 'violet' | 'violet-hi';
  as?: keyof JSX.IntrinsicElements;
  balance?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function Text(props: TextProps): JSX.Element;
/** The typed → at the end of a call to action. nudge moves it 3px right. */
export function Arrow(props: { nudge?: boolean; style?: React.CSSProperties }): JSX.Element;
