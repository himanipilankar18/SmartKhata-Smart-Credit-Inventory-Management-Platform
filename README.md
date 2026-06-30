# SmartKhata

**Smart credit and inventory management for Indian retail shops.**

SmartKhata helps shop owners track customer credit (udhaar/khata), manage inventory, record daily transactions, and follow up on outstanding payments — all from a single dashboard.

---

## Problem Statement

Small and medium retail businesses in India still rely on paper ledgers, WhatsApp messages, and memory to manage customer credit and stock. This leads to:

- Lost or disputed credit records
- Missed payment follow-ups
- Stockouts and overstocking
- No visibility into daily sales vs collections

Existing accounting software is often too complex, expensive, or not designed for the daily workflow of a neighborhood shop.

---

## Why SmartKhata Exists

SmartKhata is built for the shopkeeper who needs:

- A **simple khata (ledger)** for customer credit and payments
- **Inventory tracking** with low-stock alerts
- **Quick entry** for daily sales, expenses, and collections
- **Actionable dashboard** showing cash position, outstanding amounts, and follow-ups
- A **mobile-friendly** interface usable at the counter

The product prioritizes speed and clarity over accounting complexity.

---

## Current Stage

**Frontend complete with mock APIs.**

The UI, routing, state management, and data layer are fully implemented. All data is served from in-memory mocks with simulated latency. No backend or database is connected yet.

---

## Current Features

| Module | Capabilities |
|--------|-------------|
| **Dashboard** | Cash/bank summary, today's sales & collections, recent transactions, follow-up list, quick actions |
| **Customers** | Searchable list, detail view with stats and transaction history, add customer form |
| **Transactions** | Filterable ledger (credit, payment, sale, expense), quick entry form |
| **Inventory** | Product list with stock levels, low-stock highlighting, add product form |
| **Products** | Individual product detail pages |
| **Reports** | Bar, line, area, and pie charts for sales trends and category breakdown |
| **Notifications** | Payment, stock, reminder, and system alerts |
| **Settings** | Business profile, theme (light/dark/system), notification toggles, currency, language, backup |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19 + SSR) |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query |
| Client state | Zustand (persisted) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | Framer Motion |
| Build | Vite + Nitro |
| Language | TypeScript |
| Package manager | Bun |

---

## Folder Structure

```
src/
├── components/
│   ├── layout/       App shell (sidebar, header, mobile nav)
│   ├── shared/       PageHeader, StatCard, StatusPill, EmptyState, Loaders
│   └── ui/           shadcn/ui primitives
├── data/             Mock datasets and domain types
├── lib/              Utilities (format, cn, SSR error handling)
├── routes/           File-based pages
├── services/         Data-access layer (mock → REST later)
├── store/            Zustand UI store
├── router.tsx        Router configuration
├── start.ts          TanStack Start middleware
├── server.ts         SSR entry with error recovery
└── styles.css        Tailwind theme
```

See [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) for a detailed breakdown.

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Routes (pages)                             │
│  useQuery → services → mocks (for now)      │
├─────────────────────────────────────────────┤
│  AppShell (layout)  │  Zustand (UI state)   │
├─────────────────────────────────────────────┤
│  TanStack Router  │  TanStack Query         │
├─────────────────────────────────────────────┤
│  TanStack Start (SSR)  │  Vite  │  Nitro     │
└─────────────────────────────────────────────┘
```

Data flows: **Route → useQuery → Service → Mock/API → Render**.

When the backend is ready, only the service layer changes — routes and components stay the same.

---

## Installation & Setup

### Prerequisites

- [Bun](https://bun.sh) 1.1+ (or Node.js 20+ with npm/pnpm)
- Git

### Steps

```bash
# Clone the repository
git clone <repository-url>
cd smart-khata-foundation

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
bun run build      # Production build
bun run preview    # Preview production build
bun run lint       # Run ESLint
bun run format     # Run Prettier
```

---

## Development Roadmap

### Phase 1 — Backend Foundation (next)
- [ ] REST API design (customers, products, transactions)
- [ ] Database schema (PostgreSQL)
- [ ] Authentication (shop owner login)
- [ ] Replace mock services with API calls

### Phase 2 — Core Business Logic
- [ ] Real-time outstanding balance calculation
- [ ] SMS/WhatsApp payment reminders
- [ ] Multi-user access (staff accounts)
- [ ] Data export (CSV/PDF)

### Phase 3 — Growth
- [ ] Multi-shop support
- [ ] GST invoicing
- [ ] Mobile app (React Native or PWA)
- [ ] Analytics and insights

---

## Future Plans

- **Offline-first PWA** for shops with unreliable internet
- **Voice entry** for quick transaction recording at the counter
- **UPI integration** for payment reconciliation
- **Supplier management** and purchase orders
- **Regional language support** (Hindi, Gujarati, Tamil, etc.)

---

## Screenshots

<!-- Add screenshots here once deployed -->
| Dashboard | Customers | Reports |
|-----------|-----------|---------|
| _Coming soon_ | _Coming soon_ | _Coming soon_ |

---

## Author

Built for Indian retail businesses by the SmartKhata team.

For architecture details, see [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md).
