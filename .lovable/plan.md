We will do a focused mobile-only repair, not another visual experiment. The desktop/tablet behavior stays intact.

## Actual issue
The mobile view is still using desktop table and toolbar assumptions. That creates oversized sticky columns, hidden/half-visible columns, broken active states, unusable Aan controls, and inconsistent app-level bars. The fix is to make mobile-specific behavior explicit in the components instead of relying on broad CSS overrides.

## Plan

### 1. Mobile tables: rebuild the usable geometry
- Remove bulk-selection checkbox columns from mobile only in table components that render row selection:
  - Campaign table
  - Product ads table
  - Search terms table
  - Impact table
  - Any table found with selection checkboxes during implementation
- Do not hide with CSS only; do not render those columns on mobile so space is recovered.
- Reduce sticky first column width on mobile:
  - Product/catalog first column: compact image + 1-line name + tiny SKU line.
  - Campaign/ad group/keyword first column: compact 1-line title + small metadata.
  - Target width: about 148–164px instead of 200–350px.
- Tighten numeric columns on mobile:
  - 64–88px widths depending on metric.
  - `tabular-nums`, right-aligned, no wrapping.
  - Header labels abbreviated only on mobile where needed.
- Keep native tables with sticky first column and horizontal scroll inside the table frame only.
- Goal: at least 3–4 useful columns visible on a 390px viewport.

### 2. Delta mode parity with desktop
- Fix Delta active button contrast in light and dark mode.
- Preserve visible text/icon when active.
- Ensure `showDeltas` reaches every table that already supports desktop deltas.
- Add missing delta cell rendering where desktop has it but mobile currently loses it.
- Keep delta badges inside cells without increasing row height too much.

### 3. Mobile toolbar cleanup
- Mobile only: remove edit, upload, download, export, and write-action buttons from table/tool/chart areas.
- Keep read-only controls:
  - Search
  - Delta
  - Group/Sort where useful
  - Filter
  - Columns only where it helps visibility
- Fix filter chips:
  - Arrange applied filters in up to 3 rows.
  - If there are more than 3 rows, the chip area becomes horizontally scrollable.
  - No vertical stacking that pushes the table too far down.

### 4. App-level metric bar repair
- Remove the word `Workspace` everywhere in the mobile app-level bar.
- Make the bar reliably sticky under the mobile top bar on every page.
- Remove internal horizontal scrolling from the bar.
- Allow height to grow when needed, with clear rows:
  - Row A: metric selectors only, like date range / marketplace / account / page selectors.
  - Row B: Aan, Insight, Alert as action buttons, visually separate from selectors.
  - Row C: Run CTA only when the page supports it.
- Keep drill-down back/parent control only on drill-down pages.
- Top-level pages navigate through hamburger only.

### 5. Aan mobile workspace functional repair
- Rework mobile Aan controls so all required buttons are usable:
  - Back
  - History/nav menu
  - Collapse/close controls
  - New chat
  - Text box
  - Send / attachment controls if present
- Keep the conversation as the only scrollable area.
- Keep input dock sticky at the bottom with safe-area padding.
- Ensure Aan uses the same dynamic Aan icon system as the rest of the app, not a static square.
- Remove unusable hover behavior on mobile.

### 6. Hamburger menu hierarchy
- Remove the artificial category grouping currently added on mobile.
- Match the desktop sidebar hierarchy and order.
- Show the Rules section in mobile, but only expose the active/applied rules page as requested.
- Keep profile collapsed in the drawer footer with expand chevron.
- Keep theme toggle/profile options in the drawer footer only.

### 7. Charts and graph usability
- Audit mobile chart cards shown in the screenshots.
- Remove mobile-only export/download/chart action buttons.
- Constrain charts inside `MobileChartFrame` so they do not overflow horizontally.
- Reduce title/legend/header width so the chart area has usable space.
- For dense charts, prioritize the data viewport over decorative headers.
- Fix obvious light/dark contrast failures on chart buttons, labels, and tabs.

### 8. Button functionality audit
- Audit every mobile-visible button in:
  - Mobile top bar
  - Mobile app-level bar
  - Hamburger drawer
  - Table toolbars
  - Aan workspace
  - Chart cards
  - Rules/Active Rules page
- Fix buttons that are invisible, unclickable, duplicated, or not wired.
- Mobile has no hover state; only default, active/selected, disabled, and pressed feedback.

### 9. Verification
- Verify at 390×844 mobile viewport.
- Check both light and dark modes.
- Check these pages specifically:
  - Catalog Products
  - Campaign Manager
  - Targeting Actions
  - Impact Analysis
  - Profit & Loss
  - Geographical Data
  - Day Parting
  - AMC Executed Queries
  - Reports
  - Active/Applied Rules
  - Aan workspace
- Acceptance target:
  - No page-level horizontal scroll.
  - Tables scroll only inside their own frame.
  - First column is compact and sticky.
  - 3–4 columns visible at once on standard mobile width.
  - No mobile edit/export/download controls.
  - App-level bar stays sticky and readable.
  - Aan controls are usable.
  - Light/dark contrast is readable.