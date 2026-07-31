import { cn } from "@/lib/utils";

interface ProductsOrdersToggleProps {
  activeTab: "products" | "orders";
  onTabChange: (tab: "products" | "orders") => void;
}

export function ProductsOrdersToggle({ activeTab, onTabChange }: ProductsOrdersToggleProps) {
  return (
    <div className="flex rounded-full border border-border bg-muted/50 p-0.5 w-fit">
      <button
        onClick={() => onTabChange("products")}
        className={cn(
          "rounded-full px-4 py-1 text-xs font-medium transition-colors",
          activeTab === "products"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Products
      </button>
      <button
        onClick={() => onTabChange("orders")}
        className={cn(
          "rounded-full px-4 py-1 text-xs font-medium transition-colors",
          activeTab === "orders"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Orders
      </button>
    </div>
  );
}
