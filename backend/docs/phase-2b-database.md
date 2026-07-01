# SmartKhata Phase 2B Database Layer

This document explains the PostgreSQL + Prisma foundation added in Phase 2B.

## 1. Why PostgreSQL

PostgreSQL was chosen because SmartKhata needs a transactional, relational database that can model customers, products, transactions, and line items safely.

- Strong relational integrity for foreign keys and constraints
- Reliable ACID transactions for ledger-style business data
- Mature indexing and query planning for reporting later
- Good support for decimals, timestamps, enums, and unique constraints
- Production-proven and easy to operate in most deployment environments

For SmartKhata, this matters because financial and inventory records must stay consistent.

## 2. Why Prisma

Prisma was chosen because it gives SmartKhata a type-safe database layer and a clear migration workflow.

- Type-safe generated client for TypeScript
- Schema-first data modeling
- Clear migrations and versioned database changes
- Good developer experience for adding models later
- Strong fit for modular backend architectures

Prisma reduces the chance of runtime query mistakes and makes schema evolution easier.

## 3. Installed Packages

### Production dependencies

| Package | Why it was installed | Problem it solves | Production? |
|---|---|---|---|
| `@prisma/client` | Prisma runtime client | Provides generated, type-safe database access | Yes |
| `@prisma/adapter-pg` | Prisma PostgreSQL adapter | Connects Prisma to the PostgreSQL driver in Prisma 7 | Yes |
| `pg` | PostgreSQL driver | Provides the actual PostgreSQL connection pool | Yes |
|

### Development dependencies

| Package | Why it was installed | Problem it solves | Development? |
|---|---|---|---|
| `prisma` | Prisma CLI | Schema validation, client generation, migrations, Studio | Yes |

These were added on top of the Phase 2A backend stack, which already included Express, dotenv, CORS, Helmet, Morgan, Zod, TypeScript, ESLint, and Prettier.

## 4. Prisma Folder Structure

- `prisma/schema.prisma` defines models, enums, relations, indexes, and constraints.
- `prisma/migrations/` stores versioned migration folders.
- `prisma/migrations/migration_lock.toml` locks the provider for migration history.

Generated client output is configured to live in `src/generated/prisma/`.

## 5. Generated Files

- `src/generated/prisma/client.ts` is the server entry point for Prisma Client.
- `src/generated/prisma/browser.ts` is the browser-safe Prisma type entry point.
- `src/generated/prisma/enums.ts` contains generated enum exports.
- `src/generated/prisma/models/` contains generated model type files.
- `src/generated/prisma/internal/` contains generated Prisma internals.
- `prisma/migrations/20260701155000_init/migration.sql` is the initial migration SQL.
- `prisma/migrations/migration_lock.toml` locks the migration provider.

These generated files should not be edited manually.

## 6. Database Connection Flow

The connection flow is:

`server.ts` -> `config/env.ts` -> `config/prisma.ts` -> `PrismaClient` -> PostgreSQL

Details:

- `src/config/env.ts` loads `.env` and validates `PORT`, `NODE_ENV`, and `DATABASE_URL`.
- `src/config/prisma.ts` creates a singleton `Pool` and a singleton Prisma Client.
- `src/config/prisma.ts` uses `@prisma/adapter-pg` so Prisma 7 can talk to PostgreSQL.
- `src/server.ts` calls `connectDatabase()` before starting the HTTP server.
- On shutdown, `disconnectDatabase()` closes both Prisma and the PostgreSQL pool.

If the database cannot connect, startup fails gracefully and the process exits with a clear error.

## 7. Models

### User

Represents a SmartKhata operator or staff account.

Important fields:
- `email` unique login identifier
- `phone` optional unique contact number
- `passwordHash` stored hash, not plaintext
- `role` enum for permission tiers
- `isActive` for account lifecycle control

### Customer

Represents a ledger customer.

Important fields:
- `phone` and `email` are unique if provided
- `creditLimit` sets allowed credit exposure
- `outstandingBalance` stores current dues
- `status` tracks whether the customer is active, inactive, or blocked

### Category

Represents a product category.

Important fields:
- `slug` unique identifier for routes, API usage, or stable references
- `sortOrder` for ordered display
- `isActive` for category lifecycle control

