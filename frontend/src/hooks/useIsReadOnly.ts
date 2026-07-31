/**
 * Read-only mode gate. The production desktop app is fully interactive,
 * so this always returns false. Kept as a hook so call sites stay stable.
 */
export function useIsReadOnly(): boolean {
  return false;
}
