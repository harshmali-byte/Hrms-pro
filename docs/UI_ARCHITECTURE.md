# UI architecture — Web-first (v2.0)

## Layout model

```
┌─────────────────────────────────────────────────────────────┐
│  App (AuthProvider → HrmsDataProvider → RootNavigator)       │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         │ LoginScreen (full viewport, split web)   │
         └──────────────────────────────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         │ AppShell (authenticated)                 │
         │  ├─ Sidebar (desktop ≥ lg)               │
         │  ├─ MobileNavDrawer (< lg)              │
         │  └─ MainColumn                           │
         │       ├─ TopBar (sticky)                 │
         │       └─ PageCanvas (max-width, scroll)  │
         │            └─ Screen content             │
         │                 Page / PageHeader        │
         │                 PageSection + Card       │
         └──────────────────────────────────────────┘
```

## Breakpoints (web priority)

| Token | Min width | Behavior |
|-------|-----------|----------|
| `mobile` | 0 | Drawer nav, stacked top bar |
| `tablet` | 768 | Wider padding, 2-col grids |
| `desktop` | 1024 | Persistent sidebar |
| `wide` | 1280 | Max content width applied |

Hook: `useResponsive()` in `src/hooks/useResponsive.ts`.

## Component layers

| Layer | Path | Responsibility |
|-------|------|----------------|
| Tokens | `src/constants/tokens.cjs` | Colors, spacing, type scale |
| Theme | `src/constants/theme.ts` | JS palette for icons/native |
| Primitives | `src/components/ui/*` | Button, Input, Card, Badge |
| Layout | `src/components/layout/*` | Shell, sidebar, top bar |
| Page | `src/components/ui/Page.tsx` | Page structure, grids |
| Features | `src/screens/**` | Domain UI only |

**Rule:** Screens should not hardcode colors or invent spacing — use tokens and `Page` wrappers.

## Responsive grids

- `ContentGrid columns={2}` — 1 col mobile, 2 col tablet+
- `ContentGrid columns={4}` — KPI row on dashboard
- `Stack` — vertical rhythm with consistent gap

## Web-specific notes

- Primary target: `npm run web` (Expo Web).
- `Platform.OS === 'web'` used only for shadow/login split — avoid scattering.
- Content capped at `layout.contentMaxWidth` (1280px) for readability on ultrawide monitors.
