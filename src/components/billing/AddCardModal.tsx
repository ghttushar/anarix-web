import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (card: { last4: string; brand: string; exp: string; name: string }) => void;
}

export function AddCardModal({ open, onClose, onSave }: AddCardModalProps) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  const handleSave = () => {
    if (number.length < 12 || !name || !exp || cvc.length < 3) {
      toast.error("Please complete all card details.");
      return;
    }
    const last4 = number.replace(/\s/g, "").slice(-4);
    onSave({ last4, brand: "Visa", exp, name });
    setNumber(""); setName(""); setExp(""); setCvc("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new payment method</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card number</Label>
            <Input id="card-number" placeholder="4242 4242 4242 4242" value={number} onChange={(e) => setNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-name">Name on card</Label>
            <Input id="card-name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="card-exp">Expiry</Label>
              <Input id="card-exp" placeholder="MM/YY" value={exp} onChange={(e) => setExp(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-cvc">CVC</Label>
              <Input id="card-cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
