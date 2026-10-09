export function Sparkline(props: { values: number[]; lit?: boolean; height?: number; draw?: boolean; delay?: number }): JSX.Element;
export interface SignalTileProps { label: string; value: string; delta: string; values: number[]; selected?: boolean; onSelect?: () => void }
export function SignalTile(props: SignalTileProps): JSX.Element;
