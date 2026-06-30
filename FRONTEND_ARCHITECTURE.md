# SmartKhata Frontend Architecture

This document describes how the SmartKhata frontend is organized, how data flows through the application, and how to extend it when connecting a real backend.

---

## Folder Structure

```
smart-khata-foundation/
├── src/
│   ├── components/
│   │   ├── layout/          # App shell (sidebar, header, mobile nav)
│   │   ├── shared/          # Reusable domain components (PageHeader, StatCard, etc.)
│   │   └── ui/              # shadcn/ui primitives used by the app
│   ├── data/
│   │   └── mocks.ts         # Seed data and TypeScript domain types
│   ├── lib/
│   │   ├── utils.ts         # cn() — Tailwind class merging
│   │   ├── format.ts        # INR, date, and display helpers
│   │   ├── error-capture.ts # SSR error recovery for server.ts
│   │   └── error-page.ts    # Static HTML fallback for SSR failures
│   ├── routes/              # File-based routes (one file = one route)
│   ├── services/
│   │   └── index.ts         # Mock API layer (swap for REST later)
│   ├── store/
│   │   └── ui.ts            # Zustand store for theme and sidebar state
│   ├── router.tsx           # TanStack Router factory
│   ├── routeTree.gen.ts     # Auto-generated route tree (do not edit)
│   ├── start.ts             # TanStack Start middleware config
│   ├── server.ts            # Custom SSR entry with error handling
│   └── styles.css           # Tailwind v4 theme and design tokens
├── components.json          # shadcn/ui configuration
├── vite.config.ts           # Vite + TanStack Start + Tailwind + Nitro
├── tsconfig.json            # TypeScript compiler options
├── eslint.config.js         # ESLint flat config
├── bunfig.toml              # Bun install settings
└── package.json
```

### Folder purposes

| Folder | Purpose |
|--------|---------|
| `src/components/layout` | Persistent chrome: sidebar navigation, top header, mobile bottom nav, theme toggle |
| `src/components/shared` | App-specific reusable UI: page headers, stat cards, loading skeletons, empty states |
| `src/components/ui` | Low-level shadcn/ui components (Button, Card, Input, etc.) |
| `src/data` | Static mock datasets and shared domain types (`Customer`, `Product`, etc.) |
| `src/lib` | Utilities with no UI or routing concerns |
| `src/routes` | Page-level components; routing is derived from filenames |
| `src/services` | Data-access layer; currently returns delayed mock data |
| `src/store` | Client-side global UI state persisted to `localStorage` |

---

## Configuration Files

### `vite.config.ts`

Build and dev server configuration using:

- **`@tanstack/react-start/plugin/vite`** — file-based routing, SSR, code splitting
- **`@vitejs/plugin-react`** — React Fast Refresh and JSX transform
- **`@tailwindcss/vite`** — Tailwind CSS v4 via Vite plugin (no separate PostCSS config)
- **`vite-tsconfig-paths`** — resolves `@/*` path aliases from `tsconfig.json`
- **`nitro/vite`** — production server bundling for deployment

The TanStack Start plugin is configured with `server: { entry: "server" }` so SSR requests flow through `src/server.ts`, which adds catastrophic-error recovery.

### `tsconfig.json`

- **Target:** ES2022 with bundler module resolution
- **Strict mode** enabled
- **Path alias:** `@/*` → `./src/*`
- **No emit** — Vite handles compilation

### `eslint.config.js`

Flat ESLint config with:

- TypeScript ESLint recommended rules
- React Hooks plugin
- React Refresh plugin (warns on non-component exports in route files)
- Prettier integration
- Blocks `server-only` imports (Next.js convention; not used in TanStack Start)

### `components.json`

shadcn/ui manifest. Defines the **New York** style, Tailwind CSS entry (`src/styles.css`), and path aliases for generating new components via the shadcn CLI.

### Tailwind (`src/styles.css`)

Tailwind v4 is configured inline — no `tailwind.config.js`. The file:

- Imports Tailwind and `tw-animate-css`
- Defines `@source "../src"` for content scanning
- Declares CSS custom properties for the SmartKhata green brand palette
- Supports light/dark themes via the `.dark` class on `<html>`

### `bunfig.toml`

Bun package manager settings. Enforces a 24-hour minimum release age for supply-chain safety.

### `.prettierrc` / `.prettierignore`

