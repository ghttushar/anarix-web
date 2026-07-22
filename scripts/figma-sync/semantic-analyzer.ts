import type {
  DomSnapshot,
  DomSnapshotNode,
  RegionSnapshot,
  SemanticKind,
  SemanticLayout,
  SemanticNode,
} from "./types";

interface AnalyzeOptions {
  routeId: string;
  routeTitle: string;
  documentSize: { width: number; height: number };
  regionSnapshots?: Array<RegionSnapshot & { bytesBase64?: string }>;
  quality?: "standard" | "high";
}

const DEFAULT_PADDING = { top: 0, right: 0, bottom: 0, left: 0 };

export function analyzeDomSnapshot(snapshot: DomSnapshot | null, options: AnalyzeOptions): SemanticNode | null {
  if (!snapshot?.root) return null;

  const regionById = new Map<string, RegionSnapshot & { bytesBase64?: string }>();
  for (const region of options.regionSnapshots || []) {
    regionById.set(region.id, region);
  }

  const root: SemanticNode = {
    id: `${options.routeId}-semantic-root`,
    kind: "screen",
    name: options.routeTitle,
    tag: "screen",
    rect: { x: 0, y: 0, width: options.documentSize.width, height: options.documentSize.height },
    style: {},
    layout: {
      mode: "NONE",
      gap: 0,
      padding: DEFAULT_PADDING,
      primaryAlign: "MIN",
      counterAlign: "MIN",
    },
    children: [],
  };

  const meaningfulChildren = (snapshot.root.children || [])
    .map((child, index) => normalizeNode(child, `${options.routeId}-${index}`, regionById, options.quality || "standard"))
    .filter((node): node is SemanticNode => Boolean(node));

  root.children = unwrapScreenChildren(meaningfulChildren);
  return root;
}

function normalizeNode(
  node: DomSnapshotNode,
  id: string,
  regionById: Map<string, RegionSnapshot & { bytesBase64?: string }>,
  quality: "standard" | "high",
): SemanticNode | null {
  if (shouldSkipNode(node)) return null;

  const children = (node.children || [])
    .map((child, index) => normalizeNode(child, `${id}-${index}`, regionById, quality))
    .filter((child): child is SemanticNode => Boolean(child));

  if (isMeaninglessWrapper(node, children)) {
    return children.length === 1 ? children[0] : createNode(node, id, "container", children, regionById, quality);
  }

  return createNode(node, id, classifyNode(node, children), children, regionById, quality);
}

function createNode(
  node: DomSnapshotNode,
  id: string,
  kind: SemanticKind,
  children: SemanticNode[],
  regionById: Map<string, RegionSnapshot & { bytesBase64?: string }>,
  quality: "standard" | "high",
): SemanticNode {
  const region = node.dataFigmaRegionId ? regionById.get(node.dataFigmaRegionId) : undefined;
  const text = cleanText(node.text);
  const layout = inferLayout(node, children, kind, quality);
  const imageKind = region ? inferRegionKind(kind, node, region) : undefined;

  return {
    id,
    kind,
    name: nodeName(node, kind, text),
    tag: node.tag,
    className: node.className,
    text,
    rect: node.rect,
    style: inferStyle(node),
    layout,
    image: region?.bytesBase64 && imageKind ? { kind: imageKind, bytesBase64: region.bytesBase64 } : undefined,
    children: normalizeTableChildren(kind, children),
  };
}

function unwrapScreenChildren(children: SemanticNode[]) {
  if (children.length === 1 && children[0].kind === "container") {
    const child = children[0];
    if (child.rect.x === 0 && child.rect.y === 0 && child.children.length > 0) {
      return child.children;
    }
  }
  return children;
}

function normalizeTableChildren(kind: SemanticKind, children: SemanticNode[]) {
  if (kind !== "table") return children;

  const rows = children.flatMap((child) => {
    if (child.kind === "row") return [child];
    const nestedRows = child.children.filter((nestedChild) => nestedChild.kind === "row");
    return nestedRows.length ? nestedRows : [child];
  });

  return rows.map((child, index) => ({
    ...child,
    kind: child.kind === "row" ? child.kind : ("row" as SemanticKind),
    name: child.kind === "row" ? child.name : `Row ${index + 1}`,
    layout: {
      ...child.layout,
      mode: "HORIZONTAL" as const,
      gap: 0,
      padding: child.layout.padding,
    },
    children: normalizeRowCells(child).map((cell, cellIndex) => ({
      ...cell,
      kind: cell.kind === "cell" ? cell.kind : ("cell" as SemanticKind),
      name: cell.kind === "cell" ? cell.name : `Cell ${cellIndex + 1}`,
    })),
  }));
}