### Product

Represents inventory tracked in the shop.

Important fields:
- `sku` unique stock identifier
- `categoryId` links product to a category
- `unit` enum for inventory units
- `costPrice`, `salePrice`, `stockQuantity`, `reorderLevel` for inventory logic

### Transaction

Represents a ledger/business transaction.

Important fields:
- `transactionNumber` unique business reference
- `customerId` links the transaction to a customer
- `type` enum for sale/payment/credit/expense
- `status` enum for lifecycle control
- `subtotal`, `discountTotal`, `taxTotal`, `grandTotal` for accounting totals

### TransactionItem

Represents each line item inside a transaction.

Important fields:
- `transactionId` links to the parent transaction
- `productId` links to the purchased product
- `quantity`, `unitPrice`, `discountAmount`, `lineTotal` capture line math

## 8. Relationships

- `User` -> `Customer` through `createdById` and `updatedById`
- `User` -> `Category` through `createdById` and `updatedById`
- `User` -> `Product` through `createdById` and `updatedById`
- `User` -> `Transaction` through `createdById`
- `Category` -> `Product` as one-to-many
- `Customer` -> `Transaction` as one-to-many
- `Transaction` -> `TransactionItem` as one-to-many
- `Product` -> `TransactionItem` as one-to-many

Delete behavior is intentionally conservative:
- `Restrict` protects historical financial and inventory records
- `Cascade` is used only for child line items under a transaction
- `SetNull` preserves records when a user is removed later

## 9. Constraints

### Primary keys

Each table uses a string `id` primary key generated by `cuid()`.

### Unique fields

- `users.email`
- `users.phone`
- `customers.email`
- `customers.phone`
- `categories.slug`
- `products.sku`
- `transactions.transaction_number`

These prevent duplicate business records.

### NOT NULL

Required operational fields like names, foreign keys, money fields, and timestamps are non-null.

### DEFAULT

Defaults are used for lifecycle and accounting fields:
- `role` defaults to `OWNER`
- `status` defaults to `ACTIVE` or `POSTED`
- booleans default to `true`
- numeric totals default to `0`
- timestamps default to `now()` where appropriate

### FOREIGN KEY

Foreign keys enforce real relationships between parent and child tables.

## 10. Indexes

Indexes were added for the fields most likely to be filtered or sorted later.

- `users.role`, `users.is_active`
- `customers.name`, `customers.phone`, `customers.status`, `customers.is_active + outstanding_balance`
- `categories.name`, `categories.is_active + sort_order`
- `products.category_id`, `products.name`, `products.is_active + stock_quantity`
- `transactions.customer_id`, `transactions.created_by_id`, `transactions.type + transaction_at`, `transactions.status + transaction_at`
- `transaction_items.transaction_id`, `transaction_items.product_id`, `transaction_items.transaction_id + product_id`

These indexes support future reporting and business queries.

## 11. Migrations

### Initial migration

`prisma/migrations/20260701155000_init/migration.sql`

It creates:
- enums
- tables
- indexes
- foreign keys

### How migrations work

- Prisma reads `schema.prisma`
- Prisma compares schema state with migration history
- Prisma creates SQL for the delta
- Prisma applies the SQL to the target PostgreSQL database
- Migration history is stored in `_prisma_migrations`

### Current migration command flow

- `npm run prisma:generate` generates the client
- `npm run prisma:migrate` creates and applies migrations during development
- `npm run prisma:migrate:deploy` applies existing migrations in production-style environments

### Resetting migrations

To reset the database during development:

```bash
npm run prisma:reset
```

This drops data and reapplies migrations, so only use it in a development environment.

## 12. Prisma Client

The singleton lives in `src/config/prisma.ts`.

- Only one Prisma Client instance is created
- A PostgreSQL pool is shared for connections
- Prisma uses the PostgreSQL adapter
- Shutdown closes both Prisma and the pool

This prevents connection leaks and avoids creating a new client on every import.

## 13. Health Check

`GET /api/health`

Current response shape:

```json
{
  "success": true,
  "message": "Backend server is running.",
  "data": {
    "backendRunning": true,
    "databaseConnected": true
  }
}
```

This confirms the backend process is alive and PostgreSQL is reachable.

