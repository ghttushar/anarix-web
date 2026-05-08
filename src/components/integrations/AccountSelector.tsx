import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useAccounts, ConnectedAccount } from "@/contexts/AccountContext";

const MARKETPLACES: { key: ConnectedAccount["marketplace"]; label: string }[] = [
  { key: "amazon", label: "Amazon" },
  { key: "walmart", label: "Walmart" },
  { key: "shopify", label: "Shopify" },
  { key: "tiktok", label: "TikTok" },
];

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function AccountSelector({ selected, onChange }: Props) {
  const { accounts } = useAccounts();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    amazon: true,
    walmart: true,
    shopify: true,
    tiktok: true,
  });

  const grouped = useMemo(() => {
    const map: Record<string, ConnectedAccount[]> = {};
    for (const m of MARKETPLACES) map[m.key] = [];
    for (const a of accounts) (map[a.marketplace] ||= []).push(a);
    return map;
  }, [accounts]);

  const toggleId = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  const toggleAll = (mp: string) => {
    const ids = grouped[mp].map((a) => a.id);
    const allOn = ids.every((id) => selected.includes(id));
    onChange(allOn ? selected.filter((id) => !ids.includes(id)) : Array.from(new Set([...selected, ...ids])));
  };

  return (
    <div className="space-y-2">
      {MARKETPLACES.map((mp) => {
        const group = grouped[mp.key];
        const isOpen = expanded[mp.key];
        const ids = group.map((a) => a.id);
        const onCount = ids.filter((id) => selected.includes(id)).length;
        const allOn = ids.length > 0 && onCount === ids.length;

        return (
          <div key={mp.key} className="border border-border rounded-lg bg-card overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/40">
              <button
                type="button"
                onClick={() => setExpanded((p) => ({ ...p, [mp.key]: !p[mp.key] }))}
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Store className="h-4 w-4 text-muted-foreground" />
                <span>{mp.label}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {group.length === 0 ? "no accounts" : `${onCount}/${group.length} selected`}
                </span>
              </button>
              {group.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleAll(mp.key)}
                  className="text-xs text-primary hover:underline"
                >
                  {allOn ? "Clear all" : "Select all"}
                </button>
              )}
            </div>
            {isOpen && group.length > 0 && (
              <ul className="divide-y divide-border border-t border-border">
                {group.map((a) => {
                  const isOn = selected.includes(a.id);
                  return (
                    <li key={a.id}>
                      <label
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/30",
                          isOn && "bg-primary/5"
                        )}
                      >
                        <Checkbox checked={isOn} onCheckedChange={() => toggleId(a.id)} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground truncate">{a.merchantName}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.region} · {a.accountType} · {a.merchantId}
                          </p>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
            {isOpen && group.length === 0 && (
              <p className="px-3 py-3 text-xs text-muted-foreground border-t border-border">
                No {mp.label} accounts connected. Connect one from Settings → Accounts.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