function normalizeRowCells(row: SemanticNode) {
  if (row.children.some((child) => child.kind === "cell")) {
    return row.children.flatMap((child) => (child.kind === "cell" ? [child] : child.children.filter((nestedChild) => nestedChild.kind === "cell")));
  }
  return row.children;
}

function classifyNode(node: DomSnapshotNode, children: SemanticNode[]): SemanticKind {
  const classes = classSet(node);
  const className = normalizedClassName(node);
  const tag = node.tag.toLowerCase();
  const text = cleanText(node.text);

  if (node.dataFigmaRegionId && className.includes("map")) return "map";
  if (node.dataFigmaRegionId) return "chart";
  if (tag === "table" || role(node) === "table" || role(node) === "grid" || className.includes("data-table") || className.includes("table") || isGridLikeTable(node, children)) {
    return "table";
  }
  if (tag === "tr" || role(node) === "row" || className.includes("table-row")) return "row";
  if (["td", "th"].includes(tag) || role(node) === "cell" || role(node) === "gridcell" || role(node) === "columnheader" || className.includes("table-cell")) return "cell";
  if (className.includes("sidebar") || (node.rect.x <= 2 && node.rect.width >= 48 && node.rect.width <= 320 && node.rect.height > 600)) return "sidebar";
  if (tag === "header" || tag === "nav" || className.includes("topbar") || className.includes("taskbar") || isTopNavigation(node)) return "header";
  if (className.includes("toolbar") || isToolbarLike(node, text)) return "toolbar";
  if (className.includes("filter") || isFilterBarLike(node, text)) return "filter-bar";
  if (className.includes("breadcrumb")) return "breadcrumbs";
  if (className.includes("tabs") || className.includes("tablist")) return "tabs";
  if (className.includes("dialog") || className.includes("modal")) return "modal";
  if (className.includes("drawer") || className.includes("sheet")) return "drawer";
  if (className.includes("kpi") || (className.includes("card") && /roas|acos|spend|sales|orders|profit|margin/i.test(text))) return "kpi-card";
  if (className.includes("chart") || className.includes("recharts") || hasChartLikeChild(children)) return "chart";
  if (className.includes("map") || className.includes("geography")) return "map";
  if ((classes.has("grid") || className.includes("grid-cols")) && children.length >= 2) return "card-grid";
  if (children.length === 0 && text) return "text";
  return "container";
}

function inferRegionKind(
  kind: SemanticKind,
  node: DomSnapshotNode,
  region: RegionSnapshot & { bytesBase64?: string },
): "chart" | "map" {
  const context = `${kind} ${region.id} ${region.path} ${node.id || ""} ${node.className || ""} ${cleanText(node.text) || ""}`.toLowerCase();
  if (region.kind === "map" || kind === "map" || /map|geo|geography|country|state|territory/.test(context)) {
    return "map";
  }
  return "chart";
}

function isGridLikeTable(node: DomSnapshotNode, children: SemanticNode[]) {
  const className = normalizedClassName(node);
  if (!className.includes("grid") && !className.includes("divide-y")) return false;
  if (children.length < 3) return false;

  const rowLikeChildren = children.filter((child) => child.layout.mode === "HORIZONTAL" || child.kind === "row");
  const textDensity = children.filter((child) => hasTextDescendant(child)).length / children.length;
  return rowLikeChildren.length >= 2 || (className.includes("grid-cols") && textDensity > 0.6);
}

function isTopNavigation(node: DomSnapshotNode) {
  const className = normalizedClassName(node);
  return (
    node.rect.y <= 4 &&
    node.rect.width >= 640 &&
    node.rect.height >= 40 &&
    node.rect.height <= 120 &&
    (className.includes("sticky") || className.includes("border-b") || className.includes("shadow"))
  );
}

function isToolbarLike(node: DomSnapshotNode, text?: string) {
  if (node.rect.height > 96 || node.rect.width < 360) return false;
  return /export|download|refresh|search|view|sort/i.test(text || "");
}

function isFilterBarLike(node: DomSnapshotNode, text?: string) {
  if (node.rect.height > 120 || node.rect.width < 420) return false;
  return /filter|date|marketplace|status|campaign|range/i.test(text || "");
}

function hasTextDescendant(node: SemanticNode): boolean {
  return Boolean(node.text) || node.children.some((child) => hasTextDescendant(child));
}

