# Resume Builder — Fullstack

A fullstack resume builder application consisting of:

- `server/` — NestJS API (TypeScript) with Prisma for database access, Clerk for auth, Stripe for billing, and PDF generation.
- `web/` — Angular frontend (TypeScript) with optional SSR support.

This repository contains both the API and the frontend. The instructions below cover local development, testing, database migrations, and deployment notes.

## Repository layout

- `server/` — NestJS application
  - `src/` — application source
  - `prisma/` — Prisma schema, seed script, and migrations
  - `uploads/` — runtime file uploads (e.g. resume photos)
- `web/` — Angular web application
  - `src/` — Angular app
  - `public/` — static assets

## Requirements

- Node.js (18+ recommended)
- npm (or yarn/pnpm)
- A PostgreSQL-compatible database (or other supported by Prisma) for the server
- Optional: Chrome/Chromium for PDF generation (puppeteer)

## Environment variables

Both `server` and `web` read environment variables. Create `.env` files in each workspace or set env vars in your environment. Common variables used by this project include:

- `DATABASE_URL` — Prisma database connection string (required for `server`)
- `PORT` — port for the NestJS server (default: 3000)
- `NODE_ENV` — environment (development|production)
- `CLERK_API_KEY` / `CLERK_JWT_KEY` / `CLERK_FRONTEND_API` — Clerk credentials for authentication
- `STRIPE_SECRET_KEY` — Stripe secret key (billing)
- `GENAI_API_KEY` (or similar) — API key for Google/GenAI usage if enabled

Check `server/src/config` and `web/src/environments` if you need the exact variable names used in configuration validators.

## Local development

Start the server and the web client in separate terminals.

Server (API):

1. Install dependencies and generate Prisma client

```bash
cd server
npm install
npx prisma generate
```

2. Run migrations and seed (development)

```bash
# Apply migrations (development)
npx prisma migrate dev

# Run seed script (project includes `prisma/seed.ts` — uses ts-node)
npx ts-node prisma/seed.ts
```

3. Start in dev mode

```bash
npm run start:dev
```

Production build and run:

```bash
npm run build
npm run start:prod
```

Web (Angular):

1. Install dependencies

```bash
cd web
npm install
```

2. Start the dev server

```bash
npm run start
```

3. Build for production

```bash
npm run build
```

If you need SSR (server-side rendering), the project provides a `serve:ssr:web` script that runs the server bundle after building. Check the Angular configuration for SSR details.

Run both together (example using two terminals):

Terminal A (server):

```bash
cd server
npm run start:dev
```

Terminal B (web):

```bash
cd web
npm run start
```

## Database & Prisma

- Prisma schema is at `server/prisma/schema.prisma`.
- Migrations are in `server/prisma/migrations/` and should be applied with Prisma CLI.
- Generate the client with `npx prisma generate` when schema changes.

Recommended commands:

```bash
cd server
npx prisma migrate dev       # development (creates/updates migrations)
npx prisma migrate deploy    # production (applies existing migrations)
npx prisma generate
```

## Testing

Server:

```bash
cd server
npm test            # unit tests
npm run test:e2e    # e2e tests
```

Web:

```bash
cd web
npm test
```

## Dev notes & architecture

- The server is a NestJS app using Prisma for DB access. Authentication is implemented with Clerk (`@clerk/express`).
- The server integrates with Stripe for billing and may use Google GenAI for résumé improvements.
- PDF generation uses Puppeteer (headless Chromium) in `server/modules/pdf`.
- The web app is an Angular application with some components provided under `web/libs/ui` and uses Clerk on the client for auth.

Look at `server/src/modules` and `web/src/app/features` for feature locations.

## Deployment hints

- Build the web app (and server if using SSR). Serve the static `web/dist` files from a CDN or static hosting for a SPA setup.
- For SSR, build the Angular server bundle and run the `serve:ssr:web` script or host behind a Node.js server.
- Ensure secure environment variables are injected into your hosting environment (DATABASE_URL, Clerk and Stripe keys, etc.).
- Use `npx prisma migrate deploy` during production deployments to apply migrations safely.

## Troubleshooting

- If Prisma client is missing, run `npx prisma generate` from `server/`.
- If migrations fail, ensure `DATABASE_URL` is correct and that the database user has permission to create schemas and tables.
- For Puppeteer PDF issues in containerized environments, ensure Chromium is installed or use a Docker image that includes the required libraries.

## Contributing

Contributions are welcome. Open an issue to discuss big changes. For small fixes and features:

1. Fork the repo
2. Create a branch for your change
3. Run lint/tests locally
4. Open a pull request with a clear description
