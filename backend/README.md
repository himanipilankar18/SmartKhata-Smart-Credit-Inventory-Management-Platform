# SmartKhata Backend

Backend infrastructure for SmartKhata Phase 2A.

This project is intentionally database-independent. It establishes the Express + TypeScript
foundation that later phases can connect to PostgreSQL and Prisma without reworking the
application structure.

## Stack

- Node.js
- Express.js
- TypeScript
- dotenv
- CORS
- Helmet
- Morgan
- Zod
- ESLint
- Prettier

## Folder Structure

```
backend/
  src/
    config/
    routes/
    controllers/
    services/
    middlewares/
    validators/
    utils/
    constants/
    types/
    interfaces/
    helpers/
    app.ts
    server.ts
  package.json
  tsconfig.json
  .gitignore
  .env.example
  README.md
```

### Responsibilities

- `config/` holds environment and application configuration.
- `routes/` defines API endpoints and keeps routing thin.
- `controllers/` receives requests, calls services, and returns responses.
- `services/` contains business logic placeholders for future phases.
- `middlewares/` contains reusable middleware such as validation, 404, and error handling.
- `validators/` will hold Zod schemas and validation contracts.
- `utils/` provides reusable response helpers, async wrappers, errors, and logging helpers.
- `constants/` stores reusable application constants.
- `types/` stores shared TypeScript types.
- `interfaces/` stores shared TypeScript interfaces.
- `helpers/` stores small reusable helper functions.

## Architecture

```
server.ts
  ↓
app.ts
  ↓
routes
  ↓
controllers
  ↓
services
```

The server bootstrap loads environment variables, creates the Express app, registers middleware,
mounts routes, and starts listening.

## Environment

Copy `.env.example` to `.env` and set the required values.

```env
PORT=
NODE_ENV=
```

## Commands

- `npm run dev` - start the development server with hot reload
- `npm run build` - compile TypeScript into `dist/`
- `npm run start` - run the compiled production build
- `npm run lint` - lint the backend source
- `npm run format` - format the backend source

## Health Check

`GET /api/health`

Response:

```json
{
  "success": true,
  "message": "Backend server is running."
}
```

## Phase 2A Scope

This backend does not include:

- PostgreSQL
- Prisma
- Database models
- Migrations
- Authentication
- JWT
- Business CRUD modules
- Frontend integration

Those pieces belong to later phases.

## Phase 2B Database Layer

The PostgreSQL + Prisma foundation is documented in [docs/phase-2b-database.md](docs/phase-2b-database.md).