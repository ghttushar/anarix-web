import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { WidgetCanvas } from "@/components/workspace/WidgetCanvas";
import { AddWidgetModal } from "@/components/workspace/AddWidgetModal";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Pencil, FilePlus } from "lucide-react";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
export type WidgetType = "metric" | "chart" | "table" | "annotation" | "task";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, unknown>;
  colSpan: number;
  rowSpan: number;
}

interface SandboxDashboard {
  id: string;
  name: string;
  widgets: Widget[];
}

const defaultWidgets: Widget[] = [
  { id: "w1", type: "metric", title: "Total ROAS", config: { metric: "roas", value: 3.37, delta: 12.4 }, colSpan: 1, rowSpan: 1 },
  { id: "w2", type: "metric", title: "Ad Spend", config: { metric: "spend", value: 10973.6, delta: -3.2 }, colSpan: 1, rowSpan: 1 },
  { id: "w3", type: "metric", title: "Ad Sales", config: { metric: "sales", value: 36955.24, delta: 8.7 }, colSpan: 1, rowSpan: 1 },
  { id: "w4", type: "metric", title: "TACoS", config: { metric: "tacos", value: 14.2, delta: -1.8 }, colSpan: 1, rowSpan: 1 },
  { id: "w5", type: "chart", title: "Performance Trend", config: { chartType: "line", metric: "sales" }, colSpan: 2, rowSpan: 2 },
  { id: "w6", type: "table", title: "Top Campaigns", config: {}, colSpan: 2, rowSpan: 2 },
  { id: "w7", type: "annotation", title: "Notes", config: { text: "Review Q1 campaign strategy\nCheck competitor bids on brand keywords", colorIndex: 0 }, colSpan: 1, rowSpan: 1 },
  { id: "w8", type: "task", title: "Action Items", config: { tasks: [{ text: "Pause underperforming campaigns", done: false }, { text: "Increase budget on top 3", done: true }, { text: "Add negative keywords", done: false }] }, colSpan: 1, rowSpan: 1 },
];

function loadDashboards(): SandboxDashboard[] {
  try {
    const stored = localStorage.getItem("anarix-sandbox-dashboards");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [{ id: "default", name: "My Sandbox", widgets: defaultWidgets }];
}

function saveDashboards(dashboards: SandboxDashboard[]) {
  localStorage.setItem("anarix-sandbox-dashboards", JSON.stringify(dashboards));
  window.dispatchEvent(new CustomEvent("sandbox-dashboards-updated"));
}


const breadcrumbItems = [
  { label: "Workspace", href: "/workspace" },
  { label: "Dashboard Builder" },
];
export default function WorkspaceDashboard() {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<SandboxDashboard[]>(loadDashboards);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const activeId = dashboardId || dashboards[0]?.id || "default";
  const activeDashboard = dashboards.find((d) => d.id === activeId) || dashboards[0];

  const updateDashboards = useCallback((newDashboards: SandboxDashboard[]) => {
    setDashboards(newDashboards);
    saveDashboards(newDashboards);
  }, []);

  const updateActiveDashboard = useCallback((updates: Partial<SandboxDashboard>) => {
    updateDashboards(
      dashboards.map((d) => (d.id === activeDashboard.id ? { ...d, ...updates } : d))
    );
  }, [dashboards, activeDashboard, updateDashboards]);

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `w-${Date.now()}`,
      type,
      title: type === "metric" ? "New Metric" : type === "chart" ? "New Chart" : type === "table" ? "New Table" : type === "annotation" ? "New Note" : "New Tasks",
      config: type === "annotation" ? { text: "", colorIndex: Math.floor(Math.random() * 4) } : type === "task" ? { tasks: [] } : {},
      colSpan: type === "chart" || type === "table" ? 2 : 1,
      rowSpan: type === "chart" || type === "table" ? 2 : 1,
    };
    updateActiveDashboard({ widgets: [...activeDashboard.widgets, newWidget] });
    setShowAddModal(false);
  };

  const removeWidget = (id: string) => {
    updateActiveDashboard({ widgets: activeDashboard.widgets.filter((w) => w.id !== id) });
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    updateActiveDashboard({
      widgets: activeDashboard.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    });
  };

  const reorderWidgets = (newWidgets: Widget[]) => {
    updateActiveDashboard({ widgets: newWidgets });
  };

  const resetDashboard = () => {
    updateActiveDashboard({ widgets: defaultWidgets });
  };

  const createNewDashboard = () => {
    const newId = `sandbox-${Date.now()}`;
    const newDashboard: SandboxDashboard = {
      id: newId,
      name: `Sandbox ${dashboards.length + 1}`,
      widgets: [],
    };
    updateDashboards([...dashboards, newDashboard]);
    navigate(`/workspace/${newId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <AppTaskbar breadcrumbItems={[...breadcrumbItems, { label: activeDashboard.name }]} />

        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                value={activeDashboard.name}
                onChange={(e) => updateActiveDashboard({ name: e.target.value })}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                autoFocus
                className="text-xl font-semibold bg-transparent border-b border-primary outline-none text-foreground"
              />
            ) : (
              <h1
                className="text-xl font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {activeDashboard.name}
              </h1>
            )}
            <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-foreground">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={createNewDashboard} className="gap-1.5">
              <FilePlus className="h-3.5 w-3.5" />
              Create New
            </Button>
            <Button variant="outline" size="sm" onClick={resetDashboard} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Widget
            </Button>
          </div>
        </div>

        {/* Widget Canvas */}
        <WidgetCanvas
          widgets={activeDashboard.widgets}
          onRemoveWidget={removeWidget}
          onUpdateWidget={updateWidget}
          onReorderWidgets={reorderWidgets}
        />
      </div>

      <AddWidgetModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addWidget}
      />
</AppLayout>
  );
}
