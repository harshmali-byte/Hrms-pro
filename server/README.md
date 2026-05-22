# HRMS Pro API

Node.js + Express + Sequelize + PostgreSQL backend (v2).

## Architecture

```
server/src/
├── index.js              # App entry, route mounting, DB connect
├── config/database.js    # Sequelize + DATABASE_URL
├── middleware/
│   ├── auth.js           # JWT sign/verify, requireAuth, requireAdmin
│   ├── asyncHandler.js   # Async route wrapper → global errors
│   ├── errorHandler.js   # AppError + Sequelize errors
│   └── permissions.js    # HrRole permission checks
├── models/               # Sequelize models (18 tables)
├── services/             # Business logic (no HTTP)
├── routes/               # Thin HTTP handlers
├── constants/            # Permission catalog
└── scripts/              # seed, sync
```

## Run

```bash
cp .env.example .env   # set DATABASE_URL
npm install
npm run db:reset       # full re-seed
npm run dev            # watch mode
```

## API surface

| Prefix | Domain |
|--------|--------|
| `/api/auth` | Login, me, logout |
| `/api/bootstrap` | Post-login hydration (role-scoped) |
| `/api/employees` | CRUD, departments |
| `/api/leave` | Requests, balances, approve, cancel |
| `/api/attendance` | Today, history, clock in/out |
| `/api/notifications` | In-app notifications |
| `/api/payroll` | Run steps, payslips, summary, publish |
| `/api/dashboard` | KPI stats, charts (from DB) |
| `/api/content` | Announcements, holidays |
| `/api/config` | Company, policies, roles, templates, prefs, audit |
| `/api/admin` | Reset demo, health |

## Auth

- JWT in `Authorization: Bearer <token>`
- `admin` role: full access + config
- `employee` role: self-service + directory view
- Permissions loaded from `hr_roles` table (`employees.view`, `leave.approve`, etc.)

## Demo users

| Email | Password | Role |
|-------|----------|------|
| harsh.mali@asquarify.co | demo123 | employee |
| bhargav.purohit@asquarify.co | demo123 | admin |
