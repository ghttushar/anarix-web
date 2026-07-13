import { useEffect, useState } from "react";
import { useLivingOS } from "../state/LivingOSContext";

/** Warm bloom from the top of the workspace — used for approvals and awareness signals. */
export function AwarenessBloom() {
  const { bloomTick } = useLivingOS();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (bloomTick === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(t);
  }, [bloomTick]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 90% 45% at 50% -12%, rgba(200,135,90,0.32), transparent 70%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 420ms var(--los-ease)",
        zIndex: 20,
      }}
    />
  );
}
