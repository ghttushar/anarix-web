import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AanMascot, AanMascotState } from "@/components/aan/AanMascot";
import WebsiteAanChat from "./WebsiteAanChat";

export default function WebsiteAanLauncher() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Cycle through states when idle so it feels alive — like in the app.
  const [demoState, setDemoState] = useState<AanMascotState>("idle");
  useEffect(() => {
    if (open) return;
    const cycle: AanMascotState[] = ["idle", "listening", "idle", "thinking", "idle"];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % cycle.length;
      setDemoState(cycle[i]);
    }, 3200);
    return () => clearInterval(t);
  }, [open]);

  const mascotState: AanMascotState = open ? "listening" : hovered ? "speaking" : demoState;

  return (
    <>
      {/* Floating launcher cluster — bottom-right */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-end gap-3">
        {/* Hover label */}
        <AnimatePresence>
          {hovered && !open && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="mb-4 px-3 py-1.5 rounded-pill bg-foreground text-background text-xs font-medium shadow-medium whitespace-nowrap"
            >
              Talk to Aan — live
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launcher button */}
        <motion.button
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative w-16 h-16 rounded-full flex items-center justify-center group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          aria-label={open ? "Close Aan" : "Talk to Aan"}
        >
          {/* Gradient halo — Aan-only AI gradient */}
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--primary) / 0.4), hsl(var(--primary)))",
              filter: "blur(10px)",
              opacity: 0.55,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner pill surface */}
          <span className="relative w-14 h-14 rounded-full bg-card border border-border shadow-strong flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
            {open ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <AanMascot state={mascotState} size={40} interactive={false} floating={false} />
            )}
            {/* Live status dot */}
            {!open && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
              </span>
            )}
          </span>
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-28 right-6 z-[60] w-[400px] max-w-[calc(100vw-2rem)]"
          >
            <WebsiteAanChat height="h-[560px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
