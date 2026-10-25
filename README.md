# Crop Cultivator Hub

KisanMitra is a bilingual farmer-support web application for government schemes, crop calendars, mandi prices, weather information, farm profiles, and agricultural advisories.

This document describes the repository as it currently exists on `main`.

## Technology Stack

### Application

- React 19 with TypeScript 5.8
- Vite 8 for development and bundling
- TanStack Start for SSR/server runtime integration
- TanStack Router for type-safe, file-based routing
- TanStack React Query for query-client infrastructure and cache management
- Nitro for the production server build, configured through `@lovable.dev/vite-tanstack-config`

### UI and styling

- Tailwind CSS 4 with the Tailwind Vite plugin
- Radix UI primitives for accessible interactive components
- Local reusable UI components in `src/components/ui`
- `class-variance-authority`, `clsx`, and `tailwind-merge` for component variants and class composition
- Lucide React for icons
- Recharts for charts
- React Hook Form with Zod/resolvers for form handling and validation
- `date-fns`, `react-day-picker`, Embla Carousel, Vaul, Sonner, and CMDK for supporting UI interactions
- Outfit, Noto Sans, and Noto Sans Devanagari fonts loaded in the root route

### Tooling

- ESLint 9 with TypeScript, React Hooks, React Refresh, and Prettier integrations
- Prettier
- TypeScript strict mode
- `@` path alias mapped to `src`

## Running the Project

Install dependencies and start the Vite development server:

```bash
bun install
bun run dev
```

Other scripts:

```bash
bun run build       # production build
bun run build:dev   # development-mode build
bun run preview     # preview the production build
bun run lint        # run ESLint
bun run format      # format the repository with Prettier
```

Bun is the expected package-manager workflow because the repository includes `bunfig.toml`. Equivalent npm commands can be used if dependencies are installed with npm.

## Routing

Routing is handled by TanStack Router. Each route is defined in `src/routes` with `createFileRoute`, and the generated route tree is in `src/routeTree.gen.ts`. The generated file should not be edited manually.

Current routes:

| Path | Purpose |
| --- | --- |
| `/` | Home dashboard and overview |
| `/login` | Farmer sign-in/profile entry |
| `/profile` | Farmer profile and personalized farm information |
| `/schemes` | Government schemes |
| `/crops` | Crop calendar and crop guidance |
| `/market` | Mandi prices |
| `/weather` | Weather and advisories |
| `/help` | Help and support |

The root route in `src/routes/__root.tsx` provides the HTML shell, global header/footer, nested-route outlet, React Query provider, language provider, and farmer session provider.

`src/router.tsx` creates the router and a TanStack Query `QueryClient`. SSR is enabled through TanStack Start and the custom server entry in `src/server.ts`.

## Component Handling

The application uses ordinary React components and context providers rather than a separate component framework.

- Shared application components are in `src/components`, including `SiteHeader`, `SiteFooter`, `PageHeader`, and `ui/*` primitives.
- The `ui/*` components are mostly shadcn-style wrappers around Radix UI primitives.
- Routes own their page-level components and use shared UI components for controls and layout.
- `LanguageProvider` in `src/lib/i18n.tsx` manages English/Hindi translations.
- `FarmerSessionProvider` in `src/lib/farmer-session.tsx` manages the currently active legacy profile.
- `AuthProvider` in `src/lib/auth-context.tsx` is a separate, newer authentication context built around the service layer, but it is currently not mounted by `src/routes/__root.tsx`.

## Backend and Data Architecture

The repository is frontend-first and does not contain a database schema, Express server, controllers, migrations, or a backend API implementation.

It supports two runtime modes through `src/services`:

1. **External API mode**

	Set `VITE_API_BASE_URL` to the public base URL of the external Node.js/Express + MySQL API:

	```env
	VITE_API_BASE_URL=https://api.example.com
	```

	`src/services/api-client.ts` sends JSON requests with `fetch`. If a token is present in browser localStorage, it is sent as a Bearer token. The service layer expects endpoints such as:

	- `POST /auth/login`
	- `PUT /farmers/me`
	- `GET /dashboard/summary`
	- `GET|POST /crop-plans`
	- `DELETE /crop-plans/:id`
	- `GET /expenses`
	- `GET /saved-schemes`
	- `DELETE /saved-schemes/:id`
	- `GET /notifications`
	- `PATCH /notifications/read-all`
	- `POST /recommendations`
	- `GET /admin/stats`
	- `GET /admin/users`

2. **Demo/mock mode**

	If `VITE_API_BASE_URL` is unset, the service functions do not make network requests. They use `src/services/mock-store.ts`, an in-memory store containing plans, expenses, saved schemes, notifications, and users. Mutations only change that in-memory state, so the data is lost on a full page reload. `mockDelay()` adds simulated latency for loading-state behavior.

The public content shown by the main pages is also currently local static data in `src/data/farm-data.ts`, including schemes, crops, mandi rates, weather, advisories, and technology updates. The file itself notes that a later evaluation/database phase is expected to replace this data.

## Authentication Status

Authentication is currently a hybrid/transition area:

- The active UI uses `FarmerSessionProvider`, which stores a farmer profile in `localStorage` under `kisanmitra.farmer`.
- The newer API-backed auth code uses `AuthProvider`, `auth.service.ts`, and `auth-storage.ts`, storing an `AuthSession` under `kisanmitra.session` and optionally calling the external API.
- The demo API login assigns the admin role to phone number `9999999999` when no external API is configured.
- No database or credential storage is implemented in this repository.

Therefore, the application can run entirely with frontend-local mock/static data today, but it is already structured to switch service calls to an external Express + MySQL backend by setting `VITE_API_BASE_URL` and wiring the active UI to the newer auth context where needed.

## Server Runtime

`src/start.ts` configures TanStack Start middleware for error handling and CSRF protection on TanStack server functions. `src/server.ts` delegates requests to TanStack Start's server entry and normalizes SSR failures into an HTML error page.

These files provide the SSR/runtime shell; they are not an application database backend and currently do not expose the business API endpoints listed above.

## Important Source Locations

| Location | Responsibility |
| --- | --- |
| `src/routes` | Page routes |
| `src/routeTree.gen.ts` | Generated TanStack Router tree |
| `src/components` | Shared page and UI components |
| `src/data/farm-data.ts` | Static public/demo content |
| `src/services/api-client.ts` | External API client and API-mode switch |
| `src/services/farm.service.ts` | Farm feature service calls and mock fallbacks |
| `src/services/auth.service.ts` | Login/profile service calls and mock fallback |
| `src/services/mock-store.ts` | In-memory demo state |
| `src/lib/farmer-session.tsx` | Active legacy localStorage session |
| `src/lib/auth-context.tsx` | Newer API-aware auth context |
| `src/styles.css` | Tailwind theme and design tokens |
