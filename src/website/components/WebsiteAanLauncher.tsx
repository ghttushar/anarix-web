import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AanMascot } from "@/components/aan/AanMascot";
import WebsiteAanChat from "./WebsiteAanChat";

export default function WebsiteAanLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-card border border-border shadow-strong flex items-center justify-center hover:scale-105 transition-transform"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        aria-label={open ? "Close Aan" : "Talk to Aan"}
      >
        {open ? <X className="w-5 h-5 text-foreground" /> : <AanMascot state="idle" size={36} interactive={false} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[60] w-[380px] max-w-[calc(100vw-2rem)]"
          >
            <WebsiteAanChat height="h-[520px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
