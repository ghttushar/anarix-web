## Final Mobile UI Hotfix Plan

### Goal
Make the mobile app feel intentionally designed, not desktop squeezed into phone width. This will be done through shared mobile shell/primitives so the fix applies across all app pages, not only the current Profitability Dashboard.

### 1. Force the correct mobile shell at phone width
- Update viewport handling so phone-sized previews/routes render the mobile shell reliably.
- If the viewport is mobile width, `AppLayout` must use `MobileShell` even when the stored app view is still `desktop`.
- Ensure `html[data-view="mobile"]` is set consistently so all mobile CSS and mobile primitives activate.

### 2. Mobile top bar cleanup
- Remove profile avatar from the top-right.
- Remove light/dark switcher from the top-right.
- Keep top bar only:

```text
[Hamburger] [Anarix logo]
```

- Remove mobile hover styles from top-bar buttons.
- Keep only active/pressed state styling.

### 3. Hamburger drawer bottom controls
- Move profile and theme controls to the drawer footer.
- Footer will contain:
  - Profile/account identity row.
  - Theme toggle button.
  - Profile actions: Profile, Billing, Settings, Preferences, Team, Sign out.
- Remove any duplicate/non-desktop profile blocks.
- No extra “desktop switch” or currency control.

### 4. Merge marketplace + account selector into one drawer selector
Replace the current two-row selector with one desktop-like nested selector:

```text
Marketplace / Account
Walmart · No Account                         >

Submenu:
Amazon                                      >
  Brand / account A
  Brand / account B
Walmart                                     >
  Brand / account A
  Brand / account B
Shopify                                     >
TikTok                                      >
```

- Marketplace and account/brand selection live in one component.
- No connect-new-account action.
- Selecting a marketplace shows its accounts directly under it.
- Selecting an account updates both marketplace and current account.
- Empty marketplaces show “No accounts” only.
- Use existing marketplace/account contexts.

### 5. App-level bar hard fix
- Remove Home button everywhere in the mobile app-level bar.
- Use dynamic `AanGlyph`, not static square/icon fallback.
- Keep labeled action buttons only:

```text
[Back / Current crumb] [Date] [Aan] [Insights] [Alerts]
```

- Make the app-level bar sticky below the mobile top bar:

```text
top: 56px
z-index: stable above page content
```

- Prevent breadcrumb overlap with fixed-width zones and truncation:
  - Left crumb max width.
  - Date pill centered but allowed to shrink.
  - Action buttons fixed width.
- No horizontal scroll inside the app-level bar.
- No hover styles in mobile; only active/on states.

### 6. Disable gestures on mobile
- Keep gesture provider for desktop/tablet.
- Do not render gesture feedback on mobile.
- Prevent mobile swipe/gesture handlers from activating in mobile view.
- This removes gesture interference with horizontal table scrolling.

### 7. Universal mobile toolbar replacement
Update shared `DataTableToolbar` so mobile does not render the desktop toolbar.

Mobile toolbar formation:

```text
Row 1: [Products/Orders or left tabs] [Search field]
Row 2: [Delta] [Sort/Group] [Filter] [Columns] [Export]
```

Rules:
- No horizontal scrolling.
- Fixed 32px control height.
- Labels stay on one line.
- Controls compress proportionally.
- Write actions remain hidden on mobile.
- Delta toggle uses the same `showDeltas/onShowDeltasChange` contract as desktop.
- Filter/Columns/Sort popovers remain functional.
- No mobile hover styles.

This automatically fixes all pages using `DataTableToolbar`, including Profitability, Advertising, BI, Catalog, AMC, Reports, and Day Parting.

### 8. Table alignment hard fix
Replace fragile global `display:block` table CSS with a deterministic scroll shell.

Rules for all mobile tables:
- The table itself keeps native table layout.
- The wrapper owns horizontal scroll.
- Header/body columns stay aligned.
- First column is sticky, opaque, and stable.
- Numeric columns are right-aligned with tabular numbers.
- Header cells are single-line.
- Product/order identity cells are constrained and intentionally truncated.
- Remove/keep hidden any “Tap to expand” info-only columns.
- Preserve existing expand chevrons and row expansion logic.

Target widths:
```text
First column: 180px mobile
Numeric columns: 92px minimum
Action/info columns: hidden if redundant
Row height: 44px
Header height: 44px
```

### 9. Profitability Dashboard specific cleanup
- Remove the nested extra rounded table card where it creates card-inside-card visuals.
- Use the mobile toolbar path from shared `DataTableToolbar`.
- Keep all columns horizontally accessible inside the table frame.
- Keep Delta working exactly like desktop using the existing `showDeltas` state.
- Ensure KPI/mobile hero cards no longer squeeze into clipped vertical cards.

### 10. Mobile CSS cleanup
- Remove CSS that globally changes every table to `display:block`.
- Add scoped selectors for:
  - `[data-mobile-shell]`
  - `[data-mobile-taskbar]`
  - `[data-mobile-toolbar]`
  - `[data-mobile-table-frame]`
- Add mobile-only rule disabling hover effects:

```text
html[data-view="mobile"] .mobile-no-hover ...
```

- Keep page-level horizontal overflow locked, but allow only table frames to scroll horizontally.

### 11. Verification pass
After implementation, verify at 390x844 on representative pages:
- `/profitability/dashboard`
- `/profitability/trends`
- `/advertising/campaigns`
- `/catalog/products`
- `/bi/keyword-tracker`
- `/reports/client-portal`
- `/dayparting`

Check:
- Mobile shell appears.
- App-level bar sticks under top bar.
- No Home button.
- Aan icon is dynamic.
- Drawer contains merged marketplace/account selector.
- Profile/theme are only in drawer bottom.
- No gestures trigger.
- Toolbar is aligned without horizontal scroll.
- Table columns align header-to-body.
- All columns are reachable horizontally inside the table frame.
- No page-level horizontal scroll.
- No mobile hover-only styling remains in the affected shell/toolbar/table controls.