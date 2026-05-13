import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type AanAnchor = "input" | "pending" | "generation" | "lastMessage";

interface AnchorRegistration {
  el: HTMLElement;
  size: number;
}

interface AanPresenceContextType {
  /** Currently active anchor - the travelling mascot is rendered here. */
  activeAnchor: AanAnchor | null;
  /** Register / unregister an anchor's DOM element. */
  registerAnchor: (anchor: AanAnchor, el: HTMLElement | null, size?: number) => void;
  /** Resolve registered element for portal target. */
  getAnchorEl: (anchor: AanAnchor) => HTMLElement | null;
  getAnchorSize: (anchor: AanAnchor) => number;
}

const NOOP_CTX: AanPresenceContextType = {
  activeAnchor: null,
  registerAnchor: () => {},
  getAnchorEl: () => null,
  getAnchorSize: () => 28,
};

const Ctx = createContext<AanPresenceContextType>(NOOP_CTX);

const PRIORITY: AanAnchor[] = ["generation", "pending", "lastMessage", "input"];

export function AanPresenceProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<Record<string, AnchorRegistration>>({});

  const registerAnchor = useCallback(
    (anchor: AanAnchor, el: HTMLElement | null, size = 28) => {
      setRegistry((prev) => {
        const next = { ...prev };
        if (el) next[anchor] = { el, size };
        else delete next[anchor];
        return next;
      });
    },
    []
  );

  const activeAnchor = useMemo<AanAnchor | null>(() => {
    for (const a of PRIORITY) if (registry[a]) return a;
    return null;
  }, [registry]);

  const getAnchorEl = useCallback((anchor: AanAnchor) => registry[anchor]?.el ?? null, [registry]);
  const getAnchorSize = useCallback((anchor: AanAnchor) => registry[anchor]?.size ?? 28, [registry]);

  return (
    <Ctx.Provider value={{ activeAnchor, registerAnchor, getAnchorEl, getAnchorSize }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAanPresence() {
  return useContext(Ctx);
}

/** Hook that registers a DOM ref as an anchor target. Pass null el to unregister. */
export function useAnchorRegistration(anchor: AanAnchor, el: HTMLElement | null, size = 28) {
  const { registerAnchor } = useAanPresence();
  useEffect(() => {
    registerAnchor(anchor, el, size);
    return () => registerAnchor(anchor, null);
  }, [anchor, el, size, registerAnchor]);
}
