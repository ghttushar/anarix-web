import { cn } from "@/lib/utils";

interface GlassmorphismPanelProps {
  children: React.ReactNode;
  blur?: "sm" | "md" | "lg";
  opacity?: number;
  gradient?: boolean;
  border?: boolean;
  className?: string;
}

const blurClasses = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
};

export function GlassmorphismPanel({
  children,
  blur = "md",
  opacity = 0.8,
  gradient = true,
  border = true,
  className,
}: GlassmorphismPanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden",
        blurClasses[blur],
        border && "border border-white/10",
        className
      )}
      style={{
        backgroundColor: `hsl(var(--card) / ${opacity})`,
      }}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              135deg, 
              hsl(var(--primary) / 0.05) 0%, 
              transparent 50%,
              hsl(var(--accent) / 0.03) 100%
            )`,
          }}
        />
      )}
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
