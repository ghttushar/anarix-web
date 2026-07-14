import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Plus, MoreHorizontal, User, FileText, Search, Palette, Bot, ArrowLeft } from "lucide-react";
import { AanMascot } from "@/components/aan/AanMascot";
import { AanConversation } from "@/components/aan/AanConversation";
import { AanInput } from "@/components/aan/AanInput";
import { AanArtifactViewer } from "@/components/aan/AanArtifactViewer";
import { AanPresenceProvider } from "@/components/aan/AanPresenceContext";
import { AanPresencePortal } from "@/components/aan/AanPresencePortal";
import { useAan, FilterType } from "@/components/aan/AanContext";
import { MobileDrawerNav } from "./MobileDrawerNav";
import { MobileAccountSheet } from "./MobileAccountSheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FILTERS: { id: FilterType; label: string; icon: any }[] = [
  { id: "reports", label: "Reports", icon: FileText },
  { id: "audit", label: "Audit", icon: Search },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "agent", label: "Agent", icon: Bot },
];

/**
 * Mobile Aan workspace — OPT A: single hamburger opens the main app nav.
 * No right-side chat history drawer. Top-right has ＋ new chat, ⋯ Aan
 * settings, and 👤 account.
 */
export function MobileAanLayout() {
  const navigate = useNavigate();
  const {
    activeFilter, setActiveFilter,
    startNewConversation, viewingArtifact, closeArtifactView,
  } = useAan();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <AanPresenceProvider>
      <div className="fixed inset-0 z-[60] flex flex-col bg-background" style={{ height: "100dvh" }}>
        {/* Top bar */}
        <header
          className="h-14 shrink-0 sticky top-0 z-30 bg-background border-b border-border flex items-center px-1 gap-0.5"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="h-11 w-11 rounded-md flex items-center justify-center active:bg-muted text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="h-11 w-11 rounded-md flex items-center justify-center active:bg-muted text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0">
            <AanMascot state="idle" size={22} interactive={false} />
            <span className="font-aan text-2xl leading-none aan-gradient-text">Aan</span>
          </div>
          <button
            type="button"
            onClick={() => startNewConversation()}
            aria-label="New chat"
            className="h-11 w-11 rounded-md flex items-center justify-center active:bg-muted text-foreground"
          >
            <Plus className="h-5 w-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Aan settings"
                className="h-11 w-11 rounded-md flex items-center justify-center active:bg-muted text-foreground"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-[11px]">Filter</DropdownMenuLabel>
              {FILTERS.map((f) => {
                const Icon = f.icon;
                const active = activeFilter === f.id;
                return (
                  <DropdownMenuItem
                    key={f.id}
                    onClick={() => setActiveFilter(active ? "all" : f.id)}
                    className="flex items-center gap-2 cursor-pointer text-[13px]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="flex-1">{f.label}</span>
                    {active && <span className="text-[10px] text-primary">on</span>}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings/appearance")} className="text-[13px]">
                Aan preferences
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            onClick={() => setAccountOpen(true)}
            aria-label="Account"
            className="h-11 w-11 rounded-md flex items-center justify-center active:bg-muted text-foreground"
          >
            <User className="h-5 w-5" />
          </button>
        </header>

        {/* Conversation + sticky composer */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <AanConversation />
          </div>
          <div
            className="shrink-0 border-t border-border bg-background"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <AanInput />
          </div>
        </main>

        {/* Reuses the app's main hamburger drawer */}
        <MobileDrawerNav open={drawerOpen} onOpenChange={setDrawerOpen} />
        <MobileAccountSheet open={accountOpen} onOpenChange={setAccountOpen} />

        {viewingArtifact && (
          <AanArtifactViewer artifact={viewingArtifact} onClose={closeArtifactView} />
        )}
        <AanPresencePortal />
      </div>
    </AanPresenceProvider>
  );
}
