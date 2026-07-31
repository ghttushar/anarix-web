import { Bell, ShieldCheck, Zap } from "lucide-react";

export function WhatsAppPurposeInfo() {
  const items = [
    { icon: Bell, label: "Real-time alerts", text: "ACoS spikes, stockouts, rule triggers — pushed the moment they happen." },
    { icon: Zap, label: "Daily digests", text: "Morning recap of yesterday's profitability and pacing for chosen accounts." },
    { icon: ShieldCheck, label: "You stay in control", text: "Anarix never replies on your behalf. Mute, edit, or remove anytime." },
  ];
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">What WhatsApp will be used for</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Anarix sends operational alerts to the number you connect. No marketing, no chat replies.
        </p>
      </div>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.label} className="flex items-start gap-2.5">
            <it.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">{it.label}</p>
              <p className="text-xs text-muted-foreground">{it.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
