## Note on the GitHub repo

`https://github.com/ghttushar/anarix-insight-engine` returns 404 (private or doesn't exist). I'll work from the live reference site (`retail-growth-engine.vercel.app`) plus the existing `/website` code. If you can make the repo public or paste a zip, I'll mirror its exact code instead.

## 1. Navigation cleanup (`PillNav.tsx`)

Replace current nav with exactly:

- **Products ▾** — Profitability, Advertising, Automation, Managed Services
- **Aan AI**
- **Pricing**
- **Documentation**
- **Company ▾** — About, Career, Contact
- **Sign In** (text link)
- **Schedule a Demo** (pill button)

Remove: Rule Automation (renamed → Automation), Campaign Manager, Impact Analysis, Share of Voice, Master Dashboard, Enterprise Reporting from nav. Their route files stay deleted.

## 2. Pages — add / rename / delete

**Add** (use `ProductTemplate` shell, copy tone from reference site):
- `pages/products/Automation.tsx` — rules + scheduling + audit log
- `pages/products/ManagedServices.tsx` — done-for-you operator team offering
- `pages/company/Career.tsx` — open roles, culture, values
- `pages/company/Contact.tsx` — email, support, office; reuses Demo form pattern but lighter

**Rename**: `RuleAutomation.tsx` → folded into `Automation.tsx` (delete old file).

**Delete** (no longer linked): `CampaignManager.tsx`, `ImpactAnalysis.tsx`, `ShareOfVoice.tsx`, `MasterDashboard.tsx`, `EnterpriseReporting.tsx`, `Advertising.tsx` stays (linked).

**Update** `Company.tsx` → becomes About-only content (drop the customers grid duplication).

## 3. Routes (`src/App.tsx`)

```text
/website
/website/aan-ai
/website/pricing
/website/documentation
/website/company/about        (was /website/company)
/website/company/career
/website/company/contact
/website/products/profitability
/website/products/advertising
/website/products/automation
/website/products/managed-services
/website/demo                 (Schedule a Demo form, kept)
```

Old product routes removed.

## 4. Hide Floating Action Island on `/website/*`

In `src/features/creative/FloatingActionIsland.tsx` (or wherever it mounts in `AppLayout`), add a `useLocation()` guard: if `pathname.startsWith('/website')`, return `null`. Same for any other app-chrome (CommandPalette, AppSidebar, AppTaskbar) that may be leaking — verify by reading `AppLayout.tsx` and `App.tsx`. The website routes already render under `WebsiteLayout` outside `AppLayout`, so the island shouldn't appear; if it does, it's mounted at a higher level and needs the route guard.

## 5. Motion / transitions parity with reference site

Reference site uses subtle scroll-reveal, marquee, hover lifts, and a hero swash underline animation. Add via existing tools (framer-motion is already installed):

- **`components/Reveal.tsx`** — wrap sections in `motion.div` with `whileInView={{opacity:1, y:0}}` from `{opacity:0, y:24}`, `viewport={{once:true, margin:"-80px"}}`, duration 0.5, ease "easeOut". Apply to Hero children, StatsGrid items (staggered 0.05s), CapabilitiesGrid cards (staggered), Testimonials cards, BottomCTA.
- **`ChannelsMarquee`** — confirm CSS infinite scroll keyframe, slow it to 40s linear infinite, pause on hover.
- **`Hero`** — animate the italic "profitability" word: fade-in + the SVG underline swash draws via `pathLength` 0→1 over 0.8s after headline mounts.
- **`PillNav`** — add a 0.4s fade+slide-down on mount; dropdowns use existing Radix-style fade/scale (already smooth via `NavDropdown`).
- **CapabilityCard hover** — `hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`.
- **CTA buttons** — `transition-transform active:scale-[0.98]`.

All motion respects project rule: ≤ 240ms interactions, ≤ 500ms reveals, easeOut only, no infinite pulses outside marquee.

## 6. Out of scope

- No new color tokens, no new fonts.
- No real backend / forms still mock-submit.
- No GitHub repo mirroring (404). Working from live site + current code.
- Aan AI page keeps current `AanMascot` + `mockAanEngine` setup.

## Build order

1. Nav rewrite + create new page files (Automation, ManagedServices, Career, Contact, About split).
2. Route table update in `App.tsx`.
3. Floating Action Island route guard.
4. `Reveal` component + apply across Home + product pages.
5. Hero swash animation + marquee tuning.
6. QA at 1668px, light + dark, scroll through Home + each new page; confirm no app chrome leaks onto `/website`.

Approve and I'll build.
