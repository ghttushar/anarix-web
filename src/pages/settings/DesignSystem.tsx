import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { Chip } from "@/components/ui/chip";
import { toast } from "sonner";
import {
  Bell, Play, Sparkles, Lightbulb, Layers, Target, Percent, Package,
  ShoppingCart, DollarSign, RefreshCw, Activity, Gauge, FlaskConical,
  ShieldCheck, PackageCheck, PanelLeft, LayoutDashboard, Settings, Users,
  Search, Filter, Download, Upload, Plus, Minus, Check, X, ChevronDown,
  ChevronRight, ChevronLeft, ChevronUp, ArrowUp, ArrowDown, ArrowUpDown,
  Eye, EyeOff, Edit, Trash2, Copy, ExternalLink, Link, Mail, Calendar,
  Clock, TrendingUp, TrendingDown, BarChart3, LineChart, PieChart, Table,
  FileText, Image, Maximize2, Minimize2, MoreHorizontal, MoreVertical,
  AlertCircle, AlertTriangle, Info, CheckCircle, XCircle, Loader2, Pin,
  Home, Megaphone, Store, Globe, Zap, BookOpen, Hash, SlidersHorizontal,
  ListFilter, Columns3, GripVertical, Moon, Sun, LogOut, User, HelpCircle
} from "lucide-react";
import { AanMascot } from "@/components/aan/AanMascot";

const breadcrumbItems = [
  { label: "Settings", href: "/settings" },
  { label: "Design System" },
];

