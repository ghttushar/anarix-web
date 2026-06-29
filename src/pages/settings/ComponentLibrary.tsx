import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { KPICard } from "@/components/cards/KPICard";
import { KPICardsRow } from "@/components/cards/KPICardsRow";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { Chip } from "@/components/ui/chip";
import { TablePagination } from "@/components/tables/TablePagination";
import { AanLogo } from "@/components/aan/AanLogo";
import { ArtifactCard } from "@/components/aan/ArtifactCard";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Plus, Search, Filter, Download, Upload, Columns3, X,
  ChevronRight, ChevronDown, Pin, ArrowUp, ArrowDown, ArrowUpDown,
  Sparkles, Bell, Lightbulb, RefreshCw, LayoutDashboard, Megaphone,
  BarChart3, Settings, PanelLeft, Loader2, Check, Calendar, DollarSign,
  Target, TrendingUp, Package, Globe, AlertTriangle, Moon, Sun, User,
  Play, Maximize2, Eye
} from "lucide-react";

const breadcrumbItems = [
  { label: "Settings", href: "/settings" },
  { label: "Component Library" },
];

const SECTIONS = [
  { id: "primitives", label: "Primitives" },
  { id: "navigation", label: "Navigation" },
  { id: "taskbar", label: "Taskbar" },
  { id: "tables", label: "Tables" },
  { id: "cards", label: "Cards & KPIs" },
  { id: "charts", label: "Charts" },
  { id: "panels", label: "Panels" },
  { id: "aan", label: "Aan AI" },
  { id: "modals", label: "Modals" },
  { id: "patterns", label: "Page Patterns" },
];

