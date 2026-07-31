import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Clock, FileText } from "lucide-react";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AVAILABLE_SECTIONS = [
  "Campaign Performance", "Ad Spend Analysis", "ROAS & Conversions",
  "Top Products", "Search Terms", "Recommendations",
  "P&L Summary", "Inventory Status", "Competitor Analysis",
];

const REPORT_TEMPLATES = [
  { id: "performance", label: "Performance", desc: "Campaign metrics, ROAS, conversions" },
  { id: "pnl", label: "P&L", desc: "Revenue, costs, profit margins" },
  { id: "advertising", label: "Advertising", desc: "Ad spend, targeting, search terms" },
  { id: "custom", label: "Custom", desc: "Build your own report" },
];

const SCHEDULE_FREQUENCIES = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-Weekly" },
  { id: "monthly", label: "Monthly" },
];

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface CreateReportPanelProps {
  initialTemplate?: string;
  onSubmit?: (data: {
    name: string;
    clientName: string;
    period: string;
    template: string;
    sections: string[];
    schedule: string | null;
  }) => void;
}

export function CreateReportPanel({ initialTemplate, onSubmit }: CreateReportPanelProps) {
  const { dataPanel, closeDataPanel } = useActivePanel();

  const [reportName, setReportName] = useState("");
  const [clientName, setClientName] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate || "performance");
  const [selectedSections, setSelectedSections] = useState<string[]>(["Campaign Performance", "ROAS & Conversions"]);
  const [enableSchedule, setEnableSchedule] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [scheduleDay, setScheduleDay] = useState("Monday");
  const [scheduleTime, setScheduleTime] = useState("09:00");

  if (dataPanel !== "createReport") return null;

  const handleToggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleCreate = () => {
    if (!reportName.trim() || !period.trim()) {
      toast.error("Please fill in Report Name and Period");
      return;
    }
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }

    const cronStr = enableSchedule ? `${scheduleFrequency} ${scheduleDay} ${scheduleTime}` : null;

    onSubmit?.({
      name: reportName,
      clientName: clientName.trim() || "My Brand",
      period,
      template: selectedTemplate,
      sections: selectedSections,
      schedule: cronStr,
    });

    toast.success(enableSchedule ? "Report scheduled successfully" : "Report created successfully");
    resetForm();
    closeDataPanel();
  };

  const resetForm = () => {
    setReportName("");
    setClientName("");
    setPeriod("");
    setSelectedSections(["Campaign Performance", "ROAS & Conversions"]);
    setSelectedTemplate("performance");
    setEnableSchedule(false);
    setScheduleFrequency("weekly");
    setScheduleDay("Monday");
    setScheduleTime("09:00");
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[320px] bg-card border-l border-border z-40 flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Create Report</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { resetForm(); closeDataPanel(); }}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Template</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {REPORT_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={cn(
                    "rounded-md border p-2.5 text-left text-[11px] transition-all cursor-pointer",
                    selectedTemplate === t.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <FileText className="h-3.5 w-3.5 mb-1" />
                  <p className="font-medium leading-tight">{t.label}</p>
                  <p className="text-muted-foreground mt-0.5 leading-tight">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Report Name */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="rp-name">Report Name <span className="text-destructive">*</span></Label>
            <Input id="rp-name" className="h-8 text-xs" placeholder="e.g., Q1 2026 Performance" value={reportName} onChange={(e) => setReportName(e.target.value)} />
          </div>

          {/* Client Name (optional) */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="rp-client">Client Name <span className="text-muted-foreground text-[10px]">(optional)</span></Label>
            <Input id="rp-client" className="h-8 text-xs" placeholder="Leave blank for personal report" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>

          {/* Period */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="rp-period">Reporting Period <span className="text-destructive">*</span></Label>
            <Input id="rp-period" className="h-8 text-xs" placeholder="e.g., Jan 1 - Mar 31, 2026" value={period} onChange={(e) => setPeriod(e.target.value)} />
          </div>

          {/* Sections */}
          <div className="space-y-2">
            <Label className="text-xs">Report Sections <span className="text-destructive">*</span></Label>
            <div className="space-y-1.5 border border-border rounded-md p-2.5">
              {AVAILABLE_SECTIONS.map((section) => (
                <div key={section} className="flex items-center space-x-2">
                  <Checkbox id={`rp-${section}`} checked={selectedSections.includes(section)} onCheckedChange={() => handleToggleSection(section)} />
                  <label htmlFor={`rp-${section}`} className="text-[11px] leading-none cursor-pointer">{section}</label>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">{selectedSections.length} section{selectedSections.length !== 1 ? "s" : ""} selected</p>
          </div>

          {/* Schedule Builder */}
          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex items-center gap-2">
              <Checkbox id="rp-schedule" checked={enableSchedule} onCheckedChange={(v) => setEnableSchedule(!!v)} />
              <label htmlFor="rp-schedule" className="text-xs font-medium cursor-pointer flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Schedule auto-generation
              </label>
            </div>

            {enableSchedule && (
              <div className="space-y-2 pl-6">
                <div className="space-y-1">
                  <Label className="text-[10px]">Frequency</Label>
                  <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                    <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SCHEDULE_FREQUENCIES.map((f) => (
                        <SelectItem key={f.id} value={f.id} className="text-xs">{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Day</Label>
                  <Select value={scheduleDay} onValueChange={setScheduleDay}>
                    <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((d) => (
                        <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Time</Label>
                  <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="h-7 text-[11px]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { resetForm(); closeDataPanel(); }}>Cancel</Button>
        <Button size="sm" className="h-8 text-xs" onClick={handleCreate}>
          {enableSchedule ? "Schedule Report" : "Create Report"}
        </Button>
      </div>
    </div>
  );
}
