import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns true only after the component has mounted on the client.
 * Use this to gate rendering of anything that depends on browser-only
 * state (theme, localStorage, window size) so the server-rendered HTML
 * and the first client render match exactly — no hydration mismatch.
 *
 * Preferred over `useEffect(() => setMounted(true), [])` because it
 * doesn't call setState inside an effect (avoids the "avoid calling
 * setState directly within an effect" lint warning) and integrates
 * correctly with concurrent rendering.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}