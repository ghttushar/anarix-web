## Testimonials: vertical video, third voice, real avatars

**File:** `src/website/components/TestimonialsSection.tsx`
**Assets to add:**
- `public/testimonials/video.mp4` ← copy from `user-uploads://Video_Project_12.mp4`
- `src/assets/testimonials/firat.png` ← `user-uploads://Firat_Ozkan.png`
- `src/assets/testimonials/james.jpg` ← `user-uploads://james.JPG`
- `src/assets/testimonials/nausil.png` ← `user-uploads://Nausil_Zaheer_Nas.png`

### Changes

1. **Video player → vertical (9:16) format**
   - Replace `aspect-video` with `aspect-[9/16]` on the media container.
   - Center the `<video>` with `object-cover` so it fills the vertical frame.
   - The right-column card becomes a tall card; left text card (`lg:col-span-7`) and right video card (`lg:col-span-5`) sit side-by-side, with the video card's height naturally taller — fine on `lg+`. On mobile both stack normally.

2. **Video playback behavior**
   - Plays once on user click of the play button (current behavior), with **audio on** (no `muted` attr, controls appear after play).
   - **No looping** — explicitly omit `loop`; on `onEnded`, reset `playing=false` so the poster + play button reappear (user can replay manually). Autoplay is not used because browsers block autoplay-with-sound; the existing click-to-play preserves audio.

3. **Add Nausil's quote under the video (inside the same right card)**
   - Below the video, before the author block, render the quote text:
     > "Working with Anarix has been a game changer. In just my second month, I've already seen a 20–22% increase in sales. They're rebuilding my website, helping grow my Amazon presence, and now expanding into Walmart and TikTok Shop. Excited for what's next!"
   - Author block updates: **Nausil Zaheer (Nas) — Owner, Karma Organics**.
   - Quote uses smaller display size (e.g. `text-base sm:text-lg leading-[1.5]`) on the dark gradient background so it stays readable next to the tall video.

4. **Bottom full-width card stays as James Ellington's written quote** (unchanged copy).

5. **Real profile photos replace the gradient initial circles**
   - Swap the three `<div>` initial circles for `<Avatar>` (`@/components/ui/avatar`) with `AvatarImage` + `AvatarFallback` (initial as fallback):
     - Top-left card → `firat.png` (Firat Ozkan)
     - Right video card → `nausil.png` (Nausil Zaheer)
     - Bottom card → `james.jpg` (James Ellington)
   - Avatar size stays 40px (`h-10 w-10`) to match current layout.

### Out of scope
No changes to header, logo wall, section background, or other components.