function ColorSwatch({ name, token, hsl, hex, usage }: {
  name: string; token: string; hsl: string; hex: string; usage: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md border border-border">
      <div className="w-10 h-10 rounded-md border border-border shrink-0" style={{ backgroundColor: hex }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <code className="text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground">{token}</code>
        </div>
        <div className="text-xs text-muted-foreground">{hsl} · {hex}</div>
        <div className="text-xs text-muted-foreground">{usage}</div>
      </div>
    </div>
  );
}

function TypeScaleExample({ level, size, weight, usage, example }: {
  level: string; size: string; weight: string; usage: string; example: string;
}) {
  const fontFamily = level.startsWith("H") || level === "Display" ? "var(--font-heading)" : "var(--font-body)";
  return (
    <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
      <div className="w-20 shrink-0">
        <span className="text-xs font-medium text-muted-foreground">{level}</span>
        <div className="text-[10px] text-muted-foreground">{size} / {weight}</div>
      </div>
      <div className="flex-1">
        <div style={{ fontSize: size, fontWeight: Number(weight), fontFamily }}>{example}</div>
        <div className="text-xs text-muted-foreground mt-1">{usage}</div>
      </div>
    </div>
  );
}

function SpacingExample({ value, pixels, usage }: { value: string; pixels: string; usage: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <code className="text-xs w-12 text-muted-foreground">{value}</code>
      <div className="flex items-center gap-2 flex-1">
        <div className="bg-primary/30 rounded-sm" style={{ width: pixels, height: "12px" }} />
        <span className="text-xs text-muted-foreground">{pixels}</span>
      </div>
      <span className="text-xs text-muted-foreground">{usage}</span>
    </div>
  );
}

function IconItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors">
      <Icon className="h-5 w-5 text-foreground" />
      <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

function ColorsTab() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Light Mode — Periwinkle System 01</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ColorSwatch name="Background" token="--background" hsl="230 33% 97%" hex="#F5F6FA" usage="App background" />
          <ColorSwatch name="Surface / Card" token="--card" hsl="0 0% 100%" hex="#FFFFFF" usage="Cards, panels" />
          <ColorSwatch name="Text Primary" token="--foreground" hsl="240 53% 9%" hex="#0F1020" usage="Primary text" />
          <ColorSwatch name="Text Muted" token="--muted-foreground" hsl="228 18% 40%" hex="#555D78" usage="Secondary text, labels" />
          <ColorSwatch name="Secondary (Ink Blue)" token="--secondary" hsl="234 30% 24%" hex="#2A2D4F" usage="Dividers, outlines" />
          <ColorSwatch name="Brand Primary" token="--primary" hsl="229 65% 57%" hex="#4A62D9" usage="Primary actions, links" />
          <ColorSwatch name="Brand Accent (Lilac)" token="--accent" hsl="231 74% 81%" hex="#A7AEF2" usage="Highlights only" />
          <ColorSwatch name="Border" token="--border" hsl="230 25% 90%" hex="#E0E3EE" usage="Borders, dividers" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Dark Mode — Periwinkle System 01</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ColorSwatch name="Background" token="--background" hsl="234 53% 9%" hex="#0E1020" usage="App background" />
          <ColorSwatch name="Surface / Card" token="--card" hsl="235 37% 14%" hex="#171A2E" usage="Cards, panels" />
          <ColorSwatch name="Text Primary" token="--foreground" hsl="240 100% 97%" hex="#ECEEFF" usage="Primary text" />
          <ColorSwatch name="Text Muted" token="--muted-foreground" hsl="230 27% 63%" hex="#8590B5" usage="Secondary text" />
          <ColorSwatch name="Secondary" token="--secondary" hsl="234 43% 32%" hex="#2F3470" usage="Dividers, outlines" />
          <ColorSwatch name="Brand Primary" token="--primary" hsl="231 88% 70%" hex="#6E82F5" usage="Primary actions" />
          <ColorSwatch name="Brand Accent" token="--accent" hsl="232 97% 87%" hex="#B8BEFF" usage="Highlights only" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Data Visualization — Reserved Colors</h2>
        <p className="text-sm text-muted-foreground">These colors are <strong>strictly reserved</strong> for data meaning. Never use for brand, decorative, or UI purposes.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <ColorSwatch name="Success / Positive" token="--success" hsl="142 55% 38%" hex="#1E9E4F" usage="Profit, positive deltas" />
          <ColorSwatch name="Destructive / Negative" token="--destructive" hsl="0 65% 48%" hex="#C93535" usage="Loss, negative deltas, errors" />
          <ColorSwatch name="Warning / Neutral" token="--warning" hsl="38 75% 45%" hex="#C98A14" usage="Caution, thresholds" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Aan AI Gradient</h2>
        <p className="text-sm text-muted-foreground">Used exclusively in Aan workspace — headers, entry points, highlight outlines. Never in core analytics or reports.</p>
        <div className="flex items-center gap-4">
          <div className="h-12 w-48 rounded-lg" style={{ background: "linear-gradient(135deg, #8B5CF6, #6366F1, #3B82F6)" }} />
          <code className="text-xs text-muted-foreground">linear-gradient(135deg, #8B5CF6, #6366F1, #3B82F6)</code>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Color Usage Rules</h2>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p>• 90–95% neutral UI, 5–10% color maximum</p>
          <p>• Brand color forbidden in tables and charts (unless explicitly specified)</p>
          <p>• Data viz colors must never be reused for brand or decoration</p>
          <p>• Accent color forbidden on text blocks</p>
          <p>• AI gradient only in Aan workspace</p>
          <p>• All colors defined as HSL tokens in <code className="text-xs bg-muted px-1 rounded">index.css</code></p>
        </div>
      </section>
    </div>
  );
}

function TypographyTab() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Font Families</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-4">
            <div className="text-sm font-medium text-foreground">Satoshi Variable</div>
            <div className="text-xs text-muted-foreground mb-2">Headings · <code>--font-heading</code></div>
            <div style={{ fontFamily: "var(--font-heading)" }} className="text-2xl font-semibold text-foreground">Aa Bb Cc 123</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium text-foreground">Noto Sans</div>
            <div className="text-xs text-muted-foreground mb-2">Body · <code>--font-body</code></div>
            <div style={{ fontFamily: "var(--font-body)" }} className="text-2xl text-foreground">Aa Bb Cc 123</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium text-foreground">Allura</div>
            <div className="text-xs text-muted-foreground mb-2">Aan accent only · <code>--font-aan</code></div>
            <div style={{ fontFamily: "var(--font-aan)" }} className="text-3xl text-foreground">Aan</div>
          </Card>
        </div>
      </section>

      <section className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Type Scale</h2>
        <TypeScaleExample level="H1" size="32px" weight="600" usage="Page title — one per page" example="Campaign Manager" />
        <TypeScaleExample level="H2" size="24px" weight="600" usage="Section title" example="Performance Overview" />
        <TypeScaleExample level="H3" size="18px" weight="500" usage="Subsection / Card title" example="Ad Group Settings" />
        <TypeScaleExample level="Body" size="14px" weight="400" usage="Primary text, descriptions" example="Manage and optimize your advertising campaigns across marketplaces." />
        <TypeScaleExample level="Small" size="13px" weight="400" usage="Table cells, secondary info" example="Last synced 2 minutes ago" />
        <TypeScaleExample level="Meta" size="12px" weight="400" usage="Labels, hints, captions" example="ACOS · CTR · ROAS" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Rules</h2>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p>• No center-aligned body text</p>
          <p>• No decorative typography in analytics</p>
          <p>• Allura font only inside Aan workspace</p>
          <p>• Active voice only for all UI copy</p>
          <p>• Sentences ≤ 16 words</p>
        </div>
      </section>
    </div>
  );
}

