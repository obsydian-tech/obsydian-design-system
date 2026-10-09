export interface AgentVisualizerProps {
  state?: 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking';
  /** The agent's voice level, 0 to 1, while speaking. */
  level?: number;
  /** px or a CSS width. */
  size?: number | string;
  /** In a live session the light on the frame runs a little faster and brighter. */
  session?: boolean;
  style?: React.CSSProperties;
}
export function AgentVisualizer(props: AgentVisualizerProps): JSX.Element;
export function AgentPromo(props: { lead?: string; href?: string; busy?: boolean }): JSX.Element;
