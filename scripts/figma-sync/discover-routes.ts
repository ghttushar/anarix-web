import fs from "node:fs";
import path from "node:path";
import { discoverRoutes, FIGMA_PAGES } from "./route-config";

const routes = discoverRoutes();
const payload = {
  generatedAt: new Date().toISOString(),
  pages: FIGMA_PAGES,
  routes,
};

const outputArgIndex = process.argv.indexOf("--output");
if (outputArgIndex >= 0) {
  const outputPath = process.argv[outputArgIndex + 1];
  if (!outputPath) throw new Error("--output requires a path");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
}

console.log(JSON.stringify(payload, null, 2));
