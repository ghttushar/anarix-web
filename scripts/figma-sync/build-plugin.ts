import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transformSync } from "esbuild";
import { DEFAULT_BASE_URL, DEFAULT_FIGMA_FILE_KEY, FIGMA_PAGES } from "./route-config";
import { analyzeDomSnapshot } from "./semantic-analyzer";
import type { CapturedScreenJson, DomSnapshot, RegionSnapshot, SemanticNode, SyncInventory } from "./types";

const ROOT = process.cwd();
const OUTPUT_ROOT = path.join(ROOT, "figma-sync");
const INVENTORY_PATH = path.join(OUTPUT_ROOT, "inventory.json");
const PLUGIN_DIR = path.join(OUTPUT_ROOT, "plugin");

interface PluginScreen {
  id: string;
  title: string;
  urlPath: string;
  pathPattern: string;
  figmaPage: string;
  viewport: { width: number; height: number };
  documentSize: { width: number; height: number };
  layers: unknown[];
  semanticTree: SemanticNode | null;
}

interface PluginPayload {
  generatedAt: string;
  source: SyncInventory["source"];
  pages: string[];
  screens: PluginScreen[];
}

export function buildPlugin(options: { inventoryPath?: string; pluginDir?: string } = {}) {
  const inventoryPath = options.inventoryPath || INVENTORY_PATH;
  const pluginDir = options.pluginDir || PLUGIN_DIR;
  const payload = loadPayload(inventoryPath);
  const pluginCode = transpilePluginCode(createPluginCode(payload));

  fs.mkdirSync(pluginDir, { recursive: true });
  fs.writeFileSync(path.join(pluginDir, "manifest.json"), `${JSON.stringify(pluginManifest(), null, 2)}\n`);
  fs.writeFileSync(path.join(pluginDir, "code.js"), pluginCode);
  fs.writeFileSync(path.join(pluginDir, "ui.html"), createPluginUi(payload));
  fs.writeFileSync(path.join(pluginDir, "direct-write.use-figma.js"), createDirectWriteCode(payload));
  fs.writeFileSync(path.join(pluginDir, "inventory.embedded.json"), `${JSON.stringify(payload, null, 2)}\n`);

  return {
    pluginDir,
    manifestPath: path.join(pluginDir, "manifest.json"),
    screenCount: payload.screens.length,
    pages: payload.pages,
  };
}

function transpilePluginCode(source: string) {
  const result = transformSync(source, {
    target: "es2015",
    format: "iife",
    platform: "neutral",
    treeShaking: false,
    minify: false,
    legalComments: "none",
  });

  return `${result.code}\n`;
}

function loadPayload(inventoryPath: string): PluginPayload {
  if (!fs.existsSync(inventoryPath)) {
    return {
      generatedAt: new Date().toISOString(),
      source: {
        repository: "https://github.com/ghttushar/anarix-insight-engine",
        baseUrl: process.env.SYNC_BASE_URL || DEFAULT_BASE_URL,
        figmaFileKey: process.env.FIGMA_FILE_KEY || DEFAULT_FIGMA_FILE_KEY,
        builderPackage: "@builder.io/html-to-figma@0.0.3",
      },
      pages: FIGMA_PAGES,
      screens: [],
    };
  }

  const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8")) as SyncInventory;
  const screens: PluginScreen[] = inventory.screens.map((entry) => {
    const screenPath = path.resolve(ROOT, entry.screenJsonPath);
    const screen = JSON.parse(fs.readFileSync(screenPath, "utf8")) as CapturedScreenJson;
    const regionSnapshots = loadRegionSnapshots(screen);
    const semanticTree = compactSemanticTree(loadSemanticTree(entry, screen, regionSnapshots));

    return {
      id: entry.id,
      title: entry.title,
      urlPath: entry.urlPath,
      pathPattern: entry.pathPattern,
      figmaPage: entry.figmaPage,
      viewport: entry.viewport,
      documentSize: screen.documentSize,
      layers: semanticTree ? [] : screen.layers,
      semanticTree,
    };
  });

  return {
    generatedAt: inventory.generatedAt,
    source: inventory.source,
    pages: inventory.pages,
    screens,
  };
}

