## Integrations — WhatsApp Alerts (Settings)

A new top-level entry in the Profile dropdown that opens a connector-style page where users link WhatsApp to receive alerts from selected services and accounts. Mock-only (no backend), full CRUD, persisted in localStorage. Always on (not behind the Aan/new-branding toggle).

### 1. Navigation entry
- Add **Integrations** item to the profile dropdown in `src/components/layout/AppSidebar.tsx` (both expanded and collapsed variants), positioned right after **Accounts**, icon `Plug` from lucide.
- Route: `/settings/integrations` and `/settings/integrations/whatsapp/:id?` (single page, sub-views via state).
- Register routes in `src/App.tsx`.

### 2. New context — `IntegrationsContext`
File: `src/contexts/IntegrationsContext.tsx`. localStorage-persisted (`anarix_integrations`). Provider mounted in `App.tsx` near other contexts.

```ts
type ServiceKey = "profitability" | "advertising" | "rules" | "catalog" | "bi" | "dayparting";
interface WhatsAppIntegration {
  id: string;
  phoneNumber: string;        // E.164, +country code
  countryCode: string;
  verifiedAt: string;
  services: ServiceKey[];
  accountIds: string[];       // references AccountContext.accounts[].id
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```
CRUD: `addIntegration`, `updateIntegration`, `removeIntegration`, `toggleEnabled`. Reads from `useAccounts()` to resolve account labels at render time.

### 3. Pages

**`src/pages/settings/Integrations.tsx`** — connector hub
- Page header "Integrations" + subtitle "Send Anarix alerts to the channels you actually check."
- Section "Available integrations" with one card: **WhatsApp** (logo, name, "Send alerts and notifications to WhatsApp", primary CTA `Connect WhatsApp` or `Add another` if any exist).
- Section "Your connections" — list of existing `WhatsAppIntegration` rows showing: phone, services as chips, account count, enabled toggle, kebab menu (Edit, Delete with AlertDialog confirm).
- Empty state explains purpose, lists what alerts will be sent, single CTA.

**`src/pages/settings/IntegrationWhatsApp.tsx`** — guided flow (right-side panel style sheet `Sheet` from `ui/sheet`, full-height, fixed). Stepper with 4 steps; reused for both Create and Edit. In Edit, user can jump between steps via the stepper.

Steps:
1. **Phone number** — country code `Select` (default `+91`), `Input` numeric. Validate length 7–15 digits. CTA `Send code`.
2. **OTP verification** — `InputOTP` 6 slots, numbers only. Correct code is hardcoded `123456`. Any other → inline error "Invalid code. Please try again." with destructive styling. `Resend` link (cosmetic). Auto-advance on success.
3. **Select services** — checkbox grid of the 6 services with icon + short description of what alerts each one sends (e.g. Profitability: "Margin drops, COGS swings". Advertising: "ACoS spikes, budget pacing". Rules: "Rule triggers, errors". Catalog: "Stockouts, listing issues". Business Intelligence: "SOV shifts, keyword anomalies". Day Parting: "Schedule changes, missed windows."). Must select ≥1 to continue.
4. **Select accounts** — accounts grouped by marketplace (Amazon, Walmart, Shopify, TikTok), each group expandable with checkboxes per linked account from `AccountContext`. "Select all" per marketplace. Must select ≥1. CTA `Finish` saves integration and returns to hub with success toast.

Above the form (or as a side info panel on step 1): explainer block — "What WhatsApp will be used for" + bulleted alert types, mirroring the Lovable connector pattern.

### 4. Components (small, reusable, in `src/components/integrations/`)
- `WhatsAppLogo.tsx` — inline SVG (semantic token colors, no hardcoded green outside data-viz scope; use `text-success` token).
- `IntegrationCard.tsx` — reusable card for the hub.
- `ConnectionRow.tsx` — list row in "Your connections".
- `WhatsAppFlowStepper.tsx` — top stepper used inside the sheet.
- `ServiceSelector.tsx`, `AccountSelector.tsx` — step bodies.
- `WhatsAppPurposeInfo.tsx` — the "what this does" explainer block.

### 5. Validation rules
- Phone: only digits accepted (input `inputMode="numeric"`, strip non-digits on change), 7–15 chars.
- OTP: only digits, exactly 6, `123456` succeeds, any other shows inline destructive message; clear on change.
- Services and Accounts steps: Continue button disabled until ≥1 selected.

### 6. Tone & visual rules (per project knowledge)
- Neutral analytics zone — no gradients, no expressive motion, transitions ≤180ms.
- Use semantic tokens only (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`, `text-destructive`, `text-success`).
- Primary buttons for forward step, Secondary for Back, Destructive button + AlertDialog for Delete.
- Right-side `Sheet` for the workflow (matches existing dual-panel pattern).
- Toasts: success "WhatsApp connected", "Integration updated", "Integration removed".

### 7. Files touched / created
Created:
- `src/contexts/IntegrationsContext.tsx`
- `src/pages/settings/Integrations.tsx`
- `src/pages/settings/IntegrationWhatsApp.tsx`
- `src/components/integrations/WhatsAppLogo.tsx`
- `src/components/integrations/IntegrationCard.tsx`
- `src/components/integrations/ConnectionRow.tsx`
- `src/components/integrations/WhatsAppFlowStepper.tsx`
- `src/components/integrations/ServiceSelector.tsx`
- `src/components/integrations/AccountSelector.tsx`
- `src/components/integrations/WhatsAppPurposeInfo.tsx`

Edited:
- `src/App.tsx` — add routes + `IntegrationsProvider`.
- `src/components/layout/AppSidebar.tsx` — add **Integrations** item to both profile dropdowns.

### Out of scope
- No real WhatsApp/Twilio API; OTP and sending are mocked.
- No changes to Aan, branding toggle, or any existing screen besides the sidebar dropdown and App routes.
- No backend / Cloud enablement.

### Open question (one)
The brief says "when hovered over profiles" — I'm reading this as **a new item inside the existing Profile dropdown** (which is already hover/click-triggered from the avatar). Confirm? If you instead want Integrations as a top-level sidebar nav group (outside Settings), say so and I'll move it.