Code formatting: 100-char width, semicolons, double quotes, trailing commas.

---

## Dependencies

### Core framework

| Package | Role |
|---------|------|
| `react` / `react-dom` | UI rendering (React 19) |
| `@tanstack/react-start` | Full-stack React framework (SSR, routing, server functions) |
| `@tanstack/react-router` | Type-safe file-based routing |
| `@tanstack/react-query` | Server-state caching, loading, and refetch for async data |
| `vite` | Dev server and production bundler |
| `nitro` | Server output bundling for deployment targets |

### UI and styling

| Package | Role |
|---------|------|
| `tailwindcss` + `@tailwindcss/vite` | Utility-first CSS (v4) |
| `tw-animate-css` | Animation utilities for shadcn components |
| `@radix-ui/react-*` | Accessible headless primitives (Select, Tabs, Switch, etc.) |
| `class-variance-authority` | Variant-based component styling (Button, Badge) |
| `clsx` + `tailwind-merge` | Conditional class names via `cn()` |
| `lucide-react` | Icon library |
| `framer-motion` | Page and card entrance animations |
| `sonner` | Toast notifications |
| `recharts` | Charts on the Reports page |

### Forms and validation

| Package | Role |
|---------|------|
| `react-hook-form` | Form state on add-customer, add-product, add-transaction |
| `@hookform/resolvers` | Bridges Zod schemas to react-hook-form |
| `zod` | Runtime schema validation |

### Client state

| Package | Role |
|---------|------|
| `zustand` | Lightweight global store with `localStorage` persistence |

### Dev tooling

| Package | Role |
|---------|------|
| `typescript` | Static typing |
| `eslint` + plugins | Linting |
| `prettier` | Formatting |
| `@vitejs/plugin-react` | React support in Vite |
| `vite-tsconfig-paths` | `@/*` alias resolution |

---

## State Management

SmartKhata uses three complementary layers:

### 1. TanStack Query (server state)

All list and detail pages fetch data through `useQuery`:

```tsx
const summary = useQuery({
  queryKey: ["summary"],
  queryFn: dashboardService.getSummary,
});
```

Query keys are simple strings (e.g. `"summary"`, `"customers"`, `"r-trend"`). The `QueryClient` is created in `router.tsx` and provided at the root via `QueryClientProvider`.

When the backend is connected, only the service functions need to change — query keys and component code stay the same.

### 2. Zustand (client UI state)

`src/store/ui.ts` holds:

- **Theme:** `light` | `dark` | `system`
- **Sidebar collapsed:** boolean

State is persisted to `localStorage` under the key `smartkhata-ui`. The `applyTheme()` helper toggles the `.dark` class on `<html>`.

There is no React Context for app data — Zustand and TanStack Query cover all global state needs.

### 3. Local component state

Forms use `react-hook-form`. Search filters and tab selection use `useState` within route components.

---

## Routing Architecture

Routing is **file-based** via TanStack Router. Files in `src/routes/` map to URLs:

| File | URL | Description |
|------|-----|-------------|
| `__root.tsx` | — | Root layout: HTML shell, QueryClient, AppShell, Toaster |
| `index.tsx` | `/` | Dashboard |
| `customers.tsx` | `/customers` | Layout route (renders `<Outlet />`) |
| `customers.index.tsx` | `/customers/` | Customer list |
| `customers.$id.tsx` | `/customers/:id` | Customer detail |
| `transactions.tsx` | `/transactions` | Transaction ledger |
| `inventory.tsx` | `/inventory` | Stock overview |
| `products.tsx` | `/products` | Layout route |
| `products.index.tsx` | `/products/` | Redirects to `/inventory` |
| `products.$id.tsx` | `/products/:id` | Product detail |
| `reports.tsx` | `/reports` | Analytics charts |
| `notifications.tsx` | `/notifications` | Notification center |
| `settings.tsx` | `/settings` | Shop preferences |
| `add-transaction.tsx` | `/add-transaction` | Quick entry form |
| `add-customer.tsx` | `/add-customer` | New customer form |
| `add-product.tsx` | `/add-product` | New product form |

`routeTree.gen.ts` is regenerated automatically by the TanStack Router Vite plugin. Never edit it manually.

Navigation uses `<Link to="...">` from `@tanstack/react-router`. Dynamic routes use `params={{ id: "..." }}`.

---

## Mock Data Layer

