# Alexis Othily Portfolio

TanStack Router + Vite portfolio for Alexis Othily.

```bash
npm install
npm run dev
npm run build
```

Hidden analytics route: `/count`. It calls `/api/analytics` by default.

Local memory is only a fallback. Do not use a local SQLite file on Vercel for this:
serverless files are not durable. For real persistence, add an Upstash Redis
integration and set:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```
