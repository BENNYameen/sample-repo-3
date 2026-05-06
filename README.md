# E‑commerce Order Processing Workshop

Monorepo with a deliberately imperfect **Node.js + Express + PostgreSQL** API and a **Vite + React** storefront. The code is realistic enough to run end‑to‑end, but it carries intentional technical debt for coverage, complexity, mutation testing, and refactoring drills.

## Prerequisites

- Node.js **20+** (LTS)
- PostgreSQL **14+** (local install or cloud)

## 1. Database

Create a database (example name: `ecommerce_workshop`):

```bash
createdb ecommerce_workshop
# or: psql -c "CREATE DATABASE ecommerce_workshop;"
```

## 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env if your Postgres user/password/host differ

npm install
npm run db:init    # runs sql/init.sql (destructive drop/recreate tables)
npm run seed       # loads sample users, categories, products
npm run dev        # API on http://localhost:3001
```

Health check: `curl http://localhost:3001/health`

### Tests

```bash
cd backend
npm test
```

Coverage is configured for `controllers`, `services`, `utils`, and `middleware` only (~60% statements — intentional gaps).

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The dev server proxies `/api` to the backend.

## Seeded accounts

| Role     | Email               | Password   |
|----------|---------------------|------------|
| admin    | `admin@example.com` | `Admin123!` |
| customer | `customer@example.com` | `User123!` |

## API reference

See [docs/API.md](docs/API.md).

## Known defects catalog

See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) — important for facilitators and static analysis benchmarks.

## Repository layout

```
backend/
  controllers/   # HTTP handlers (some are long / duplicated)
  services/      # Business logic + DB access
  models/        # Connection helper
  routes/
  utils/
  sql/
  scripts/
  tests/
frontend/
  components/    # (minimal — pages hold most UI)
  pages/
  services/
docs/
```

## License

Educational / workshop use. Not intended as a production baseline.
