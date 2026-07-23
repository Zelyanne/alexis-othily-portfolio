# Freelance Route and Analytics Design

Date: 2026-07-23
Status: Approved design, awaiting written-spec review

## Goal

Split the portfolio into a general route and a freelance route, then extend the existing analytics page so it separates their views and shows a country- and date-filterable view history.

The existing lifetime analytics counters remain intact. Route-level history starts when this feature is deployed because the current storage does not contain complete historical route, country, and daily data.

## Scope

### Included

- Keep `/` as the general portfolio without freelance offers.
- Add `/freelance` as the same portfolio with the offers section and regional pricing.
- Count one view per browser session for each of the two routes.
- Preserve the existing total, view, click, location, and recent-event analytics.
- Add daily view aggregates by route and server-derived country in Upstash Redis.
- Add base/freelance totals, a two-series view chart, and country/date filters to `/count`.
- Preserve equivalent local-storage behavior when the API is unavailable.

### Excluded

- Reconstructing route-level history from incomplete old events.
- Moving analytics to Neon or adding a database schema.
- Adding a charting, date-picker, state-management, or analytics dependency.
- Tracking `/cv`, `/count`, or section impressions as landing-page views.
- CSV export, authentication, bot detection, unique-user identification, or analytics-provider integration.

## Existing Invariants

- Preserve all French and English copy and the current device-language selection.
- Preserve `/cv`, `/count`, Vercel SPA rewrites, project-click tracking, referrer display, recent events, and regional service prices.
- Preserve the existing Upstash Redis keys and their values.
- Preserve the memory and local-storage fallbacks.
- Preserve accessibility behavior, responsive navigation, and reduced-motion styling.
- Preserve the user's uncommitted `@neondatabase/serverless` changes in `package.json` and `package-lock.json`.

## Route Design

The existing homepage becomes a shared portfolio page with one explicit boolean input controlling whether freelance content is present.

- `/` renders the shared page without the offers section, the offers metric, or the regional-pricing request.
- `/freelance` renders the shared page with the offers metric, all five offer cards, and the existing regional-pricing request.
- Hero, projects, stack, experience, credentials, contact, language, footer, and responsive behavior remain identical.
- The global “Offres” navigation link points to `/freelance#services` from either route.
- Existing home anchors continue to use `/` for sections shared by both routes.

This keeps one source for portfolio content and avoids duplicating the page or its bilingual data.

## View Tracking

The current event path remains the source for route classification.

- `/freelance` and `/freelance/` normalize to `freelance`.
- Every other tracked landing path normalizes to `base`; old events therefore keep the approved `base` fallback.
- The session-storage key includes the normalized page, so the same browser session may record one base view and one freelance view, but repeated visits to either route remain deduplicated.
- The server derives the country from Vercel geo headers and stores `unknown` when no country is available. A client-provided country is never trusted.
- The UTC date on which the server receives the event, in `YYYY-MM-DD` form, determines the daily bucket. The browser timestamp remains available only as event context.
- Recent events receive normalized `page` and `country` fields so `/count` can label them explicitly.

## Redis Data Model

Keep every existing key. Add one Redis hash:

```text
analytics:view-series
  2026-07-23|BJ|base      -> 12
  2026-07-23|BJ|freelance -> 4
  2026-07-23|unknown|base -> 1
```

Only view events increment this hash. Click behavior and existing location aggregation do not change.

One hash is sufficient for the expected portfolio traffic. The API reads it once, ignores malformed fields, derives the available country list and lifetime base/freelance totals, and produces the requested timeline. A separate country index, per-day keys, raw-event archive, and duplicate page counters are unnecessary.

The known ceiling is hash growth across many years and countries. A database or partitioned keys should be considered only if the aggregate hash becomes measurably expensive.

The in-memory fallback mirrors the same aggregate field/count structure. Browser-local events keep `path`; when no server country exists, they use `unknown` for filtering.

## Analytics API

The existing `GET /api/analytics` response retains its current fields and adds:

```ts
type AnalyticsStats = {
  clicks: number
  total: number
  views: number
  locations: Array<{ label: string; count: number }>
  recent: AnalyticsEvent[]
  pageViews: { base: number; freelance: number }
  countries: string[]
  viewSeries: Array<{ date: string; base: number; freelance: number }>
}
```

The request accepts optional `from`, `to`, and `country` query parameters.

- Missing dates default to the last 30 calendar days, including today.
- Dates must use valid `YYYY-MM-DD` values.
- `from` must not follow `to`.
- The inclusive range is limited to 366 days to prevent an oversized response.
- `country=all` or an omitted country includes every country.
- A selected country must be `unknown` or a two-letter uppercase country code already present in the aggregates.
- Invalid filters return HTTP 400 with a concise error. Storage failures retain the current HTTP 500 behavior.
- `GET /api/analytics?geo=1` remains unchanged.

The filtered timeline contains every requested date. Missing days and missing route values are returned as zero, ensuring continuous chart lines.

## Count Page

The existing `/count` page keeps its storage notice, API error notice, location list, recent-event list, and five-second refresh.

Its summary grid contains:

- total views from the existing lifetime counter;
- base views since route-level tracking began;
- freelance views since route-level tracking began;
- total clicks;
- observed location count.

A note states that the base/freelance split begins with this deployment, so the new page totals are not presented as a decomposition of the older lifetime total.

The chart section contains:

- a native country `<select>` with “all countries” and recorded country codes;
- native start/end `<input type="date">` controls;
- a responsive inline SVG with one base series and one freelance series;
- visible labels/legend, an accessible chart name, and a clear empty state;
- zero-filled days so gaps mean zero views rather than missing data.

The controls request a newly filtered API response. The local fallback applies the same selected range and country to locally stored events. Recent-event rows add a localized base/freelance label while retaining location, referrer, and timestamp.

## Compatibility and Failure Behavior

- Old events without `type` continue to count as clicks under the current rule.
- Old events without `page` normalize from `path`, falling back to `base`.
- Old events without `country` display and filter as `unknown`.
- Existing Redis totals are never reset, migrated, or backfilled.
- If Redis is unavailable, the process-local memory response retains the same response shape.
- If the remote analytics request fails, `/count` shows the current notice and uses local events.
- Empty, malformed, or unavailable series data renders an empty chart state rather than invalid SVG coordinates.

## Implementation Boundaries

- Terra owns implementation, debugging, and test edits after the primary supplies the approved plan.
- The primary owns architecture, diff review, integration decisions, and final verification.
- Expected production files are `src/main.tsx`, `src/styles.css`, and `api/analytics.js`.
- One focused built-in Node test file may be added for the pure API normalization, filter, and timeline behavior.
- Do not modify package dependencies or the lockfile.
- Do not split the portfolio into duplicate page components or move unrelated bilingual content.
- Do not refactor unrelated analytics, navigation, or styling code.

## Testing and Verification

- Use Node's built-in `node:test`; no test dependency is needed.
- Follow red-green TDD for route normalization, filter validation, country selection, zero-filled dates, and base/freelance aggregation.
- Run the focused Node test command after each backend behavior change.
- Run `npm run build` after implementation.
- Load `/`, `/freelance`, `/count`, and `/cv` without runtime or console errors.
- Confirm `/` has no offer metric or offer section.
- Confirm `/freelance` has all five offers and the geo-priced amounts.
- Confirm one session can record one view on each route but not repeated views on the same route.
- Confirm `/count` separates the routes, filters by country and inclusive dates, zero-fills empty days, and remains usable on mobile.
- Confirm invalid filter requests return HTTP 400 and `?geo=1` still succeeds.
- Review the final diff to ensure the pre-existing Neon dependency edits remain untouched.

## Acceptance Criteria

- `/` contains no freelance offers.
- `/freelance` otherwise matches `/` and adds the complete offers experience.
- Views are independently deduplicated and counted for base and freelance routes.
- New daily aggregates use the server date and server-derived country.
- `/count` shows the two route totals and a responsive two-series chart.
- Country and inclusive date filters produce accurate, continuous daily results.
- Existing analytics counters and old events remain compatible.
- No new runtime or development dependency is added.
- Focused tests, the production build, and browser verification pass.
