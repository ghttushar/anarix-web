## Goal

The current taco reads flat and small in a centered column. The user wants the visual energy of the attached 3D taco reference (volumetric shell, plump fillings, soft studio lighting) — but executed as a mature, editorial illustration that fits Anarix's serious analytical platform tone.

## Visual concept

**Bigger, dimensional, asymmetric.** Replace the small flat side-profile with a large 3/4-view taco rendered as layered SVG with soft gradient shading to simulate volume — inspired by the 3D reference but kept as a refined 2D illustration (no photoreal, no glossy plastic look).

**Side-by-side editorial layout** (replaces the current centered stack):
- Left (60%): the taco illustration, ~520px tall, sitting on a soft pedestal of light. Bite removed from upper-right ~30%.
- Right (40%): typographic poster — eyebrow, large headline with morphing 30%, supporting paragraph, and a small stat strip ("avg TACoS reduction · 30%" / "across 100+ brands" / "in first 90 days").
- On narrow viewports, stacks vertically, taco first.

## Illustration upgrades (within current single SVG)

1. **Dimensional shell** — replace flat shell fills with layered paths:
   - Back rim (darker ochre)
   - Mid shell body (warm gradient: hsl(36 55% 72%) → hsl(32 48% 52%))
   - Inner shell shadow (deep umber crescent on the inside curve)
   - Highlight sheen (soft cream gradient along upper edge, ~12% opacity)
2. **Plump fillings** — lettuce ribbon gets a second darker layer behind for depth; tomato cubes get a tiny highlight dot; cheese strands get one warm-shadow stroke beneath.
3. **Soft contact shadow** — wider, softer radial ellipse beneath the taco (currently too thin).
4. **Ambient floor glow** — a very faint warm radial gradient *behind* the taco at ~6% opacity so it sits in a quiet "studio" environment without breaking the calm app palette.
5. **Bite refinement** — keep the animated mask, but add:
   - A subtle inner darker rim along the bite edge (1.5px stroke at 22% foreground) to suggest the shell's cross-section thickness.
   - 5 crumbs instead of 3, with varied sizes (1.6–2.6px).
6. **30% badge** — promote to a circular medallion with a thin ring outline anchored at the bite, with a hairline leader line pointing to the bite edge. Still uses tabular nums + count-up.

## Typography & copy (right column)

- Eyebrow: `TACoS · TOTAL ADVERTISING COST OF SALES` (existing styling)
- Headline (Satoshi 600, 48–56px): "We take a **30%** bite out of yours."
- Sub (Noto, 16–18px, muted): "One bite for us. The rest stays on your plate. TACoS is the only ad-spend ratio your CFO actually cares about — and we're built to shrink it."
- Stat strip (3 inline mini-stats, 12px label / 20px value, separated by hairline dividers):
  - `30%` avg TACoS reduction
  - `90 days` typical timeline
  - `100+` brands operated

## Motion (unchanged constraints)

- Single-pass bite animation, 1.4s, easeOutQuart, triggered on scroll-reveal.
- Number morphs with bite progress.
- Stat strip fades in at delay 0.85s, opacity-only, 600ms.
- No loops, no pulsing, no parallax. Respects Section 9.

## Palette discipline

- Taco uses *illustrative* warm palette (ochre/sage/tomato) — these are illustration colors, not data-viz tokens. They live only inside this one section, fully scoped to the SVG.
- All text, dividers, and the medallion ring use design-system tokens (`foreground`, `muted-foreground`, `border`).
- No brand gradient leaks outside Aan zones; the medallion uses neutral foreground only.

## Files touched

- `src/website/components/TacosSection.tsx` — single file rewrite. No new components, no new dependencies, no other files touched.

## QA checklist

- Verify in light + dark themes (taco palette stays warm, surrounding chrome inverts via tokens).
- Verify illustration scales cleanly from 320px → 720px wide.
- Verify text never overlaps illustration at 768px breakpoint.
- Verify bite mask renders cleanly (no jagged edge) at full size.
- Verify count-up reaches exactly 30 at progress=1.
