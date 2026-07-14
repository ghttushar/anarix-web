import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import {
  GESTURES,
  GESTURE_ACTIONS,
  useGestures,
  type GestureKey,
  type GestureActionId,
} from "@/contexts/GestureContext";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DIR_ICON = { up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight };

function GestureTile({ gestureKey }: { gestureKey: GestureKey }) {
  const { bindings, setBinding, lastTriggered } = useGestures();
  const gesture = GESTURES.find((g) => g.key === gestureKey)!;
  const Icon = DIR_ICON[gesture.direction];
  const isLastFired = lastTriggered?.key === gestureKey && Date.now() - lastTriggered.at < 1500;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 transition-colors",
        isLastFired ? "border-primary shadow-sm" : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
            <span className="text-[11px] font-bold text-primary">{gesture.fingers}F</span>
          </div>
          <Icon className="h-4 w-4 text-foreground" />
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-foreground">{gesture.label}</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mb-2 leading-snug">{gesture.hint}</p>
      <Select
        value={bindings[gestureKey]}
        onValueChange={(v) => setBinding(gestureKey, v as GestureActionId)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {GESTURE_ACTIONS.map((a) => (
            <SelectItem key={a.id} value={a.id} className="text-xs">
              {a.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function GestureMapper() {
  const { enabled, setEnabled, resetBindings, lastTriggered } = useGestures();
  const lastAction = lastTriggered
    ? GESTURE_ACTIONS.find((a) => a.id === lastTriggered.action)?.label
    : null;
  const lastGesture = lastTriggered
    ? GESTURES.find((g) => g.key === lastTriggered.key)?.label
    : null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground">Enable gestures</p>
          <p className="text-xs text-muted-foreground">
            Master switch. Disables all swipes and multi-finger actions.
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", !enabled && "opacity-40 pointer-events-none")}>
        {GESTURES.map((g) => (
          <GestureTile key={g.key} gestureKey={g.key} />
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-foreground">Last gesture detected</p>
            <p className="text-xs text-muted-foreground">
              {lastTriggered
                ? `${lastGesture} → ${lastAction}`
                : "Try a gesture to confirm it's working."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetBindings}>
            <RotateCcw className="h-3 w-3 mr-1.5" />
            Reset bindings
          </Button>
        </div>
      </div>
    </div>
  );
}
