import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Store, MoreVertical, RefreshCw, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { useAccounts, ConnectedAccount } from "@/contexts/AccountContext";
import { toast } from "sonner";
// Walmart logo
const WalmartLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" />
  </svg>
);

function AccountCard({ account, onSync, onRemove }: { 
  account: ConnectedAccount; 
  onSync: () => void;
  onRemove: () => void;
}) {
  const isAmazon = account.marketplace === "amazon";
  
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
              isAmazon ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
            )}>
              {isAmazon ? (
                <Store className="h-6 w-6" />
              ) : (
                <WalmartLogo className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground">{account.merchantName}</h3>
              <p className="text-sm text-muted-foreground">
                {account.marketplace === "amazon" ? "Amazon" : "Walmart"} • {account.accountType === "seller" ? "Seller" : "Vendor"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {account.region}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    account.status === "connected" ? "bg-success" : 
                    account.status === "syncing" ? "bg-warning animate-pulse" : "bg-destructive"
                  )} />
                  <span className="text-xs text-muted-foreground capitalize">{account.status}</span>
                </div>
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
                View in {account.marketplace === "amazon" ? "Seller Central" : "Walmart"}
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

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Bid Automation */}
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

        {/* Data Sync */}
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
                  : "Never"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const breadcrumbItems = [
  { label: "Settings", href: "/settings/accounts" },
  { label: "Accounts" },
];
export default function Accounts() {
  const navigate = useNavigate();
  const { accounts, removeAccount, updateAccount } = useAccounts();
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const handleSelectMarketplace = (marketplace: "amazon" | "walmart") => {
    setShowMarketplaceModal(false);
    navigate(`/settings/accounts/connect/${marketplace}`);
  };

  const handleSync = (id: string) => {
    updateAccount(id, { status: "syncing" });
    toast.info("Syncing account data...");
    
    // Simulate sync
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />

        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">Connected Accounts</h1>
          <p className="text-sm text-muted-foreground">Manage your marketplace connections and data sync settings</p>
        </div>

        {/* Account cards grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      {/* Delete Confirmation Dialog */}
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
</AppLayout>
  );
}
