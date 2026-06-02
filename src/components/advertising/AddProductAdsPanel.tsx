import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { StatusBadge } from "@/components/status/StatusBadge";
import { catalogProducts } from "@/data/mockCatalog";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";

interface StagedProduct {
  id: string;
  name: string;
  image: string;
  itemId: string;
  suggestedBid: number;
  bid: number;
}

export function AddProductAdsPanel() {
  const { formatCurrency } = useCurrency();
  const { dataPanel, closeDataPanel } = useActivePanel();
  const isOpen = dataPanel === "addProductAd";

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [stagedProducts, setStagedProducts] = useState<StagedProduct[]>([]);

  const filteredProducts = catalogProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.itemId.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProduct = (product: typeof catalogProducts[0]) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(product.id)) {
      newSelected.delete(product.id);
      setStagedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      newSelected.add(product.id);
      setStagedProducts((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          itemId: product.itemId,
          suggestedBid: 0.75,
          bid: 0.75,
        },
      ]);
    }
    setSelectedIds(newSelected);
  };

  const removeStaged = (id: string) => {
    setStagedProducts((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateBid = (id: string, bid: number) => {
    setStagedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bid } : p))
    );
  };

  const handleAdd = () => {
    closeDataPanel();
    setSelectedIds(new Set());
    setStagedProducts([]);
    setSearch("");
  };

  if (!isOpen) return null;

  return (
    <div className="w-[360px] shrink-0 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          Add Product Ad
          <span className="text-xs font-normal text-muted-foreground">
            {selectedIds.size}/2,000
          </span>
        </h3>
        <button onClick={closeDataPanel} className="p-1 rounded hover:bg-muted transition-colors cursor-pointer">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Product List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          {filteredProducts.map((product) => (
            <label
              key={product.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedIds.has(product.id)}
                onCheckedChange={() => toggleProduct(product)}
              />
              <img
                src={product.image}
                alt={product.name}
                className="h-8 w-8 rounded object-cover bg-muted"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-foreground truncate">{product.name}</span>
                <span className="text-xs text-muted-foreground">{product.itemId}</span>
              </div>
            </label>
          ))}
        </div>
      </ScrollArea>

      {/* Staged Products */}
      {stagedProducts.length > 0 && (
        <div className="border-t border-border shrink-0">
          <div className="px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-foreground">
              Added ({stagedProducts.length})
            </span>
          </div>
          <ScrollArea className="max-h-[200px]">
            <div className="p-2 space-y-1">
              {stagedProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                  <img src={product.image} alt={product.name} className="h-6 w-6 rounded object-cover bg-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-foreground truncate block">{product.name}</span>
                    <span className="text-[10px] text-muted-foreground">{product.itemId}</span>
                  </div>
                  <button onClick={() => removeStaged(product.id)} className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
        <Button variant="ghost" size="sm" onClick={closeDataPanel}>Cancel</Button>
        <Button size="sm" onClick={handleAdd} disabled={stagedProducts.length === 0}>
          Add ({stagedProducts.length})
        </Button>
      </div>
    </div>
  );
}
