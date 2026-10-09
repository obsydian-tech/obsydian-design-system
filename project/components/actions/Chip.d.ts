export interface ChipProps {
  /** true or false makes it a toggle (aria-pressed); leave it out for a one-shot starter. */
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function Chip(props: ChipProps): JSX.Element;
/** legend: a fieldset of choices under a question. label: starters with a lead-in. */
export function ChipGroup(props: { legend?: string; label?: string; style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
export function InlineLink(props: { href: string; external?: boolean; style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
