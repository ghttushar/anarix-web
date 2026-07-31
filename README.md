# Anarix Website

Marketing website for [Anarix](https://anarix.ai) — expert-managed marketplace
growth across Amazon and Walmart. Built with Vite, React, TypeScript, Tailwind
CSS, and shadcn/ui.

## Getting started

```sh
npm install
npm run dev
```

## Commands

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start the dev server         |
| `npm run build`     | Production build             |
| `npm run preview`   | Preview the production build |
| `npm run lint`      | Run ESLint                   |

## Structure

- `frontend/src/website/` — all website pages, sections, and layout
  (see `frontend/src/website/README.md` for the full handoff notes)
- `frontend/src/components/aan/` — Aan mascot + chat surface shared with the
  Aan website panel
- `frontend/src/App.tsx` — routes (mounted at root; old `/website/*` URLs
  redirect automatically)

## Environment

The Aan website chat calls the hosted `website-aan` Supabase edge function.
Set the following in your environment (see `.env`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Deployment

Vercel (see `vercel.json`): `npm run build` at the root, output in
`frontend/dist`, with SPA rewrites for client-side routing.
