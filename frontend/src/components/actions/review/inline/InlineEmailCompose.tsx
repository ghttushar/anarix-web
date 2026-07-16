// Inline email compose card — used inside ReviewWorkspace when AI Panel mode = "main"
// Replaces the "Choose your strategy" area with an editable email draft.
import { useState } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AanMark } from "@/components/branding/AanMark";
import { toast } from "sonner";

export interface EmailDraft {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

interface Props {
  initial: EmailDraft;
  onCancel: () => void;
  onSent: () => void;
}

export function InlineEmailCompose({ initial, onCancel, onSent }: Props) {
  const [to, setTo] = useState(initial.to);
  const [cc, setCc] = useState(initial.cc ?? "");
  const [bcc, setBcc] = useState(initial.bcc ?? "");
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
  const [showCc, setShowCc] = useState(!!initial.cc);
  const [showBcc, setShowBcc] = useState(!!initial.bcc);

  const canSend = to.trim() && subject.trim() && body.trim();

  function send() {
    if (!canSend) return;
    toast.success("Email sent to Vendor Manager.");
    onSent();
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AanMark size={14} className="text-primary" />
          <span className="text-[10.5px] uppercase tracking-widest font-semibold text-primary">
            Aan drafted this email
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 text-[11.5px] gap-1 text-muted-foreground">
          <X className="h-3 w-3" /> Cancel
        </Button>
      </div>

      <div className="rounded-xl border border-primary/25 bg-card overflow-hidden">
        {/* Recipients */}
        <div className="divide-y divide-border/60">
          <div className="flex items-center gap-2 px-3 py-2">
            <label className="text-[11px] font-medium text-muted-foreground w-10 shrink-0">To</label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-8 border-0 bg-transparent focus-visible:ring-0 px-0 text-[13px]"
              placeholder="recipient@example.com"
            />
            <div className="flex items-center gap-1 text-[11px]">
              {!showCc && (
                <button type="button" onClick={() => setShowCc(true)} className="text-muted-foreground hover:text-foreground px-1">Cc</button>
              )}
              {!showBcc && (
                <button type="button" onClick={() => setShowBcc(true)} className="text-muted-foreground hover:text-foreground px-1">Bcc</button>
              )}
            </div>
          </div>

          {showCc && (
            <div className="flex items-center gap-2 px-3 py-2">
              <label className="text-[11px] font-medium text-muted-foreground w-10 shrink-0">Cc</label>
              <Input value={cc} onChange={(e) => setCc(e.target.value)} className="h-8 border-0 bg-transparent focus-visible:ring-0 px-0 text-[13px]" placeholder="cc@example.com" />
            </div>
          )}
          {showBcc && (
            <div className="flex items-center gap-2 px-3 py-2">
              <label className="text-[11px] font-medium text-muted-foreground w-10 shrink-0">Bcc</label>
              <Input value={bcc} onChange={(e) => setBcc(e.target.value)} className="h-8 border-0 bg-transparent focus-visible:ring-0 px-0 text-[13px]" placeholder="bcc@example.com" />
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-2">
            <label className="text-[11px] font-medium text-muted-foreground w-14 shrink-0">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-8 border-0 bg-transparent focus-visible:ring-0 px-0 text-[13px] font-medium"
            />
          </div>
        </div>

        {/* Body */}
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-[240px] rounded-none border-0 border-t border-border/60 focus-visible:ring-0 text-[13px] leading-relaxed resize-y"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          Edit anything before sending — this draft is not sent yet.
        </span>
        <Button size="sm" onClick={send} disabled={!canSend} className="h-8 gap-1.5 text-[12.5px]">
          <Send className="h-3.5 w-3.5" /> Send email
        </Button>
      </div>
    </section>
  );
}