function loadSemanticTree(
  entry: SyncInventory["screens"][number],
  screen: CapturedScreenJson,
  regionSnapshots: Array<RegionSnapshot & { bytesBase64?: string }>,
): SemanticNode | null {
  const domPath = entry.domSnapshotPath ? path.resolve(ROOT, entry.domSnapshotPath) : "";
  if (domPath && fs.existsSync(domPath)) {
    const snapshot = JSON.parse(fs.readFileSync(domPath, "utf8")) as DomSnapshot;
    return analyzeDomSnapshot(snapshot, {
      routeId: entry.id,
      routeTitle: entry.title,
      documentSize: screen.documentSize,
      quality: process.env.SYNC_QUALITY === "standard" ? "standard" : "high",
      regionSnapshots,
    });
  }

  const semanticPath = entry.semanticSnapshotPath ? path.resolve(ROOT, entry.semanticSnapshotPath) : "";
  if (semanticPath && fs.existsSync(semanticPath)) {
    return JSON.parse(fs.readFileSync(semanticPath, "utf8")) as SemanticNode;
  }

  return null;
}

function loadRegionSnapshots(screen: CapturedScreenJson) {
  return (screen.regionSnapshots || []).map((region) => {
    const filePath = path.resolve(ROOT, region.path);
    const bytesBase64 = fs.existsSync(filePath) ? fs.readFileSync(filePath).toString("base64") : undefined;
    return {
      ...region,
      bytesBase64,
    };
  });
}

function compactSemanticTree(tree: SemanticNode | null): SemanticNode | null {
  if (!tree) return null;
  return compactSemanticNode(tree);
}

function compactSemanticNode(node: SemanticNode): SemanticNode {
  return {
    id: node.id,
    kind: node.kind,
    name: node.name,
    text: node.text,
    rect: {
      x: Math.round(node.rect.x),
      y: Math.round(node.rect.y),
      width: Math.round(node.rect.width),
      height: Math.round(node.rect.height),
    },
    style: compactStyle(node.style),
    layout: node.layout,
    image: node.image,
    children: node.children.map(compactSemanticNode),
  } as SemanticNode;
}

function compactStyle(style: SemanticNode["style"]) {
  const compacted: SemanticNode["style"] = {};
  for (const [key, value] of Object.entries(style || {})) {
    if (value === undefined || value === "" || value === 0) continue;
    compacted[key as keyof SemanticNode["style"]] = value as never;
  }
  return compacted;
}

function pluginManifest() {
  return {
    name: "Anarix Lovable Screen Sync",
    id: "anarix-lovable-screen-sync",
    api: "1.0.0",
    main: "code.js",
    ui: "ui.html",
    editorType: ["figma"],
    documentAccess: "dynamic-page",
  };
}

function createPluginCode(payload: PluginPayload) {
  return `${createImporterRuntime(payload)}

figma.showUI(__html__, { width: 400, height: 540 });
figma.ui.postMessage({
  type: "ready",
  screenCount: INVENTORY.screens.length,
  pages: INVENTORY.pages,
  generatedAt: INVENTORY.generatedAt,
});

figma.ui.onmessage = async (message) => {
  if (!message || message.type !== "import") return;
  try {
    const result = await importInventory((progress) => {
      figma.ui.postMessage({ type: "progress", progress });
    });
    figma.ui.postMessage({ type: "complete", result });
  } catch (error) {
    figma.ui.postMessage({
      type: "error",
      message: error && error.message ? error.message : String(error),
    });
  }
};
`;
}

function createDirectWriteCode(payload: PluginPayload) {
  return `${createImporterRuntime(payload)}

return await importInventory();
`;
}

