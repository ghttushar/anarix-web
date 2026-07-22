# Lovable-to-Figma Sync

Run this from the repository root:

```bash
npm run sync-to-figma
```

The command captures user-visible routes from the live Lovable/Vercel app, converts each rendered page through `@builder.io/html-to-figma`, and writes a static screen inventory under `figma-sync/`.

Useful environment variables:

```bash
SYNC_BASE_URL=https://anarix-insight-engine.vercel.app
SYNC_LOGIN_EMAIL=xyz@gmail.com
SYNC_LOGIN_PASSWORD=1234
FIGMA_FILE_KEY=octzdTT347bjxqNEtBkKcI
SYNC_ROUTE_LIMIT=3
```

Generated outputs:

- `figma-sync/inventory.json`: full screen manifest
- `figma-sync/screens/*.json`: per-screen Builder/Figma layer JSON
- `figma-sync/dom/*.json`: rendered DOM and computed-style snapshots
- `figma-sync/screenshots/*.png`: Playwright QA screenshots
- `figma-sync/plugin/manifest.json`: local Figma plugin manifest
- `figma-sync/plugin/direct-write.use-figma.js`: optional Codex/Figma MCP direct-write script

To import through Figma, open the target Figma file, load `figma-sync/plugin/manifest.json` as a development plugin, then run **Anarix Lovable Screen Sync**.

Do not commit a real Figma personal access token. If a token was pasted into a chat or terminal history, rotate it.
