import { createPortal } from "react-dom";
import { LayoutGroup } from "framer-motion";
import { AanMascot, AanMascotState } from "./AanMascot";
import { useAanPresence } from "./AanPresenceContext";
import { useAan } from "./AanContext";

/**
 * Renders the single travelling Aan mascot into whichever anchor is currently active.
 * Uses Framer Motion's `layoutId` so the same DOM element animates between anchor positions.
 */
export function AanPresencePortal() {
  const { activeAnchor, getAnchorEl, getAnchorSize } = useAanPresence();
  const { isGenerating, generationProgress, generationType, inputFocused } = useAan();

  if (!activeAnchor) return null;
  const target = getAnchorEl(activeAnchor);
  if (!target) return null;
  const size = getAnchorSize(activeAnchor);

  let state: AanMascotState = "idle";
  if (activeAnchor === "input") state = inputFocused ? "listening" : "idle";
  else if (activeAnchor === "pending") state = "thinking";
  else if (activeAnchor === "generation") state = "working";
  else if (activeAnchor === "lastMessage") state = "speaking";

  return createPortal(
    <LayoutGroup>
      <AanMascot
        layoutId="aan-presence"
        state={state}
        size={size}
        progress={isGenerating ? generationProgress : 0}
        interactive={activeAnchor === "input"}
        floating={size >= 40}
      />
    </LayoutGroup>,
    target
  );
}

// Also export a context-less label helper for the generation card
export function generationLabel(type: "report" | "audit" | null) {
  return type === "report" ? "Generating Report" : type === "audit" ? "Running Audit" : "Working";
}
