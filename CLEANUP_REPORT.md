# SmartKhata Cleanup Report

**Date:** June 30, 2026  
**Scope:** Repository audit, Lovable trace removal, dead code cleanup, documentation

---

## Summary

The SmartKhata frontend has been cleaned and documented for production backend development. All Lovable-specific artifacts were removed, unused scaffold code was deleted, and the Vite configuration was migrated to standard TanStack Start plugins. The production build completes successfully.

---

## Files Removed

### Lovable artifacts

| File | Reason |
|------|--------|
| `AGENTS.md` | Lovable git workflow instructions |
| `.lovable/project.json` | Lovable project metadata |
| `src/lib/lovable-error-reporting.ts` | Lovable-only error telemetry |
| `src/routes/README.md` | Lovable scaffold routing notes (covered in `FRONTEND_ARCHITECTURE.md`) |
| `bun.lock` | Stale lockfile containing Lovable npm registry references (replaced by `package-lock.json`) |

### Unused hooks

| File | Reason |
|------|--------|
| `src/hooks/use-mobile.tsx` | Only consumed by deleted `sidebar.tsx` UI component |

### Unused shadcn/ui components (33 files)

These were scaffolded by the AI template but never imported by any route, layout, or shared component:

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `breadcrumb`, `calendar`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `separator`, `sheet`, `sidebar`, `slider`, `table`, `toggle`, `toggle-group`, `tooltip`

### Remaining UI components (14)

`avatar`, `badge`, `button`, `card`, `input`, `label`, `select`, `skeleton`, `sonner`, `switch`, `tabs`, `textarea`

---

## Dependencies Removed

### Dev dependencies

| Package | Reason |
|---------|--------|
| `@lovable.dev/vite-tanstack-config` | Lovable Vite wrapper (replaced with standard plugins) |
| `@tanstack/router-plugin` | Transitive via TanStack Start; not needed as direct dep |

### Production dependencies

| Package | Reason |
|---------|--------|
| `@radix-ui/react-accordion` | Unused UI component |
| `@radix-ui/react-alert-dialog` | Unused UI component |
| `@radix-ui/react-aspect-ratio` | Unused UI component |
| `@radix-ui/react-checkbox` | Unused UI component |
| `@radix-ui/react-collapsible` | Unused UI component |
| `@radix-ui/react-context-menu` | Unused UI component |
| `@radix-ui/react-dialog` | Unused UI component |
| `@radix-ui/react-dropdown-menu` | Unused UI component |
| `@radix-ui/react-hover-card` | Unused UI component |
| `@radix-ui/react-menubar` | Unused UI component |
| `@radix-ui/react-navigation-menu` | Unused UI component |
| `@radix-ui/react-popover` | Unused UI component |
| `@radix-ui/react-progress` | Unused UI component |
| `@radix-ui/react-radio-group` | Unused UI component |
| `@radix-ui/react-scroll-area` | Unused UI component |
| `@radix-ui/react-separator` | Unused UI component |
| `@radix-ui/react-slider` | Unused UI component |
| `@radix-ui/react-toggle` | Unused UI component |
| `@radix-ui/react-toggle-group` | Unused UI component |
| `@radix-ui/react-tooltip` | Unused UI component |
| `cmdk` | Command palette component |
| `date-fns` | Never imported |
| `embla-carousel-react` | Carousel component |
| `input-otp` | OTP input component |
| `react-day-picker` | Calendar component |
| `react-resizable-panels` | Resizable panels component |
| `vaul` | Drawer component |

**Net change:** 38 packages removed, 14 added (dependency tree normalization via npm).

---

## Lovable Traces Removed

| Item | Action |
|------|--------|
| `@lovable.dev/vite-tanstack-config` import in `vite.config.ts` | Replaced with standard TanStack Start + Vite plugins |
| Lovable comments in `vite.config.ts` | Removed |
| `reportLovableError()` in `__root.tsx` | Removed |
| `window.__lovableEvents` telemetry | Removed |
| Lovable npm registry URLs in lockfile | Removed (regenerated lockfile) |
| `bunfig.toml` Lovable package excludes | Removed |
| `package.json` name `tanstack_start_ts` | Renamed to `smart-khata` |

---

## Configurations Updated

| File | Change |
|------|--------|
| `vite.config.ts` | Standard plugins: `tanstackStart`, `viteReact`, `tailwindcss`, `tsconfigPaths`, `nitro` |
| `package.json` | Renamed project, removed Lovable and unused deps |
| `bunfig.toml` | Removed Lovable-specific install excludes |
| `components.json` | Removed unused `hooks` alias |
| `src/routes/__root.tsx` | Removed Lovable error reporting |
| `src/routes/products.index.tsx` | Removed placeholder `void Link` hack |

---

## Remaining Project Structure

```
smart-khata-foundation/
├── FRONTEND_ARCHITECTURE.md    # Developer onboarding guide
├── README.md                   # Project overview
├── CLEANUP_REPORT.md           # This file
├── components.json
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── bunfig.toml
├── .prettierrc
├── .prettierignore
├── .gitignore
└── src/
    ├── components/
    │   ├── layout/AppShell.tsx
    │   ├── shared/             # PageHeader, StatCard, StatusPill, EmptyState, Loaders
    │   └── ui/                 # 14 shadcn components
    ├── data/mocks.ts
    ├── lib/                    # utils, format, error-capture, error-page
    ├── routes/                 # 16 route files
    ├── services/index.ts
    ├── store/ui.ts
    ├── router.tsx
    ├── routeTree.gen.ts
    ├── start.ts
    ├── server.ts
    └── styles.css
```

---

## Build Verification

```
npm install   ✓ (360 packages, 0 vulnerabilities)
npm run build ✓ (client + SSR + Nitro, ~30s)
```

---

## Recommendations Before Backend Development

1. **Introduce an API client** — Create `src/lib/api-client.ts` with base URL, auth token injection, and typed error handling before swapping services.

2. **Add environment variables** — Use `VITE_API_URL` in `.env` for the backend base URL. Add `.env.example` to the repo.

3. **Replace mock services incrementally** — Start with `customerService` and `transactionService`; keep mock fallbacks during development if useful.

4. **Add TanStack Query mutations** — Form pages currently use `toast + navigate`. Switch to `useMutation` with `queryClient.invalidateQueries` when writes hit a real API.

5. **Authentication** — Add login route and `beforeLoad` guards on protected routes. The settings page already has placeholder business profile data.

6. **Remove `vite-tsconfig-paths`** — Vite 8 supports `resolve.tsconfigPaths: true` natively; removing the plugin would speed up builds (~50% of plugin time per build output).

7. **Code-split Reports page** — The reports chunk is ~422 KB (Recharts). Consider lazy-loading with `React.lazy` or route-level code splitting.

8. **Choose deployment target** — Nitro preset is currently `node-server`. Configure Cloudflare, Netlify, or Bun preset in `vite.config.ts` when deploying.

9. **Add tests** — Vitest + React Testing Library for services and critical routes before backend integration.

10. **Regenerate lockfile with Bun** — If using Bun locally, run `bun install` to create a fresh `bun.lock` without Lovable references.

---

## Files Created

| File | Purpose |
|------|---------|
| `FRONTEND_ARCHITECTURE.md` | Comprehensive frontend architecture guide |
| `README.md` | Professional project README |
| `CLEANUP_REPORT.md` | This cleanup summary |
