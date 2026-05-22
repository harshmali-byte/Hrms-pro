# HRMS Pro

HRMS built with **Expo / React Native** and a **Node.js + PostgreSQL + Sequelize** API. Admin and employee panels share one design system; clicks drive real API operations (leave, attendance, payroll, notifications, employees).

---

## Quick start

### 1. Database

```bash
docker compose up -d postgres
```

Or use your own PostgreSQL and set `server/.env` (`DATABASE_URL`).

### 2. API server

```bash
npm run server:install
npm run server:reset    # full reset + Asquarify team (first time or after email changes)
npm run server:dev
```

If the database already has data and login returns **401**, sync demo users only:

```bash
npm run server:sync-users
```

API runs at `http://localhost:3001`.

### 3. Mobile / web app

```bash
npm install
npx expo start
```

**Demo logins**

| Role     | Email                      | Password |
| -------- | -------------------------- | -------- |
| Employee | harsh.mali@asquarify.co     | demo123  |
| Admin    | bhargav.purohit@asquarify.co | demo123  |

### API URL on devices

- **Web / iOS simulator:** `http://localhost:3001` (default)
- **Android emulator:** `http://10.0.2.2:3001` (default)
- **Physical device:** set in `.env` at project root:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3001
```

Restart Expo after changing env.

---

## Architecture

```
HRMS-pro/
├─ src/                    # Expo app (NativeWind, contexts, screens)
├─ server/                 # Express + Sequelize + PostgreSQL (see server/README.md)
│  ├─ src/services/        # Business logic layer
│  ├─ src/models/          # 18 Sequelize models
│  ├─ src/routes/          # REST API (auth, HR, config, content)
│  └─ src/scripts/         # db:seed, db:reset, db:seed-config
└─ docker-compose.yml      # Local Postgres
```

Backend v2 adds: services layer, global error handling, RBAC permissions, role-scoped bootstrap, attendance history, announcements/holidays from DB, dashboard charts from DB, employee CRUD with leave balances on hire, leave policy validation, audit logging.

### API highlights

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | `/api/auth/login` | JWT login |
| GET | `/api/auth/me` | Session restore |
| GET | `/api/bootstrap/state` | Hydrate app after login |
| POST | `/api/attendance/clock-in` | Clock in |
| POST | `/api/leave/requests` | Submit leave |
| PATCH | `/api/leave/requests/:id/status` | Approve / reject |
| POST | `/api/employees` | Add employee (admin) |
| POST | `/api/payroll/advance` | Payroll checklist (admin) |
| POST | `/api/admin/reset-demo` | Re-seed database (admin) |
| GET | `/api/hubstaff/summary` | Live Hubstaff metrics for logged-in user |

---

## Hubstaff (real-time sync)

The Hubstaff widget can read **live** time from the Hubstaff Time Tracking API v2 instead of estimating from HRMS clock punches.

### Why you saw `0m` while Hubstaff desktop showed ~54m

The desktop app tracks independently. Until the API is connected, the HRMS card only mirrored **HRMS clock-in** segments — if you had not clocked in inside HRMS, it showed `0m` even while Hubstaff was running.

### Setup (one-time)

1. Open [Hubstaff Personal Access Tokens](https://developer.hubstaff.com/personal_access_tokens) and create a token (manager/owner role recommended).
2. Copy the **refresh token** into `server/.env`:

```env
HUBSTAFF_REFRESH_TOKEN=your_refresh_token_here
# optional if you have multiple orgs:
HUBSTAFF_ORG_ID=123456
```

3. Restart the API: `npm run server:dev`
4. Use the **same work email** in Hubstaff as in HRMS (e.g. `harsh.mali@asquarify.co`).

### How “real-time” works

| Layer | Behavior |
| ----- | -------- |
| **Hubstaff desktop** | Tracks project/time locally (e.g. “Asquarify's Project”). |
| **HRMS API** | Polls Hubstaff every **30s** (`/api/hubstaff/summary`), caches ~25s server-side. |
| **HRMS UI** | Refreshes the card on that interval; shows **Tracking** when Hubstaff reports a recent activity slot. |

For faster updates, lower `pollIntervalMs` in the API response or add [Hubstaff webhooks](https://support.hubstaff.com/time-tracking-api/) later to push events instead of polling.

### Optional next steps

- **OAuth app** — Let each org connect Hubstaff without a shared PAT ([developer apps](https://developer.hubstaff.com/apps)).
- **Webhooks** — `POST` to your server when time entries change (near real-time, no 30s poll).
- **Admin view** — Team “23 clocked in” from `/api/dashboard/clocked-in` + Hubstaff org activities.

---

## Tech stack

| Layer | Stack |
| ----- | ----- |
| App | Expo 51, React Native, NativeWind, TypeScript |
| API | Express, Sequelize 6, PostgreSQL, JWT |
| Auth | Bearer token stored in AsyncStorage |

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm start` | Expo dev server |
| `npm run lint` | Typecheck |
| `npm run db:up` | Start Postgres (Docker) |
| `npm run server:dev` | API with watch |
| `npm run server:seed` | Seed / create tables |
| `npm run server:seed-config` | Config tables only |
| `npm run db:reset` (in server/) | Force re-seed all data |

---

## Contributing

- UI tokens: `src/constants/tokens.cjs`
- Copy: `src/constants/strings.ts`
- API client: `src/api/client.ts`, `src/api/hrmsApi.ts`
- Do not commit real secrets in `server/.env`
