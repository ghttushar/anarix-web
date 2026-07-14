import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X } from "lucide-react";
import { StatusBadge } from "@/components/status/StatusBadge";
import { catalogProducts } from "@/data/mockCatalog";

interface AddProductAdsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StagedProduct {
  id: string;
  name: string;
  image: string;
  itemId: string;
}

export function AddProductAdsModal({ open, onOpenChange }: AddProductAdsModalProps) {
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
    onOpenChange(false);
    setSelectedIds(new Set());
    setStagedProducts([]);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="flex items-center gap-2">
            Add Product
            <span className="text-sm font-normal text-muted-foreground">
              {selectedIds.size}/2,000
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden border-t border-border">
          {/* Left Panel: Product List */}
          <div className="w-1/2 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
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
            <div className="flex-1 overflow-auto p-2 space-y-1">
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
          </div>

          {/* Right Panel: Staged Products */}
          <div className="w-1/2 flex flex-col">
            <div className="p-3 border-b border-border">
              <span className="text-sm font-medium text-foreground">Added Product</span>
            </div>
            <div className="flex-1 overflow-auto">
              {stagedProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  Select products from the left panel
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left px-3 py-2 font-medium">Status</th>
                      <th className="text-left px-3 py-2 font-medium">Product</th>
                      <th className="w-8 px-2 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stagedProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border">
                        <td className="px-3 py-2"><StatusBadge status="live" /></td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <img src={product.image} alt={product.name} className="h-6 w-6 rounded object-cover bg-muted" />
                            <span className="truncate max-w-[260px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <button onClick={() => removeStaged(product.id)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={stagedProducts.length === 0}>
            Add ({stagedProducts.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
