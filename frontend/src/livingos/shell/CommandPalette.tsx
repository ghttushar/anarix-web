// Universal command (⌘K).
// Natural-language input plus grouped results across decisions, meetings, and
// view commands. Phase 1: local search only.

import { useEffect, useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useActionsStore } from "@/livingos/state/actionsStore";
import { ALERT_TABS, type AlertTabKey } from "@/livingos/actions/tabs";
import { scrollToRow, pushRecent } from "./ContextDock";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSetRegister: (k: AlertTabKey) => void;
}

export function CommandPalette({ open, onOpenChange, onSetRegister }: Props) {
  const { decisions, meetings, questions, approve, reject } = useActionsStore();
  const [q, setQ] = useState("");

  useEffect(() => { if (!open) setQ(""); }, [open]);

  const filteredDecisions = useMemo(() => {
    const term = q.toLowerCase().trim();
    const base = decisions.filter((d) => d.status !== "snoozed");
    if (!term) return base.slice(0, 6);
    return base.filter((d) =>
      d.insight.toLowerCase().includes(term) ||
      d.sourceRef.label.toLowerCase().includes(term) ||
      d.domain.toLowerCase().includes(term)
    ).slice(0, 8);
  }, [decisions, q]);

  const filteredMeetings = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return meetings.slice(0, 3);
    return meetings.filter((m) =>
      m.title.toLowerCase().includes(term)
    ).slice(0, 5);
  }, [meetings, q]);

  const filteredQuestions = useMemo(() => {
    const term = q.toLowerCase().trim();
    const open = questions.filter((qi) => qi.status === "open");
    if (!term) return open.slice(0, 3);
    return open.filter((qi) => qi.prompt.toLowerCase().includes(term)).slice(0, 5);
  }, [questions, q]);

  const go = (id: string) => {
    onOpenChange(false);
    pushRecent(id);
    // Row scroll runs after dialog unmounts.
    setTimeout(() => scrollToRow(id), 60);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        value={q}
        onValueChange={setQ}
        placeholder="Ask Aan or search — decisions, meetings, registers…"
      />
      <CommandList>
        <CommandEmpty>Nothing matches. Try a domain, a source, or a register name.</CommandEmpty>

        {filteredDecisions.length > 0 && (
          <CommandGroup heading="Decisions">
            {filteredDecisions.map((d) => (
              <CommandItem key={d.id} value={`d-${d.id}-${d.insight}`} onSelect={() => go(d.id)}>
                <span className="los-mono mr-3 text-[10.5px] uppercase tracking-wider text-[hsl(var(--los-muted))]">
                  {d.domain}
                </span>
                <span className="truncate">{d.insight}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredMeetings.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="From the room">
              {filteredMeetings.map((m) => (
                <CommandItem key={m.id} value={`m-${m.id}-${m.title}`} onSelect={() => onOpenChange(false)}>
                  <span className="los-mono mr-3 text-[10.5px] uppercase tracking-wider text-[hsl(var(--los-muted))]">
                    meeting
                  </span>
                  <span className="truncate">{m.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {filteredQuestions.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Aan is asking">
              {filteredQuestions.map((qi) => (
                <CommandItem key={qi.id} value={`q-${qi.id}-${qi.prompt}`} onSelect={() => onOpenChange(false)}>
                  <span className="los-mono mr-3 text-[10.5px] uppercase tracking-wider text-[hsl(var(--los-muted))]">
                    ask
                  </span>
                  <span className="truncate">{qi.prompt}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Switch register">
          {ALERT_TABS.map((t) => (
            <CommandItem key={t.key} value={`reg-${t.key}`} onSelect={() => { onSetRegister(t.key); onOpenChange(false); }}>
              <span className="los-mono mr-3 text-[10.5px] uppercase tracking-wider text-[hsl(var(--los-muted))]">
                register
              </span>
              <span>{t.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {filteredDecisions.length > 0 && q.trim() && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Act on top match">
              <CommandItem value="act-approve" onSelect={() => { approve(filteredDecisions[0].id); onOpenChange(false); }}>
                Approve · {filteredDecisions[0].insight.slice(0, 60)}
              </CommandItem>
              <CommandItem value="act-reject" onSelect={() => { reject(filteredDecisions[0].id); onOpenChange(false); }}>
                Dismiss · {filteredDecisions[0].insight.slice(0, 60)}
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
