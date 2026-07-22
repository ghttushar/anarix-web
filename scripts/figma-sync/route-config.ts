import fs from "node:fs";
import path from "node:path";
import type { FigmaPageName, RouteAuthState, SyncRoute, SyncViewport } from "./types";

export const DEFAULT_BASE_URL = "https://anarix-insight-engine.vercel.app";
export const DEFAULT_FIGMA_FILE_KEY = "octzdTT347bjxqNEtBkKcI";
export const DEFAULT_VIEWPORT: SyncViewport = { width: 1440, height: 900 };
export const FIGMA_PAGES: FigmaPageName[] = [
  "Authentication",
  "Dashboard",
  "Reports",
  "Settings",
  "Marketing Website",
  "Shared Components",
];

const REDIRECT_OR_DUPLICATE_ROUTES = new Set([
  "/",
  "*",
  "/desktop",
  "/desktop/*",
  "/tablet",
  "/tablet/*",
  "/mobile",
  "/mobile/*",
  "/_state/:state/*",
  "/workspace/:dashboardId",
  "/dayparting/hourly",
  "/dayparting/campaigns",
  "/dayparting/campaigns/:campaignId",
  "/dayparting/scheduled",
  "/dayparting/scheduled/*",
  "/website/company",
]);

const SAMPLE_PARAMS: Record<string, string> = {
  tab: "overview",
  section: "components",
  campaignId: "1",
  adGroupId: "ag-1",
  productAdId: "pa-1",
  templateId: "budget",
  ruleId: "r1",
  dashboardId: "demo-dashboard",
};

const TITLE_OVERRIDES: Record<string, string> = {
  "/login": "Login",
  "/onboarding/connect": "Connect Accounts",
  "/workspace": "Dashboard Builder",
  "/workspace/health-score": "Health Score",
  "/aan": "Aan Workspace",
  "/brand/aan": "Aan Mascot Showcase",
  "/reports/client-portal": "Automated Reports",
  "/profile": "Profile",
  "/website": "Website Home",
  "/website/aan-ai": "Website Aan AI",
  "/website/company/about": "Website About",
  "/website/company/career": "Website Careers",
  "/website/company/contact": "Website Contact",
  "/website/products/profitability": "Website Product Profitability",
  "/website/products/advertising": "Website Product Advertising",
  "/website/products/automation": "Website Product Automation",
  "/website/products/managed-services": "Website Managed Services",
  "/website/privacy-policy": "Website Privacy Policy",
  "/website/terms-and-conditions": "Website Terms And Conditions",
  "/website/cancel-plan": "Cancel Plan",
  "/website/downgrade-plan": "Downgrade Plan",
};

export function defaultAppSourcePath(cwd = process.cwd()) {
  return path.join(cwd, "src", "App.tsx");
}

export function extractRoutePatterns(source: string) {
  const paths: string[] = [];
  const seen = new Set<string>();
  const routeRegex = /<Route\b[^>]*\bpath=(?:"([^"]+)"|'([^']+)')[^>]*>/g;
  let match: RegExpExecArray | null;

  while ((match = routeRegex.exec(source))) {
    const raw = match[1] || match[2];
    const normalized = raw.startsWith("/") || raw === "*" ? raw : `/website/${raw}`;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      paths.push(normalized);
    }
  }

  if (source.includes('path="/website"') && !seen.has("/website")) {
    paths.push("/website");
  }

  return paths;
}

export function materializeRoute(pattern: string): SyncRoute | null {
  if (REDIRECT_OR_DUPLICATE_ROUTES.has(pattern)) return null;
  if (pattern.includes("*")) return null;

  const sampleParams: Record<string, string> = {};
  const urlPath = pattern.replace(/:([A-Za-z0-9_]+)/g, (_token, paramName: string) => {
    const value = SAMPLE_PARAMS[paramName] || `${paramName}-sample`;
    sampleParams[paramName] = value;
    return value;
  });

  return {
    id: routeId(urlPath),
    title: titleForRoute(urlPath),
    pathPattern: pattern,
    urlPath,
    figmaPage: figmaPageForRoute(urlPath),
    authState: authStateForRoute(urlPath),
    fullPage: shouldCaptureFullPage(urlPath),
    viewport: DEFAULT_VIEWPORT,
    isDynamic: Object.keys(sampleParams).length > 0,
    sampleParams,
  };
}

export function discoverRoutes(options: { appSourcePath?: string } = {}) {
  const appSourcePath = options.appSourcePath || defaultAppSourcePath();
  const source = fs.readFileSync(appSourcePath, "utf8");
  return extractRoutePatterns(source)
    .map(materializeRoute)
    .filter((route): route is SyncRoute => Boolean(route));
}

export function routeId(urlPath: string) {
  return urlPath
    .replace(/^\/+/, "")
    .replace(/\/+$/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "root";
}

function figmaPageForRoute(urlPath: string): FigmaPageName {
  if (urlPath === "/login" || urlPath.startsWith("/onboarding")) return "Authentication";
  if (urlPath.startsWith("/website")) return "Marketing Website";
  if (urlPath.startsWith("/reports")) return "Reports";
  if (
    urlPath.startsWith("/settings/design-system") ||
    urlPath.startsWith("/settings/component-library") ||
    urlPath.startsWith("/brand")
  ) {
    return "Shared Components";
  }
  if (urlPath.startsWith("/settings") || urlPath === "/profile") return "Settings";
  return "Dashboard";
}

function authStateForRoute(urlPath: string): RouteAuthState {
  if (urlPath === "/login" || urlPath.startsWith("/website")) return "public";
  if (urlPath.startsWith("/onboarding")) return "onboarding";
  return "authenticated";
}

function shouldCaptureFullPage(urlPath: string) {
  return urlPath.startsWith("/website");
}

function titleForRoute(urlPath: string) {
  if (TITLE_OVERRIDES[urlPath]) return TITLE_OVERRIDES[urlPath];

  return urlPath
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    .join(" / ");
}
