# HRMS Pro

**Version `2.0.0-web`** — Web-first HRMS with **Expo / React Native Web** and a **Node.js + PostgreSQL** API.

See [docs/PROJECT_VERSION.md](docs/PROJECT_VERSION.md) for a senior-level assessment and [docs/UI_ARCHITECTURE.md](docs/UI_ARCHITECTURE.md) for the UI layout model.

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
npm run server:seed
npm run server:dev
```

API runs at `http://localhost:3001`.

### 3. Web app (primary)

```bash
npm install
npm run web
```

Or `npx expo start` then press `w` for web. Mobile (`a` / `i`) is supported but secondary.

**Demo logins**

| Role     | Email                     | Password |
| -------- | ------------------------- | -------- |
| Employee | aarav.mehta@organiq.co    | demo123  |
| Admin    | admin@organiq.co          | demo123  |

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
