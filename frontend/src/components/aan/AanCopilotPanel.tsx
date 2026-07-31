import { X, Calendar, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAan } from "./AanContext";
import { AanConversation } from "./AanConversation";

import { AanInput } from "./AanInput";
import { AanLogo } from "./AanLogo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AanPresenceProvider } from "./AanPresenceContext";
import { AanPresencePortal } from "./AanPresencePortal";

export function AanCopilotPanel() {
  const { mode, closeAan, openWorkspace, context } = useAan();

  const isOpen = mode === "copilot";

  return (
    <AanPresenceProvider>
      <div
        data-app-panel="copilot"
        className={cn(
          "h-full shrink-0 flex flex-col border-l border-border bg-background transition-all duration-200 ease-out overflow-hidden relative",
          isOpen ? "w-[360px] opacity-100" : "w-0 opacity-0 border-l-0"
        )}
      >
        {isOpen && (
          <>
          {/* Header with Aan gradient */}
          <div className="border-b border-border shrink-0">
            <div className="flex items-center justify-between px-4 py-4">
              <AanLogo />
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={openWorkspace} className="h-8 w-8" title="Open full workspace">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={closeAan} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Context Bar */}
            <div className="flex items-center gap-4 border-t border-border/50 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Context:</span>
                <span>{context.page}</span>
              </div>
              {context.dateRange && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{context.dateRange}</span>
                </div>
              )}
            </div>
          </div>

          {/* Conversation Area - independent scroll */}
          <ScrollArea className="flex-1 min-h-0">
            <AanConversation />
          </ScrollArea>

          {/* Draft preview removed - drafts are now shown inline in the conversation */}

          {/* Input Area */}
          <div className="shrink-0">
            <AanInput />
          </div>
          </>
        )}
        <AanPresencePortal />
      </div>
    </AanPresenceProvider>
  );
}
