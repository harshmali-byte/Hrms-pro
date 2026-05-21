# HRMS Pro — Project version assessment

**Document version:** 1.0  
**Product version:** `2.0.0-web`  
**Assessment date:** May 2026  
**Audience:** Engineering, product, stakeholders  

---

## Executive summary

HRMS Pro is a **full-stack HRMS** (Expo/React Native + Node/PostgreSQL), not a UI-only demo. Backend v2 is production-shaped (services, RBAC, audit). The **UI is moving to v2.0-web**: web-first layout, light shell, responsive breakpoints, and a clearer component hierarchy.

| Layer | Version | Maturity |
|-------|---------|----------|
| Backend API | 2.0.0 | Demo-complete, service-layer, needs hardening for prod |
| Mobile app (Expo) | 2.0.0-web | Functional; secondary to web |
| Web (Expo Web) | 2.0.0-web | **Primary target** |
| Design system | 2.0 (Organiq Web) | Replacing SmartHR-dark clone |

---

## Stack inventory

### Client (`hrms-pro`)

| Technology | Version / role |
|------------|----------------|
| Expo SDK | 51 |
| React Native | 0.74.5 |
| React | 18.2 |
| TypeScript | 5.3 |
| NativeWind | 4.1 (Tailwind for RN) |
| React Navigation | 6 (stack + shell state) |
| Fonts | DM Sans |
| Icons | Lucide RN |

### Server (`server/`)

| Technology | Version / role |
|------------|----------------|
| Node.js | ESM |
| Express | 4.x |
| Sequelize | 6.x |
| PostgreSQL | 16 (Docker or local) |
| Auth | JWT (7d) |

---

## Feature matrix (what works end-to-end)

| Module | Employee | Admin | Persistence |
|--------|----------|-------|-------------|
| Auth (login/logout) | Yes | Yes | JWT + Postgres users |
| Dashboard | Yes | Yes | API stats + charts |
| Attendance | Clock in/out, history | — | `attendance_days` |
| Leave | Apply, balances | Approve/reject | `leave_requests` |
| Personnel | Directory | CRUD employees | `employees` |
| Payroll | Payslips | Run + steps | `payslips`, `payroll_runs` |
| Notifications | Bell + sheet | Bell + sheet | `notifications` |
| Configuration | — | Full (policies, roles, etc.) | Config tables |
| Announcements / holidays | Read | — | `announcements`, `holidays` |

---

## UI architecture — before vs after

### v0.1 (initial)

- Bottom tabs, mobile-first.
- Dummy AsyncStorage API.

### v1.0 (SmartHR-style)

- Dark sidebar `#1B2531`, light content `#F0F2F5`.
- `AppShell` + `Sidebar` + `TopBar`.
- Collapse sidebar at `width < 900`.
- Single scroll column; limited max-width on web.
- Tokens in `tokens.cjs`; screens compose `Card`, `StatCard`, etc.

### v2.0-web (current direction — **web priority**)

| Principle | Implementation |
|-----------|----------------|
| Web-first | Breakpoints, max content width, sticky header, light shell |
| Responsive | Mobile drawer nav; desktop persistent sidebar |
| Clear hierarchy | `Page` → `PageHeader` → `PageSection` → content |
| Distinct visual | Light sidebar, slate neutrals, teal primary (not dark admin clone) |
| Token-driven | `tokens.cjs` → Tailwind + `theme.ts` |

See [UI_ARCHITECTURE.md](./UI_ARCHITECTURE.md).

---

## Known gaps (honest senior review)

1. **No automated tests** (unit/E2E).
2. **No CI/CD** pipeline in repo.
3. **Permissions** enforced on API but not mirrored in UI (hide admin routes).
4. **Some flows** still use `Alert` placeholders (reimburse, documents).
5. **Web a11y** — partial (needs focus rings, landmarks, aria on web).
6. **i18n** — English only; locale in DB only.
7. **Production** — no rate limiting, refresh tokens, or email service.

---

## Recommended version tags

```text
git tag v2.0.0-backend   # API + Sequelize complete
git tag v2.0.0-web       # Web-first UI shell (this milestone)
```

**Next milestones**

- `v2.1` — Role-based UI visibility + form validation UX  
- `v2.2` — E2E (Playwright on web) + CI  
- `v3.0` — Production deploy (API + static web)  

---

## How to run (current)

```bash
# DB + API
npm run db:up
npm run server:seed
npm run server:dev

# Web (primary)
npm run web
# or: npx expo start --web
```

Demo: `admin@organiq.co` / `aarav.mehta@organiq.co` — password `demo123`.
