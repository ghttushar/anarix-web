import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { chromium, type Browser, type Page } from "playwright";
import { buildPlugin } from "./build-plugin";
import {
  DEFAULT_BASE_URL,
  DEFAULT_FIGMA_FILE_KEY,
  FIGMA_PAGES,
  discoverRoutes,
} from "./route-config";
import { analyzeDomSnapshot } from "./semantic-analyzer";
import type {
  CapturedScreenJson,
  DomSnapshot,
  DomSnapshotNode,
  RegionSnapshot,
  SyncInventory,
  SyncRoute,
  SyncScreenManifestEntry,
} from "./types";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const OUTPUT_ROOT = path.join(ROOT, "figma-sync");
const SCREEN_DIR = path.join(OUTPUT_ROOT, "screens");
const DOM_DIR = path.join(OUTPUT_ROOT, "dom");
const SEMANTIC_DIR = path.join(OUTPUT_ROOT, "semantic");
const REGION_DIR = path.join(OUTPUT_ROOT, "regions");
const SCREENSHOT_DIR = path.join(OUTPUT_ROOT, "screenshots");
const REPORT_PATH = path.join(OUTPUT_ROOT, "sync-report.md");
const INVENTORY_PATH = path.join(OUTPUT_ROOT, "inventory.json");
const BUILDER_BROWSER_BUNDLE = require.resolve("@builder.io/html-to-figma/browser");

interface CaptureStats {
  layerCount: number;
  textNodeCount: number;
}

const baseUrl = stripTrailingSlash(process.env.SYNC_BASE_URL || DEFAULT_BASE_URL);
const figmaFileKey = process.env.FIGMA_FILE_KEY || DEFAULT_FIGMA_FILE_KEY;
const routeLimit = process.env.SYNC_ROUTE_LIMIT ? Number(process.env.SYNC_ROUTE_LIMIT) : null;
const quality = getQualityMode();

async function main() {
  resetOutput();
  const routes = routeLimit ? discoverRoutes().slice(0, routeLimit) : discoverRoutes();

  const browser = await chromium.launch({ headless: process.env.SYNC_HEADLESS !== "false" });
  const screens: SyncScreenManifestEntry[] = [];

  try {
    for (let index = 0; index < routes.length; index += 1) {
      const route = routes[index];
      const label = `[${index + 1}/${routes.length}] ${route.urlPath}`;
      console.log(`${label} capturing`);
      const entry = await captureRoute(browser, route);
      screens.push(entry);
      console.log(`${label} captured ${entry.layerCount} layers`);
    }
  } finally {
    await browser.close();
  }

  const inventory: SyncInventory = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      repository: "https://github.com/ghttushar/anarix-insight-engine",
      baseUrl,
      figmaFileKey,
      builderPackage: "@builder.io/html-to-figma@0.0.3",
    },
    pages: FIGMA_PAGES,
    screens,
  };

  writeJson(INVENTORY_PATH, inventory);
  writeReport(inventory);
  const plugin = buildPlugin({ inventoryPath: INVENTORY_PATH });

  console.log(
    JSON.stringify(
      {
        inventoryPath: relativePath(INVENTORY_PATH),
        reportPath: relativePath(REPORT_PATH),
        pluginDir: relativePath(plugin.pluginDir),
        screenCount: screens.length,
      },
      null,
      2,
    ),
  );
}