function SectionHeader({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <div id={id} className="scroll-mt-24 pt-8 first:pt-0">
      <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function PrimitivesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader id="primitives" title="1. Foundation Primitives" description="Core UI building blocks used across the entire application." />

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Typography Specimens</Label>
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold" style={{ fontFamily: "var(--font-heading)" }}>H1 — Page Title (32px/600)</h1>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>H2 — Section Title (24px/600)</h2>
          <h3 className="text-lg font-medium" style={{ fontFamily: "var(--font-heading)" }}>H3 — Subsection (18px/500)</h3>
          <p className="text-sm">Body — Primary text (14px/400)</p>
          <p className="text-[13px] text-muted-foreground">Small — Table cells (13px/400)</p>
          <p className="text-xs text-muted-foreground">Meta — Labels, hints (12px/400)</p>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Button Matrix</Label>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="pr-4 py-1 text-left">Variant</th>
                <th className="px-3 py-1">Default</th>
                <th className="px-3 py-1">Disabled</th>
                <th className="px-3 py-1">Loading</th>
                <th className="px-3 py-1">With Icon</th>
              </tr>
            </thead>
            <tbody>
              {(["default", "secondary", "destructive", "ghost", "outline"] as const).map((v) => (
                <tr key={v}>
                  <td className="pr-4 py-2 text-xs text-muted-foreground capitalize">{v}</td>
                  <td className="px-3 py-2"><Button variant={v} size="sm">Action</Button></td>
                  <td className="px-3 py-2"><Button variant={v} size="sm" disabled>Action</Button></td>
                  <td className="px-3 py-2"><Button variant={v} size="sm" disabled><Loader2 className="h-3.5 w-3.5 animate-spin" /></Button></td>
                  <td className="px-3 py-2"><Button variant={v} size="sm"><Plus className="h-3.5 w-3.5" />Create</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Form Controls</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Text Input</Label>
            <Input placeholder="Enter value..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Select</Label>
            <Select defaultValue="sp">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sp">Sponsored Products</SelectItem>
                <SelectItem value="sb">Sponsored Brands</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Textarea</Label>
            <Textarea placeholder="Enter description..." className="h-[72px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Checkbox</Label>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2"><Checkbox id="cl-1" /><label htmlFor="cl-1" className="text-sm">Option A</label></div>
              <div className="flex items-center gap-2"><Checkbox id="cl-2" defaultChecked /><label htmlFor="cl-2" className="text-sm">Option B</label></div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Radio Group</Label>
            <RadioGroup defaultValue="auto">
              <div className="flex items-center gap-2"><RadioGroupItem value="auto" id="r-auto" /><label htmlFor="r-auto" className="text-sm">Automatic</label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="manual" id="r-manual" /><label htmlFor="r-manual" className="text-sm">Manual</label></div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Switch</Label>
            <div className="flex items-center gap-2"><Switch defaultChecked /><span className="text-sm">Enabled</span></div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Slider</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Badge / Chip / StatusBadge / DeltaBadge</Label>
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge>Default</Badge><Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge><Badge variant="outline">Outline</Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status="live" /><StatusBadge status="paused" /><StatusBadge status="archived" /><StatusBadge status="scheduled" /><StatusBadge status="out_of_budget" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DeltaBadge value={12.5} /><DeltaBadge value={-8.3} /><DeltaBadge value={0} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Chip>SP</Chip><Chip>SB</Chip><Chip>SD</Chip><Chip>SV</Chip>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Loading Skeletons</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Table Skeleton</span>
            <div className="border border-border rounded-md p-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/5 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Card Skeleton</span>
            <div className="border border-border rounded-md p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function NavigationSection() {
  return (
    <div className="space-y-6">
      <SectionHeader id="navigation" title="2. Navigation" description="Sidebar, breadcrumbs, marketplace selector, and Floating Action Island." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sidebar — Expanded (w-56)</Label>
          <div className="border border-border rounded-md bg-card w-52 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Anarix</span>
              <PanelLeft className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-2 space-y-0.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/10 text-sm font-medium text-foreground border-l-2 border-primary">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer">
                <Megaphone className="h-4 w-4" /> Advertising
              </div>
              <div className="pl-8 py-1 text-xs text-muted-foreground">Campaign Manager</div>
              <div className="pl-8 py-1 text-xs text-muted-foreground">Budget Pacing</div>
              <div className="pl-8 py-1 text-xs text-muted-foreground">Rule Agents</div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> Profitability</div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground"><BarChart3 className="h-4 w-4" /> BI & Analytics</div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground"><Package className="h-4 w-4" /> Catalog</div>
            </div>
            <div className="p-2 border-t border-border">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-muted/50 text-sm text-primary cursor-pointer">
                <Sparkles className="h-4 w-4" /> Ask Aan
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border-t border-border">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">MiniSidebar — Collapsed</Label>
          <div className="border border-border rounded-md bg-card w-14 overflow-hidden">
            <div className="flex items-center justify-center p-3 border-b border-border">
              <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">A</div>
            </div>
            <div className="flex flex-col items-center gap-3 py-3">
              <LayoutDashboard className="h-5 w-5 text-foreground" />
              <Megaphone className="h-5 w-5 text-muted-foreground" />
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <Package className="h-5 w-5 text-muted-foreground" />
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center py-2 border-t border-border"><Sparkles className="h-5 w-5 text-primary" /></div>
            <div className="flex flex-col items-center gap-2 p-2 border-t border-border">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">SidebarHoverPopup</Label>
        <div className="flex items-start gap-4">
          <div className="border border-border rounded-md bg-card w-14 flex flex-col items-center py-3 gap-3">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div className="border border-border rounded-md bg-card p-3 w-48 shadow-md">
            <div className="text-xs font-medium text-foreground mb-2">Advertising</div>
            <div className="space-y-1">
              {["Campaign Manager", "Budget Pacing", "Rule Agents", "Impact Analysis"].map((item) => (
                <div key={item} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer py-0.5">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">MarketplaceSelector</Label>
        <div className="flex items-start gap-4">
          <div className="border border-border rounded-md bg-card w-52 p-2 space-y-1">
            {[
              { name: "Amazon", color: "#FF9900", active: true },
              { name: "Walmart", color: "#0071DC", active: false },
              { name: "Shopify", color: "#96BF48", active: false },
            ].map((mp) => (
              <div key={mp.name} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs ${mp.active ? "bg-primary/10 font-medium" : "text-muted-foreground hover:bg-muted/50 cursor-pointer"}`}>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: mp.color }} />{mp.name}
              </div>
            ))}
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted/50 cursor-pointer">
              <Globe className="h-4 w-4" />TikTok
            </div>
          </div>
          <div className="border border-border rounded-md bg-card p-3 w-52 shadow-md">
            <div className="text-xs font-medium text-foreground mb-2">Amazon Accounts</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full bg-success" />Acme Corp (US)</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-2 h-2 rounded-full bg-warning" />Acme Corp (UK)</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">PageBreadcrumb</Label>
        <PageBreadcrumb items={[
          { label: "Advertising", href: "/advertising/campaigns" },
          { label: "Campaign Manager", href: "/advertising/campaigns" },
          { label: "Acme SP Auto" },
        ]} />
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Floating Action Island</Label>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 border border-primary/60 rounded-full px-3 py-1.5 bg-card">
              <Sparkles className="h-4 w-4 text-primary" /><span className="text-xs font-medium text-primary">Ask Aan</span>
              <div className="w-px h-4 bg-border mx-1" />
              <Bell className="h-3.5 w-3.5 text-muted-foreground" /><Lightbulb className="h-3.5 w-3.5 text-muted-foreground" /><RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground">Expanded</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 border border-primary/60 rounded-full px-3 py-1.5 bg-card">
              <Sparkles className="h-4 w-4 text-primary" /><span className="text-xs font-medium text-primary">Ask Aan</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Collapsed</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TaskbarSection() {
  return (
    <div className="space-y-6">
      <SectionHeader id="taskbar" title="3. AppTaskbar" description="Universal 2-row sticky header with breadcrumbs, filters, and island-off actions." />

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full 2-Row Layout</Label>
        <div className="border border-primary rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="text-primary hover:underline cursor-pointer">Advertising</span>
              <ChevronRight className="h-3 w-3" /><span>Campaign Manager</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-muted/50 rounded-md px-2 py-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#FF9900" }} />
                <span className="font-medium text-foreground">Amazon US</span>
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
              </div>
              <span>Acme Corp · Last synced 2m ago</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-card">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
                <span className="text-xs font-medium text-muted-foreground">Ad Type</span>
                <span className="text-xs text-foreground">All Types</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
                <Calendar className="h-3 w-3 text-muted-foreground" /><span className="text-xs">Last 30 Days</span>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Play className="h-3 w-3" />Run</Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7"><Sparkles className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7"><Lightbulb className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7"><RefreshCw className="h-3.5 w-3.5" /></Button>
              <div className="w-px h-4 bg-border mx-0.5" />
              <Button variant="ghost" size="icon" className="h-7 w-7"><Bell className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Panel-Collapsed Variant</Label>
        <p className="text-sm text-muted-foreground">When right-side panels are open, Row 2 actions collapse to icon-only buttons. Row 2 supports <code className="bg-muted px-1 rounded text-xs">flex-wrap</code> for responsive overflow.</p>
      </Card>
    </div>
  );
}

function TablesSection() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="space-y-6">
      <SectionHeader id="tables" title="4. Data Tables" description="DataTableToolbar, SortableTableHead, pagination, and tab patterns." />

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">DataTableToolbar — Anatomy</Label>
        <div className="flex items-center justify-between border border-border rounded-md p-2 bg-card">
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="h-3.5 w-3.5" />Create</Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search campaigns..." className="h-8 w-48 pl-8 text-xs" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Upload className="h-3.5 w-3.5" />Upload</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><TrendingUp className="h-3.5 w-3.5" />Δ</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Filter className="h-3.5 w-3.5" />Filter</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Columns3 className="h-3.5 w-3.5" />Columns</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><ArrowUpDown className="h-3.5 w-3.5" />Sort</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Download className="h-3.5 w-3.5" />Export</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Eye className="h-3.5 w-3.5" />View</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">SortableTableHead — Pin & Sort States</Label>
        <div className="border border-border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">
                  <div className="flex items-center gap-1">Campaign <ArrowUp className="h-3 w-3 text-primary" /><Pin className="h-3 w-3 text-primary" /></div>
                </TableHead>
                <TableHead className="text-xs"><div className="flex items-center gap-1">Spend <ArrowUpDown className="h-3 w-3 text-muted-foreground" /></div></TableHead>
                <TableHead className="text-xs"><div className="flex items-center gap-1">ROAS <ArrowDown className="h-3 w-3 text-muted-foreground/50" /></div></TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-sm font-medium">Acme SP Auto</TableCell>
                <TableCell className="text-sm">$1,245.00</TableCell>
                <TableCell className="text-sm">3.2x</TableCell>
                <TableCell><StatusBadge status="live" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm font-medium">Brand Defense SB</TableCell>
                <TableCell className="text-sm">$892.50</TableCell>
                <TableCell className="text-sm">2.8x</TableCell>
                <TableCell><StatusBadge status="paused" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">Pin: 4 states (hidden → hover → active → highlight). Sort: 3 states (neutral → asc → desc).</p>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">TablePagination</Label>
        <TablePagination page={page} pageSize={pageSize} totalItems={247} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">UnderlineTabs</Label>
        <UnderlineTabs
          tabs={[
            { value: "campaigns", label: "Campaigns" },
            { value: "ad-groups", label: "Ad Groups" },
            { value: "product-ads", label: "Product Ads" },
            { value: "keywords", label: "Keywords" },
            { value: "search-terms", label: "Search Terms" },
          ]}
          value="campaigns"
          onChange={() => {}}
        />
      </Card>
    </div>
  );
}

function CardsSection() {
  const kpiData = [
    { label: "Ad Spend", value: 45230, previousValue: 42100, format: "currency" as const, trend: "up" as const },
    { label: "Ad Sales", value: 156780, previousValue: 148900, format: "currency" as const, trend: "up" as const },
    { label: "ROAS", value: 3.47, previousValue: 3.54, format: "decimal" as const, trend: "down" as const },
    { label: "Impressions", value: 2340000, previousValue: 2100000, format: "number" as const, trend: "up" as const },
  ];

  const stripItems = [
    { label: "Ad Spend", value: 45230, previousValue: 42100, format: "currency" as const, accentColor: "primary" },
    { label: "Sales", value: 156780, previousValue: 148900, format: "currency" as const, accentColor: "success" },
    { label: "ROAS", value: 3.47, previousValue: 3.54, format: "decimal" as const, accentColor: "accent" },
    { label: "ACOS", value: 28.8, previousValue: 28.2, format: "percentage" as const, accentColor: "warning" },
    { label: "CTR", value: 0.42, previousValue: 0.38, format: "percentage" as const, accentColor: "destructive" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader id="cards" title="5. Cards & KPIs" description="KPICard, KPICardsRow, InlineKPIStrip, and ProfitabilityHeroCard." />

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Single KPICard</Label>
        <div className="w-64"><KPICard label="Ad Spend" value={45230} previousValue={42100} format="currency" /></div>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">KPICardsRow (4-up grid)</Label>
        <KPICardsRow data={kpiData} />
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">InlineKPIStrip</Label>
        <InlineKPIStrip items={stripItems} />
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">ProfitabilityHeroCard — Anatomy</Label>
        <div className="border border-border rounded-md p-3 space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {["Today", "Yesterday", "This Month", "Last Month", "Forecast"].map((label, i) => (
              <div key={label} className={`border rounded-md p-2 text-center text-xs ${i === 0 ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
                <div className="font-medium text-foreground">{label}</div>
                <div className="text-muted-foreground mt-1">6 metrics</div>
              </div>
            ))}
          </div>
          <div className="h-[220px] bg-muted/30 rounded-md flex items-center justify-center text-xs text-muted-foreground border border-border">
            Comparison Chart — 220px height — 5-series area overlay
          </div>
        </div>
        <p className="text-xs text-muted-foreground">5-card selectable grid. 6 metrics per card. Click highlights + filters chart. ForecastCard shows projected metrics.</p>
      </Card>
    </div>
  );
}

function ChartsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader id="charts" title="6. Charts" description="ChartContainer, PerformanceChart, and MetricSelector anatomy." />

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">ChartContainer — Anatomy</Label>
        <div className="border border-border rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Performance</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[10px] text-muted-foreground">Spend</span>
                <div className="w-2 h-2 rounded-full bg-success ml-1" /><span className="text-[10px] text-muted-foreground">Sales</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6"><BarChart3 className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" className="h-6 w-6"><Maximize2 className="h-3 w-3" /></Button>
            </div>
          </div>
          <div className="h-48 bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">Chart Area</div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">MetricSelector</Label>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: "Spend", color: "bg-primary", active: true },
            { label: "Sales", color: "bg-success", active: true },
            { label: "ROAS", color: "bg-warning", active: true },
            { label: "ACOS", color: "bg-muted", active: false },
          ].map((m) => (
            <div key={m.label} className={`flex items-center gap-1 px-2 py-1 rounded-md border border-border text-xs ${!m.active ? "opacity-50" : ""}`}>
              <div className={`w-2 h-2 rounded-full ${m.color}`} />{m.label}
              {m.active && <Check className="h-3 w-3 text-primary ml-1" />}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Popover with max-metric cap. Click toggles. Disabled when at cap.</p>
      </Card>
    </div>
  );
}

function PanelMockup({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="border border-border rounded-md overflow-hidden w-80 bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6"><X className="h-3.5 w-3.5" /></Button>
      </div>
      <div className="px-4 py-4 space-y-3 max-h-[320px] overflow-y-auto">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-muted/30">{footer}</div>
      )}
    </div>
  );
}

function PanelsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader id="panels" title="7. Right-Side Panels" description="All configuration and viewing panels. Fixed viewport, independent scroll, auto-close on outside click." />

      {/* CreateCampaignPanel */}
      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">CreateCampaignPanel</Label>
        <PanelMockup title="Create Campaign" footer={<><Button variant="outline" size="sm" className="text-xs">Cancel</Button><Button size="sm" className="text-xs">Create Campaign</Button></>}>
          <div className="space-y-1.5"><Label className="text-xs">Campaign Name</Label><Input placeholder="Enter campaign name..." className="h-8 text-xs" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Campaign Type</Label>
            <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="auto" className="text-xs">Auto</SelectItem><SelectItem value="manual" className="text-xs">Manual</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Bidding Strategy</Label>
            <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select strategy" /></SelectTrigger><SelectContent><SelectItem value="down" className="text-xs">Dynamic Down</SelectItem><SelectItem value="updown" className="text-xs">Dynamic Up/Down</SelectItem><SelectItem value="fixed" className="text-xs">Fixed</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Daily Budget</Label>
            <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="0.00" className="h-8 text-xs" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5"><Label className="text-xs">Start Date</Label><Input type="date" className="h-8 text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">End Date</Label><Input type="date" className="h-8 text-xs" /></div>
          </div>
        </PanelMockup>
      </Card>

      {/* CreateReportPanel */}
      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">CreateReportPanel</Label>
        <PanelMockup title="Create Report" footer={<><Button variant="outline" size="sm" className="text-xs">Cancel</Button><Button size="sm" className="text-xs">Generate Report</Button></>}>
          <div className="space-y-1.5"><Label className="text-xs">Report Name</Label><Input placeholder="Q4 Performance Report" className="h-8 text-xs" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Client Name</Label><Input placeholder="Acme Corp" className="h-8 text-xs" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Template</Label>
            <div className="flex gap-1.5 flex-wrap">
              {["Executive Summary", "Detailed Analysis", "Monthly Review"].map((t) => (
                <Badge key={t} variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10">{t}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Sections</Label>
            <div className="space-y-1">
              {["Overview", "Campaign Performance", "Budget Analysis", "Recommendations"].map((s) => (
                <div key={s} className="flex items-center gap-2"><Checkbox id={`s-${s}`} /><label htmlFor={`s-${s}`} className="text-xs text-foreground">{s}</label></div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between"><Label className="text-xs">Schedule Recurring</Label><Switch /></div>
        </PanelMockup>
      </Card>

      {/* CreateSchedulePanel */}
      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">CreateSchedulePanel</Label>
        <PanelMockup title="Create Schedule" footer={<><Button variant="outline" size="sm" className="text-xs">Cancel</Button><Button size="sm" className="text-xs">Apply Rule</Button></>}>
          <div className="space-y-1.5"><Label className="text-xs">Selected Campaigns</Label>
            <div className="flex gap-1 flex-wrap"><Badge className="text-[10px]">Campaign Alpha <X className="h-2.5 w-2.5 ml-1" /></Badge><Badge className="text-[10px]">Campaign Beta <X className="h-2.5 w-2.5 ml-1" /></Badge></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Rule Name</Label><Input placeholder="Peak hours bid increase" className="h-8 text-xs" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Action</Label>
            <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select action" /></SelectTrigger><SelectContent><SelectItem value="pause" className="text-xs">Pause</SelectItem><SelectItem value="increase" className="text-xs">Increase Budget</SelectItem><SelectItem value="reduce" className="text-xs">Reduce Budget</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Days</Label>
            <div className="flex gap-1">{["M","T","W","T","F","S","S"].map((d,i) => (
              <div key={i} className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] border border-border cursor-pointer ${i < 5 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>{d}</div>
            ))}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5"><Label className="text-xs">Start Time</Label><Input type="time" defaultValue="09:00" className="h-8 text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">End Time</Label><Input type="time" defaultValue="17:00" className="h-8 text-xs" /></div>
          </div>
        </PanelMockup>
      </Card>

      {/* ProductDetailPanel */}
      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">ProductDetailPanel</Label>
        <PanelMockup title="Product Detail">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center"><Package className="h-5 w-5 text-muted-foreground" /></div>
            <div><div className="text-sm font-medium text-foreground">Wireless Bluetooth Speaker</div><div className="text-[10px] text-muted-foreground">Item ID: WM-12345 · SKU: BTS-001</div></div>
          </div>
          <div className="flex items-center justify-between py-2 border-y border-border">
            <div><div className="text-[10px] text-muted-foreground">Net Profit</div><div className="text-lg font-semibold text-foreground">$1,245.80</div></div>
            <Badge variant="secondary" className="text-[10px]">32.4% margin</Badge>
          </div>
          <div className="h-16 bg-muted/30 rounded-md flex items-center justify-center text-[10px] text-muted-foreground">Weekly trend sparkline</div>
          {[
            { label: "Revenue", items: [{ l: "Organic Sales", v: "$2,840" }, { l: "Ad Sales", v: "$1,020" }] },
            { label: "Costs", items: [{ l: "COGS", v: "$1,200" }, { l: "Ad Spend", v: "$380" }, { l: "Fees", v: "$234" }] },
          ].map((section) => (
            <div key={section.label}>
              <div className="flex items-center gap-1 text-xs font-medium text-foreground cursor-pointer"><ChevronDown className="h-3 w-3" />{section.label}</div>
              <div className="ml-4 mt-1 space-y-1">{section.items.map((item) => (
                <div key={item.l} className="flex justify-between text-xs"><span className="text-muted-foreground">{item.l}</span><span className="text-foreground">{item.v}</span></div>
              ))}</div>
            </div>
          ))}
        </PanelMockup>
      </Card>

      {/* PeriodBreakdownPanel */}
      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">PeriodBreakdownPanel</Label>
        <PanelMockup title="Today Breakdown">
          <div className="text-xs text-muted-foreground mb-2">Apr 10, 2026</div>
          {[
            { title: "Sales Breakdown", rows: [{ l: "Organic", v: "$4,200" }, { l: "Sponsored Products", v: "$1,800" }, { l: "Sponsored Brands", v: "$620" }] },
            { title: "Orders & Units", rows: [{ l: "Total Orders", v: "142" }, { l: "Total Units", v: "189" }, { l: "Returns", v: "7" }] },
            { title: "Costs", rows: [{ l: "COGS", v: "$2,100" }, { l: "Ad Spend", v: "$890" }, { l: "Total Expenses", v: "$3,400" }] },
            { title: "Metrics", rows: [{ l: "Net Profit", v: "$1,420" }, { l: "TACOS", v: "13.4%" }, { l: "ROAS", v: "3.2x" }] },
          ].map((section) => (
            <div key={section.title}>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{section.title}</div>
              <div className="space-y-1">{section.rows.map((r) => (
                <div key={r.l} className="flex justify-between rounded-md bg-muted/50 px-2 py-1.5 text-xs"><span className="text-muted-foreground">{r.l}</span><span className="font-medium text-foreground">{r.v}</span></div>
              ))}</div>
            </div>
          ))}
        </PanelMockup>
      </Card>

      {/* CampaignSettingsPanel */}
      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">CampaignSettingsPanel</Label>
        <PanelMockup title="Campaign Settings" footer={<><Button variant="outline" size="sm" className="text-xs">Cancel</Button><Button size="sm" className="text-xs">Save</Button></>}>
          <div className="space-y-1.5"><Label className="text-xs">Campaign Name</Label><Input defaultValue="Summer Sale SP" className="h-8 text-xs" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Campaign ID</Label><Input value="CAMP-2024-001" disabled className="h-8 text-xs bg-muted" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Status</Label>
            <Select defaultValue="live"><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="live" className="text-xs">Live</SelectItem><SelectItem value="paused" className="text-xs">Paused</SelectItem><SelectItem value="archived" className="text-xs">Archived</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Daily Budget</Label>
            <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-muted-foreground" /><Input defaultValue="150.00" className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Bidding Strategy</Label>
            <RadioGroup defaultValue="down" className="space-y-1">
              <div className="flex items-center gap-2"><RadioGroupItem value="down" id="bs-d" /><label htmlFor="bs-d" className="text-xs">Dynamic Down</label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="updown" id="bs-ud" /><label htmlFor="bs-ud" className="text-xs">Dynamic Up/Down</label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="fixed" id="bs-f" /><label htmlFor="bs-f" className="text-xs">Fixed</label></div>
            </RadioGroup>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Top of Search %</Label><Input defaultValue="25" className="h-8 text-xs" /></div>
        </PanelMockup>
      </Card>

      {/* AdGroupSettingsPanel */}
      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">AdGroupSettingsPanel</Label>
        <PanelMockup title="Ad Group Settings" footer={<><Button variant="outline" size="sm" className="text-xs">Cancel</Button><Button size="sm" className="text-xs">Save</Button></>}>
          <div className="space-y-1.5"><Label className="text-xs">Ad Group Name</Label><Input defaultValue="High-Performance Keywords" className="h-8 text-xs" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Status</Label>
            <Select defaultValue="live"><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="live" className="text-xs">Live</SelectItem><SelectItem value="paused" className="text-xs">Paused</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Default Bid</Label>
            <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-muted-foreground" /><Input defaultValue="1.25" className="h-8 text-xs" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5"><Label className="text-xs">Min Bid</Label><Input defaultValue="0.50" className="h-8 text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Max Bid</Label><Input defaultValue="3.00" className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Target ROAS</Label><Input defaultValue="4.5" className="h-8 text-xs" /></div>
        </PanelMockup>
      </Card>
    </div>
  );
}

function AanSection() {
  return (
    <div className="space-y-6">
      <SectionHeader id="aan" title="8. Aan AI Components" description="AI workspace branding, input, conversation, and artifact patterns." />

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">AanLogo Variants</Label>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1"><AanLogo showByAnarix={true} /><span className="text-[10px] text-muted-foreground">With "by Anarix"</span></div>
          <div className="flex flex-col items-center gap-1"><AanLogo showByAnarix={false} /><span className="text-[10px] text-muted-foreground">Icon + Name</span></div>
          <div className="flex flex-col items-center gap-1"><Sparkles className="h-5 w-5 text-primary" /><span className="text-[10px] text-muted-foreground">Icon only</span></div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">ArtifactCard</Label>
        <div className="w-72">
          <ArtifactCard artifact={{ id: "1", type: "audit", title: "Campaign Audit Report", description: "Full performance analysis of Q4 campaigns", changes: [], status: "pending" }} onClick={() => toast.info("Opening artifact...")} />
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">AanInput — Anatomy</Label>
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex-1"><Input placeholder="Ask Aan anything..." className="border-0 shadow-none h-8 text-sm bg-transparent" /></div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7"><Upload className="h-3.5 w-3.5" /></Button>
              <Button size="icon" className="h-7 w-7"><ArrowUp className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Model:</span>
              <Badge variant="secondary" className="text-[10px] h-5">Gemini 2.5 Pro</Badge>
            </div>
            <span style={{ fontSize: "10px" }} className="text-muted-foreground">Aan can make mistakes.</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">AI Gradient Usage</Label>
        <div className="space-y-3">
          <div className="h-10 rounded-md flex items-center px-4 text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, #8B5CF6, #6366F1, #3B82F6)" }}>Gradient header</div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5" style={{ borderImage: "linear-gradient(135deg, #8B5CF6, #3B82F6) 1" }}>
            <Sparkles className="h-4 w-4" style={{ color: "#6366F1" }} />
            <span className="text-sm" style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Gradient text</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Gradients restricted to Aan workspace only.</p>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">AanWorkspaceSidebar</Label>
        <div className="border border-border rounded-md bg-card w-56 overflow-hidden">
          <div className="p-3 border-b border-border"><AanLogo showByAnarix={false} /></div>
          <div className="p-2 space-y-0.5">
            <div className="px-2 py-1.5 text-xs text-foreground bg-muted/50 rounded-md">Today's conversation</div>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">Campaign audit analysis</div>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">Budget optimization draft</div>
          </div>
          <div className="p-2 border-t border-border">
            <Button variant="outline" size="sm" className="w-full text-xs gap-1"><Plus className="h-3 w-3" />New Conversation</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ModalsSection() {
  const modals = [
    { name: "COGSEditModal", desc: "Edit COGS. Number input + save/cancel." },
    { name: "ProductTrendsModal", desc: "Product trends chart. Date-range + multi-metric line." },
    { name: "CreateCampaignModal", desc: "Quick campaign creation (legacy). Name, type, budget." },
    { name: "AddKeywordTargetModal", desc: "Add keywords. Bulk text + match type." },
    { name: "AddProductAdsModal", desc: "Dual-pane product selector. Left: available. Right: selected." },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader id="modals" title="9. Modals & Dialogs" description="Confirmation dialogs, edit modals, and overlay patterns." />

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Modal Anatomy</Label>
        <div className="border border-border rounded-lg overflow-hidden w-96 shadow-lg bg-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Modal Title</span>
            <Button variant="ghost" size="icon" className="h-6 w-6"><X className="h-3.5 w-3.5" /></Button>
          </div>
          <div className="px-4 py-4 space-y-3">
            <p className="text-sm text-muted-foreground">Max width 520px. Focus trapped. ESC closes unless destructive.</p>
            <Input placeholder="Input field..." className="h-8 text-xs" />
          </div>
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
            <Button variant="outline" size="sm" className="text-xs">Cancel</Button>
            <Button size="sm" className="text-xs">Confirm</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Destructive Confirmation</Label>
        <div className="border border-border rounded-lg overflow-hidden w-96 shadow-lg bg-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Delete Campaign</span>
            <Button variant="ghost" size="icon" className="h-6 w-6"><X className="h-3.5 w-3.5" /></Button>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">This action cannot be undone.</p>
                <p className="text-sm text-muted-foreground mt-1">Permanently delete "Acme SP Auto" and all associated ad groups.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
            <Button variant="outline" size="sm" className="text-xs">Cancel</Button>
            <Button variant="destructive" size="sm" className="text-xs">Delete</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">All Modals</Label>
        <div className="space-y-2">
          {modals.map((m) => (
            <div key={m.name} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground shrink-0">{m.name}</code>
              <span className="text-xs text-muted-foreground">{m.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PatternsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader id="patterns" title="10. Page-Level Patterns" description="Complete page anatomy and tab group patterns." />

      <Card className="p-4 space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Complete Page Anatomy</Label>
        <div className="border border-border rounded-md overflow-hidden">
          <div className="px-4 py-3 bg-card border-b border-border">
            <div className="text-sm font-semibold text-foreground">PageHeader</div>
            <div className="text-xs text-muted-foreground">Title + Subtitle</div>
          </div>
          <div className="px-4 py-2 bg-muted/30 border-b border-border text-xs text-muted-foreground">AppTaskbar — Row 1 + Row 2</div>
          <div className="px-4 py-3 bg-card border-b border-border">
            <div className="flex gap-2">
              {["$45.2K", "$156.8K", "3.47x", "2.3M", "28.8%"].map((v, i) => (
                <div key={i} className="flex-1 text-center py-2 border border-border rounded-md">
                  <div className="text-xs text-muted-foreground">KPI {i + 1}</div>
                  <div className="text-sm font-medium text-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-6 bg-muted/20 border-b border-border text-center text-xs text-muted-foreground">PerformanceChart</div>
          <div className="px-4 py-2 bg-card border-b border-border">
            <div className="flex gap-4 text-xs">
              <span className="text-primary border-b-2 border-primary pb-1.5 font-medium">Campaigns</span>
              <span className="text-muted-foreground pb-1.5">Ad Groups</span>
              <span className="text-muted-foreground pb-1.5">Product Ads</span>
              <span className="text-muted-foreground pb-1.5">Keywords</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-card border-b border-border text-xs text-muted-foreground">DataTableToolbar</div>
          <div className="px-4 py-6 bg-card text-center text-xs text-muted-foreground">Data Table + Pagination</div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tab Group Patterns</Label>
        <div className="space-y-4">
          {[
            { name: "Campaign Manager", tabs: ["Campaigns", "Ad Groups", "Product Ads", "Keyword Targeting", "Product Targeting", "Search Terms", "Page Type", "Platform"] },
            { name: "Impact Analysis", tabs: ["Overview", "Campaign Impact", "Keyword Impact", "Placement Impact"] },
            { name: "Day Parting", tabs: ["Hourly Heatmap", "Day Analysis", "Scheduled Jobs", "History"] },
            { name: "Profitability", tabs: ["Dashboard", "Trends", "P&L", "Geographical", "Unified P&L"] },
            { name: "AMC", tabs: ["Queries", "Executed Queries", "Schedules", "Audiences", "Created Audiences", "Instances"] },
          ].map((group, idx) => (
            <div key={group.name}>
              {idx > 0 && <Separator className="mb-4" />}
              <span className="text-xs font-medium text-foreground">{group.name}</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                {group.tabs.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ComponentLibrary() {
  const { hash } = useLocation();
  const { section: paramSection } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const initialSection = (paramSection && SECTIONS.some((s) => s.id === paramSection)) ? paramSection : "primitives";
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (paramSection && SECTIONS.some((s) => s.id === paramSection)) {
      setActiveSection(paramSection);
      setTimeout(() => { document.getElementById(paramSection)?.scrollIntoView({ behavior: "smooth" }); }, 100);
    } else if (hash) {
      const id = hash.replace("#", "");
      if (SECTIONS.some((s) => s.id === id)) {
        setActiveSection(id);
        setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }, 100);
      }
    }
  }, [paramSection, hash]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    navigate(`/settings/component-library/${id}`, { replace: true });
  };

  return (
    <AppLayout>
      <PageHeader title="Component Library" subtitle="Systematic reference of all UI components and patterns" />
      <AppTaskbar breadcrumbItems={breadcrumbItems} />

      <div className="mt-4 flex gap-6">
        <nav className="hidden lg:block w-44 shrink-0 sticky top-16 self-start">
          <div className="space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`block w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeSection === s.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 min-w-0 space-y-12 pb-24">
          <PrimitivesSection />
          <NavigationSection />
          <TaskbarSection />
          <TablesSection />
          <CardsSection />
          <ChartsSection />
          <PanelsSection />
          <AanSection />
          <ModalsSection />
          <PatternsSection />
        </div>
      </div>
    </AppLayout>
  );
}
