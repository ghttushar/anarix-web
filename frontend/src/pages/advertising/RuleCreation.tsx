import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Plus, Copy, Trash2, ChevronDown, ChevronRight, Info, Home, ArrowRight, X, Save } from "lucide-react";
import { ruleTemplates, metricOptions, operatorOptions, actionOptions, lookbackOptions, frequencyOptions, dateRangeOptions, type RuleCriteria, type RuleCondition } from "@/data/mockRules";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RuleCampaignSelector } from "@/components/advertising/RuleCampaignSelector";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function createCondition(): RuleCondition {
  return { id: generateId(), metric: "acos", operator: "greater_than", valueType: "absolute", value: 0 };
}

function createCriteria(priority: number): RuleCriteria {
  return {
    id: generateId(),
    priority,
    name: `Criteria ${priority}`,
    conditions: [createCondition()],
    action: { type: "set_bid", value: 0 },
  };
}


const breadcrumbItems = [
  { label: "Rules", href: "/advertising/rules/create" },
  { label: "Rule Creation" },
];
export default function RuleCreation() {
  const navigate = useNavigate();
  const { templateId, ruleId } = useParams();
  const template = ruleTemplates.find((t) => t.id === templateId);
  const isEdit = !!ruleId;

  const [ruleName, setRuleName] = useState(template ? `${template.name}` : "");
  const [status, setStatus] = useState(true);
  const [lookback, setLookback] = useState("14");
  const [frequency, setFrequency] = useState("not_set");
  const [dateRange, setDateRange] = useState("not_set");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [criteria, setCriteria] = useState<RuleCriteria[]>([createCriteria(1)]);
  const [step, setStep] = useState<"builder" | "campaigns">("builder");
  const addCriteria = () => {
    setCriteria((prev) => [...prev, createCriteria(prev.length + 1)]);
  };

  const removeCriteria = (id: string) => {
    setCriteria((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      return filtered.map((c, i) => ({ ...c, priority: i + 1 }));
    });
  };

  const duplicateCriteria = (id: string) => {
    setCriteria((prev) => {
      const source = prev.find((c) => c.id === id);
      if (!source) return prev;
      const dup: RuleCriteria = {
        ...source,
        id: generateId(),
        priority: prev.length + 1,
        name: `${source.name} (Copy)`,
        conditions: source.conditions.map((c) => ({ ...c, id: generateId() })),
      };
      return [...prev, dup];
    });
  };

  const updateCriteria = (id: string, updates: Partial<RuleCriteria>) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addCondition = (criteriaId: string) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === criteriaId ? { ...c, conditions: [...c.conditions, createCondition()] } : c))
    );
  };

  const removeCondition = (criteriaId: string, conditionId: string) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === criteriaId ? { ...c, conditions: c.conditions.filter((co) => co.id !== conditionId) } : c
      )
    );
  };

  const updateCondition = (criteriaId: string, conditionId: string, updates: Partial<RuleCondition>) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === criteriaId
          ? { ...c, conditions: c.conditions.map((co) => (co.id === conditionId ? { ...co, ...updates } : co)) }
          : c
      )
    );
  };

  const handleSaveDraft = () => {
    toast.success("Rule saved as draft");
    navigate("/advertising/rules/applied?tab=draft");
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Advertising", href: "/advertising" },
    { label: "Rules", href: "/advertising/rules/agents" },
    { label: "Agents", href: "/advertising/rules/agents" },
    { label: isEdit ? "Edit Rule" : (template?.name || "Create Rule") },
  ];

  const handleApplyRule = () => {
    toast.success("Rule applied successfully");
    navigate("/advertising/rules/applied");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title={isEdit ? "Edit Rule" : "Create Rule"}
          subtitle={
            step === "campaigns"
              ? "Select campaigns to apply this rule to"
              : template
              ? `Based on: ${template.name}`
              : "Define conditions, actions, and apply to campaigns"
          }
          actions={
            step === "builder" && !isEdit ? (
              <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Draft
              </Button>
            ) : undefined
          }
        />

        {step === "builder" ? (
          <>
            {/* Basic Information */}
            <Card>
              <CardContent className="pt-5 pb-4 px-5 space-y-4">
                <h3 className="font-heading text-sm font-semibold text-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5 lg:col-span-2">
                    <Label className="text-xs">Rule Name</Label>
                    <Input value={ruleName} onChange={(e) => setRuleName(e.target.value)} placeholder="Enter rule name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-foreground">Status</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch checked={status} onCheckedChange={setStatus} />
                      <span className="text-sm text-muted-foreground">{status ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Lookback Window</Label>
                    <Select value={lookback} onValueChange={setLookback}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {lookbackOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Select Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {dateRangeOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <Card>
                <CardContent className="py-3 px-5">
                  <CollapsibleTrigger className="flex items-center gap-2 w-full">
                    {advancedOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-heading text-sm font-semibold text-foreground">Advanced Settings</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Advanced configuration options will be available here.</p>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>

            {/* Criteria Information */}
            <Card>
              <CardContent className="pt-5 pb-4 px-5 space-y-4">
                <h3 className="font-heading text-sm font-semibold text-foreground">Criteria Information</h3>

                {/* Info banner */}
                <div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5">
                  <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Define criteria with conditions and actions. Criteria are evaluated in priority order — the first matching criteria's action will be executed.
                  </p>
                </div>

                {/* Criteria Blocks */}
                <div className="space-y-4">
                  {criteria.map((crit) => (
                    <CriteriaBlock
                      key={crit.id}
                      criteria={crit}
                      onUpdate={(updates) => updateCriteria(crit.id, updates)}
                      onDuplicate={() => duplicateCriteria(crit.id)}
                      onDelete={() => removeCriteria(crit.id)}
                      onAddCondition={() => addCondition(crit.id)}
                      onRemoveCondition={(condId) => removeCondition(crit.id, condId)}
                      onUpdateCondition={(condId, updates) => updateCondition(crit.id, condId, updates)}
                      canDelete={criteria.length > 1}
                    />
                  ))}
                </div>

                <Button variant="outline" size="sm" onClick={addCriteria}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add Criteria
                </Button>
              </CardContent>
            </Card>

            {/* Footer Actions */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-3">
              <Button variant="outline" size="sm" onClick={addCriteria}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Criteria
              </Button>
              <Button size="sm" onClick={() => setStep("campaigns")}>
                {isEdit ? "Update Campaigns" : "Select Campaigns"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        ) : (
          <RuleCampaignSelector
            isEdit={isEdit}
            onBack={() => setStep("builder")}
            onSaveDraft={handleSaveDraft}
            onApplyRule={handleApplyRule}
            ruleName={ruleName}
          />
        )}
      </div>
</AppLayout>
  );
}

function CriteriaBlock({
  criteria,
  onUpdate,
  onDuplicate,
  onDelete,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
  canDelete,
}: {
  criteria: RuleCriteria;
  onUpdate: (updates: Partial<RuleCriteria>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddCondition: () => void;
  onRemoveCondition: (condId: string) => void;
  onUpdateCondition: (condId: string, updates: Partial<RuleCondition>) => void;
  canDelete: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
          {criteria.priority}
        </div>
        <Input
          value={criteria.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="h-8 flex-1 text-sm"
          placeholder="Criteria name"
        />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDuplicate} title="Duplicate Criteria">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          {canDelete && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete} title="Delete Criteria">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Conditions */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Conditions</span>
        {criteria.conditions.map((cond, i) => (
          <div key={cond.id} className="flex items-center gap-2">
            {i > 0 && <span className="text-xs text-muted-foreground w-8 text-center">AND</span>}
            {i === 0 && <span className="text-xs text-muted-foreground w-8 text-center">IF</span>}
            <Select value={cond.metric} onValueChange={(v) => onUpdateCondition(cond.id, { metric: v })}>
              <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {metricOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={cond.operator} onValueChange={(v) => onUpdateCondition(cond.id, { operator: v })}>
              <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {operatorOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={cond.valueType} onValueChange={(v) => onUpdateCondition(cond.id, { valueType: v as "absolute" | "percentage" })}>
              <SelectTrigger className="h-8 w-[100px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="absolute">Absolute</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={cond.value}
              onChange={(e) => onUpdateCondition(cond.id, { value: parseFloat(e.target.value) || 0 })}
              className="h-8 w-20 text-xs"
              placeholder={cond.operator === "between" ? "Min" : undefined}
            />
            {cond.operator === "between" && (
              <>
                <span className="text-xs text-muted-foreground">and</span>
                <Input
                  type="number"
                  value={cond.maxValue ?? 0}
                  onChange={(e) => onUpdateCondition(cond.id, { maxValue: parseFloat(e.target.value) || 0 })}
                  className="h-8 w-20 text-xs"
                  placeholder="Max"
                />
              </>
            )}
            {criteria.conditions.length > 1 && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onRemoveCondition(cond.id)} title="Remove condition">
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onAddCondition}>
          <Plus className="mr-1 h-3 w-3" />
          Add Condition
        </Button>
      </div>

      <Separator />

      {/* Action */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Action</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-8 text-center">THEN</span>
          <Select value={criteria.action.type} onValueChange={(v) => onUpdate({ action: { ...criteria.action, type: v } })}>
            <SelectTrigger className="h-8 w-[180px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {actionOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {!["pause", "enable"].includes(criteria.action.type) && (
            <Input
              type="number"
              value={criteria.action.value}
              onChange={(e) => onUpdate({ action: { ...criteria.action, value: parseFloat(e.target.value) || 0 } })}
              className="h-8 w-20 text-xs"
            />
          )}
        </div>
      </div>
    </div>
  );
}
