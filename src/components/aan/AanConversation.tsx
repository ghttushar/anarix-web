import { useRef, useEffect, useState } from "react";
import { useAan } from "./AanContext";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { AanGlyph } from "./AanGlyph";
import { AanMascot } from "./AanMascot";
import { useAanPresence } from "./AanPresenceContext";
import { useBranding } from "@/contexts/BrandingContext";
import { format } from "date-fns";
import { ArtifactCard } from "./ArtifactCard";
import { CircularProgress } from "@/components/ui/circular-progress";
import { FloatingDots } from "./FloatingDots";

export function AanConversation() {
  const { messages, openSplit, isGenerating, generationType, generationProgress } = useAan();
  const { newBranding } = useBranding();
  const { registerAnchor } = useAanPresence();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingAnchorEl, setPendingAnchorEl] = useState<HTMLDivElement | null>(null);
  const [generationAnchorEl, setGenerationAnchorEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, generationProgress]);

  // Register the generation card anchor - owns the live presence while generating
  useEffect(() => {
    if (!newBranding) return;
    if (isGenerating) {
      registerAnchor("generation", generationAnchorEl, 40);
    } else {
      registerAnchor("generation", null);
    }
    return () => registerAnchor("generation", null);
  }, [newBranding, isGenerating, generationAnchorEl, registerAnchor]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center",
              message.role === "assistant"
                ? newBranding
                  ? "text-foreground"
                  : "rounded-full aan-gradient text-white"
                : "rounded-full bg-muted text-muted-foreground"
            )}
          >
            {message.role === "assistant" ? (
              newBranding ? (
                <AanMascot size={20} state="anchor" interactive={false} />
              ) : (
                <AanGlyph className="h-4 w-4" />
              )
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={cn(
              "flex max-w-[80%] flex-col gap-2",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                message.role === "assistant"
                  ? "bg-card text-foreground border border-border"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.content}
            </div>

            {/* Artifact Card (if present) */}
            {message.draft && (
              <ArtifactCard
                artifact={message.draft}
                onClick={() => openSplit(message.draft!)}
                className="max-w-sm"
              />
            )}

            <span className="text-xs text-muted-foreground px-2">
              {format(message.timestamp, "h:mm a")}
            </span>
          </div>
        </div>
      ))}

      {/* Generation Progress Indicator - rendered like an assistant message */}
      {isGenerating && (
        <div className="flex flex-row gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center",
              newBranding ? "text-foreground" : "rounded-full aan-gradient text-white"
            )}
          >
            {newBranding ? (
              <AanMascot size={20} state="anchor" interactive={false} />
            ) : (
              <AanGlyph className="h-4 w-4" />
            )}
          </div>
          <div className="flex max-w-[80%] flex-col gap-2 items-start">
            <div className="flex flex-row items-center gap-4 px-5 py-4 rounded-2xl border border-border bg-card shadow-sm w-fit min-w-[280px]">
              {newBranding ? (
                <div
                  ref={setGenerationAnchorEl}
                  aria-hidden
                  data-aan-anchor="generation"
                  className="w-10 h-10 shrink-0 flex items-center justify-center"
                />
              ) : (
                <CircularProgress progress={generationProgress} size={48} />
              )}
              <div className="flex flex-col items-start text-left">
                <p className="font-medium text-foreground text-sm leading-tight">
                  {generationType === "report" ? "Generating Report" : "Running Audit"}
                </p>
                <FloatingDots className="mt-2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
