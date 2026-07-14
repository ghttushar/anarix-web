import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, FileText } from "lucide-react";
import { ruleTemplates, suggestionChips, appliedRules, type RuleTemplate } from "@/data/mockRules";
import { cn } from "@/lib/utils";
const draftCount = appliedRules.filter((r) => r.status === "draft").length;


const breadcrumbItems = [
  { label: "Rules", href: "/advertising/rules/agents" },
  { label: "Rule Agents" },
];
export default function RuleAgents() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const campaignRules = ruleTemplates.filter((t) => t.category === "campaign");
  const targetingRules = ruleTemplates.filter((t) => t.category === "targeting");

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const handleTemplateClick = (template: RuleTemplate) => {
    navigate(`/advertising/rules/create/${template.id}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />

        <PageHeader
          title="Rule Agents"
          subtitle="Create automation rules from templates or with AI assistance"
          actions={
            draftCount > 0 ? (
              <Button variant="outline" size="sm" onClick={() => navigate("/advertising/rules/applied?tab=draft")}>
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                View Drafts ({draftCount})
              </Button>
            ) : undefined
          }
        />

        {/* AI Prompt Section */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Create Rules with AI</span>
            </div>
            <div className="flex gap-3">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the rule you want to create..."
                className="flex-1"
              />
              <Button
                data-write-action
                onClick={() => {
                  if (prompt.trim()) navigate("/advertising/rules/create");
                }}
              >
                Create Rule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide">
            {suggestionChips.map((chip, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors shrink-0"
                onClick={() => setPrompt(chip)}
              >
                {chip}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Campaign Rules */}
        <div className="space-y-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">Campaign Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {campaignRules.map((template) => (
              <TemplateCard key={template.id} template={template} onClick={() => handleTemplateClick(template)} />
            ))}
          </div>
        </div>

        {/* Targeting Rules */}
        <div className="space-y-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">Targeting Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {targetingRules.map((template) => (
              <TemplateCard key={template.id} template={template} onClick={() => handleTemplateClick(template)} />
            ))}
          </div>
        </div>
      </div>
</AppLayout>
  );
}

function TemplateCard({ template, onClick }: { template: RuleTemplate; onClick: () => void }) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-150 hover:border-primary/30 hover:shadow-sm group"
      )}
      onClick={onClick}
    >
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{template.name}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
        </div>
      </CardContent>
    </Card>
  );
}
