import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Megaphone, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { useAccounts } from "@/contexts/AccountContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import logoFull from "@/assets/logo-light-full.svg";
import logoWhite from "@/assets/logo-dark-full.svg";
// Walmart logo
const WalmartLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" />
  </svg>
);

const connectionOptions = [
  {
    id: "connect",
    title: "Walmart Connect",
    description: "Connect your Walmart Connect advertising account to manage Sponsored Search and Display campaigns.",
    icon: Megaphone,
    color: "bg-blue-100 text-blue-600",
    accountType: "connect" as const,
  },
  {
    id: "marketplace",
    title: "Walmart Marketplace",
    description: "Connect your Walmart Marketplace seller account to sync orders, inventory, and catalog data.",
    icon: ShoppingCart,
    color: "bg-green-100 text-green-600",
    accountType: "marketplace" as const,
  },
];


const breadcrumbItems = [
  { label: "Settings", href: "/settings/accounts" },
  { label: "Connect Walmart" },
];
export default function ConnectWalmart() {
  const navigate = useNavigate();
  const { addAccount, isOnboarding } = useAccounts();
  const { resolvedTheme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;

  const handleConnect = async () => {
    if (!selectedOption || !merchantName || !merchantId) return;

    setIsConnecting(true);
    
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const option = connectionOptions.find((o) => o.id === selectedOption);
    
    addAccount({
      marketplace: "walmart",
      accountType: option?.accountType || "marketplace",
      merchantName,
      merchantId,
      region: "US",
      status: "connected",
      lastSync: new Date().toISOString(),
      bidAutomation: "ai",
    });

    toast.success("Walmart account connected successfully!");
    
    if (isOnboarding) {
      navigate("/onboarding/connect");
    } else {
      navigate("/settings/accounts");
    }
  };

  const breadcrumbItems = isOnboarding
    ? [
        { label: "Onboarding", href: "/onboarding/connect" },
        { label: "Connect Walmart" },
      ]
    : [
        { label: "Settings", href: "/settings/appearance" },
        { label: "Accounts", href: "/settings/accounts" },
        { label: "Connect Walmart" },
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <img src={logoSrc} alt="Anarix" className="h-8 w-auto" />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Breadcrumb */}
        <PageBreadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 mb-4">
            <WalmartLogo className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
            Accelerate Your Growth on Walmart
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect your Walmart account to unlock advertising insights and marketplace automation.
          </p>
        </div>

        {/* Connection options */}
        <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
          {connectionOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={cn(
                "relative rounded-xl border-2 p-5 text-left transition-all duration-200",
                selectedOption === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              {selectedOption === option.id && (
                <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4", option.color)}>
                <option.icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-foreground mb-1">{option.title}</h3>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </button>
          ))}
        </div>

        {/* Connection form */}
        {selectedOption && (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
              <Label htmlFor="merchantName">Seller Name</Label>
              <Input
                id="merchantName"
                placeholder="Your store name"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchantId">Partner ID</Label>
              <Input
                id="merchantId"
                placeholder="e.g., 123456789"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Find this in your Walmart Seller Center
              </p>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleConnect}
              disabled={!merchantName || !merchantId || isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Walmart Account"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
