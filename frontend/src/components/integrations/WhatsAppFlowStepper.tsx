import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type StepKey = "phone" | "otp" | "services" | "accounts";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "phone", label: "Phone" },
  { key: "otp", label: "Verify" },
  { key: "services", label: "Services" },
  { key: "accounts", label: "Accounts" },
];

interface Props {
  current: StepKey;
  completed: StepKey[];
  onJump?: (step: StepKey) => void;
}

export function WhatsAppFlowStepper({ current, completed, onJump }: Props) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, idx) => {
        const isDone = completed.includes(s.key);
        const isCurrent = current === s.key;
        const canJump = onJump && (isDone || isCurrent);
        return (
          <div key={s.key} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canJump}
              onClick={() => canJump && onJump?.(s.key)}
              className={cn(
                "flex items-center gap-2 text-xs font-medium transition-colors",
                canJump ? "cursor-pointer" : "cursor-default",
                isCurrent ? "text-foreground" : isDone ? "text-foreground/80 hover:text-foreground" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[10px] border",
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary"
                    : isDone
                    ? "bg-primary/10 text-primary border-primary/40"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                {isDone && !isCurrent ? <Check className="h-3 w-3" /> : idx + 1}
              </span>
              <span>{s.label}</span>
            </button>
            {idx < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
