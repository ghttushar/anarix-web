import { useNavigate } from "react-router-dom";
import { ExternalLink, Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShortcutEditor } from "@/features/shortcuts/ShortcutEditor";

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 font-heading">
            <Keyboard className="h-4 w-4 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Click the edit icon to rebind. Changes save instantly and sync everywhere.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-5">
            <ShortcutEditor compact />
          </div>
        </ScrollArea>
        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              navigate("/settings/appearance#shortcuts");
            }}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open in Preferences
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
