import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ruleTemplates, appliedRules, metricOptions, operatorOptions, actionOptions } from "@/data/mockRules";
import type { AppliedRule } from "@/data/mockRules";
import { Plus, Pause, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabletDataTable } from "../../data/TabletDataTable";
import { TabletTableToolbar } from "../../data/TabletTableToolbar";
import type { TabletColumn } from "../../data/types";
import { TouchTarget } from "../../primitives/TouchTarget";

export function TabletRuleAgents() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Rule Agents</h1>
        <Button className="h-12" onClick={() => navigate("/tablet/advertising/rules/create")}>
          <Plus className="h-4 w-4 mr-2" /> Create Rule
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ruleTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/tablet/advertising/rules/create/${t.id}`)}
            className="text-left rounded-md border border-border bg-card p-4 min-h-[88px]"
          >
            <div className="text-sm font-semibold mb-1">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.description}</div>
            <div className="text-[11px] uppercase mt-2 text-muted-foreground">{t.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TabletAppliedRules() {
  const navigate = useNavigate();
  const cols: TabletColumn<AppliedRule>[] = [
    { id: "name", header: "Rule", sticky: true, sortable: true, cell: (r) => <span className="font-medium">{r.name}</span> },
    { id: "status", header: "Status", cell: (r) => (
      <span className={`text-xs rounded px-2 py-0.5 ${r.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
        {r.status}
      </span>
    )},
    { id: "scope", header: "Scope", cell: (r) => r.scope },
    { id: "triggered", header: "Triggered", align: "right", sortable: true, cell: (r) => r.timesTriggered },
    { id: "last", header: "Last Run", cell: (r) => r.lastRun },
    {
      id: "actions", header: "Actions",
      cell: (r) => (
        <div className="flex gap-1">
          <TouchTarget aria-label={r.status === "active" ? "Pause" : "Resume"} className="h-10 w-10">
            {r.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </TouchTarget>
          <TouchTarget aria-label="Delete" className="h-10 w-10 text-destructive">
            <Trash2 className="h-4 w-4" />
          </TouchTarget>
          <Button variant="outline" size="sm" className="h-10" onClick={() => navigate(`/tablet/advertising/rules/edit/${r.id}`)}>Edit</Button>
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <TabletDataTable
        rows={appliedRules}
        columns={cols}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Applied Rules" />}
      />
    </div>
  );
}

export function TabletRuleCreation() {
  const { templateId, ruleId } = useParams();
  const navigate = useNavigate();
  const template = ruleTemplates.find((t) => t.id === templateId);
  const editing = appliedRules.find((r) => r.id === ruleId);
  const [name, setName] = useState(editing?.name ?? template?.name ?? "");
  const [metric, setMetric] = useState("ACOS");
  const [op, setOp] = useState(">=");
  const [value, setValue] = useState("30");
  const [action, setAction] = useState("decrease_bid");

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <h1 className="text-lg font-semibold">{editing ? "Edit Rule" : "Create Rule"}</h1>
      <div className="flex-1 min-h-0 overflow-y-auto rounded-md border border-border bg-card p-4 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">When</label>
          <div className="grid grid-cols-3 gap-2">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                {metricOptions.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={op} onValueChange={setOp}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                {operatorOptions.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-12" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Then</label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {actionOptions.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
          Preview is shown before applying — destructive actions require confirmation.
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 h-12" onClick={() => navigate(-1)}>Cancel</Button>
        <Button className="flex-1 h-12" onClick={() => navigate("/tablet/advertising/rules/applied")}>
          {editing ? "Save" : "Create"}
        </Button>
      </div>
    </div>
  );
}
