import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Store, MoreVertical, RefreshCw, Trash2, ExternalLink, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { useAccounts, ConnectedAccount, AccountGroup, AccountRegion, AMAZON_REGIONS } from "@/contexts/AccountContext";
import { toast } from "sonner";

const WalmartLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" />
  </svg>
);

function StatusDot({ status, size = "h-1.5 w-1.5" }: { status: string; size?: string }) {
  const colors: Record<string, string> = {
    connected: "bg-emerald-500",
    syncing: "bg-amber-500 animate-pulse",
    error: "bg-destructive",
  };
  return <div className={cn(size, "rounded-full shrink-0", colors[status] || colors.connected)} />;
}

function AccountCard({ account, onSync, onRemove }: {
  account: ConnectedAccount;
  onSync: () => void;
  onRemove: () => void;
}) {
  const isAmazon = account.marketplace === "amazon";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
              isAmazon ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
            )}>
              {isAmazon ? <Store className="h-6 w-6" /> : <WalmartLogo className="h-6 w-6" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground">{account.merchantName}</h3>
              <p className="text-sm text-muted-foreground">
                {account.marketplace === "amazon" ? "Amazon" : "Walmart"} • {account.accountType === "seller" ? "Seller" : account.accountType === "vendor" ? "Vendor" : "Ads"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {account.region}
                </Badge>
                <StatusDot status={account.status} />
                <span className="text-xs text-muted-foreground capitalize">{account.status}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0" title="More options">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSync}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View in {isAmazon ? "Seller Central" : "Walmart"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onRemove} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Bid Automation</p>
            <p className="text-xs text-muted-foreground">AI-powered bid optimization</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={account.bidAutomation === "ai"} />
            <Badge variant={account.bidAutomation === "ai" ? "default" : "secondary"} className="text-xs">
              {account.bidAutomation?.toUpperCase() || "OFF"}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Data Sync</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Advertising ID</p>
              <p className="font-mono text-xs">{account.merchantId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Sync</p>
              <p className="text-xs">
                {account.lastSync
                  ? new Date(account.lastSync).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegionCard({ region, group, onSync, onRemove }: {
  region: AccountRegion;
  group: AccountGroup;
  onSync: () => void;
  onRemove: () => void;
}) {
  const regionLabel = AMAZON_REGIONS.find((r) => r.value === region.region);

  return (
    <div className="flex items-center justify-between py-2.5 px-4 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{regionLabel?.label || region.region}</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{region.region}</Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{region.merchantId}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusDot status={region.status} size="h-2 w-2" />
        <span className="text-xs text-muted-foreground capitalize">{region.status}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSync}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onRemove} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function AmazonGroupCard({ group, regions, onSyncRegion, onRemoveRegion, onAddRegion }: {
  group: AccountGroup;
  regions: AccountRegion[];
  onSyncRegion: (id: string) => void;
  onRemoveRegion: (id: string) => void;
  onAddRegion: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Store className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1.5"
                >
                  {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h3 className="font-medium text-foreground">{group.name}</h3>
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Amazon • {group.accountType === "seller" ? "Seller" : group.accountType === "vendor" ? "Vendor" : "Ads"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {regions.length} region{regions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border">
          <div className="p-2">
            {regions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                group={group}
                onSync={() => onSyncRegion(region.id)}
                onRemove={() => onRemoveRegion(region.id)}
              />
            ))}
          </div>

          <div className="border-t border-border p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-1.5 text-xs text-muted-foreground"
              onClick={onAddRegion}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Region
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const breadcrumbItems = [
  { label: "Settings", href: "/settings/accounts" },
  { label: "Accounts" },
];

export default function Accounts() {
  const navigate = useNavigate();
  const { accounts, removeAccount, updateAccount, accountGroups, accountRegions, addRegionToGroup, removeRegion, updateRegion } = useAccounts();
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [addRegionDialogOpen, setAddRegionDialogOpen] = useState(false);
  const [addRegionGroup, setAddRegionGroup] = useState<string | null>(null);
  const [newRegion, setNewRegion] = useState("US");
  const [newRegionMerchantId, setNewRegionMerchantId] = useState("");
  const [deleteRegionTarget, setDeleteRegionTarget] = useState<string | null>(null);
  const [deleteRegionDialogOpen, setDeleteRegionDialogOpen] = useState(false);

  const handleSelectMarketplace = (marketplace: "amazon" | "walmart") => {
    setShowMarketplaceModal(false);
    navigate(`/settings/accounts/connect/${marketplace}`);
  };

  const handleSync = (id: string) => {
    updateAccount(id, { status: "syncing" });
    toast.info("Syncing account data...");
    setTimeout(() => {
      updateAccount(id, {
        status: "connected",
        lastSync: new Date().toISOString()
      });
      toast.success("Account synced successfully");
    }, 2000);
  };

  const handleRemoveClick = (id: string) => {
    setAccountToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (accountToDelete) {
      removeAccount(accountToDelete);
      toast.success("Account disconnected");
      setAccountToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSyncRegion = (id: string) => {
    updateRegion(id, { status: "syncing" });
    toast.info("Syncing region data...");
    setTimeout(() => {
      updateRegion(id, {
        status: "connected",
        lastSync: new Date().toISOString()
      });
      toast.success("Region synced successfully");
    }, 2000);
  };

  const handleRemoveRegionClick = (id: string) => {
    setDeleteRegionTarget(id);
    setDeleteRegionDialogOpen(true);
  };

  const handleConfirmRemoveRegion = () => {
    if (deleteRegionTarget) {
      removeRegion(deleteRegionTarget);
      toast.success("Region disconnected");
      setDeleteRegionTarget(null);
    }
    setDeleteRegionDialogOpen(false);
  };

  const handleOpenAddRegion = (groupId: string) => {
    setAddRegionGroup(groupId);
    setNewRegion("US");
    setNewRegionMerchantId("");
    setAddRegionDialogOpen(true);
  };

  const handleConfirmAddRegion = () => {
    if (!addRegionGroup || !newRegionMerchantId) return;
    const group = accountGroups.find((g) => g.id === addRegionGroup);
    if (!group) return;
    addRegionToGroup({
      groupId: addRegionGroup,
      region: newRegion,
      merchantName: `${group.name} ${newRegion}`,
      merchantId: newRegionMerchantId,
      status: "connected",
      lastSync: new Date().toISOString(),
      bidAutomation: "ai",
    });
    toast.success("Region added successfully");
    setAddRegionDialogOpen(false);
    setAddRegionGroup(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />

        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">Connected Accounts</h1>
          <p className="text-sm text-muted-foreground">Manage your marketplace connections and data sync settings</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* Amazon groups */}
          {accountGroups.map((group) => {
            const regions = accountRegions.filter((r) => r.groupId === group.id);
            return (
              <AmazonGroupCard
                key={group.id}
                group={group}
                regions={regions}
                onSyncRegion={handleSyncRegion}
                onRemoveRegion={handleRemoveRegionClick}
                onAddRegion={() => handleOpenAddRegion(group.id)}
              />
            );
          })}

          {/* Non-Amazon account cards */}
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onSync={() => handleSync(account.id)}
              onRemove={() => handleRemoveClick(account.id)}
            />
          ))}

          {/* Add Account card */}
          <button
            onClick={() => setShowMarketplaceModal(true)}
            className={cn(
              "rounded-xl border-2 border-dashed border-border bg-card/50",
              "flex flex-col items-center justify-center gap-3 min-h-[240px]",
              "text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card",
              "transition-all duration-200"
            )}
          >
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-7 w-7" />
            </div>
            <span className="font-medium">Add Account</span>
          </button>
        </div>
      </div>

      {/* Marketplace Selection Modal */}
      <Dialog open={showMarketplaceModal} onOpenChange={setShowMarketplaceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Marketplace</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => handleSelectMarketplace("amazon")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-xl border border-border",
                "hover:border-primary hover:bg-primary/5 transition-all duration-200"
              )}
            >
              <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Store className="h-8 w-8 text-orange-600" />
              </div>
              <span className="font-medium text-foreground">Amazon</span>
            </button>

            <button
              onClick={() => handleSelectMarketplace("walmart")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-xl border border-border",
                "hover:border-primary hover:bg-primary/5 transition-all duration-200"
              )}
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <WalmartLogo className="h-8 w-8 text-blue-600" />
              </div>
              <span className="font-medium text-foreground">Walmart</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Region Dialog */}
      <Dialog open={addRegionDialogOpen} onOpenChange={setAddRegionDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Region</DialogTitle>
            <DialogDescription>
              Add a new marketplace region to this account group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-region">Region</Label>
              <Select value={newRegion} onValueChange={setNewRegion}>
                <SelectTrigger id="new-region">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AMAZON_REGIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label} ({r.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-region-merchant-id">Merchant ID</Label>
              <Input
                id="new-region-merchant-id"
                placeholder="e.g., A1B2C3D4E5F6G7"
                value={newRegionMerchantId}
                onChange={(e) => setNewRegionMerchantId(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleConfirmAddRegion}
              disabled={!newRegionMerchantId}
            >
              Add Region
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect this account? All associated data sync settings will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="bg-destructive hover:bg-destructive/90">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Region Confirmation Dialog */}
      <AlertDialog open={deleteRegionDialogOpen} onOpenChange={setDeleteRegionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Region</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect this region? This will remove the data sync for this marketplace region.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemoveRegion} className="bg-destructive hover:bg-destructive/90">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
