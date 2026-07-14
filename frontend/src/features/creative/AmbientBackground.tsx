import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface AmbientBackgroundProps {
  intensity?: "low" | "medium" | "high";
  className?: string;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function AmbientBackground({ intensity = "low", className }: AmbientBackgroundProps) {
  const dotCount = intensity === "low" ? 20 : intensity === "medium" ? 40 : 60;
  const baseOpacity = intensity === "low" ? 0.03 : intensity === "medium" ? 0.05 : 0.08;

  const dots = useMemo<Dot[]>(() => {
    return Array.from({ length: dotCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
      opacity: (Math.random() * 0.5 + 0.5) * baseOpacity,
    }));
  }, [dotCount, baseOpacity]);

  return (
    <div 
      className={cn(
        "fixed inset-0 pointer-events-none overflow-hidden -z-10",
        className
      )}
      aria-hidden="true"
    >
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            animation: `ambient-float ${dot.duration}s ease-in-out infinite`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes ambient-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10px, -10px) scale(1.1);
          }
          50% {
            transform: translate(-5px, 5px) scale(0.95);
          }
          75% {
            transform: translate(-10px, -5px) scale(1.05);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ambient-float {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
