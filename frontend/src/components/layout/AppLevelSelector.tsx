import { ReactNode } from "react";

interface AppLevelSelectorProps {
  children?: ReactNode;
}

/** @deprecated - Pass children directly into AppTaskbar instead */
export function AppLevelSelector({ children }: AppLevelSelectorProps) {
  return <>{children}</>;
}