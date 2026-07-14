import { useViewport } from "@/contexts/ViewportContext";

/**
 * Mobile is a strict read-only companion view.
 * Any create/edit/delete/upload/connect control must hide when this returns true.
 */
export function useIsReadOnly(): boolean {
  const { view } = useViewport();
  return view === "mobile";
}