function inferLayout(
  node: DomSnapshotNode,
  children: SemanticNode[],
  kind: SemanticKind,
  quality: "standard" | "high",
): SemanticLayout {
  const styles = node.styles || {};
  const classes = classSet(node);
  const className = normalizedClassName(node);
  const display = style(styles, "display");
  const flexDirection = style(styles, "flex-direction", "flexDirection");
  const hasFlex = display.includes("flex") || classes.has("flex") || className.includes("inline-flex");
  const hasGrid = display.includes("grid") || classes.has("grid");
  const tableLike = ["table", "row"].includes(kind);

  let mode: SemanticLayout["mode"] = "NONE";
  if (tableLike) mode = kind === "table" ? "VERTICAL" : "HORIZONTAL";
  else if (hasFlex) mode = flexDirection.includes("column") || classes.has("flex-col") ? "VERTICAL" : "HORIZONTAL";
  else if (hasGrid || kind === "card-grid") mode = "HORIZONTAL";
  else if (children.length > 1 && quality === "high") mode = inferAxisFromChildRects(children);

  return {
    mode,
    gap: inferGap(node, children, mode),
    padding: inferPadding(node),
    primaryAlign: inferPrimaryAlign(node),
    counterAlign: inferCounterAlign(node),
    wrap: hasGrid || className.includes("flex-wrap"),
  };
}

function inferAxisFromChildRects(children: SemanticNode[]): SemanticLayout["mode"] {
  const visible = children.filter((child) => child.rect.width > 0 && child.rect.height > 0);
  if (visible.length < 2) return "NONE";

  const xSpread = Math.max(...visible.map((child) => child.rect.x)) - Math.min(...visible.map((child) => child.rect.x));
  const ySpread = Math.max(...visible.map((child) => child.rect.y)) - Math.min(...visible.map((child) => child.rect.y));
  if (xSpread > ySpread * 1.4) return "HORIZONTAL";
  if (ySpread > xSpread * 1.1) return "VERTICAL";
  return "NONE";
}

function inferGap(node: DomSnapshotNode, children: SemanticNode[], mode: SemanticLayout["mode"]) {
  const explicit = numberStyle(node.styles, "gap") || numberStyle(node.styles, mode === "VERTICAL" ? "row-gap" : "column-gap");
  if (explicit > 0) return explicit;
  const tw = tailwindSpacing(node.className || "", "gap");
  if (tw > 0) return tw;
  if (mode === "NONE" || children.length < 2) return 0;

  const sorted = [...children].sort((a, b) => (mode === "HORIZONTAL" ? a.rect.x - b.rect.x : a.rect.y - b.rect.y));
  const gaps: number[] = [];
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const gap =
      mode === "HORIZONTAL"
        ? current.rect.x - (previous.rect.x + previous.rect.width)
        : current.rect.y - (previous.rect.y + previous.rect.height);
    if (gap >= 0 && gap < 96) gaps.push(gap);
  }
  return gaps.length ? Math.round(median(gaps)) : 0;
}

function inferPadding(node: DomSnapshotNode) {
  const className = node.className || "";
  const uniform = tailwindSpacing(className, "p");
  const px = tailwindSpacing(className, "px") || uniform;
  const py = tailwindSpacing(className, "py") || uniform;

  return {
    top: numberStyle(node.styles, "padding-top", "paddingTop") || py,
    right: numberStyle(node.styles, "padding-right", "paddingRight") || px,
    bottom: numberStyle(node.styles, "padding-bottom", "paddingBottom") || py,
    left: numberStyle(node.styles, "padding-left", "paddingLeft") || px,
  };
}

function inferPrimaryAlign(node: DomSnapshotNode): SemanticLayout["primaryAlign"] {
  const justify = style(node.styles, "justify-content", "justifyContent");
  const className = normalizedClassName(node);
  if (justify.includes("space-between") || className.includes("justify-between")) return "SPACE_BETWEEN";
  if (justify.includes("center") || className.includes("justify-center")) return "CENTER";
  if (justify.includes("end") || className.includes("justify-end")) return "MAX";
  return "MIN";
}

function inferCounterAlign(node: DomSnapshotNode): SemanticLayout["counterAlign"] {
  const align = style(node.styles, "align-items", "alignItems");
  const className = normalizedClassName(node);
  if (align.includes("center") || className.includes("items-center")) return "CENTER";
  if (align.includes("end") || className.includes("items-end")) return "MAX";
  if (align.includes("baseline") || className.includes("items-baseline")) return "BASELINE";
  return "MIN";
}

