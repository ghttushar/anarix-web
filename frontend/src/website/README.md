# Anarix Website — Handoff Folder

This folder contains the entire marketing website (`/website/*` routes). It's
designed to be mostly self-contained so a developer can lift it into a separate
project with minimal rework.

## Structure

```
src/website/
├── WebsiteLayout.tsx       Shared layout + ambient backdrop
├── website.css             Website-only Tailwind layer
├── components/             Header, Footer, hero blocks, page sections
├── pages/                  Routes mounted under /website
│   ├── Home.tsx
│   ├── Pricing.tsx         (redesigned, 2 majors x sub-tabs + table)
│   ├── AanAI.tsx
│   ├── Documentation.tsx
│   ├── Demo.tsx
│   ├── CancelPlan.tsx      Hidden — only via in-app redirect
│   ├── DowngradePlan.tsx   Hidden — only via in-app redirect
│   ├── company/
│   ├── products/
│   └── legal/
└── data/
    └── pricingPlans.ts     Plan + comparison data
```

## External dependencies the website still imports from the app

The website re-uses a handful of things from the broader app. Before extracting
this folder into a separate repo, copy these into `src/website/`:

- `@/components/ui/*` — shadcn primitives (`button`, `input`, `label`, `switch`,
  `dialog`, `tooltip`, `dropdown-menu`, `badge`). Copy the ones used and update
  imports inside `src/website` to point at the local copy.
- `@/assets/branding/*`, `@/assets/logo-*.svg`, `@/assets/illustrations/*` —
  copy into `src/website/assets/` and re-point website imports.
- `@/contexts/BrandingContext`, `ThemeContext` — only used to swap logos and
  colors. Either re-implement minimally or copy into `src/website/contexts/`.
- `@/lib/utils` (`cn`) — one-line helper, copy as `src/website/lib/utils.ts`.
- `@/contexts/TrialContext` and `@/contexts/BillingFlowContext` are imported
  by `Pricing.tsx`, `CancelPlan.tsx`, `DowngradePlan.tsx`. In a standalone
  build, gate these behind feature flags or replace with no-op stubs.

## Tailwind / styling

The website uses the same Tailwind config as the app. Extracted standalone, copy:

- `tailwind.config.ts` from the project root
- `index.css` (root tokens, only the `:root` and `.dark` blocks are needed)
- `src/website/website.css` (already website-scoped)

## Routing

This repo is website-only. Routes are mounted at the root in `src/App.tsx`,
wrapped in `WebsiteLayout`:

```tsx
<Route path="/" element={<WebsiteLayout />}>
  <Route index element={<Home />} />
  <Route path="product" element={<Product />} />
  <Route path="pricing" element={<Pricing />} />
  ...
  <Route path="cancel-plan" element={<CancelPlan />} />       // hidden
  <Route path="downgrade-plan" element={<DowngradePlan />} /> // hidden
</Route>
```

Old `/website/*` URLs redirect to their root equivalents via `LegacyWebsiteRedirect`.

The hidden routes use `HiddenRouteGuard` which checks for either a
`?from=app` query param or a `sessionStorage["anarix-cancel-from-app"]=1` flag.
Direct URL access falls back to `/`. They are also disallowed in
`public/robots.txt`.

## Status of extraction

This README documents the target structure. The actual asset / UI primitive
copying is intentionally deferred — duplicating all shadcn primitives and
re-pointing every `@/components/ui/*` import inside `src/website/` is a large
mechanical refactor that should be done as a single dedicated PR to avoid
breaking either side. Run this audit to find every external import:

```bash
rg -n 'from "@/(?!website)' src/website
```

Each match is a candidate for a local copy.
