import { useState, createContext, useContext, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface StoryStep {
  target: string; // CSS selector
  title: string;
  description: string;
  highlightColor?: "primary" | "success" | "warning" | "destructive";
}

interface DataStoryContextType {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  startStory: (steps: StoryStep[]) => void;
  stopStory: () => void;
  nextStep: () => void;
  prevStep: () => void;
  pauseStory: () => void;
  resumeStory: () => void;
}

const DataStoryContext = createContext<DataStoryContextType | null>(null);

export function useDataStory() {
  const context = useContext(DataStoryContext);
  if (!context) {
    throw new Error("useDataStory must be used within DataStoryMode");
  }
  return context;
}

const highlightColors = {
  primary: "ring-primary shadow-primary/20",
  success: "ring-success shadow-success/20",
  warning: "ring-warning shadow-warning/20",
  destructive: "ring-destructive shadow-destructive/20",
};

export function DataStoryMode({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<StoryStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStepData = steps[currentStep];

  // Update target element position
  useEffect(() => {
    if (currentStepData?.target) {
      const element = document.querySelector(currentStepData.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Scroll element into view
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStepData]);

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying && !isPaused && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 5000); // 5 seconds per step
      return () => clearTimeout(timer);
    }
  }, [isPlaying, isPaused, currentStep, steps.length]);

  const startStory = useCallback((newSteps: StoryStep[]) => {
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const stopStory = useCallback(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
    setTargetRect(null);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      stopStory();
    }
  }, [currentStep, steps.length, stopStory]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const pauseStory = useCallback(() => setIsPaused(true), []);
  const resumeStory = useCallback(() => setIsPaused(false), []);

  return (
    <DataStoryContext.Provider value={{
      isPlaying,
      currentStep,
      totalSteps: steps.length,
      startStory,
      stopStory,
      nextStep,
      prevStep,
      pauseStory,
      resumeStory,
    }}>
      {children}

      {/* Story overlay */}
      {isPlaying && currentStepData && (
        <>
          {/* Backdrop with spotlight */}
          <div className="fixed inset-0 z-[9990] pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  {targetRect && (
                    <rect
                      x={targetRect.left - 8}
                      y={targetRect.top - 8}
                      width={targetRect.width + 16}
                      height={targetRect.height + 16}
                      rx="8"
                      fill="black"
                    />
                  )}
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.5)"
                mask="url(#spotlight-mask)"
              />
            </svg>
          </div>

          {/* Highlight ring around target */}
          {targetRect && (
            <div
              className={cn(
                "fixed z-[9991] ring-4 rounded-lg shadow-2xl pointer-events-none",
                "animate-pulse",
                highlightColors[currentStepData.highlightColor || "primary"]
              )}
              style={{
                left: targetRect.left - 8,
                top: targetRect.top - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            />
          )}

          {/* Story card */}
          <div 
            className="fixed z-[9992] bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl p-6 mx-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg">{currentStepData.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{currentStepData.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={stopStory}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-muted rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={isPaused ? resumeStory : pauseStory}
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextStep}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DataStoryContext.Provider>
  );
}
