export function useMediaQuery(query: string): boolean;
/** true when the OS asks for reduced motion. */
export function usePrefersReducedMotion(): boolean;
/** true below 820px. */
export function useIsPhone(): boolean;
/** true below 980px. */
export function useIsNarrow(): boolean;
export function useInteraction(opts?: { inert?: boolean }): {
  hover: boolean; down: boolean; focusVisible: boolean;
  handlers: Record<string, (e: any) => void>;
};
/** The shared keyboard focus ring: 2px violet, offset 2px. */
export function focusRing(on: boolean): React.CSSProperties;
