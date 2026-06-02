import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "anarix-tutorial";

interface TutorialState {
  enabled: boolean;
  completed: boolean;
  lastSeen: string | null;
  currentStep: number;
}

const defaultState: TutorialState = {
  enabled: true,
  completed: false,
  lastSeen: null,
  currentStep: 0,
};

function loadState(): TutorialState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultState, ...JSON.parse(stored) };
  } catch {}
  return { ...defaultState };
}

function persist(state: TutorialState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface TutorialContextValue {
  state: TutorialState;
  active: boolean;
  start: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  skip: () => void;
  complete: () => void;
  setEnabled: (v: boolean) => void;
  restart: () => void;
  /** True between login success and first analytics render. */
  requestAutoStart: () => void;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("useTutorial must be used inside TutorialProvider");
  return ctx;
}

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TutorialState>(loadState);
  const [active, setActive] = useState(false);
  const [autoStartPending, setAutoStartPending] = useState(false);

  useEffect(() => {
    persist(state);
  }, [state]);

  // Auto-start once user lands on an analytics route after sign-in.
  useEffect(() => {
    if (!autoStartPending) return;
    if (!state.enabled || state.completed) {
      setAutoStartPending(false);
      return;
    }
    const path = window.location.pathname;
    if (path.startsWith("/login") || path.startsWith("/onboarding")) return;
    setAutoStartPending(false);
    setState((s) => ({ ...s, currentStep: 0 }));
    setActive(true);
  }, [autoStartPending, state.enabled, state.completed]);

  const start = useCallback(() => {
    setState((s) => ({ ...s, currentStep: 0, completed: false }));
    setActive(true);
  }, []);

  const next = useCallback(() => {
    setState((s) => ({ ...s, currentStep: s.currentStep + 1 }));
  }, []);

  const prev = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.max(0, s.currentStep - 1) }));
  }, []);

  const goTo = useCallback((index: number) => {
    setState((s) => ({ ...s, currentStep: Math.max(0, index) }));
  }, []);

  const complete = useCallback(() => {
    setState((s) => ({
      ...s,
      completed: true,
      lastSeen: new Date().toISOString(),
      currentStep: 0,
    }));
    setActive(false);
  }, []);

  const skip = useCallback(() => {
    complete();
  }, [complete]);

  const setEnabled = useCallback((v: boolean) => {
    setState((s) => ({ ...s, enabled: v }));
  }, []);

  const restart = useCallback(() => {
    setState((s) => ({ ...s, completed: false, currentStep: 0 }));
    setActive(true);
  }, []);

  const requestAutoStart = useCallback(() => {
    setAutoStartPending(true);
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        state,
        active,
        start,
        next,
        prev,
        goTo,
        skip,
        complete,
        setEnabled,
        restart,
        requestAutoStart,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}