async function captureRoute(browser: Browser, route: SyncRoute): Promise<SyncScreenManifestEntry> {
  const context = await browser.newContext({
    viewport: route.viewport,
    deviceScaleFactor: quality === "high" ? 2 : 1,
    ignoreHTTPSErrors: true,
  });
  await context.addInitScript(initBrowserState, { state: route.authState });

  const page = await context.newPage();
  const warnings: string[] = [];
  page.on("pageerror", (error) => warnings.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      warnings.push(`console:${message.type()}: ${message.text().slice(0, 240)}`);
    }
  });

  const capturedUrl = `${baseUrl}${route.urlPath}`;
  try {
    await page.goto(capturedUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await recoverFromUnexpectedLogin(page, route);
    await waitForRenderedPage(page);
    await installEvaluationHelpers(page);
    const regionSnapshots = quality === "high" ? await captureRegionSnapshots(page, route) : [];
    await page.addScriptTag({ path: BUILDER_BROWSER_BUNDLE });
    await freezeTransientUi(page);

    const [layers, domSnapshot, documentSize] = await Promise.all([
      convertPageToFigmaLayers(page),
      captureDomSnapshot(page, quality),
      page.evaluate(() => ({
        width: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0, window.innerWidth),
        height: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0, window.innerHeight),
      })),
    ]);

    const stats = countLayerStats(layers);
    const screenshotPath = path.join(SCREENSHOT_DIR, `${route.id}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: route.fullPage });

    const screenPath = path.join(SCREEN_DIR, `${route.id}.json`);
    const domPath = path.join(DOM_DIR, `${route.id}.json`);
    const semanticPath = path.join(SEMANTIC_DIR, `${route.id}.json`);
    const semanticTree = analyzeDomSnapshot(domSnapshot, {
      routeId: route.id,
      routeTitle: route.title,
      documentSize,
      quality,
      regionSnapshots,
    });
    const screenJson: CapturedScreenJson = {
      schemaVersion: 1,
      route,
      capturedAt: new Date().toISOString(),
      capturedUrl,
      finalUrl: page.url(),
      viewport: route.viewport,
      fullPage: route.fullPage,
      documentSize,
      layers,
      regionSnapshots,
      warnings: dedupeWarnings(warnings),
    };

    writeJson(screenPath, screenJson);
    writeJson(domPath, domSnapshot);
    writeJson(semanticPath, semanticTree);

    return {
      ...route,
      screenshotPath: relativePath(screenshotPath),
      screenJsonPath: relativePath(screenPath),
      domSnapshotPath: relativePath(domPath),
      semanticSnapshotPath: relativePath(semanticPath),
      layerCount: stats.layerCount,
      textNodeCount: stats.textNodeCount,
      capturedUrl,
      finalUrl: page.url(),
      warnings: dedupeWarnings(warnings),
    };
  } finally {
    await context.close();
  }
}

function initBrowserState({ state }: { state: SyncRoute["authState"] }) {
    (window as unknown as { __name?: <T>(target: T) => T }).__name = (target) => target;

    const demoAccount = {
      id: "acc_sync_demo",
      marketplace: "walmart",
      accountType: "seller",
      merchantName: "Demo Store",
      merchantId: "DEMO123",
      region: "US",
      status: "connected",
      lastSync: "2026-06-10T00:00:00.000Z",
      bidAutomation: "ai",
    };

    try {
      localStorage.setItem("anarix-theme", "light");
      localStorage.setItem("anarix-app-view", "desktop");
      localStorage.setItem("anarix_marketplace", "walmart");
      localStorage.setItem("anarix-new-features-visible", "true");
      localStorage.setItem("anarix-visual-effects", "false");
      localStorage.setItem(
        "anarix-tutorial",
        JSON.stringify({ enabled: false, completed: true, lastSeen: "2026-06-10T00:00:00.000Z", currentStep: 0 }),
      );

      if (state === "authenticated") {
        localStorage.setItem("anarix_accounts", JSON.stringify([demoAccount]));
        localStorage.setItem("anarix_current_account", demoAccount.id);
        localStorage.setItem("anarix_onboarding_complete", "true");
      } else if (state === "onboarding") {
        localStorage.removeItem("anarix_accounts");
        localStorage.removeItem("anarix_current_account");
        localStorage.removeItem("anarix_onboarding_complete");
      } else {
        localStorage.removeItem("anarix_accounts");
        localStorage.removeItem("anarix_current_account");
        localStorage.removeItem("anarix_onboarding_complete");
      }
    } catch (_error) {
      // Best effort; the app is mock/localStorage based.
    }

    const style = document.createElement("style");
    style.setAttribute("data-figma-sync", "motion-freeze");
    style.textContent = `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
      [data-sonner-toaster],
      [data-radix-popper-content-wrapper],
      [role="tooltip"],
      .fixed.bottom-4.right-4 {
        display: none !important;
      }
    `;
    const appendStyle = () => document.documentElement.appendChild(style);
    if (document.documentElement) {
      appendStyle();
    } else {
      window.addEventListener("DOMContentLoaded", appendStyle, { once: true });
    }
}

async function recoverFromUnexpectedLogin(page: Page, route: SyncRoute) {
  if (route.authState !== "authenticated") return;
  if (!new URL(page.url()).pathname.startsWith("/login")) return;

  await page.fill('input[type="email"]', process.env.SYNC_LOGIN_EMAIL || "xyz@gmail.com").catch(() => undefined);
  await page.fill('input[type="password"]', process.env.SYNC_LOGIN_PASSWORD || "1234").catch(() => undefined);
  await page.click('button[type="submit"]').catch(() => undefined);
  await page.waitForTimeout(1200);

  await page.evaluate(() => {
    const demoAccount = {
      id: "acc_sync_demo",
      marketplace: "walmart",
      accountType: "seller",
      merchantName: "Demo Store",
      merchantId: "DEMO123",
      region: "US",
      status: "connected",
      lastSync: "2026-06-10T00:00:00.000Z",
      bidAutomation: "ai",
    };
    localStorage.setItem("anarix_accounts", JSON.stringify([demoAccount]));
    localStorage.setItem("anarix_current_account", demoAccount.id);
    localStorage.setItem("anarix_onboarding_complete", "true");
  });
  await page.goto(`${baseUrl}${route.urlPath}`, { waitUntil: "domcontentloaded", timeout: 45_000 });
}

async function waitForRenderedPage(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
  await page.evaluate(() => document.fonts?.ready).catch(() => undefined);
  await page
    .waitForFunction(
      () => {
        const root = document.querySelector("#root");
        const hasContent = Boolean(root && root.textContent && root.textContent.trim().length > 20);
        const loaders = Array.from(document.querySelectorAll('[aria-label*="loading" i], [class*="loader" i]'));
        return hasContent && loaders.length < 3;
      },
      { timeout: 20_000 },
    )
    .catch(() => undefined);
  await waitForStableLayout(page);
}

async function waitForStableLayout(page: Page) {
  let previous = "";
  let stableTicks = 0;
  const started = Date.now();

  while (Date.now() - started < (quality === "high" ? 9_000 : 6_000)) {
    const signature = await page.evaluate(() =>
      JSON.stringify({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        textLength: document.body?.innerText?.length || 0,
        svgCount: document.querySelectorAll("svg").length,
        canvasCount: document.querySelectorAll("canvas").length,
      }),
    );

    if (signature === previous) {
      stableTicks += 1;
      if (stableTicks >= 2) return;
    } else {
      stableTicks = 0;
      previous = signature;
    }

    await page.waitForTimeout(300);
  }
}

async function installEvaluationHelpers(page: Page) {
  await page.evaluate(() => {
    (window as unknown as { __name?: <T>(target: T) => T }).__name ||= (target) => target;
  });
}

async function freezeTransientUi(page: Page) {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const removable = [
      "[data-sonner-toast]",
      "[data-radix-popper-content-wrapper]",
      '[role="tooltip"]',
      '[role="status"]',
    ];
    for (const selector of removable) {
      document.querySelectorAll(selector).forEach((node) => node.remove());
    }
  });
}

async function captureRegionSnapshots(page: Page, route: SyncRoute): Promise<RegionSnapshot[]> {
  const regions = await page.evaluate(() => {
    const selector = [
      "canvas",
      "svg",
      '[class*="chart"]',
      '[class*="Chart"]',
      '[class*="recharts"]',
      '[class*="map"]',
      '[class*="Map"]',
      '[class*="Geography"]',
      '[class*="geography"]',
    ].join(",");

    const candidates = Array.from(document.querySelectorAll(selector))
      .map((element) => {
        const htmlElement = element as HTMLElement;
        const rect = htmlElement.getBoundingClientRect();
        const className = String(htmlElement.className || "");
        return { element: htmlElement, rect, className, tag: htmlElement.tagName.toLowerCase() };
      })
      .filter(({ rect, tag }) => rect.width >= 180 && rect.height >= 120 && (tag !== "svg" || rect.width >= 240))
      .sort((a, b) => b.rect.width * b.rect.height - a.rect.width * a.rect.height);

    const selected: Array<{
      id: string;
      kind: "chart" | "map";
      rect: { x: number; y: number; width: number; height: number };
    }> = [];

    const overlaps = (a: DOMRect, b: { x: number; y: number; width: number; height: number }) => {
      const xOverlap = Math.max(0, Math.min(a.right, b.x + b.width) - Math.max(a.left, b.x));
      const yOverlap = Math.max(0, Math.min(a.bottom, b.y + b.height) - Math.max(a.top, b.y));
      const overlapArea = xOverlap * yOverlap;
      const smaller = Math.min(a.width * a.height, b.width * b.height);
      return smaller > 0 && overlapArea / smaller > 0.55;
    };

    for (const candidate of candidates) {
      if (selected.length >= 10) break;
      if (selected.some((existing) => overlaps(candidate.rect, existing.rect))) continue;
      const id = `figma-region-${selected.length + 1}`;
      candidate.element.setAttribute("data-figma-region-id", id);
      const kind = /map|geography/i.test(candidate.className) ? "map" : "chart";
      selected.push({
        id,
        kind,
        rect: {
          x: Math.round(candidate.rect.x),
          y: Math.round(candidate.rect.y),
          width: Math.round(candidate.rect.width),
          height: Math.round(candidate.rect.height),
        },
      });
    }

    return selected;
  });

  const snapshots: RegionSnapshot[] = [];
  for (const region of regions) {
    const filePath = path.join(REGION_DIR, `${route.id}__${region.id}.png`);
    try {
      await page.locator(`[data-figma-region-id="${region.id}"]`).screenshot({
        path: filePath,
        timeout: 8_000,
      });
      snapshots.push({ ...region, path: relativePath(filePath) });
    } catch (error) {
      console.warn(`Could not capture ${route.id} ${region.id}: ${error}`);
    }
  }
  return snapshots;
}

async function convertPageToFigmaLayers(page: Page) {
  return page.evaluate(() => {
    const exported = (window as unknown as { htmlToFigma?: unknown }).htmlToFigma;
    const htmlToFigma =
      typeof exported === "function"
        ? exported
        : exported && typeof exported === "object" && "htmlToFigma" in exported
          ? (exported as { htmlToFigma: unknown }).htmlToFigma
          : null;

    if (typeof htmlToFigma !== "function") {
      throw new Error("Builder htmlToFigma browser bundle did not expose a converter");
    }

    const layers = htmlToFigma(document.body, false);
    return JSON.parse(
      JSON.stringify(layers, (key, value) => {
        if (key === "ref" || key === "parent") return undefined;
        if (typeof value === "function") return undefined;
        if (typeof Node !== "undefined" && value instanceof Node) return undefined;
        return value;
      }),
    );
  });
}

async function captureDomSnapshot(page: Page, captureQuality: "standard" | "high"): Promise<DomSnapshot> {
  return page.evaluate(({ qualityMode }) => {
    const STYLE_PROPS = [
      "display",
      "position",
      "visibility",
      "box-sizing",
      "width",
      "height",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "font-family",
      "font-size",
      "font-weight",
      "line-height",
      "letter-spacing",
      "color",
      "background-color",
      "border-top-color",
      "border-top-width",
      "border-radius",
      "opacity",
      "transform",
      "overflow",
      "white-space",
      "min-width",
      "max-width",
      "grid-template-columns",
      "grid-auto-flow",
      "flex-direction",
      "flex-wrap",
      "justify-content",
      "align-items",
      "gap",
      "row-gap",
      "column-gap",
      "text-align",
    ];
    const maxNodes = qualityMode === "high" ? 12000 : 6000;
    let count = 0;
    let truncated = false;

    function visit(element: Element): DomSnapshotNode | null {
      if (count >= maxNodes) {
        truncated = true;
        return null;
      }
      count += 1;

      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      const styleMap: Record<string, string> = {};
      for (const prop of STYLE_PROPS) styleMap[prop] = styles.getPropertyValue(prop);

      const children = Array.from(element.children)
        .map((child) => visit(child))
        .filter((child): child is DomSnapshotNode => Boolean(child));
      const ownText = Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 240);

      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || undefined,
        className: typeof element.className === "string" ? element.className || undefined : undefined,
        role: element.getAttribute("role") || undefined,
        ariaLabel: element.getAttribute("aria-label") || undefined,
        dataFigmaRegionId: element.getAttribute("data-figma-region-id") || undefined,
        text: ownText || undefined,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        styles: styleMap,
        children,
      };
    }

    return {
      root: document.body ? visit(document.body) : null,
      truncated,
    };
  }, { qualityMode: captureQuality });
}

function countLayerStats(layers: unknown[]): CaptureStats {
  const stats = { layerCount: 0, textNodeCount: 0 };
  const visit = (layer: unknown) => {
    if (!layer || typeof layer !== "object") return;
    stats.layerCount += 1;
    const maybeLayer = layer as { type?: string; children?: unknown[] };
    if (maybeLayer.type === "TEXT") stats.textNodeCount += 1;
    if (Array.isArray(maybeLayer.children)) maybeLayer.children.forEach(visit);
  };
  layers.forEach(visit);
  return stats;
}

function resetOutput() {
  fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  fs.mkdirSync(SCREEN_DIR, { recursive: true });
  fs.mkdirSync(DOM_DIR, { recursive: true });
  fs.mkdirSync(SEMANTIC_DIR, { recursive: true });
  fs.mkdirSync(REGION_DIR, { recursive: true });
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function writeReport(inventory: SyncInventory) {
  const lines = [
    "# Anarix Lovable-to-Figma Sync Report",
    "",
    `Generated: ${inventory.generatedAt}`,
    `Base URL: ${inventory.source.baseUrl}`,
    `Figma file key: ${inventory.source.figmaFileKey}`,
    `Quality mode: ${quality}`,
    `Screens: ${inventory.screens.length}`,
    "",
    "| Page | Screen | Route | Layers | Text | Warnings |",
    "| --- | --- | --- | ---: | ---: | ---: |",
    ...inventory.screens.map(
      (screen) =>
        `| ${screen.figmaPage} | ${screen.title} | ${screen.urlPath} | ${screen.layerCount} | ${screen.textNodeCount} | ${screen.warnings.length} |`,
    ),
    "",
    "Generated plugin: `figma-sync/plugin/manifest.json`",
    "Optional Codex/Figma direct-write script: `figma-sync/plugin/direct-write.use-figma.js`",
    "",
  ];

  fs.writeFileSync(REPORT_PATH, lines.join("\n"));
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function relativePath(filePath: string) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function dedupeWarnings(warnings: string[]) {
  return Array.from(new Set(warnings)).slice(0, 50);
}

function getQualityMode(): "standard" | "high" {
  const fromArg = process.argv.find((arg) => arg.startsWith("--quality="))?.split("=")[1];
  const qualityFlagIndex = process.argv.indexOf("--quality");
  const fromPair = qualityFlagIndex >= 0 ? process.argv[qualityFlagIndex + 1] : undefined;
  const value = fromArg || fromPair || process.env.SYNC_QUALITY || process.env.npm_config_quality || "standard";
  return value === "high" ? "high" : "standard";
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
