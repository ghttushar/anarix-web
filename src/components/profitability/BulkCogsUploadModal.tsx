import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileText,
  Info,
  AlertTriangle,
  Loader2,
  FileCheck2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "upload" | "selected" | "auditing" | "summary" | "success";

interface ConflictRow {
  productName: string;
  asin: string;
  cogs: string;
  reason: string;
}

const MOCK_CONFLICTS: ConflictRow[] = [
  { productName: "NapQueen 5 Inch Twin Mattress", asin: "B0BRTSG12435", cogs: "$20", reason: "SKU and ASIN does not match the product" },
  { productName: "NapQueen 6 Inch Queen Mattress", asin: "B0BRTSG12436", cogs: "$20", reason: "ASIN is incorrect" },
  { productName: "NapQueen 8 Inch King Mattress", asin: "B0BRTSG12437", cogs: "$20", reason: "SKU and ASIN does not match the product" },
  { productName: "NapQueen Full Mattress Cooling", asin: "B0BRTSG12438", cogs: "$20", reason: "SKU and ASIN does not match the product" },
  { productName: "NapQueen Maxima 8 Inch Hybrid", asin: "B0BRTSG12439", cogs: "$20", reason: "SKU and ASIN does not match the product" },
];

interface BulkCogsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkCogsUploadModal({ isOpen, onClose }: BulkCogsUploadModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep("upload");
    setFile(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5 MB.");
      return;
    }
    setFile(f);
    setStep("selected");
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleUpload = () => {
    setStep("auditing");
    setTimeout(() => {
      // Deterministic mock — show conflicts summary
      setStep("summary");
    }, 2400);
  };

  const handleContinueFromSummary = () => {
    setStep("success");
  };

  const downloadTemplate = () => {
    toast.success("COGs template download started");
  };

  const downloadReport = () => {
    toast.success("Conflict report download started");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-[640px]">
        {step === "upload" && (
          <UploadView
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            inputRef={inputRef}
            handleFiles={handleFiles}
            downloadTemplate={downloadTemplate}
            onClose={handleClose}
          />
        )}

        {step === "selected" && file && (
          <SelectedView
            file={file}
            formatBytes={formatBytes}
            onClear={reset}
            onClose={handleClose}
            onUpload={handleUpload}
          />
        )}

        {step === "auditing" && <AuditingView />}

        {step === "summary" && (
          <SummaryView
            onClose={handleClose}
            onDownloadReport={downloadReport}
            onContinue={handleContinueFromSummary}
          />
        )}

        {step === "success" && <SuccessView onContinue={handleClose} />}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- Sub-views -------------------- */

function UploadView({
  isDragging,
  setIsDragging,
  inputRef,
  handleFiles,
  downloadTemplate,
  onClose,
}: {
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  handleFiles: (files: FileList | null) => void;
  downloadTemplate: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-1.5 text-base">
          Add/Update Bulk COGs
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[260px]">
                You can only upload COGs in Bulk. To upload product level COGs,
                click on "COGs" in product table.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTitle>
        <DialogDescription className="sr-only">
          Upload bulk cost of goods sold data
        </DialogDescription>
      </DialogHeader>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-12 cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:bg-muted/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.csv,.xls"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="rounded-md border border-border bg-card p-2">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-foreground">
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadTemplate();
            }}
            className="text-primary hover:underline cursor-pointer"
          >
            Download Template
          </button>{" "}
          for bulk COGs upload
        </p>
        <p className="text-[11px] text-muted-foreground">XLSX format | 5 MB max</p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Button variant="ghost" size="sm" disabled className="text-xs">
          Clear and Upload again
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" disabled>
            Upload Bulk COGs
          </Button>
        </div>
      </div>
    </>
  );
}

function SelectedView({
  file,
  formatBytes,
  onClear,
  onClose,
  onUpload,
}: {
  file: File;
  formatBytes: (n: number) => string;
  onClear: () => void;
  onClose: () => void;
  onUpload: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-base">Add/Update Bulk COGs</DialogTitle>
        <DialogDescription className="sr-only">
          Confirm and upload the selected file
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-lg border border-border p-4 min-h-[200px]">
        <div className="grid grid-cols-[1fr_120px] gap-2 text-[11px] text-muted-foreground pb-2 border-b border-border">
          <span>File Name:</span>
          <span className="text-right">File Size:</span>
        </div>
        <div className="grid grid-cols-[1fr_120px] gap-2 items-center pt-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span
              className="text-sm text-foreground truncate"
              title={file.name}
            >
              {file.name}
            </span>
          </div>
          <span className="text-sm text-foreground text-right tabular-nums">
            {formatBytes(file.size)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Button variant="ghost" size="sm" onClick={onClear} className="text-xs">
          Clear and Upload again
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" onClick={onUpload}>
            Upload Bulk COGs
          </Button>
        </div>
      </div>
    </>
  );
}

function AuditingView() {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="sr-only">Auditing COGs</DialogTitle>
        <DialogDescription className="sr-only">
          We are checking your uploaded data for conflicts.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="relative">
          <div className="rounded-full border border-primary/20 bg-primary/5 p-4">
            <Loader2 className="h-7 w-7 text-primary animate-spin" />
          </div>
        </div>
        <p className="text-sm font-medium text-foreground max-w-[360px]">
          COGs Uploaded data is being auditing for conflicts.
          <br />
          Please wait for few seconds.
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">Note: </span>
          Do not switch page or close tab or the data will get lost.
        </p>
      </div>
    </>
  );
}

function SummaryView({
  onClose,
  onDownloadReport,
  onContinue,
}: {
  onClose: () => void;
  onDownloadReport: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-base text-warning">
          <AlertTriangle className="h-4 w-4" />
          Bulk COGs Upload Summary
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground pt-1">
          <span className="font-semibold text-foreground">100 COGs rows</span>{" "}
          has been processed.{" "}
          <span className="font-semibold text-foreground">
            72 COGs are successfully processed
          </span>{" "}
          and{" "}
          <span className="font-semibold text-foreground">18 conflicts</span>{" "}
          has been found which are shown below.
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-lg border border-border max-h-[280px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10 hover:bg-primary/10">
              <TableHead className="text-[11px]">Product Name</TableHead>
              <TableHead className="text-[11px]">ASIN</TableHead>
              <TableHead className="text-[11px]">COGs</TableHead>
              <TableHead className="text-[11px]">Reason of Conflict</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CONFLICTS.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="text-xs">{row.productName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{row.asin}</TableCell>
                <TableCell className="text-xs">{row.cogs}</TableCell>
                <TableCell className="text-xs">{row.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Report has been generated. You can download the report and make the
        changes in the file and upload again.
      </p>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" onClick={onDownloadReport} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Download CSV Report
        </Button>
        <Button size="sm" variant="ghost" onClick={onContinue} className="text-xs">
          Continue
        </Button>
      </div>
    </>
  );
}

function SuccessView({ onContinue }: { onContinue: () => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="sr-only">COGs updated</DialogTitle>
        <DialogDescription className="sr-only">
          Audit complete and data updated
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="rounded-full border border-success/30 bg-success/10 p-4">
          <FileCheck2 className="h-7 w-7 text-success" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          72 COGs have been audited and updated successfully
        </p>
        <p className="text-xs text-muted-foreground max-w-[320px]">
          You can visit and check the COGs data in Profitability and Catalogue now.
        </p>
        <Button onClick={onContinue} className="mt-1">
          Continue
        </Button>
      </div>
    </>
  );
}
