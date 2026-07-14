import { Suspense, lazy, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

// Simple CSS spinner fallback
function SpinnerFallback({ size = "md", className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          sizeMap[size],
          "rounded-full border-2 border-primary/30 border-t-primary animate-spin"
        )}
      />
    </div>
  );
}

// Lazily load Lottie to avoid React hooks issues
const LottiePlayer = lazy(() =>
  import("lottie-react").then((mod) => ({ default: mod.default }))
);

export function Loader({ size = "md", className }: LoaderProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Load the custom loader animation from public folder
    fetch("/animations/loader.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {
        console.warn("Could not load custom loader animation");
        setUseFallback(true);
      });
  }, []);

  if (useFallback || !animationData) {
    return <SpinnerFallback size={size} className={className} />;
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Suspense fallback={<SpinnerFallback size={size} />}>
        <LottiePlayer animationData={animationData} loop className={sizeMap[size]} />
      </Suspense>
    </div>
  );
}

export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        {message && (
          <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}

export function InlineLoader({ className }: { className?: string }) {
  return <Loader size="sm" className={className} />;
}
