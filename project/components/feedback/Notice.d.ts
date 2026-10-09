export function Notice(props: { alert?: boolean; counsel?: boolean; style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
export function Callout(props: { label: string; title?: string; style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
export interface ToastProps {
  title: string;
  open?: boolean;
  contained?: boolean;
  /** ms before it leaves; 3800 by default. */
  duration?: number;
  onClose?: () => void;
  children?: React.ReactNode;
}
export function Toast(props: ToastProps): JSX.Element | null;