function inferStyle(node: DomSnapshotNode) {
  return {
    fontFamily: trimCssString(style(node.styles, "font-family", "fontFamily")),
    fontSize: numberStyle(node.styles, "font-size", "fontSize") || tailwindFontSize(node.className || ""),
    fontWeight: style(node.styles, "font-weight", "fontWeight") || undefined,
    lineHeight: numberStyle(node.styles, "line-height", "lineHeight"),
    letterSpacing: numberStyle(node.styles, "letter-spacing", "letterSpacing"),
    color: style(node.styles, "color"),
    backgroundColor: style(node.styles, "background-color", "backgroundColor"),
    borderColor: style(node.styles, "border-top-color", "borderTopColor"),
    borderWidth: numberStyle(node.styles, "border-top-width", "borderTopWidth"),
    borderRadius: numberStyle(node.styles, "border-radius", "borderRadius") || tailwindRadius(node.className || ""),
    opacity: numberStyle(node.styles, "opacity"),
    textAlign: style(node.styles, "text-align", "textAlign"),
  };
}

function shouldSkipNode(node: DomSnapshotNode) {
  const className = normalizedClassName(node);
  const rect = node.rect;
  if (!rect || rect.width < 0 || rect.height < 0) return true;
  if (className.includes("pointer-events-none") && className.includes("-z-10")) return true;
  if (className.includes("sr-only")) return true;
  if (style(node.styles, "display") === "none" || style(node.styles, "visibility") === "hidden") return true;
  if (rect.width === 0 && rect.height === 0 && !cleanText(node.text) && (!node.children || node.children.length === 0)) return true;
  return false;
}

function isMeaninglessWrapper(node: DomSnapshotNode, children: SemanticNode[]) {
  if (children.length === 0) return false;
  const className = normalizedClassName(node);
  const text = cleanText(node.text);
  const rect = node.rect;
  return (
    !text &&
    !className.includes("card") &&
    !className.includes("sidebar") &&
    !className.includes("toolbar") &&
    !className.includes("table") &&
    rect.height === 0
  );
}

function hasChartLikeChild(children: SemanticNode[]) {
  return children.some((child) => child.kind === "chart" || child.kind === "map" || child.className?.includes("recharts"));
}

function nodeName(node: DomSnapshotNode, kind: SemanticKind, text?: string) {
  if (kind === "text" && text) return text.slice(0, 64);
  if (node.ariaLabel) return `${kind}: ${node.ariaLabel}`;
  if (node.id) return `${kind}: #${node.id}`;
  return kind;
}

function classSet(node: DomSnapshotNode) {
  return new Set((node.className || "").split(/\s+/).filter(Boolean));
}

function normalizedClassName(node: DomSnapshotNode) {
  return (node.className || "").toLowerCase();
}

function role(node: DomSnapshotNode) {
  return (node.role || "").toLowerCase();
}

function style(styles: Record<string, string> | undefined, ...keys: string[]) {
  if (!styles) return "";
  for (const key of keys) {
    if (styles[key]) return String(styles[key]).trim();
  }
  return "";
}

function numberStyle(styles: Record<string, string> | undefined, ...keys: string[]) {
  const value = style(styles, ...keys);
  if (!value || value === "normal" || value === "auto") return 0;
  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function tailwindSpacing(className: string, prefix: string) {
  const match = className.split(/\s+/).find((classPart) => classPart === prefix || classPart.startsWith(`${prefix}-`));
  if (!match) return 0;
  const value = match.slice(prefix.length + 1).replace(/\[|\]|px/g, "");
  const number = Number(value);
  if (Number.isFinite(number)) return number * 4;
  return 0;
}

function tailwindFontSize(className: string) {
  if (/\btext-xs\b/.test(className)) return 12;
  if (/\btext-sm\b/.test(className)) return 14;
  if (/\btext-base\b/.test(className)) return 16;
  if (/\btext-lg\b/.test(className)) return 18;
  if (/\btext-xl\b/.test(className)) return 20;
  if (/\btext-2xl\b/.test(className)) return 24;
  if (/\btext-3xl\b/.test(className)) return 30;
  if (/\btext-4xl\b/.test(className)) return 36;
  return 14;
}

function tailwindRadius(className: string) {
  if (/\brounded-full\b/.test(className)) return 999;
  if (/\brounded-xl\b/.test(className)) return 12;
  if (/\brounded-lg\b/.test(className)) return 8;
  if (/\brounded-md\b/.test(className)) return 6;
  if (/\brounded-sm\b/.test(className)) return 4;
  return 0;
}

function cleanText(text?: string) {
  return text?.replace(/\s+/g, " ").trim() || undefined;
}

function trimCssString(value: string) {
  return value?.replace(/^["']|["']$/g, "").split(",")[0]?.trim() || undefined;
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}
