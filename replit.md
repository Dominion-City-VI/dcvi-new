# DCVI New — Replit Setup

## Project Overview
A Vite + React 19 single-page application for Dominion City VI church management. Uses TanStack Router for file-based routing, TanStack Query for data fetching, MobX for state management, and shadcn/ui + Radix UI components with Tailwind CSS v4.

## Architecture
- **Frontend**: Vite + React 19 + TypeScript
- **Routing**: TanStack Router (file-based, auto code-splitting)
- **State**: MobX + MobX React Lite
- **Data Fetching**: TanStack Query + Axios
- **UI**: shadcn/ui, Radix UI, Tailwind CSS v4, Tabler Icons, Lucide React
- **Forms**: React Hook Form + Zod
- **Backend API**: External — `https://cms-backend-i97e.onrender.com/api/v1`

## Key Files
- `src/servers/dcvi.ts` — Axios instance with auth interceptors (token refresh on 401/403)
- `src/store/` — MobX stores (AuthStore, etc.)
- `src/routes/` — TanStack file-based routes
- `src/layout/AuthLayout.tsx` — Auth guard that redirects to `/auth/login` when unauthenticated
- `vite.config.ts` — Vite config (port 5000, host 0.0.0.0 for Replit)

## Running the App
```bash
npm run dev
```
Runs on port 5000. The workflow "Start application" is configured to auto-start.

## Package Manager
Uses npm (migrated from yarn for Replit compatibility). Lock file: `package-lock.json`.

## Replit Migration Notes
- Vite server configured for port 5000 and `host: '0.0.0.0'` with `allowedHosts: true` for Replit proxy compatibility
- `prepare` script updated to silently handle husky in environments without git hook support
- `date-fns` added as an explicit dependency (was missing from package.json)
- Husky git hooks are present but gracefully skipped in Replit environment

## Route Structure
- `/auth/login` — Login page (unauthenticated entry point)
- `/auth/forgot-password`, `/auth/request`, `/auth/verification`, `/auth/password-reset` — Auth flows
- `/_authenticated/` — Dashboard (requires auth)
- `/_authenticated/admin/*` — Admin routes (users, zones, requests)
- `/_authenticated/cell/*` — Cell management
- `/_authenticated/department/*` — Department management
- `/_authenticated/zone/*` — Zone management
- `/_authenticated/messaging/*` — SMS and phone book
- `/_authenticated/wallet/*` — Wallet/funding
- `/_authenticated/settings/*` — Account settings
