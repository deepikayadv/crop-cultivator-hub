# KisanMitra — Evaluation-II Upgrade Plan

## 1. What exists today (inspection)

| Area | Current state |
|---|---|
| Routing | TanStack Router (file-based, `src/routes/`): `/`, `/schemes`, `/crops`, `/market`, `/weather`, `/help`, `/login`, `/profile`. Shared layout in `__root.tsx` (header, footer, `<Outlet />`). |
| State management | React Context API: `LanguageProvider` (EN/HI toggle, `t()`/`tr()`), `FarmerSessionProvider` (profile). TanStack Query client is mounted but unused. |
| Authentication | Mock only — phone + profile form (Zod validated) saved to `localStorage`; `/profile` redirects to `/login` if no session. No passwords, tokens or roles. |
| API / data | None. All content is static bilingual data in `src/data/farm-data.ts`. No fetch calls, no backend, no database. |
| UI kit | shadcn components (form, dialog, tabs, table, select, chart, sonner, etc.) + Forest & Moss theme. |

Note on "React Router": this project's framework is fixed to TanStack Router, which is a React router offering the same concepts the syllabus asks for (routes, nested layouts, params, `Link`, `useNavigate`, protected routes). Switching to `react-router-dom` would break the app, so all new pages use TanStack Router and can be presented as "React routing".

## 2. Architecture for MySQL

```text
React app (this project)  --HTTP/JSON-->  Node.js + Express REST API  -->  MySQL 8
  src/services/*.ts                          (separate repo, you run it)
  VITE_API_BASE_URL                          JWT auth, routes, SQL
```

- The Express + MySQL server cannot run inside this preview. It lives in a separate folder/repo (I will provide `server/` code: Express routes, `mysql2` pool, `schema.sql` with tables, FKs, normalization to 3NF, views, a stored procedure, a trigger and a transaction example).
- No Supabase/PostgreSQL / Lovable Cloud tables will be created.
- Frontend uses a typed REST service layer. Until your API is deployed at a public URL, each service falls back to a mock adapter (same data shape) so the demo always works. Flip via `VITE_API_BASE_URL`.

## 3. Proposed structure

```text
src/
  services/
    api-client.ts        fetch wrapper: base URL, JWT header, JSON, errors
    auth.service.ts      POST /auth/register, /auth/login, GET /auth/me
    profile.service.ts   GET/PUT /farmers/me
    schemes.service.ts   GET /schemes, POST /schemes/eligibility, saved schemes
    mandi.service.ts     GET /mandi?crop&state
    planner.service.ts   CRUD /crop-plans
    expense.service.ts   CRUD /expenses, GET /expenses/summary
    weather.service.ts   GET /weather/alerts (Open-Meteo fallback)
    tickets.service.ts   CRUD /tickets
    notify.service.ts    GET /notifications, PATCH read
    recommend.service.ts POST /recommendations
    admin.service.ts     admin stats, users, tickets, schemes CRUD
    mock/                mock adapters per service
  lib/
    auth-context.tsx     replaces farmer-session (token, user, role) — same hook name kept
    notifications-context.tsx
    validation/*.ts      Zod schemas shared by forms
  components/
    common/  DataTable, StatCard, EmptyState, ConfirmDialog, FormField, PageGuard
    dashboard/ expense/ planner/ tickets/ admin/
  routes/
    _authenticated.tsx            guard layout (redirect to /login)
    _authenticated.dashboard.tsx
    _authenticated.profile.tsx    (moved, same URL /profile)
    _authenticated.planner.tsx
    _authenticated.expenses.tsx
    _authenticated.saved.tsx
    _authenticated.notifications.tsx
    _authenticated.tickets.tsx / tickets.$id.tsx
    schemes.eligibility.tsx       public
    market.compare.tsx            public
    recommend.tsx                 public
    weather.tsx                   upgraded with live alerts
    _admin.tsx + admin.index/users/schemes/tickets
```

Existing pages stay untouched except small additive links/buttons.

## 4. Stages (each testable on its own)

1. Foundation: api-client, mock adapters, auth context (register/login/JWT, roles), `_authenticated` guard, Express+MySQL `server/` folder with `schema.sql`. Existing login keeps working.
2. Farmer Profile & Dashboard (edit profile, summary cards).
3. Scheme Eligibility Checker + Saved Schemes + Notifications.
4. Mandi Price Comparison (multi-crop/mandi, chart) + Crop Recommendation (soil, season, land, water inputs).
5. Crop Planner (CRUD) + Farm Expense & Profit Tracker (CRUD, charts, totals via SQL GROUP BY).
6. Live Weather Alerts (Open-Meteo, no key) on weather page and dashboard.
7. Help Tickets (create, status, replies).
8. Admin Dashboard (role-guarded: stats, users, tickets, scheme CRUD).
9. Tests (Vitest for validation + services) and deployment notes.

## 5. Syllabus mapping
- FEE: routing/nested/protected routes, Context API, hooks, forms + validation, modals/tabs/search/filter, REST consumption, CRUD, Jest-style tests.
- DBMS: ER model, DDL/DML, joins (saved schemes, tickets with farmer), normalization, views, stored procedure (eligibility), trigger (notification on new scheme), transactions (expense entries).

## 6. Open question before Stage 1
Whether you already have the Express server running somewhere (URL) or want me to write the `server/` code for you to run locally.
