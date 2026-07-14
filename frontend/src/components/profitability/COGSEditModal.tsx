import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProfitabilityProduct } from "@/types/profitability";
import { useCurrency } from "@/contexts/CurrencyContext";

interface COGSEditModalProps {
  product: ProfitabilityProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, newCogs: number) => void;
}

export function COGSEditModal({ product, isOpen, onClose, onSave }: COGSEditModalProps) {
  const { formatCurrency } = useCurrency();
  const [cogsValue, setCogsValue] = useState("");

  const handleOpen = () => {
    if (product) setCogsValue(product.cogs.toString());
  };

  const handleSave = () => {
    if (product && cogsValue) {
      onSave(product.id, parseFloat(cogsValue));
      onClose();
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); else handleOpen(); }}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-base">Edit COGS</DialogTitle>
          <DialogDescription className="sr-only">Edit cost of goods sold for this product</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="h-12 w-12 rounded-md border border-border object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{product.itemId}</span>
                <span>•</span>
                <span>{product.sku}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
            <span className="text-sm text-muted-foreground">Current COGS</span>
            <span className="font-medium text-foreground">{formatCurrency(product.cogs)}</span>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">New COGS Value</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={cogsValue}
              onChange={(e) => setCogsValue(e.target.value)}
              placeholder="Enter new COGS..."
              className="h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!cogsValue || parseFloat(cogsValue) < 0}>
            Change Cost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