## 14. Adding a New Model Later

1. Add the model to `prisma/schema.prisma`.
2. Add any enums, relations, indexes, and constraints.
3. Run a migration.
4. Regenerate the Prisma Client.
5. Use the new generated types in services or controllers later.

Example future sequence:

```bash
npm run prisma:migrate
npm run prisma:generate
```

## 15. Common Prisma Commands

- `npm run prisma:generate` - generate the Prisma Client
- `npm run prisma:migrate` - create and apply a migration in development
- `npm run prisma:migrate:deploy` - apply migrations without creating new ones
- `npm run prisma:reset` - reset the database and reapply all migrations
- `npm run prisma:studio` - open Prisma Studio
- `npm run prisma:format` - format the schema if you add a script later
- `npm run prisma:validate` - validate the schema if you add a script later

## 16. Inspecting the Database

You can inspect the database in several ways:

- Use Prisma Studio
- Use a PostgreSQL GUI such as pgAdmin
- Use the `pg` driver or Prisma Client in a small script
- Query the tables directly from the local Prisma Postgres instance

## 17. Prisma Studio

Start Studio with:

```bash
npm run prisma:studio
```

Prisma Studio is useful for:
- viewing tables
- checking relations
- verifying migrated rows
- manually inspecting seed data later

## 18. Environment Variables

Current `.env` variables:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:51214/template1?sslmode=disable&connection_limit=10&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0
SHADOW_DATABASE_URL=postgres://postgres:postgres@localhost:51215/template1?sslmode=disable&connection_limit=10&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0
```

`SHADOW_DATABASE_URL` is used by Prisma migrations.

## 19. Verification Guide

### What was installed

- `@prisma/client` - runtime Prisma Client, required in production
- `@prisma/adapter-pg` - Prisma 7 PostgreSQL adapter, required in production
- `pg` - PostgreSQL driver and connection pooling, required in production
- `prisma` - CLI for generate/migrate/studio, required in development

### What files were created

- `prisma/schema.prisma` - database schema source of truth
- `prisma/config.ts` - Prisma CLI configuration and datasource URL wiring
- `prisma/migrations/migration_lock.toml` - migration provider lock
- `prisma/migrations/20260701155000_init/migration.sql` - initial SQL migration
- `src/generated/prisma/*` - generated Prisma Client and types
- `.env` - local environment values
- `.env.example` - example environment values

### How to verify everything works

1. Confirm PostgreSQL is running.
2. Confirm the database port is reachable.
3. Confirm `.env` contains a valid `DATABASE_URL`.
4. Run `npm run prisma:generate`.
5. Run `npm run prisma:migrate:deploy` or `npm run prisma:migrate`.
6. Confirm the tables exist in Prisma Studio or pgAdmin.
7. Start the backend with `npm run dev`.
8. Call `GET /api/health`.
9. Confirm the response shows `databaseConnected: true`.
10. Open Prisma Studio and verify the schema is visible.

### Common mistakes and fixes

- Wrong `DATABASE_URL`
  - Fix: copy the exact connection string from Prisma Dev or your PostgreSQL server.
- PostgreSQL service stopped
  - Fix: start the database service or restart `prisma dev`.
- Migration errors
  - Fix: check schema syntax, foreign keys, and enum names.
- Prisma Client not generated
  - Fix: run `npm run prisma:generate`.
- Version mismatch
  - Fix: keep `prisma`, `@prisma/client`, and `@prisma/adapter-pg` on matching major versions.
- Connection refused
  - Fix: verify the database port, host, and credentials.
- Port already in use
  - Fix: change `PORT` in `.env` or stop the existing process.

### Final checklist

- PostgreSQL installed or running ✅
- Prisma installed ✅
- Prisma Client generated ✅
- Initial migration created ✅
- Initial migration applied ✅
- Tables created ✅
- Backend health endpoint working ✅
- Database connection verified ✅
- Prisma Studio available ✅

## 20. Notes for Phase 2B

This phase intentionally stops at the database foundation.

Not implemented yet:
- business CRUD APIs
- authentication
- JWT
- frontend integration
- seed data
- repositories or domain services for customer/product/transaction workflows

Those belong in the next phase.
