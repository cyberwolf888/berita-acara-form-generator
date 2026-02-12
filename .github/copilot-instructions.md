# Copilot Instructions for bagenerator

## Project overview
- Next.js 16 App Router app (React 19) using Bun as the package manager.
- Routes live in `src/app/*` (e.g., `src/app/page.tsx`, `src/app/create-berita-acara/page.tsx`).
- UI built with shadcn/ui + Tailwind v4 (`components.json`, `src/components/ui/*`, `src/app/globals.css`).

## Architecture & data flow
- Client-side form lives in `src/app/create-berita-acara/page.tsx` using `@tanstack/react-form`.
  - Field patterns: `<form.Field name="...">`, array fields with `mode="array"`, `pushValue/removeValue`.
  - Uses local helpers: `DatePicker` (`src/components/date-picker.tsx`) and `FileUpload` (`src/components/file-upload.tsx`).
- Server-side Firestore access is centralized in `src/lib/actions.ts` (`"use server"`).
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
- If saving form data, call the server actions in `src/lib/actions.ts` from client components (via Next.js server actions) instead of writing Firestore calls in the client.
- New UI should reuse shadcn components in `src/components/ui` and follow Tailwind v4 patterns from `globals.css`.
- Always design layouts mobile-first, then layer in larger breakpoints.
- Always test UI changes using the MCP Chrome DevTool before finalizing.
