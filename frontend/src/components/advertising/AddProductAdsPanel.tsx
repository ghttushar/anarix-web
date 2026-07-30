import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { getCatalogProducts } from "@/services/catalog.service";
import { useActivePanel } from "@/contexts/ActivePanelContext";

interface StagedProduct {
  id: string;
  name: string;
  image: string;
  itemId: string;
}

export function AddProductAdsPanel() {
  const { dataPanel, closeDataPanel } = useActivePanel();
  const isOpen = dataPanel === "addProductAd";

  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [stagedProducts, setStagedProducts] = useState<StagedProduct[]>([]);

  useEffect(() => {
    getCatalogProducts(1, 200).then((res) => setCatalogProducts(res.data)).catch(() => setCatalogProducts([]));
  }, []);

  const filteredProducts = catalogProducts.filter((p: any) =>
    (p.itemName || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.asin || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleProduct = (product: (typeof catalogProducts)[0]) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(product.asin)) {
      newSelected.delete(product.asin);
      setStagedProducts((prev) => prev.filter((p) => p.id !== product.asin));
    } else {
      newSelected.add(product.asin);
      setStagedProducts((prev) => [
        ...prev,
        {
          id: product.asin,
          name: product.itemName,
          image: product.imageUrl,
          itemId: product.asin,
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
              key={product.asin}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedIds.has(product.asin)}
                onCheckedChange={() => toggleProduct(product)}
              />
              <img
                src={product.imageUrl}
                alt={product.itemName}
                className="h-8 w-8 rounded object-cover bg-muted"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-foreground truncate">{product.itemName}</span>
                <span className="text-xs text-muted-foreground">{product.asin}</span>
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