function SpacingTab() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">4px Base Unit Scale</h2>
        <Card className="p-4">
          <SpacingExample value="0.5" pixels="2px" usage="Micro gaps" />
          <SpacingExample value="1" pixels="4px" usage="Tight padding" />
          <SpacingExample value="1.5" pixels="6px" usage="Badge padding, icon gaps" />
          <SpacingExample value="2" pixels="8px" usage="Small gaps, table cell padding" />
          <SpacingExample value="3" pixels="12px" usage="Card padding (compact), toolbar gaps" />
          <SpacingExample value="4" pixels="16px" usage="Standard card padding, section gaps" />
          <SpacingExample value="5" pixels="20px" usage="Larger padding" />
          <SpacingExample value="6" pixels="24px" usage="Section spacing" />
          <SpacingExample value="8" pixels="32px" usage="Page-level spacing" />
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Component Padding Standards</h2>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p>• Button: <code className="bg-muted px-1 rounded text-xs">px-4 py-2</code> (40px height)</p>
          <p>• Input: <code className="bg-muted px-1 rounded text-xs">px-3 py-2</code> (40px height)</p>
          <p>• Table row: <code className="bg-muted px-1 rounded text-xs">h-11</code> (44px height)</p>
          <p>• Card: <code className="bg-muted px-1 rounded text-xs">p-4</code> (16px all sides)</p>
          <p>• Page content: <code className="bg-muted px-1 rounded text-xs">space-y-6</code> (24px vertical)</p>
          <p>• Toolbar gaps: <code className="bg-muted px-1 rounded text-xs">gap-2</code> (8px)</p>
        </div>
      </section>
    </div>
  );
}

