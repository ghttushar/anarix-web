import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Eye, ExternalLink, Pencil, Plus } from "lucide-react";
import { mockInvoices, Invoice } from "@/data/mockInvoices";
import { AddCardModal } from "@/components/billing/AddCardModal";
import { useBillingFlow } from "@/contexts/BillingFlowContext";
import { toast } from "sonner";

const TABS = ["invoices", "manage-plans"] as const;
type Tab = typeof TABS[number];

const breadcrumbItems = [
  { label: "Settings" },
  { label: "Billing" },
];

function StatusBadge({ status }: { status: Invoice["status"] }) {
  const variants: Record<Invoice["status"], string> = {
    paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    failed: "bg-red-500/10 text-red-600 border-red-500/20",
    refunded: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${variants[status]}`}>
      {status}
    </span>
  );
}

export default function Billing() {
  const navigate = useNavigate();
  const { tab: routeTab } = useParams<{ tab?: string }>();
  const initialTab: Tab = (routeTab && (TABS as readonly string[]).includes(routeTab)) ? (routeTab as Tab) : "invoices";
  const [tab, setTab] = useState<Tab>(initialTab);
  const { billingFlowEnabled } = useBillingFlow();

  const [card, setCard] = useState({ last4: "4242", brand: "Visa", exp: "12/27", name: "Jane Doe" });
  const [autoRenew, setAutoRenew] = useState(true);
  const [addCardOpen, setAddCardOpen] = useState(false);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    navigate(`/settings/billing/${t}`, { replace: true });
  };

  if (!billingFlowEnabled) {
    return (
      <AppLayout>
        <div className="flex flex-1 h-full min-h-0 min-w-0">
          <div className="flex-1 min-w-0 space-y-6">
            <PageHeader title="Billing" subtitle="Enable Billing Flow in Preferences to access this section." />
            <AppTaskbar breadcrumbItems={breadcrumbItems} />
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                The Billing Flow toggle is currently off. Turn it on to manage invoices, payment methods, and plans.
              </p>
              <Button onClick={() => navigate("/settings/appearance")}>Open Preferences</Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-1 h-full min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6">
          <PageHeader title="Billing" subtitle="Manage invoices, payment methods, and your plan." />
          <AppTaskbar breadcrumbItems={breadcrumbItems}>
            <div className="inline-flex items-center gap-1 border-b border-border">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className={`px-3 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    tab === t
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "invoices" ? "Invoices" : "Manage Plans"}
                </button>
              ))}
            </div>
          </AppTaskbar>

          {tab === "invoices" && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Invoice #</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Plan</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/60 last:border-b-0 hover:bg-muted/20">
                      <td className="py-3 px-4 text-foreground whitespace-nowrap">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-foreground font-mono text-xs">{inv.number}</td>
                      <td className="py-3 px-4 text-foreground">{inv.plan}</td>
                      <td className="py-3 px-4 text-right text-foreground whitespace-nowrap">${inv.amount.toLocaleString()}</td>
                      <td className="py-3 px-4"><StatusBadge status={inv.status} /></td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Opening invoice ${inv.number}`)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${inv.number}.pdf`)}>
                          <Download className="h-3.5 w-3.5 mr-1" /> Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "manage-plans" && (
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Current plan */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Plan</p>
                    <h3 className="text-xl font-bold text-foreground mt-1">Profitability Pro</h3>
                    <p className="text-sm text-muted-foreground">Yearly • $639/mo • Renews May 1, 2027</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => window.open("/website/pricing", "_blank")}>
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> Edit Plan
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      sessionStorage.setItem("anarix-cancel-from-app", "1");
                      navigate("/website/cancel-plan?from=app");
                    }}
                  >
                    Cancel Plan
                  </Button>
                </div>
              </div>

              {/* Payment method */}
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Payment Method</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-14 rounded-md bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{card.brand} •••• {card.last4}</p>
                    <p className="text-xs text-muted-foreground">Exp {card.exp} · {card.name}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setAddCardOpen(true)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="mb-4" onClick={() => setAddCardOpen(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add new card
                </Button>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-renew</p>
                    <p className="text-xs text-muted-foreground">Automatically renew your plan when it expires.</p>
                  </div>
                  <Switch checked={autoRenew} onCheckedChange={(v) => { setAutoRenew(v); toast.success(v ? "Auto-renew on" : "Auto-renew off"); }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddCardModal
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        onSave={(c) => { setCard(c); toast.success("Card updated"); }}
      />
    </AppLayout>
  );
}
