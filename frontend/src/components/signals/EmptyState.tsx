import { Button } from "@/components/ui/button";

export type EmptyVariant =
  | "none"
  | "needs_me"
  | "watching"
  | "search"
  | "permissions"
  | "disconnected"
  | "offline";

const COPY: Record<EmptyVariant, { title: string; cta?: string }> = {
  none: { title: "You're clear. Aan will surface a signal the moment it matters." },
  needs_me: { title: "No signals need your judgment right now." },
  watching: { title: "Nothing on the watchlist. Aan is monitoring quietly." },
  search: { title: "No signals match that search." },
  permissions: { title: "You don't have permission to view these signals.", cta: "Request access" },
  disconnected: { title: "Workspace disconnected.", cta: "Reconnect" },
  offline: { title: "You're offline. Reconnect to load new signals." },
};

export function EmptyState({
  variant = "none",
  headline,
  body,
  onAction,
}: {
  variant?: EmptyVariant;
  headline?: string;
  body?: string;
  onAction?: () => void;
}) {
  const c = COPY[variant];
  return (
    <div className="flex flex-col items-start gap-3 py-16 px-6 text-left">
      <p className="text-[15px] text-foreground/85 max-w-md">
        {headline || c.title}
      </p>
      {body && <p className="text-[13px] text-muted-foreground max-w-md">{body}</p>}
      {c.cta && (
        <Button size="sm" variant="outline" onClick={onAction} className="h-8 text-[12.5px]">
          {c.cta}
        </Button>
      )}
    </div>
  );
}
