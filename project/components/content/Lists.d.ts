export function Steps(props: { steps: { title: string; body: string }[]; compact?: boolean; start?: number; style?: React.CSSProperties }): JSX.Element;
export function NextSteps(props: { items: string[]; reveal?: boolean; style?: React.CSSProperties }): JSX.Element;
export function CapabilityRows(props: { rows: { name: string; desc: string; href: string }[]; style?: React.CSSProperties }): JSX.Element;
export function StatStrip(props: { stats: { figure: string; label: string; body: string }[]; style?: React.CSSProperties }): JSX.Element;
export function SectionFoot(props: { href: string; children?: React.ReactNode }): JSX.Element;
export function CapabilityList(props: { items: string[]; label?: string; columns?: number; style?: React.CSSProperties }): JSX.Element;
