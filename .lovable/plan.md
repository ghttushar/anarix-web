
## Plan

### 1. Redesign the team-card stack (reference-image style)
Replace the dept-grouped grid in `TeamsSection.tsx` with a single, flowing horizontal row per department that mimics the uploaded reference:

- **Stacked overlap**: cards use negative left margin (`-ml-3` to `-ml-5` responsive) so each card visually overlaps its neighbor by ~25%.
- **Per-card tilt**: deterministic rotation `(-4° .. +4°)` based on index, with alternating sign so the row reads as a hand-laid arrangement, not a grid.
- **Squircle silhouette**: tighter `rounded-[28px]`, drop shadow `shadow-xl`, subtle white inner ring (`ring-1 ring-white/10`) so cards pop against dark backgrounds.
- **Hover behavior**: hovered card lifts (`y:-10`, `scale:1.12`), straightens (`rotate:0`), raises `z-index`, and pushes neighbors gently apart via group-hover sibling translate. Caricature crossfades to photo-style portrait (existing `PhotoMockup`).
- **Name label**: hidden by default, fades in below on hover only (so the row stays clean like the reference).
- **Layout shift**: department label (name + tagline + count) moves to a left rail, the right side becomes a single horizontal scroll row of stacked faces, no grid wrapping. On mobile, falls back to a wrapped flex with the same overlap + tilt.

The dark "Chai (or Filter Coffee)" hero strip already uses a mini version of this row - I'll upgrade it to match the new card silhouette and overlap so the two sections feel unified.

### 2. Redesign caricatures - Ghibli / animated 3D style
Rebuild `CaricatureMockup.tsx` from the ground up. Goals: soft, painted-3D feel, large round eyes with highlights, warm rim light, painterly hair shapes, gentle face shading. All hand-authored SVG (no raster, no AI generation).

New SVG construction:
- **Background**: soft radial gradient + subtle painterly "speckle" overlay (20-30 tiny low-opacity dots) for hand-drawn texture.
- **Face geometry**: rounder head proportions (Ghibli-style: wider face, smaller chin), soft shadow under chin, blush ovals.
- **Eyes**: large round eyes with iris gradient, two highlight dots (specular + secondary), eyelash arc on top. Deterministic pupil position so different members "look" slightly different directions.
- **Hair**: 4-6 painterly hair variants per dept, layered fills (base + highlight stroke) for the "stylized 3D" feel. Cowlick / bangs / side-swept / topknot / curly-fluff variants chosen by name hash.
- **Skin shading**: a second layer with multiply-blend dark patch on cheek/jaw side to fake 3D form. Nose hint as a soft curved highlight + shadow pair instead of a line.
- **Expressions**: 3 mouth variants (soft smile, open laugh, neutral lip-press), each with painterly inner-mouth shadow.
- **Optional accents**: glasses (rounded, with lens highlight), beard (deterministic), small earring dot, subtle freckle cluster.
- **Rim light**: soft white glow on the upper-left of head/shoulders to sell the 3D form.
- **Color palette per dept**: keep current dept tints, add a second "Ghibli-warm" accent layer (soft peach/sky/rose) so each card has a paint-pot feel rather than flat fills.

Result: the default card view is a row of Ghibli-style 3D-feel portraits, lightly tilted and overlapping, with hover revealing the more "photo-real" variant.

### 3. Files
**Edited only** (no new files):
- `src/website/components/company/CaricatureMockup.tsx` - full rewrite with Ghibli/3D style.
- `src/website/components/company/TeamsSection.tsx` - new stacked/overlapping row layout, hover lift, sibling-push, hidden labels by default.
- (Minor) `src/website/components/company/PhotoMockup.tsx` - tighten color palette so the hover-state portrait reads as the "real" version of the same Ghibli character (consistent face shape, eye position).

### Out of scope this round
- No content changes, no other pages touched, no new sections.
- Real photos still belong in `public/team/` later - hover-state remains the stylized portrait until then.

Ready to build on approval.
