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
