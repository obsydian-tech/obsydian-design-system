export interface FieldProps {
  /** Sentence case: "Your name", "Work email", "About the project". */
  label?: string;
  optional?: boolean;
  multiline?: boolean;
  /** brief: the large well whose label is a question at display size ("What do you want built?"). */
  size?: 'default' | 'brief';
  /** Guides the answer. Never "Enter your name". */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  /** The sentence under an invalid field: "Enter a valid email." */
  error?: string;
  hint?: string;
  /** A KeyHint inside the brief well. */
  keyHint?: React.ReactNode;
  rows?: number;
  disabled?: boolean;
  type?: string;
  autoComplete?: string;
  name?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}
export function Field(props: FieldProps): JSX.Element;
export function KeyHint(props: { keys?: string[]; style?: React.CSSProperties; children?: React.ReactNode }): JSX.Element;