function IconsTab() {
  const categories = [
    {
      name: "Navigation",
      icons: [
        { icon: Home, label: "Home" }, { icon: LayoutDashboard, label: "LayoutDashboard" },
        { icon: PanelLeft, label: "PanelLeft" }, { icon: ChevronLeft, label: "ChevronLeft" },
        { icon: ChevronRight, label: "ChevronRight" }, { icon: ChevronUp, label: "ChevronUp" },
        { icon: ChevronDown, label: "ChevronDown" }, { icon: ExternalLink, label: "ExternalLink" },
        { icon: Link, label: "Link" }, { icon: Globe, label: "Globe" },
      ],
    },
    {
      name: "Actions",
      icons: [
        { icon: Plus, label: "Plus" }, { icon: Minus, label: "Minus" },
        { icon: Edit, label: "Edit" }, { icon: Trash2, label: "Trash2" },
        { icon: Copy, label: "Copy" }, { icon: Download, label: "Download" },
        { icon: Upload, label: "Upload" }, { icon: Search, label: "Search" },
        { icon: Filter, label: "Filter" }, { icon: RefreshCw, label: "RefreshCw" },
        { icon: Play, label: "Play" }, { icon: Maximize2, label: "Maximize2" },
        { icon: Minimize2, label: "Minimize2" }, { icon: SlidersHorizontal, label: "SlidersHorizontal" },
        { icon: ListFilter, label: "ListFilter" }, { icon: Columns3, label: "Columns3" },
        { icon: GripVertical, label: "GripVertical" }, { icon: Pin, label: "Pin" },
      ],
    },
    {
      name: "Data & Metrics",
      icons: [
        { icon: TrendingUp, label: "TrendingUp" }, { icon: TrendingDown, label: "TrendingDown" },
        { icon: BarChart3, label: "BarChart3" }, { icon: LineChart, label: "LineChart" },
        { icon: PieChart, label: "PieChart" }, { icon: Activity, label: "Activity" },
        { icon: Gauge, label: "Gauge" }, { icon: Target, label: "Target" },
        { icon: Percent, label: "Percent" }, { icon: DollarSign, label: "DollarSign" },
        { icon: Hash, label: "Hash" }, { icon: ArrowUp, label: "ArrowUp" },
        { icon: ArrowDown, label: "ArrowDown" }, { icon: ArrowUpDown, label: "ArrowUpDown" },
      ],
    },
    {
      name: "System & UI",
      icons: [
        { icon: Settings, label: "Settings" }, { icon: Users, label: "Users" },
        { icon: User, label: "User" }, { icon: Mail, label: "Mail" },
        { icon: Calendar, label: "Calendar" }, { icon: Clock, label: "Clock" },
        { icon: FileText, label: "FileText" }, { icon: Image, label: "Image" },
        { icon: Table, label: "Table" }, { icon: Eye, label: "Eye" },
        { icon: EyeOff, label: "EyeOff" }, { icon: Moon, label: "Moon" },
        { icon: Sun, label: "Sun" }, { icon: LogOut, label: "LogOut" },
        { icon: MoreHorizontal, label: "MoreHorizontal" }, { icon: MoreVertical, label: "MoreVertical" },
        { icon: HelpCircle, label: "HelpCircle" }, { icon: BookOpen, label: "BookOpen" },
      ],
    },
    {
      name: "Status & Alerts",
      icons: [
        { icon: Check, label: "Check" }, { icon: X, label: "X" },
        { icon: CheckCircle, label: "CheckCircle" }, { icon: XCircle, label: "XCircle" },
        { icon: AlertCircle, label: "AlertCircle" }, { icon: AlertTriangle, label: "AlertTriangle" },
        { icon: Info, label: "Info" }, { icon: Bell, label: "Bell" },
        { icon: ShieldCheck, label: "ShieldCheck" }, { icon: Loader2, label: "Loader2" },
        { icon: Zap, label: "Zap" },
      ],
    },
    {
      name: "Commerce & Marketplace",
      icons: [
        { icon: ShoppingCart, label: "ShoppingCart" }, { icon: Package, label: "Package" },
        { icon: PackageCheck, label: "PackageCheck" }, { icon: Store, label: "Store" },
        { icon: Megaphone, label: "Megaphone" }, { icon: Layers, label: "Layers" },
        { icon: FlaskConical, label: "FlaskConical" }, { icon: Lightbulb, label: "Lightbulb" },
        { icon: Sparkles, label: "Sparkles" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <section key={cat.name} className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{cat.name}</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {cat.icons.map((item) => (
              <IconItem key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Sizing Rules</h2>
        <div className="flex items-end gap-6">
          <div className="flex flex-col items-center gap-1">
            <Search className="h-4 w-4 text-foreground" />
            <span className="text-[10px] text-muted-foreground">16px — Tables</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Search className="h-5 w-5 text-foreground" />
            <span className="text-[10px] text-muted-foreground">20px — Buttons</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Search className="h-6 w-6 text-foreground" />
            <span className="text-[10px] text-muted-foreground">24px — Headers</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Icons inherit <code className="bg-muted px-1 rounded text-xs">currentColor</code>. Use semantic text classes for consistent theming.</p>
      </section>
    </div>
  );
}

function AanTab() {
  const morphs = [
    { shape: "diamond" as const, label: "Diamond idle", desc: "The inherited Anarix form at rest: calm, ready, structurally tied to the brand." },
    { shape: "circle" as const, label: "Circle listening", desc: "Aan opens into a softer listening state when it receives human intent and context." },
    { shape: "bar" as const, label: "Bar loading", desc: "The form stretches into a bridge between prompt and output while work is processed." },
    { shape: "cube" as const, label: "Cube thinking", desc: "Aan condenses into a tighter analytical state when reasoning becomes focused." },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-lg border border-border bg-card p-6 flex items-center gap-8">
        <div className="shrink-0 w-32 h-32 flex items-center justify-center">
          <AanMascot state="idle" size={96} />
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Phase 02 — Meet Aan</p>
          <h2 className="text-xl font-semibold text-foreground">Aan is the Anarix diamond made intelligent.</h2>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Aan keeps the character but behaves with more seriousness. The mascot is the active intelligence
            layer across Anarix — watchful at rest, precise in motion, and useful in context.
          </p>
        </div>
      </section>

      {/* Naming */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4 space-y-1">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Hindi / Sanskrit</Label>
          <div className="text-sm text-foreground font-medium">Self-respect, dignity, grace, and the sun.</div>
          <p className="text-xs text-muted-foreground">Composed, intelligent, steady under pressure.</p>
        </Card>
        <Card className="p-4 space-y-1">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">English reading</Label>
          <div className="text-sm text-foreground font-medium">Presence, composure, intelligent attention.</div>
          <p className="text-xs text-muted-foreground">Aan reads as the intelligence on top of every action.</p>
        </Card>
        <Card className="p-4 space-y-1">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full form</Label>
          <div className="text-sm text-foreground font-medium">Anarix Analytical Nural</div>
          <p className="text-xs text-muted-foreground">Tied directly to the analytical core of the product.</p>
        </Card>
      </section>

      {/* Brand hues */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Brand hues used by Aan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <ColorSwatch name="Primary Coral" token="aan.coral" hsl="354 84% 70%" hex="#F26E77" usage="Mascot body — supplied exactly." />
          <ColorSwatch name="Primary Blue" token="aan.blue" hsl="229 65% 57%" hex="#4A62D9" usage="Logo + Aan accent. Never recolored." />
          <ColorSwatch name="Logo Ink" token="aan.ink" hsl="210 22% 14%" hex="#1D252D" usage="Wordmark + mascot eyes only." />
        </div>
      </section>

      {/* States & morphs */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">States & morphs</h2>
        <p className="text-sm text-muted-foreground">Each state is the same inherited Anarix form changing role, not identity.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {morphs.map((m) => (
            <div key={m.shape} className="rounded-lg border border-border bg-card p-4 flex flex-col items-center gap-3 text-center">
              <div className="h-24 flex items-center justify-center">
                <AanMascot shape={m.shape} size={64} interactive={false} />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">{m.label}</div>
                <p className="text-[11px] text-muted-foreground leading-snug">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Appearance rules */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-4 space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Aan appears when</Label>
          <ul className="text-sm text-foreground space-y-1">
            <li>• Chat dock and prompt entry</li>
            <li>• Copilot panels and split view</li>
            <li>• Action island and quick actions</li>
            <li>• Insight notices and generated artifacts</li>
          </ul>
        </Card>
        <Card className="p-4 space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Aan stays absent when</Label>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Static decoration in empty chrome</li>
            <li>• Repeated branding where no AI is active</li>
            <li>• Noisy mascot moments without purpose</li>
            <li>• Cute filler motion disconnected from work</li>
          </ul>
        </Card>
      </section>

      {/* Tone */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Tone rule — serious, calm, helpful.</h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Aan should never read as random decoration. The character stays mature, restrained, and useful so
          the brand keeps authority while still holding a clear personality.
        </p>
      </section>

      {/* Asset handoff */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Asset handoff</h2>
        <p className="text-sm text-muted-foreground">Keep the logo, symbol, and Lottie loader source unchanged.</p>
        <div className="flex flex-wrap gap-2">
          <a href="/animations/aan-loader.json" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">aan-loader.json</a>
          <span className="text-muted-foreground">·</span>
          <a href="/favicon-new.svg" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">anarix-symbol.svg</a>
          <span className="text-muted-foreground">·</span>
          <a href="/brand/aan" className="text-sm text-primary hover:underline">Open full mascot showcase →</a>
        </div>
      </section>
    </div>
  );
}

function ComponentsTab() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Buttons</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(["default", "secondary", "destructive", "ghost", "outline", "link"] as const).map((variant) => (
            <Card key={variant} className="p-4 space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">{variant}</Label>
              <div className="space-y-2">
                <Button variant={variant} size="sm">Default</Button>
                <Button variant={variant} size="sm" disabled>Disabled</Button>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-4 space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sizes</Label>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Form Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Text Input</Label>
            <Input placeholder="Default state" />
            <Input placeholder="Disabled" disabled />
          </Card>
          <Card className="p-4 space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select</Label>
            <Select defaultValue="option1">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </Card>
          <Card className="p-4 space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Checkbox & Switch</Label>
            <div className="flex items-center gap-2"><Checkbox id="ds-cb" defaultChecked /><label htmlFor="ds-cb" className="text-sm text-foreground">Checked</label></div>
            <div className="flex items-center gap-2"><Switch defaultChecked /><span className="text-sm text-foreground">Enabled</span></div>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Badges & Chips</h2>
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge>Default</Badge><Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge><Badge variant="outline">Outline</Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status="live" /><StatusBadge status="paused" /><StatusBadge status="archived" /><StatusBadge status="scheduled" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DeltaBadge value={12.5} /><DeltaBadge value={-8.3} /><DeltaBadge value={0} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Chip>SP</Chip><Chip>SB</Chip><Chip>SD</Chip>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Alerts & Toasts</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => toast.success("Success toast")}>Success Toast</Button>
          <Button size="sm" variant="outline" onClick={() => toast.error("Error toast")}>Error Toast</Button>
          <Button size="sm" variant="outline" onClick={() => toast.warning("Warning toast")}>Warning Toast</Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("Info toast")}>Info Toast</Button>
        </div>
      </section>
    </div>
  );
}

function StatesTab() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Button States</h2>
        <Card className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-center space-y-1"><Button size="sm">Default</Button><div className="text-[10px] text-muted-foreground">Default</div></div>
            <div className="text-center space-y-1"><Button size="sm" disabled>Disabled</Button><div className="text-[10px] text-muted-foreground">Disabled</div></div>
            <div className="text-center space-y-1"><Button size="sm" disabled><Loader2 className="h-3.5 w-3.5 animate-spin" /></Button><div className="text-[10px] text-muted-foreground">Loading</div></div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Input States</h2>
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><Label className="text-xs text-muted-foreground mb-1">Default</Label><Input placeholder="Type here..." /></div>
            <div><Label className="text-xs text-muted-foreground mb-1">Disabled</Label><Input placeholder="Disabled" disabled /></div>
            <div><Label className="text-xs text-muted-foreground mb-1">Error</Label><Input placeholder="Invalid" className="border-destructive" /><p className="text-xs text-destructive mt-1">Required field</p></div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Switch & Checkbox States</h2>
        <Card className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2"><Switch /><span className="text-xs text-muted-foreground">Off</span></div>
            <div className="flex items-center gap-2"><Switch defaultChecked /><span className="text-xs text-muted-foreground">On</span></div>
            <div className="flex items-center gap-2"><Switch disabled /><span className="text-xs text-muted-foreground">Disabled</span></div>
            <div className="flex items-center gap-2"><Checkbox /><span className="text-xs text-muted-foreground">Unchecked</span></div>
            <div className="flex items-center gap-2"><Checkbox defaultChecked /><span className="text-xs text-muted-foreground">Checked</span></div>
            <div className="flex items-center gap-2"><Checkbox disabled /><span className="text-xs text-muted-foreground">Disabled</span></div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Status Badge States</h2>
        <Card className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status="live" /><StatusBadge status="paused" /><StatusBadge status="archived" /><StatusBadge status="scheduled" /><StatusBadge status="out_of_budget" />
          </div>
        </Card>
      </section>
    </div>
  );
}

function LayoutTab() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">AppTaskbar — 2-Row Layout</h2>
        <Card className="p-4 space-y-2">
          <div className="border border-border rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-primary hover:underline cursor-pointer">Advertising</span>
                <ChevronRight className="h-3 w-3" /><span>Campaign Manager</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-success" /><span>Amazon US · Acme Corp · Last synced 2m ago</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-card">
              <div className="flex items-center gap-2">
                <div className="bg-muted/40 rounded-md px-2.5 py-1 text-xs text-muted-foreground">Ad Type: All</div>
                <div className="bg-muted/40 rounded-md px-2.5 py-1 text-xs text-muted-foreground">Date: Last 30 Days</div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="icon" className="h-7 w-7"><Sparkles className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Lightbulb className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><RefreshCw className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Bell className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Row 1: Breadcrumb + Account/Sync. Row 2: Filters + Island-off actions. Actions collapse to icons when panels open.</p>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Sidebar — Expanded vs Collapsed</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Expanded (w-56)</Label>
            <div className="mt-2 border border-border rounded-md p-3 space-y-2 bg-card w-48">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><LayoutDashboard className="h-4 w-4" /> Dashboard</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Megaphone className="h-4 w-4" /> Advertising</div>
              <div className="pl-8 text-xs text-muted-foreground">Campaign Manager</div>
              <div className="pl-8 text-xs text-muted-foreground">Budget Pacing</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><BarChart3 className="h-4 w-4" /> Analytics</div>
            </div>
          </Card>
          <Card className="p-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Collapsed (Icon-only)</Label>
            <div className="mt-2 border border-border rounded-md p-2 space-y-3 bg-card w-12 flex flex-col items-center">
              <LayoutDashboard className="h-5 w-5 text-foreground" />
              <Megaphone className="h-5 w-5 text-muted-foreground" />
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Right-Side Panel Structure</h2>
        <Card className="p-4">
          <div className="border border-border rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <span className="text-sm font-medium text-foreground">Panel Title</span>
              <Button variant="ghost" size="icon" className="h-6 w-6"><X className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="px-3 py-4 space-y-3 bg-card">
              <div className="h-3 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-8 bg-muted rounded w-full" /><div className="h-8 bg-muted rounded w-full" />
            </div>
            <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-border bg-muted/30">
              <Button variant="outline" size="sm">Cancel</Button><Button size="sm">Submit</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Fixed viewport. Independent ScrollArea. Auto-closes on outside click (except Aan/Create).</p>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Floating Action Island</h2>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border border-primary/60 rounded-full px-3 py-1.5 bg-card">
              <Sparkles className="h-4 w-4 text-primary" /><span className="text-xs font-medium text-primary">Ask Aan</span>
              <div className="w-px h-4 bg-border mx-1" />
              <Bell className="h-3.5 w-3.5 text-muted-foreground" /><Lightbulb className="h-3.5 w-3.5 text-muted-foreground" /><RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">← Expanded</span>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Page Structure Hierarchy</h2>
        <Card className="p-4">
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-foreground w-4">1</span> PageHeader (title + subtitle)</div>
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-foreground w-4">2</span> AppTaskbar (breadcrumb, filters, actions)</div>
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-foreground w-4">3</span> KPI Strip / Hero Cards</div>
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-foreground w-4">4</span> Performance Chart</div>
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-foreground w-4">5</span> UnderlineTabs (entity switching)</div>
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-foreground w-4">6</span> DataTableToolbar</div>
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-foreground w-4">7</span> Data Table + Pagination</div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default function DesignSystem() {
  const { hash } = useLocation();
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const validTabs = ["colors", "typography", "spacing", "icons", "components", "states", "layout"];
  const initialTab = (tab && validTabs.includes(tab)) ? tab : "colors";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    } else if (hash) {
      const h = hash.replace("#", "");
      if (validTabs.includes(h)) setActiveTab(h);
    }
  }, [tab, hash]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings/design-system/${value}`, { replace: true });
  };

  return (
    <AppLayout>
      <PageHeader title="Design System" subtitle="Periwinkle System 01 — Token-based design reference" />
      <AppTaskbar breadcrumbItems={breadcrumbItems} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
          <TabsTrigger value="typography" className="text-xs">Typography</TabsTrigger>
          <TabsTrigger value="spacing" className="text-xs">Spacing</TabsTrigger>
          <TabsTrigger value="icons" className="text-xs">Icons</TabsTrigger>
          <TabsTrigger value="components" className="text-xs">Components</TabsTrigger>
          <TabsTrigger value="states" className="text-xs">States</TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="mt-4"><ColorsTab /></TabsContent>
        <TabsContent value="typography" className="mt-4"><TypographyTab /></TabsContent>
        <TabsContent value="spacing" className="mt-4"><SpacingTab /></TabsContent>
        <TabsContent value="icons" className="mt-4"><IconsTab /></TabsContent>
        <TabsContent value="components" className="mt-4"><ComponentsTab /></TabsContent>
        <TabsContent value="states" className="mt-4"><StatesTab /></TabsContent>
        <TabsContent value="layout" className="mt-4"><LayoutTab /></TabsContent>
      </Tabs>
    </AppLayout>
  );
}