function createImporterRuntime(payload: PluginPayload) {
  return `const INVENTORY = ${JSON.stringify(payload)};
const SYNC_NAMESPACE = "anarix.sync";
const GENERATED_KEY = "generated";

async function importInventory(onProgress) {
  const pageMap = ensurePages(INVENTORY.pages);
  const pageCounts = {};
  const imported = [];

  for (let index = 0; index < INVENTORY.screens.length; index += 1) {
    const screen = INVENTORY.screens[index];
    const page = pageMap[screen.figmaPage] || pageMap["Dashboard"];
    if (!page) throw new Error("Missing Figma page for " + screen.figmaPage);

    if (onProgress) {
      onProgress({
        index: index + 1,
        total: INVENTORY.screens.length,
        screen: screen.title,
        page: screen.figmaPage,
      });
    }

    const currentCount = pageCounts[screen.figmaPage] || 0;
    pageCounts[screen.figmaPage] = currentCount + 1;
    const frame = await importScreen(page, screen, currentCount);
    imported.push({ id: frame.id, title: screen.title, page: screen.figmaPage });
  }

  const firstImported = imported[0] && figma.getNodeById(imported[0].id);
  if (firstImported) {
    if (typeof figma.setCurrentPageAsync === "function") {
      await figma.setCurrentPageAsync(firstImported.parent);
    } else {
      figma.currentPage = firstImported.parent;
    }
    try {
      figma.viewport.scrollAndZoomIntoView([firstImported]);
    } catch (_error) {
      // Some automation contexts do not expose viewport helpers.
    }
  }

  return {
    importedCount: imported.length,
    pages: INVENTORY.pages,
    generatedAt: INVENTORY.generatedAt,
    nodes: imported,
  };
}

function ensurePages(pageNames) {
  const pageMap = {};
  for (const pageName of pageNames) {
    let page = figma.root.children.find((candidate) => candidate.name === pageName);
    if (!page) {
      page = figma.createPage();
      page.name = pageName;
    }
    pageMap[pageName] = page;
  }
  return pageMap;
}

async function importScreen(page, screen, pageIndex) {
  await loadPage(page);
  removePreviousScreen(page, screen.id);

  const width = positiveNumber(screen.documentSize && screen.documentSize.width, screen.viewport.width || 1440);
  const height = positiveNumber(screen.documentSize && screen.documentSize.height, screen.viewport.height || 900);
  const wrapper = figma.createFrame();
  wrapper.name = screen.title + " - " + screen.urlPath;
  wrapper.resize(width, height);
  wrapper.x = (pageIndex % 2) * (width + 120);
  wrapper.y = Math.floor(pageIndex / 2) * (Math.min(height, 1600) + 180);
  wrapper.clipsContent = false;
  wrapper.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  wrapper.setSharedPluginData(SYNC_NAMESPACE, GENERATED_KEY, "true");
  wrapper.setSharedPluginData(SYNC_NAMESPACE, "screenId", screen.id);
  wrapper.setSharedPluginData(SYNC_NAMESPACE, "route", screen.urlPath);
  wrapper.setSharedPluginData(SYNC_NAMESPACE, "generatedAt", INVENTORY.generatedAt);
  page.appendChild(wrapper);

  if (screen.semanticTree && screen.semanticTree.children && screen.semanticTree.children.length) {
    for (const child of screen.semanticTree.children) {
      await appendSemanticNode(child, wrapper, { x: 0, y: 0, width: width, height: height }, false);
    }
    return wrapper;
  }

  if (!screen.layers || !screen.layers.length) {
    await appendPlaceholder(wrapper, screen);
    return wrapper;
  }

  for (const layer of screen.layers) {
    await appendLayer(layer, wrapper);
  }

  return wrapper;
}

async function loadPage(page) {
  if (typeof figma.setCurrentPageAsync === "function") {
    await figma.setCurrentPageAsync(page);
  } else {
    figma.currentPage = page;
  }
}

function removePreviousScreen(page, screenId) {
  const previousNodes = page.findAll((node) => {
    return (
      typeof node.getSharedPluginData === "function" &&
      node.getSharedPluginData(SYNC_NAMESPACE, "screenId") === screenId
    );
  });
  for (const node of previousNodes) {
    node.remove();
  }
}

async function appendPlaceholder(parent, screen) {
  const font = await resolveFont("Inter");
  await figma.loadFontAsync(font);
  const text = figma.createText();
  text.fontName = font;
  text.characters = "No captured layers for " + screen.title;
  text.fontSize = 20;
  text.x = 32;
  text.y = 32;
  parent.appendChild(text);
}

async function appendSemanticNode(model, parent, parentRect, parentAutoLayout) {
  if (!model || !model.rect || isNonVisualSemanticNode(model)) return null;

  let node;
  if (model.image && model.image.bytesBase64) {
    node = createSemanticImage(model);
  } else if (model.kind === "text" && model.text) {
    node = await createSemanticText(model);
  } else {
    node = figma.createFrame();
    node.clipsContent = false;
  }

  parent.appendChild(node);
  await assignSemanticCommon(node, model, parentRect, parentAutoLayout);

  if ("appendChild" in node && node.type !== "TEXT") {
    const childParentUsesAutoLayout = hasSemanticAutoLayout(model);
    const children = sortedSemanticChildren(model);
    for (const child of children) {
      await appendSemanticNode(child, node, model.rect, childParentUsesAutoLayout);
    }

    if (model.kind !== "text" && model.text) {
      const ownText = semanticOwnTextModel(model);
      await appendSemanticNode(ownText, node, model.rect, childParentUsesAutoLayout);
    }
  }

  return node;
}

async function createSemanticText(model) {
  const text = figma.createText();
  const style = model.style || {};
  const font = await resolveFont(style.fontFamily || "Inter");
  await figma.loadFontAsync(font);
  text.fontName = font;
  text.characters = String(model.text || "");

  const fontSize = positiveNumber(style.fontSize, 14);
  text.fontSize = fontSize;
  safeAssign(text, "textAutoResize", "HEIGHT");
  safeAssign(text, "textAlignHorizontal", figmaTextAlign(style.textAlign));
  safeAssign(text, "lineHeight", style.lineHeight ? { unit: "PIXELS", value: Math.max(1, style.lineHeight) } : { unit: "AUTO" });
  safeAssign(text, "letterSpacing", { unit: "PIXELS", value: finiteNumber(style.letterSpacing, 0) });

  const fill = cssColorToPaint(style.color);
  if (fill) text.fills = [fill];

  return text;
}

function createSemanticImage(model) {
  const image = figma.createRectangle();
  try {
    const bytes = base64ToBytes(model.image.bytesBase64);
    image.fills = [{ type: "IMAGE", imageHash: figma.createImage(bytes).hash, scaleMode: "FILL" }];
  } catch (_error) {
    image.fills = [{ type: "SOLID", color: { r: 0.94, g: 0.95, b: 0.97 } }];
  }
  return image;
}

async function assignSemanticCommon(node, model, parentRect, parentAutoLayout) {
  const rect = model.rect || {};
  const style = model.style || {};
  node.name = model.name || model.kind || "Layer";

  if (parentAutoLayout) {
    safeAssign(node, "layoutSizingHorizontal", "FIXED");
    safeAssign(node, "layoutSizingVertical", node.type === "TEXT" ? "HUG" : "FIXED");
  } else {
    node.x = Math.round(finiteNumber(rect.x, 0) - finiteNumber(parentRect && parentRect.x, 0));
    node.y = Math.round(finiteNumber(rect.y, 0) - finiteNumber(parentRect && parentRect.y, 0));
  }

  if ("resize" in node) {
    const width = semanticNodeWidth(model, node);
    const height = semanticNodeHeight(model, node);
    try {
      node.resize(width, height);
    } catch (_error) {
      // Text and SVG-derived nodes occasionally reject a resize while fonts/images settle.
    }
  }

  if (isFiniteNumber(style.opacity)) {
    node.opacity = clamp(style.opacity, 0, 1);
  }

  if ("fills" in node && node.type !== "TEXT" && !(model.image && model.image.bytesBase64)) {
    const fill = cssColorToPaint(style.backgroundColor);
    node.fills = fill ? [fill] : [];
  }

  if ("strokes" in node && style.borderWidth > 0) {
    const stroke = cssColorToPaint(style.borderColor);
    if (stroke) {
      node.strokes = [stroke];
      node.strokeWeight = Math.max(0, style.borderWidth);
    }
  }

  if ("cornerRadius" in node && isFiniteNumber(style.borderRadius)) {
    node.cornerRadius = Math.max(0, style.borderRadius);
  }

  if (node.type === "FRAME") {
    applySemanticLayout(node, model);
  }
}

function applySemanticLayout(frame, model) {
  const mode = resolvedSemanticLayoutMode(model);
  if (mode === "NONE") return;

  const layout = model.layout || {};
  safeAssign(frame, "layoutMode", mode);
  safeAssign(frame, "primaryAxisSizingMode", "FIXED");
  safeAssign(frame, "counterAxisSizingMode", "FIXED");
  safeAssign(frame, "primaryAxisAlignItems", layout.primaryAlign || "MIN");
  safeAssign(frame, "counterAxisAlignItems", layout.counterAlign || "MIN");
  safeAssign(frame, "itemSpacing", Math.max(0, finiteNumber(layout.gap, 0)));
  safeAssign(frame, "paddingTop", Math.max(0, finiteNumber(layout.padding && layout.padding.top, 0)));
  safeAssign(frame, "paddingRight", Math.max(0, finiteNumber(layout.padding && layout.padding.right, 0)));
  safeAssign(frame, "paddingBottom", Math.max(0, finiteNumber(layout.padding && layout.padding.bottom, 0)));
  safeAssign(frame, "paddingLeft", Math.max(0, finiteNumber(layout.padding && layout.padding.left, 0)));
  safeAssign(frame, "layoutWrap", layout.wrap ? "WRAP" : "NO_WRAP");
}

function resolvedSemanticLayoutMode(model) {
  const kind = model.kind;
  if (kind === "sidebar" || kind === "table" || kind === "modal" || kind === "drawer") return "VERTICAL";
  if (kind === "header" || kind === "toolbar" || kind === "filter-bar" || kind === "row" || kind === "tabs" || kind === "breadcrumbs") return "HORIZONTAL";
  if (kind === "card-grid") return "HORIZONTAL";
  if (kind === "kpi-card") return "VERTICAL";
  return model.layout && model.layout.mode ? model.layout.mode : "NONE";
}

function hasSemanticAutoLayout(model) {
  return resolvedSemanticLayoutMode(model) !== "NONE";
}

function sortedSemanticChildren(model) {
  const children = Array.isArray(model.children) ? model.children.slice() : [];
  const mode = resolvedSemanticLayoutMode(model);
  if (model.layout && model.layout.wrap) {
    return children.sort((a, b) => {
      const rowDelta = Math.round((a.rect.y - b.rect.y) / 12) * 12;
      return rowDelta || a.rect.x - b.rect.x;
    });
  }
  if (mode === "HORIZONTAL") return children.sort((a, b) => a.rect.x - b.rect.x || a.rect.y - b.rect.y);
  if (mode === "VERTICAL") return children.sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x);
  return children;
}

function semanticOwnTextModel(model) {
  const padding = (model.layout && model.layout.padding) || { top: 0, right: 0, bottom: 0, left: 0 };
  const fontSize = positiveNumber(model.style && model.style.fontSize, 14);
  return {
    id: String(model.id || "node") + "-own-text",
    kind: "text",
    name: "Text",
    tag: "text",
    text: model.text,
    rect: {
      x: finiteNumber(model.rect.x, 0) + finiteNumber(padding.left, 0),
      y: finiteNumber(model.rect.y, 0) + finiteNumber(padding.top, 0),
      width: Math.max(1, finiteNumber(model.rect.width, 1) - finiteNumber(padding.left, 0) - finiteNumber(padding.right, 0)),
      height: Math.max(fontSize * 1.25, finiteNumber(model.rect.height, fontSize * 1.25) - finiteNumber(padding.top, 0) - finiteNumber(padding.bottom, 0)),
    },
    style: model.style || {},
    layout: { mode: "NONE", gap: 0, padding: { top: 0, right: 0, bottom: 0, left: 0 }, primaryAlign: "MIN", counterAlign: "MIN" },
    children: [],
  };
}

function semanticNodeWidth(model, node) {
  const rectWidth = positiveNumber(model.rect && model.rect.width, 1);
  if (node.type !== "TEXT") return rectWidth;
  const fontSize = positiveNumber(model.style && model.style.fontSize, 14);
  return Math.max(rectWidth + 8, estimateTextWidth(model.text, fontSize));
}

function semanticNodeHeight(model, node) {
  const rectHeight = positiveNumber(model.rect && model.rect.height, 1);
  if (node.type !== "TEXT") return rectHeight;
  const fontSize = positiveNumber(model.style && model.style.fontSize, 14);
  return Math.max(rectHeight, fontSize * 1.35);
}

function estimateTextWidth(text, fontSize) {
  const normalized = String(text || "").replace(/\\s+/g, " ").trim();
  if (!normalized) return 1;
  return Math.ceil(normalized.length * fontSize * 0.58) + 10;
}

function figmaTextAlign(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "center") return "CENTER";
  if (normalized === "right" || normalized === "end") return "RIGHT";
  if (normalized === "justify") return "JUSTIFIED";
  return "LEFT";
}

function cssColorToPaint(value) {
  const color = parseCssColor(value);
  if (!color || color.a <= 0.01) return null;
  return {
    type: "SOLID",
    color: { r: color.r, g: color.g, b: color.b },
    opacity: color.a,
  };
}

function parseCssColor(value) {
  const input = String(value || "").trim().toLowerCase();
  if (!input || input === "transparent" || input === "inherit" || input === "initial" || input === "rgba(0, 0, 0, 0)") return null;

  if (input[0] === "#") {
    const hex = input.slice(1);
    const full = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
    if (full.length === 6) {
      return {
        r: parseInt(full.slice(0, 2), 16) / 255,
        g: parseInt(full.slice(2, 4), 16) / 255,
        b: parseInt(full.slice(4, 6), 16) / 255,
        a: 1,
      };
    }
  }

  const match = input.match(/rgba?\\(([^)]+)\\)/);
  if (!match) return null;
  const parts = match[1].split(",").map((part) => Number(part.trim().replace("%", "")));
  if (parts.length < 3 || parts.some((part, index) => index < 3 && !Number.isFinite(part))) return null;
  return {
    r: clamp(parts[0] > 1 ? parts[0] / 255 : parts[0], 0, 1),
    g: clamp(parts[1] > 1 ? parts[1] / 255 : parts[1], 0, 1),
    b: clamp(parts[2] > 1 ? parts[2] / 255 : parts[2], 0, 1),
    a: parts.length >= 4 && Number.isFinite(parts[3]) ? clamp(parts[3], 0, 1) : 1,
  };
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function isNonVisualSemanticNode(model) {
  if (!model || !model.rect) return true;
  if (model.kind === "text") return !model.text;
  return model.rect.width <= 0 && model.rect.height <= 0 && (!model.children || !model.children.length) && !model.text;
}

async function appendLayer(layer, parent) {
  if (!layer || typeof layer !== "object") return null;
  const type = layer.type || (Array.isArray(layer.children) ? "FRAME" : "RECTANGLE");
  let node;

  if (type === "TEXT") {
    node = await createText(layer);
  } else if (type === "SVG" && layer.svg) {
    node = figma.createNodeFromSvg(String(layer.svg));
  } else if (type === "FRAME" || type === "GROUP" || Array.isArray(layer.children)) {
    node = figma.createFrame();
    node.clipsContent = Boolean(layer.clipsContent);
  } else {
    node = figma.createRectangle();
  }

  parent.appendChild(node);
  await assignCommon(node, layer);

  if (Array.isArray(layer.children) && "appendChild" in node) {
    for (const child of layer.children) {
      await appendLayer(child, node);
    }
  }

  return node;
}

async function createText(layer) {
  const text = figma.createText();
  const font = await resolveFont(layer.fontFamily || (layer.fontName && layer.fontName.family) || "Inter");
  await figma.loadFontAsync(font);
  text.fontName = font;
  text.characters = String(layer.characters || "");

  if (isFiniteNumber(layer.fontSize)) text.fontSize = Math.max(1, layer.fontSize);
  if (layer.textAlignHorizontal) safeAssign(text, "textAlignHorizontal", layer.textAlignHorizontal);
  if (layer.textAlignVertical) safeAssign(text, "textAlignVertical", layer.textAlignVertical);
  if (layer.lineHeight) safeAssign(text, "lineHeight", sanitizeLineHeight(layer.lineHeight));
  if (layer.letterSpacing) safeAssign(text, "letterSpacing", sanitizeLetterSpacing(layer.letterSpacing));

  return text;
}

async function assignCommon(node, layer) {
  node.name = String(layer.name || layer.type || "Layer");
  node.x = finiteNumber(layer.x, 0);
  node.y = finiteNumber(layer.y, 0);
  if (isFiniteNumber(layer.rotation)) node.rotation = layer.rotation;
  if (isFiniteNumber(layer.opacity)) node.opacity = clamp(layer.opacity, 0, 1);
  if (typeof layer.visible === "boolean") node.visible = layer.visible;

  if ("resize" in node) {
    const width = positiveNumber(layer.width, 1);
    const height = positiveNumber(layer.height, 1);
    try {
      node.resize(width, height);
    } catch (_error) {
      // Some SVG-derived nodes reject resize after creation. Keep their natural size.
    }
  }

  if ("fills" in node && Array.isArray(layer.fills)) {
    node.fills = await sanitizePaints(layer.fills);
  }
  if ("strokes" in node && Array.isArray(layer.strokes)) {
    node.strokes = await sanitizePaints(layer.strokes);
  }
  if ("strokeWeight" in node && isFiniteNumber(layer.strokeWeight)) {
    node.strokeWeight = layer.strokeWeight;
  }
  if ("cornerRadius" in node && isFiniteNumber(layer.cornerRadius)) {
    node.cornerRadius = Math.max(0, layer.cornerRadius);
  }
  if ("effects" in node && Array.isArray(layer.effects)) {
    node.effects = sanitizeEffects(layer.effects);
  }
}

async function sanitizePaints(paints) {
  const result = [];
  for (const paint of paints) {
    if (!paint || typeof paint !== "object") continue;

    if (paint.type === "SOLID" && paint.color) {
      result.push({
        type: "SOLID",
        color: normalizeColor(paint.color),
        opacity: isFiniteNumber(paint.opacity) ? clamp(paint.opacity, 0, 1) : 1,
        visible: paint.visible !== false,
      });
      continue;
    }

    if (paint.type === "IMAGE") {
      const imagePaint = clonePaint(paint);
      if (Array.isArray(paint.intArr)) {
        try {
          imagePaint.imageHash = figma.createImage(Uint8Array.from(paint.intArr)).hash;
        } catch (_error) {
          continue;
        }
      }
      delete imagePaint.intArr;
      if (imagePaint.imageHash) result.push(imagePaint);
      continue;
    }

    if (String(paint.type || "").startsWith("GRADIENT")) {
      result.push(clonePaint(paint));
    }
  }
  return result;
}

function sanitizeEffects(effects) {
  return effects
    .filter((effect) => effect && typeof effect === "object" && effect.type)
    .map((effect) => ({ ...effect }));
}

function clonePaint(paint) {
  return JSON.parse(JSON.stringify(paint));
}

function normalizeColor(color) {
  return {
    r: normalizeChannel(color.r),
    g: normalizeChannel(color.g),
    b: normalizeChannel(color.b),
  };
}

function normalizeChannel(value) {
  const number = finiteNumber(value, 0);
  return clamp(number > 1 ? number / 255 : number, 0, 1);
}

function sanitizeLineHeight(lineHeight) {
  if (typeof lineHeight === "number") return { unit: "PIXELS", value: Math.max(1, lineHeight) };
  if (lineHeight && isFiniteNumber(lineHeight.value)) {
    return {
      unit: lineHeight.unit === "PERCENT" ? "PERCENT" : "PIXELS",
      value: Math.max(1, lineHeight.value),
    };
  }
  return { unit: "AUTO" };
}

function sanitizeLetterSpacing(letterSpacing) {
  if (typeof letterSpacing === "number") return { unit: "PIXELS", value: letterSpacing };
  if (letterSpacing && isFiniteNumber(letterSpacing.value)) {
    return {
      unit: letterSpacing.unit === "PERCENT" ? "PERCENT" : "PIXELS",
      value: letterSpacing.value,
    };
  }
  return { unit: "PIXELS", value: 0 };
}

async function resolveFont(fontFamily) {
  const requested = normalizeFontFamily(fontFamily);
  const fonts = await figma.listAvailableFontsAsync();
  const exact = fonts.find((font) => normalizeFontFamily(font.fontName.family) === requested);
  if (exact) return exact.fontName;
  const inter = fonts.find((font) => normalizeFontFamily(font.fontName.family) === "inter" && font.fontName.style === "Regular");
  if (inter) return inter.fontName;
  const regular = fonts.find((font) => font.fontName.style === "Regular");
  return regular ? regular.fontName : fonts[0].fontName;
}

function normalizeFontFamily(fontFamily) {
  return String(fontFamily || "")
    .split(",")[0]
    .replace(/['"]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function safeAssign(target, key, value) {
  try {
    target[key] = value;
  } catch (_error) {
    // Ignore unsupported imported properties; fidelity is best-effort.
  }
}

function finiteNumber(value, fallback) {
  return isFiniteNumber(value) ? value : fallback;
}

function positiveNumber(value, fallback) {
  return Math.max(1, finiteNumber(value, fallback));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
`;
}

