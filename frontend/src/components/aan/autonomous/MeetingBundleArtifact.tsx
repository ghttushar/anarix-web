import { useState } from "react";
import {
  X, Check, Users, Video, FileText, Check as CheckIcon, Ban,
  ChevronDown, Share2, Slack, Mail, Link as LinkIcon, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { MeetingTaskBundle } from "@/data/mockMeetingTasks";
import { useAanEvents } from "./AanEventsContext";
import { toast } from "sonner";

interface Props {
  bundle: MeetingTaskBundle;
  onClose: () => void;
}

function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const statusBadge: Record<string, string> = {
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-muted text-muted-foreground border-border",
  pending: "bg-primary/10 text-primary border-primary/30",
};

function Section({ label, children, right }: { label: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">{label}</div>
        {right}
      </div>
      {children}
    </section>
  );
}

function CollapseSection({ label, defaultOpen = false, badge, children }: { label: string; defaultOpen?: boolean; badge?: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 hover:bg-muted/40 transition-colors">
        <div className="flex items-center gap-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">{label}</div>
          {badge}
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2.5">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export function MeetingBundleArtifact({ bundle, onClose }: Props) {
  const { approveMeetingItem, rejectMeetingItem, approveAllMeetingItems, rejectAllMeetingItems } = useAanEvents();
  const pendingCount = bundle.actionItems.filter((it) => it.status === "pending").length;
  const approvedCount = bundle.actionItems.filter((it) => it.status === "approved").length;
  const rejectedCount = bundle.actionItems.filter((it) => it.status === "rejected").length;
  const total = bundle.actionItems.length;
  const resolvedPct = total > 0 ? Math.round(((approvedCount + rejectedCount) / total) * 100) : 0;

  const shareTo = (channel: string) => toast.success(`Shared meeting summary to ${channel}.`);
  const copyLink = () => { navigator.clipboard?.writeText(`meeting://${bundle.bundleId}`); toast.success("Link copied."); };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-[1px]" onClick={onClose} aria-hidden />
      <div className="fixed inset-y-0 right-0 z-50 w-[760px] max-w-[94vw] bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-border shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary/80">Aan · From Meeting</div>
              <span className="text-[9.5px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border bg-primary/10 text-primary border-primary/30">
                {pendingCount > 0 ? `${pendingCount} waiting on you` : "All resolved"}
              </span>
            </div>
            <h2 className="font-heading text-[17px] font-semibold text-foreground leading-snug truncate">{bundle.meetingTitle}</h2>
            <p className="text-[11.5px] text-muted-foreground mt-0.5">
              {bundle.meetingWhen} · {bundle.duration} · {bundle.participants.length} people
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground shrink-0" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-5 space-y-5">
            {/* SNAPSHOT with resolution progress */}
            <section>
              <div className="rounded-lg border-l-4 border-primary bg-primary/[0.04] px-4 py-3.5">
                <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground">Summary</div>
                <p className="text-[13.5px] text-foreground/90 leading-relaxed mt-1">{bundle.summary}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10.5px] text-muted-foreground mb-1">
                    <span>Resolution</span>
                    <span className="font-medium">{approvedCount + rejectedCount} of {total} · {resolvedPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${resolvedPct}%` }} />
                  </div>
                </div>
              </div>
            </section>

            {/* Participants */}
            <Section label="Participants">
              <ul className="grid grid-cols-2 gap-1.5">
                {bundle.participants.map((p) => (
                  <li key={p.name} className="flex items-center gap-2.5 rounded-md bg-muted/30 px-2.5 py-1.5">
                    <span className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0">
                      {initials(p.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-medium text-foreground leading-tight truncate">{p.name}</div>
                      <div className="text-[10.5px] text-muted-foreground leading-tight truncate">{p.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Transcript — collapsed */}
            <CollapseSection
              label="Transcript excerpt"
              defaultOpen={false}
              badge={<span className="text-[10.5px] text-muted-foreground">{bundle.transcriptExcerpt.length} lines</span>}
            >
              <div className="rounded-md border border-border bg-muted/30 px-3.5 py-3 space-y-1.5 max-h-[240px] overflow-auto">
                {bundle.transcriptExcerpt.map((line, i) => (
                  <div key={i} className="text-[12px] text-foreground/80 leading-relaxed font-mono">{line}</div>
                ))}
              </div>
            </CollapseSection>

            {/* Action items */}
            <Section
              label={`Action items · ${total}`}
              right={pendingCount > 0 ? <span className="text-[10.5px] text-primary font-semibold">{pendingCount} pending</span> : null}
            >
              <ul className="space-y-2">
                {bundle.actionItems.map((it) => {
                  const isPending = it.status === "pending";
                  return (
                    <li key={it.id} className={cn(
                      "rounded-md border px-3.5 py-2.5",
                      isPending ? "border-border bg-card" : "border-border/60 bg-muted/20"
                    )}>
                      <div className="flex items-start gap-3">
                        <span className={cn(
                          "mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                          it.status === "approved" ? "bg-success border-success" :
                          it.status === "rejected" ? "bg-muted border-border" :
                          "border-primary/40 bg-primary/5"
                        )}>
                          {it.status === "approved" && <Check className="h-2.5 w-2.5 text-success-foreground" />}
                          {it.status === "rejected" && <X className="h-2.5 w-2.5 text-muted-foreground" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-[13px] font-medium text-foreground leading-snug">{it.title}</span>
                            <span className={cn("text-[9.5px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border", statusBadge[it.status])}>
                              {it.status}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {it.owner} · due {it.due}
                          </div>
                          <p className="mt-1.5 text-[12px] text-foreground/75 leading-snug">{it.detail}</p>
                        </div>
                      </div>
                      {isPending && (
                        <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-border/40">
                          <Button size="sm" onClick={() => approveMeetingItem(bundle.bundleId, it.id)} className="h-7 px-3 text-[11.5px] shadow-none">
                            <Check className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => rejectMeetingItem(bundle.bundleId, it.id)} className="h-7 px-2.5 text-[11.5px] text-muted-foreground hover:text-destructive">
                            <X className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Section>

            {/* Verification / share (visible once anything is resolved) */}
            {(approvedCount > 0 || rejectedCount > 0) && (
              <Section label="Verification & share">
                <div className="rounded-md border border-success/30 bg-success/5 p-3.5">
                  <div className="flex items-start gap-2 text-[12.5px] text-foreground mb-3">
                    <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                    <span>
                      I've logged {approvedCount} approval{approvedCount === 1 ? "" : "s"}
                      {rejectedCount > 0 && ` and ${rejectedCount} rejection${rejectedCount === 1 ? "" : "s"}`} against this meeting.
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border/60">
                    <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Share2 className="h-3 w-3" /> Share meeting summary
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button onClick={() => shareTo("Slack")} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                        <Slack className="h-3 w-3" /> Slack
                      </button>
                      <button onClick={() => shareTo("Teams")} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                        <Video className="h-3 w-3" /> Teams
                      </button>
                      <button onClick={() => shareTo("Email")} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                        <Mail className="h-3 w-3" /> Email
                      </button>
                      <button onClick={copyLink} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                        <LinkIcon className="h-3 w-3" /> Copy link
                      </button>
                    </div>
                  </div>
                </div>
              </Section>
            )}
          </div>
        </ScrollArea>

        {/* Sticky footer */}
        <div className="border-t border-border px-6 py-3 flex items-center justify-between gap-2 bg-background shrink-0">
          <div className="text-[11px] text-muted-foreground">You have 30s to undo after either action.</div>
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost" disabled={pendingCount === 0} onClick={() => rejectAllMeetingItems(bundle.bundleId)} className="h-8 px-3 text-[12px] text-muted-foreground hover:text-destructive">
              <Ban className="h-3.5 w-3.5 mr-1" /> Reject all
            </Button>
            <Button size="sm" disabled={pendingCount === 0} onClick={() => approveAllMeetingItems(bundle.bundleId)} className="h-8 px-3 text-[12px] shadow-none">
              <Check className="h-3.5 w-3.5 mr-1" /> Approve all pending
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
