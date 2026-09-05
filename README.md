# Tagflow QR Operations

QR batch administration built with Next.js and TypeScript. This version runs entirely on typed local sample data—no database or Prisma setup is required.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`. The main workflow is `/batches/create`.

## Sample API and frontend call

The local API endpoints are:

- `GET /api/sample/qr-codes`
- `GET /api/sample/batches`

The inventory table demonstrates a frontend request:

```ts
const response = await fetch("/api/sample/qr-codes");
const { data } = await response.json();
```

All sample records live in `lib/data/sample-data.ts`; update that file to change the displayed dashboard data.
