
## Plan

### 1. Teams Section Redesign (`TeamsSection.tsx`, `CaricatureMockup.tsx`)
Match the reference image aesthetic:
- **Default state:** caricature SVG (no monogram). Cards rendered in a single horizontal flowing row per department with slight rotation/staggered offset like the reference, soft shadow, rounded squircle (rx=18).
- **Hover state:** caricature crossfades to a real photo placeholder (circular `<img>` from `/team/{slug}.jpg` with graceful fallback to a richer photo-style SVG). Card lifts `y:-6`, scale `1.08`, name+role label fades in below.
- Replace dept-grouped grid with a more editorial layout: dept name + tagline on left, horizontal scrolling/wrapping caricature row on right (mirroring reference).
- Add a dark "Let's chat over chai" hero strip above teams (Bangalore-flavored pun: *"Let's chat more over Chai (or Filter Coffee)."*) with caricature row preview and a "Talk to an Expert" pill CTA.
- Upgrade `CaricatureMockup` with richer SVG: subtle gradient bg, hair highlights, shoulder garment color per dept, optional accessories (glasses/beard) deterministic by name hash. Add second variant `PhotoMockup` rendered as a more photo-realistic SVG portrait (skin shading, depth) used as the "photo" hover state until real photos are uploaded.

### 2. Content & Feature Audit — add coverage for innovative features
Add new sections / expand existing ones across:
- **Home (`Home.tsx`)** — insert `InnovationBand` highlighting: Aan Copilot, Ask Aan (text-selection tooltip), Full-Screen Aan workspace, Floating Action Island, Insights System, Command Palette (Cmd+K), Day-Parting heatmap, Sandbox dashboard. Each card: icon, name, one-line value prop, micro pun.
- **AanAI page** — new `AanSurfacesSection` describing the three Aan touchpoints with mock visuals:
  1. **Aan Copilot Panel** — right-side workspace
  2. **Ask Aan** — text-selection tooltip use-case (highlight a number → Aan explains)
  3. **Full-Screen Aan** — dedicated `/aan` route for deep work
  4. **Floating Action Island** — persistent hub for alerts + quick actions
  Each with a mini mock card showing the UI shape (no screenshots, hand-built mocks using app tokens).
- **Product pages** (Advertising, Profitability, Automation, ManagedServices) — add 1 extra "Why teams love it" content block + 1 use-case strip with 3 mini scenarios written as light pitch copy with mild puns ("Bid less, win more. Yes, really.").
- **About page** — keep teams; add small "Our principles" trio (Operators first, Reversible by default, Numbers don't lie — but they do whisper).

Tone: light, indirect, salesy with restrained puns. No emojis. Aan zone keeps the playful copy; analytics tone untouched.

### 3. Design polish + visuals
- Add a new `FeatureMockStrip.tsx` rendering small, distinct hand-coded mocks (command palette, floating island, ask-aan tooltip, full-screen workspace) using existing app design tokens — distinct silhouettes per feature so visuals don't repeat.
- Strengthen `AmbientBackdropV2` contrast in light mode (current bloom is too faint at 1668px). Add a subtle conic accent in hero zones only.

### 4. Alignment & Spacing Audit
Sweep all `src/website/pages/**` and `src/website/components/**`:
- Standardize section vertical rhythm to `py-24` (mobile `py-16`).
- Standardize container to `max-w-6xl mx-auto px-6`.
- Standardize SectionHeader margin-bottom to `mb-14`.
- Standardize card grid gaps to `gap-4` (dense) / `gap-6` (feature).
- Fix any orphan `mt-`/`pt-` overrides; remove inline magic numbers.
- Verify no horizontal overflow at 1668px and 390px.

### 5. Em-dash Purge
Run `rg -l "—" src/website src/components/aan` and replace every em-dash (—) and en-dash (–) with hyphen `-` across all website + Aan-facing copy. Code/comments included if user-visible. Skip generated files (supabase types).

### Files
**New:** `src/website/components/home/InnovationBand.tsx`, `src/website/components/aan/AanSurfacesSection.tsx`, `src/website/components/marketing/FeatureMockStrip.tsx`, `src/website/components/company/PhotoMockup.tsx`, `src/website/components/company/TeamsHero.tsx`, `src/website/components/marketing/UseCaseStrip.tsx`.
**Edited:** `TeamsSection.tsx`, `CaricatureMockup.tsx`, `Home.tsx`, `AanAI.tsx`, `About.tsx`, all 4 product pages, `AmbientBackdropV2.tsx`, plus em-dash sweep across `src/website/**`.

### Open question
1. For the team **photo hover**, should I generate stylized SVG "photo-style" portraits as placeholders (deterministic per name, distinct from caricature), or leave a real `<img src="/team/{slug}.jpg">` reference with a fallback caricature so you can drop real photos into `public/team/` later? (Recommended: do both — try `<img>` first, fall back to stylized portrait SVG.)
