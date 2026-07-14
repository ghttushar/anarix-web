import { useLocation } from "react-router-dom";
import { CommandPalette } from "./CommandPalette";
import { FloatingActionIsland } from "./FloatingActionIsland";
import { AmbientBackground } from "./AmbientBackground";
import { KeyboardNavigationProvider } from "./KeyboardNavigation";
import { DataStoryMode } from "./DataStoryMode";
import { useVisualEffects } from "@/contexts/VisualEffectsContext";

interface CreativeFeaturesProps {
  children: React.ReactNode;
}

export function CreativeFeatures({ children }: CreativeFeaturesProps) {
  const { effects } = useVisualEffects();
  const { pathname } = useLocation();
  // Living OS exploration surfaces run outside the product: no dock, no ambient bg, no command palette.
  const isLivingOS = pathname.startsWith("/livingos");

  if (isLivingOS) return <>{children}</>;

  let content = <>{children}</>;

  // Wrap with DataStoryMode
  content = <DataStoryMode>{content}</DataStoryMode>;

  // Wrap with KeyboardNavigation
  content = <KeyboardNavigationProvider>{content}</KeyboardNavigationProvider>;

  // Wrap with CommandPalette
  content = <CommandPalette>{content}</CommandPalette>;

  return (
    <>
      {effects.ambientBackground && <AmbientBackground intensity="medium" />}
      {content}
      {effects.floatingIsland && <FloatingActionIsland />}
    </>
  );
}

