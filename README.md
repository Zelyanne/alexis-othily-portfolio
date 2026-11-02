# Alexis Othily Portfolio

TanStack Router + Vite portfolio for Alexis Othily.

```bash
npm install
npm run dev
npm run build
```

## Design

The main portfolio and `/freelance` share the Monumentale direction: pearl
background, cobalt typography, the original portrait and subtle scroll motion.
Projects and offers include scope details; existing regional prices and timelines
are preserved. The CV remains at `/cv`.

Typography is self-hosted **Outfit**, a geometric alternative, not Brodine.
Its source and license are documented in `public/fonts/`. The exact Brodine
webfont still requires a licensed kit.

The updated CV is served from `public/Alexis-OTHILY-CV.pdf`. Its original source
PDF is retained at the repository root. `python3 scripts/update_cv.py` (requires
`pypdf`) adds the current Harnix role using the original embedded fonts, preserving
the two-page document, its existing content and certificate links. No start date
has been assumed.

Focused checks:

```bash
node --test tests/*.test.ts api/analytics.test.js
```

Hidden analytics route: `/count`. It calls `/api/analytics` by default.

Local memory is only a fallback. Do not use a local SQLite file on Vercel for this:
serverless files are not durable. For real persistence, add an Upstash Redis
integration and set:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Vercel's Upstash integration may also inject these names; the API supports them too:

```env
KV_REST_API_URL=
KV_REST_API_TOKEN=
```
