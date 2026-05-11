## Aan Eyes — Simplify to Plain Black Dots

The current eyes render as cream-colored "sclera" circles with dark pupils inside — that's what's making it look fussy/ugly. The reference shows just **two solid dark dots** directly on the coral surface. Match that.

### Changes to `AanMascot.tsx` (eye block only)

- **Remove** the cream-circle wrapper (`background: rgba(255,240,235,...)`, the `boxShadow` ring, and the `overflow:hidden` clipping).
- **Each eye = one solid dark dot.** Pure `#1a0608` (near-black with a hint of warmth so it sits on coral without going harsh), `borderRadius: 50%`.
- **Size**: shrink from `size * 0.075` to `size * 0.06` — daintier, matches the reference proportion.
- **Spacing**: tighten `eyeOffsetX` from `size * 0.16` to `size * 0.13` (eyes closer together — reference shows them roughly 1.2× eye-width apart).
- **Vertical position**: keep slightly above center (`eyeY = size * 0.04`) — reads as "looking forward."
- **Gaze tracking**: keep — but the entire dot moves now (no pupil-in-sclera), with a smaller travel range (`size * 0.04` max) since there's no sclera to contain it.
- **Blink**: keep the `scaleY 1 → 0.05 → 1` keyframe — on a solid dot it reads as a clean blink line.

### What stays untouched
- Diamond shape, gradient, aura, hover-petting, body lean, blink interval, all other states.
- Position above input, suggestion chip layout — all unchanged.

### Files
- `src/components/aan/AanMascot.tsx` — eye render block only (~lines 320–365).

One file, one block. No other behavior changes.
