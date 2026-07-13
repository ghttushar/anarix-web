import { useLivingOS } from "../state/LivingOSContext";

/** Cool tint overlay across the workspace when simulating a proposal. */
export function SimulationOverlay() {
  const { simulating } = useLivingOS();
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "linear-gradient(180deg, rgba(140,160,180,0.10), rgba(120,140,170,0.04) 40%, transparent 100%)",
        opacity: simulating ? 1 : 0,
        transition: "opacity 320ms var(--los-ease)",
        zIndex: 15,
        mixBlendMode: "multiply",
      }}
    />
  );
}
