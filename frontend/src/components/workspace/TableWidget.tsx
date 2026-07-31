import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockData = [
  { name: "SP | Catch All Brand", spend: "$3,245", sales: "$10,812", roas: "3.33", status: "Live" },
  { name: "SP | New Victory Launch", spend: "$1,923", sales: "$8,078", roas: "4.20", status: "Live" },
  { name: "SP | Generic Keywords", spend: "$2,876", sales: "$5,177", roas: "1.80", status: "Paused" },
  { name: "SP | Competitor Conquest", spend: "$1,543", sales: "$6,789", roas: "4.40", status: "Live" },
  { name: "SP | Retargeting Pool", spend: "$1,385", sales: "$6,098", roas: "4.40", status: "Live" },
];

export function TableWidget() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex-1 overflow-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs">Campaign</TableHead>
              <TableHead className="text-right font-semibold text-xs">Spend</TableHead>
              <TableHead className="text-right font-semibold text-xs">Sales</TableHead>
              <TableHead className="text-right font-semibold text-xs">ROAS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-xs font-medium truncate max-w-[200px]">{row.name}</TableCell>
                <TableCell className="text-right text-xs">{row.spend}</TableCell>
                <TableCell className="text-right text-xs">{row.sales}</TableCell>
                <TableCell className="text-right text-xs font-semibold text-foreground">{row.roas}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <button
        onClick={() => navigate("/advertising/campaigns")}
        className="flex items-center gap-1.5 text-xs text-primary hover:underline self-end"
      >
        <span>Open Full View</span>
        <ExternalLink className="h-3 w-3" />
      </button>
    </div>
  );
}