`src/data/mocks.ts` is the single source of truth for demo data:

- **25 customers** with credit/outstanding balances
- **40 products** across 8 categories
- **100 transactions** (credit, payment, sale, expense)
- **10 notifications**
- **Dashboard aggregates** (cash, bank, sales, collections)
- **Chart data** (14-day sales trend, category breakdown)

Types exported: `Customer`, `Product`, `Transaction`, `AppNotification`.

Data is generated with a seeded PRNG so values are stable across reloads.

---

## Services

`src/services/index.ts` exposes domain-oriented APIs:

| Service | Methods |
|---------|---------|
| `dashboardService` | `getSummary`, `getSalesTrend`, `getCategoryBreakdown`, `getRecentTransactions`, `getFollowUps` |
| `customerService` | `list`, `get`, `create` |
| `inventoryService` | `list`, `get`, `lowStock`, `create` |
| `transactionService` | `list`, `byCustomer`, `create` |
| `notificationService` | `list`, `markAllRead` |
| `reportService` | `salesTrend`, `categoryBreakdown` |

Each method wraps mock data in a `delay()` helper (~250 ms) to simulate network latency.

Types are re-exported from `@/data/mocks` for convenience.

---

## Reusable Components

### Layout (`src/components/layout/AppShell.tsx`)

Wraps every page with:

- Collapsible desktop sidebar with 8 nav items
- Sticky header with search, quick entry, theme toggle, notifications badge
- Mobile bottom navigation (5 items) + floating action button
- Framer Motion page transitions

### Shared (`src/components/shared/`)

| Component | Purpose |
|-----------|---------|
| `PageHeader` | Title, description, breadcrumb trail, action buttons |
| `StatCard` | Metric card with icon, tone color, optional hint |
| `StatusPill` | Small colored badge (success/warning/danger/info) |
| `EmptyState` | Centered placeholder when lists are empty |
| `Loaders` | `StatGridSkeleton` and `ListSkeleton` loading placeholders |

### UI (`src/components/ui/`)

Only components actively used by the app are kept:

`avatar`, `badge`, `button`, `card`, `input`, `label`, `select`, `skeleton`, `sonner`, `switch`, `tabs`, `textarea`

Add more via `npx shadcn@latest add <component>` when needed.

---

## Layout Architecture

```
__root.tsx (HTML shell + QueryClientProvider)
└── AppShell
    ├── Sidebar (desktop)
    ├── Header
    ├── <Outlet />  ← route page content
    └── MobileBottomNav
```

Each route component renders inside `<main>` via the `<Outlet />` in `__root.tsx`. Route pages use `PageHeader` + content cards; they do not define their own layout wrappers.

Error and 404 states are handled at the root level via `errorComponent` and `notFoundComponent`.

---

## End-to-End Request Flow

```
Browser navigation
    │
    ▼
TanStack Router matches file route
    │
    ▼
Route component mounts
    │
    ▼
useQuery calls service method
    │
    ▼
service/index.ts → delay() → mocks.ts data
    │
    ▼
TanStack Query caches result, component renders
    │
    ▼
User interacts (form submit, navigation)
    │
    ▼
toast.success() + navigate() (forms) or Link navigation (lists)
```

For SSR, the initial HTML is rendered on the server via TanStack Start → Nitro. Client hydration attaches React and TanStack Query takes over fetches on the client.

---

## Connecting a Real Backend

Replace mock implementations in `src/services/index.ts` with HTTP calls:

```ts
// Before (mock)
getSummary: () => delay(dashboardSummary),

// After (REST)
getSummary: () =>
  fetch("/api/dashboard/summary").then(r => r.json()),
```

Recommended migration steps:

1. **Introduce an API client** — create `src/lib/api-client.ts` with base URL, auth headers, and error handling.
2. **Swap service methods one domain at a time** — dashboard first, then customers, inventory, transactions.
3. **Keep the same return types** — services should still return `Customer`, `Product`, etc. Map API responses if shapes differ.
4. **Use TanStack Query mutations** — replace `toast + navigate` form handlers with `useMutation` + cache invalidation (`queryClient.invalidateQueries`).
5. **Add auth** — protect routes with TanStack Router `beforeLoad` guards once login exists.
6. **Remove or gate mocks** — keep `mocks.ts` for Storybook/tests or delete when no longer needed.

The existing service interface is intentionally thin so backend integration requires minimal route changes.
