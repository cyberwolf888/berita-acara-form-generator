# Copilot Instructions for bagenerator

## Project overview
- Next.js 16 App Router app (React 19) using Bun as the package manager.
- Routes live in `src/app/*` (e.g., `src/app/page.tsx`, `src/app/create-berita-acara/page.tsx`).
- UI built with shadcn/ui + Tailwind v4 (`components.json`, `src/components/ui/*`, `src/app/globals.css`).

## Architecture & data flow
- Client-side form lives in `src/app/create-berita-acara/page.tsx` using `@tanstack/react-form`.
  - Field patterns: `<form.Field name="...">`, array fields with `mode="array"`, `pushValue/removeValue`.
  - Uses local helpers: `DatePicker` (`src/components/date-picker.tsx`) and `FileUpload` (`src/components/file-upload.tsx`).
- Server-side Firestore access lives in `src/lib/actions/` (modular server actions).
  - `index.ts` — barrel re-export (consumers import from `@/lib/actions`).
  - `get-documents.ts`, `save-berita-acara.ts`, `get-berita-acara-print-data.ts` — individual server actions (`"use server"`).
  - `helpers.ts` — shared image/text/date utilities. `types.ts` & `constants.ts` — shared types and constants.
  - Firestore is initialized in `src/lib/firebase-admin.ts` with Admin SDK credentials.
  - Database name is explicitly `"berita-acara-generator"`.

## Conventions & patterns
- Client components declare `"use client"` at top (see `date-picker.tsx`, `file-upload.tsx`).
- Server actions use `"use server"` and import `db` from `@/lib/firebase-admin`.
- Prefer `cn()` from `src/lib/utils.ts` for className composition.
- Path aliases are configured (`@/components`, `@/lib`, `@/components/ui`).

## Environment & integration points
- Firebase Admin SDK requires `.env.local` values:
  - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
  - See `.env.example` for expected format (private key uses `\n` newlines).

## Dev workflows (Bun)
- Dev server: `bun dev`
- Build: `bun run build`
- Start prod: `bun start`
- Lint: `bun run lint`

## Tips when extending
- If saving form data, call the server actions in `src/lib/actions/` from client components (via Next.js server actions) instead of writing Firestore calls in the client.
- When adding a new server action, create a dedicated file in `src/lib/actions/` and re-export it from `index.ts`.
- New UI should reuse shadcn components in `src/components/ui` and follow Tailwind v4 patterns from `globals.css`.
- Always design layouts mobile-first, then layer in larger breakpoints.
- Always test UI changes using the MCP Chrome DevTool before finalizing.

## Skill usage directive
- Before making changes, always attempt to match the task against skills in `.github/skills` and load the most appropriate matching skill(s).
- This applies to all skills in `.github/skills`, including any newly added skills.
- If multiple skills match, load all relevant skills and reconcile them, prioritizing the most specific guidance for the task.
- If no skill clearly matches, proceed with standard project instructions and conventions.
- If the task is Next.js or App Router related, load `nextjs-developer`; if advanced TypeScript types are required, load `typescript-pro`.
- For bug fixes or errors, also consider loading `debugging-expert` to assist with troubleshooting and root cause analysis.