function createPluginUi(payload: PluginPayload) {
  const pageSummary = payload.pages
    .map((page) => {
      const count = payload.screens.filter((screen) => screen.figmaPage === page).length;
      return `<li><span>${escapeHtml(page)}</span><strong>${count}</strong></li>`;
    })
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
        padding: 20px;
        font: 12px/1.45 Inter, sans-serif;
        color: #151621;
        background: #f7f8fb;
      }
      h1 { font-size: 18px; margin: 0 0 8px; }
      p { margin: 0 0 14px; color: #5d6478; }
      button {
        width: 100%;
        height: 40px;
        border: 0;
        border-radius: 8px;
        background: #4a62d9;
        color: white;
        font-weight: 700;
        cursor: pointer;
      }
      button:disabled { opacity: .6; cursor: default; }
      ul {
        list-style: none;
        padding: 0;
        margin: 16px 0;
        border: 1px solid #e3e6ef;
        border-radius: 8px;
        overflow: hidden;
        background: white;
      }
      li {
        display: flex;
        justify-content: space-between;
        padding: 9px 12px;
        border-bottom: 1px solid #eef0f5;
      }
      li:last-child { border-bottom: 0; }
      #status {
        margin-top: 14px;
        min-height: 36px;
        color: #3e455b;
        white-space: pre-wrap;
      }
      .meta { font-size: 11px; color: #777f93; }
    </style>
  </head>
  <body>
    <h1>Anarix Screen Sync</h1>
    <p>Imports ${payload.screens.length} static editable screens into organized Figma pages.</p>
    <div class="meta">Generated ${escapeHtml(payload.generatedAt)}</div>
    <ul>${pageSummary}</ul>
    <button id="importButton">Import Screens</button>
    <div id="status">Ready.</div>
    <script>
      var button = document.getElementById("importButton");
      var status = document.getElementById("status");
      button.onclick = function () {
        button.disabled = true;
        status.textContent = "Starting import...";
        parent.postMessage({ pluginMessage: { type: "import" } }, "*");
      };
      onmessage = function (event) {
        var message = event.data.pluginMessage;
        if (!message) return;
        if (message.type === "progress") {
          var progress = message.progress;
          status.textContent = progress.index + "/" + progress.total + " " + progress.page + "\\n" + progress.screen;
        }
        if (message.type === "complete") {
          status.textContent = "Imported " + message.result.importedCount + " screens.";
          button.disabled = false;
        }
        if (message.type === "error") {
          status.textContent = "Import failed: " + message.message;
          button.disabled = false;
        }
      };
    </script>
  </body>
</html>
`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = buildPlugin();
  console.log(JSON.stringify(result, null, 2));
}
