export const FOOTER_COLUMNS: { label: string; links: [string, string][] }[];
export const LOCATIONS_LINE: string;
export function Footer(props: { columns?: { label: string; links: [string, string][] }[]; tagline?: string; year?: number; extra?: React.ReactNode; style?: React.CSSProperties }): JSX.Element;
