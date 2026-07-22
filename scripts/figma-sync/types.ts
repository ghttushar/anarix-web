export type FigmaPageName =
  | "Authentication"
  | "Dashboard"
  | "Reports"
  | "Settings"
  | "Marketing Website"
  | "Shared Components";

export type RouteAuthState = "public" | "onboarding" | "authenticated";

export interface SyncViewport {
  width: number;
  height: number;
}

export interface SyncRoute {
  id: string;
  title: string;
  pathPattern: string;
  urlPath: string;
  figmaPage: FigmaPageName;
  authState: RouteAuthState;
  fullPage: boolean;
  viewport: SyncViewport;
  isDynamic: boolean;
  sampleParams: Record<string, string>;
}

export interface SyncScreenManifestEntry extends SyncRoute {
  screenshotPath: string;
  screenJsonPath: string;
  domSnapshotPath: string;
  semanticSnapshotPath?: string;
  layerCount: number;
  textNodeCount: number;
  capturedUrl: string;
  finalUrl: string;
  warnings: string[];
}

export interface SyncInventory {
  schemaVersion: 1;
  generatedAt: string;
  source: {
    repository: string;
    baseUrl: string;
    figmaFileKey: string;
    builderPackage: string;
  };
  pages: FigmaPageName[];
  screens: SyncScreenManifestEntry[];
}

export interface CapturedScreenJson {
  schemaVersion: 1;
  route: SyncRoute;
  capturedAt: string;
  capturedUrl: string;
  finalUrl: string;
  viewport: SyncViewport;
  fullPage: boolean;
  documentSize: {
    width: number;
    height: number;
  };
  layers: unknown[];
  regionSnapshots?: RegionSnapshot[];
  warnings: string[];
}

export interface DomSnapshotNode {
  tag: string;
  id?: string;
  className?: string;
  role?: string;
  ariaLabel?: string;
  dataFigmaRegionId?: string;
  text?: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styles: Record<string, string>;
  children: DomSnapshotNode[];
}

export interface DomSnapshot {
  root: DomSnapshotNode | null;
  truncated: boolean;
}

export interface RegionSnapshot {
  id: string;
  kind: "chart" | "map";
  path: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type SemanticKind =
  | "screen"
  | "container"
  | "sidebar"
  | "header"
  | "toolbar"
  | "filter-bar"
  | "table"
  | "row"
  | "cell"
  | "card-grid"
  | "kpi-card"
  | "chart"
  | "map"
  | "modal"
  | "drawer"
  | "tabs"
  | "breadcrumbs"
  | "text";

export interface SemanticLayout {
  mode: "NONE" | "HORIZONTAL" | "VERTICAL";
  gap: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  primaryAlign: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAlign: "MIN" | "CENTER" | "MAX" | "BASELINE";
  wrap?: boolean;
}

export interface SemanticImage {
  kind: "chart" | "map";
  bytesBase64: string;
}

export interface SemanticNode {
  id: string;
  kind: SemanticKind;
  name: string;
  tag: string;
  className?: string;
  text?: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    lineHeight?: number;
    letterSpacing?: number;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    opacity?: number;
    textAlign?: string;
  };
  layout: SemanticLayout;
  image?: SemanticImage;
  children: SemanticNode[];
}
