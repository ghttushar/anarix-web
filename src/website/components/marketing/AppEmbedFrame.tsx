import { ReactNode } from "react";

interface AppEmbedFrameProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

const AppEmbedFrame = ({ label, children, className = "" }: AppEmbedFrameProps) => (
  <div className={`rounded-2xl border border-border bg-card overflow-hidden shadow-medium ${className}`}>
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
      </div>
      {label && <span className="text-[11px] text-muted-foreground ml-2 font-mono">{label}</span>}
    </div>
    <div className="pointer-events-none select-none">{children}</div>
  </div>
);

export default AppEmbedFrame;
