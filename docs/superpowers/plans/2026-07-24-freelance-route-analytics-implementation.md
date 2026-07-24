# Freelance Route and Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/freelance`, remove offers from `/`, and give `/count` route-separated daily view analytics with country and date filters.

**Architecture:** Keep one shared portfolio component controlled by `showServices`. Extend the existing Upstash/memory analytics path with one daily aggregate hash keyed by `date|country|page`; the API validates filters and returns a zero-filled timeline consumed by a dependency-free SVG chart.

**Tech Stack:** React 19, TypeScript, TanStack Router, Vite, Vercel functions, Upstash Redis, CSS, Node `node:test`.

---

## File Map

- Create `api/analytics.test.js`: focused red-green tests for page normalization, server-date bucketing, filter validation, country filtering, totals, and zero-filled timelines.
- Modify `api/analytics.js`: pure tested helpers plus the existing Redis/memory handler integration.
- Modify `src/main.tsx`: shared base/freelance route, per-route session tracking, new analytics response types, local fallback, filters, and inline SVG.
- Modify `src/styles.css`: responsive filter, legend, and chart styles using existing design tokens.
- Do not modify `package.json`, `package-lock.json`, or dependencies; preserve the user's existing Neon edits.

## Task 1: Route-aware analytics API

**Files:**

- Create: `api/analytics.test.js`
- Modify: `api/analytics.js:3-190`

- [ ] **Step 1: Write the failing API behavior tests**

Create `api/analytics.test.js` with the complete test file below. Namespace import keeps the module loadable before named helpers exist, and each test first proves the missing behavior explicitly.

```js
import assert from 'node:assert/strict'
import test from 'node:test'
import * as analytics from './analytics.js'

test('normalizes only the freelance path as freelance', () => {
  assert.equal(typeof analytics.normalizePage, 'function')
  assert.equal(analytics.normalizePage('/freelance'), 'freelance')
  assert.equal(analytics.normalizePage('/freelance/'), 'freelance')
  assert.equal(analytics.normalizePage('/'), 'base')
  assert.equal(analytics.normalizePage('/cv'), 'base')
  assert.equal(analytics.normalizePage(), 'base')
})

test('defaults analytics filters to the last 30 UTC days', () => {
  assert.equal(typeof analytics.getAnalyticsFilters, 'function')
  assert.deepEqual(analytics.getAnalyticsFilters({}, new Date('2026-07-24T18:00:00Z')), {
    country: 'all',
    from: '2026-06-25',
    to: '2026-07-24',
  })
})

test('rejects invalid analytics filters', () => {
  assert.equal(typeof analytics.getAnalyticsFilters, 'function')
  const invalidQueries = [
    { from: '2026-02-30', to: '2026-03-01' },
    { from: '2026-07-25', to: '2026-07-24' },
    { from: '2025-01-01', to: '2026-01-02' },
    { country: 'bj' },
  ]

  for (const query of invalidQueries) {
    assert.throws(() => analytics.getAnalyticsFilters(query, new Date('2026-07-24T18:00:00Z')), RangeError)
  }
})

test('uses the server receive date for the aggregate field', () => {
  assert.equal(typeof analytics.getViewSeriesField, 'function')
  assert.equal(
    analytics.getViewSeriesField(
      { country: 'BJ', page: 'freelance' },
      new Date('2026-07-24T23:59:59Z'),
    ),
    '2026-07-24|BJ|freelance',
  )
})

test('summarizes lifetime page totals and zero-fills the selected timeline', () => {
  assert.equal(typeof analytics.summarizeViewSeries, 'function')
  const summary = analytics.summarizeViewSeries(
    {
      '2026-07-23|BJ|base': '2',
      '2026-07-23|BJ|freelance': 1,
      '2026-07-24|FR|freelance': 4,
      malformed: 99,
    },
    { country: 'BJ', from: '2026-07-23', to: '2026-07-25' },
  )

  assert.deepEqual(summary.pageViews, { base: 2, freelance: 5 })
  assert.deepEqual(summary.countries, ['BJ', 'FR'])
  assert.deepEqual(summary.viewSeries, [
    { date: '2026-07-23', base: 2, freelance: 1 },
    { date: '2026-07-24', base: 0, freelance: 0 },
    { date: '2026-07-25', base: 0, freelance: 0 },
  ])
})

test('rejects a country absent from the aggregates', () => {
  assert.equal(typeof analytics.summarizeViewSeries, 'function')
  assert.throws(
    () =>
      analytics.summarizeViewSeries(
        { '2026-07-23|BJ|base': 1 },
        { country: 'US', from: '2026-07-23', to: '2026-07-23' },
      ),
    RangeError,
  )
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test api/analytics.test.js
```

Expected: FAIL assertions report that `normalizePage`, `getAnalyticsFilters`, `getViewSeriesField`, and `summarizeViewSeries` are `undefined`. The failure must be caused by missing feature behavior, not syntax or import errors.

- [ ] **Step 3: Add the pure analytics helpers**

In `api/analytics.js`, add the constants and named exports below after the Redis key declarations. Add `viewSeries: 'analytics:view-series'` to `keys` first.

```js
const dayMilliseconds = 24 * 60 * 60 * 1000
const datePattern = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(value) {
  if (!datePattern.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function normalizePage(path = '/') {
  return String(path).replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base'
}

export function getAnalyticsFilters(query = {}, now = new Date()) {
  const today = now.toISOString().slice(0, 10)
  const defaultFrom = new Date(now.getTime() - 29 * dayMilliseconds).toISOString().slice(0, 10)
  const from = query.from ? String(query.from) : defaultFrom
  const to = query.to ? String(query.to) : today
  const country = query.country ? String(query.country) : 'all'

  if (!isValidDate(from) || !isValidDate(to)) throw new RangeError('Invalid analytics filters')

  const fromTime = Date.parse(`${from}T00:00:00.000Z`)
  const toTime = Date.parse(`${to}T00:00:00.000Z`)
  const days = (toTime - fromTime) / dayMilliseconds + 1
  if (days < 1 || days > 366) throw new RangeError('Invalid analytics filters')
  if (country !== 'all' && country !== 'unknown' && !/^[A-Z]{2}$/.test(country)) {
    throw new RangeError('Invalid analytics filters')
  }

  return { country, from, to }
}

export function getViewSeriesField(event, now = new Date()) {
  return `${now.toISOString().slice(0, 10)}|${event.country}|${event.page}`
}

export function summarizeViewSeries(entries = {}, filters) {
  const countries = new Set()
  const pageViews = { base: 0, freelance: 0 }
  const filtered = new Map()

  for (const [field, rawCount] of Object.entries(entries)) {
    const [date, country, page, extra] = field.split('|')
    const count = Number(rawCount)
    if (extra || !isValidDate(date) || !country || !['base', 'freelance'].includes(page)) continue
    if (!Number.isFinite(count) || count < 0) continue

    countries.add(country)
    pageViews[page] += count
    if (date < filters.from || date > filters.to) continue
    if (filters.country !== 'all' && filters.country !== country) continue

    const point = filtered.get(date) || { base: 0, freelance: 0 }
    point[page] += count
    filtered.set(date, point)
  }

  if (filters.country !== 'all' && !countries.has(filters.country)) {
    throw new RangeError('Invalid analytics filters')
  }

  const viewSeries = []
  for (
    let time = Date.parse(`${filters.from}T00:00:00.000Z`);
    time <= Date.parse(`${filters.to}T00:00:00.000Z`);
    time += dayMilliseconds
  ) {
    const date = new Date(time).toISOString().slice(0, 10)
    viewSeries.push({ date, ...(filtered.get(date) || { base: 0, freelance: 0 }) })
  }

  return {
    countries: [...countries].sort(),
    pageViews,
    viewSeries,
  }
}
```

- [ ] **Step 4: Integrate the aggregate into Redis and memory**

Extend the existing global memory object and guard warm processes created with the old shape:

```js
const memory = globalThis.__alexisAnalytics || {
  clicks: 0,
  locations: new Map(),
  recent: [],
  total: 0,
  viewSeries: new Map(),
  views: 0,
}

memory.viewSeries ||= new Map()
```

Change `getStats` to accept `filters`, read the extra Redis hash once, and merge the pure summary into both response paths:

```js
async function getStats(filters) {
  if (redis) {
    const [total, views, clicks, locations, recent, viewSeries] = await Promise.all([
      redis.get(keys.total),
      redis.get(keys.views),
      redis.get(keys.clicks),
      redis.hgetall(keys.locations),
      redis.lrange(keys.recent, 0, 11),
      redis.hgetall(keys.viewSeries),
    ])

    return {
      clicks: Number(clicks || 0),
      persistent: true,
      storage,
      total: Number(total || 0),
      views: Number(views || 0),
      locations: Object.entries(locations || {})
        .map(([label, count]) => ({ label, count: Number(count) }))
        .sort((a, b) => b.count - a.count),
      recent: normalizeRecent(recent),
      ...summarizeViewSeries(viewSeries || {}, filters),
    }
  }

  return {
    clicks: memory.clicks,
    persistent: false,
    storage,
    total: memory.total,
    views: memory.views,
    locations: [...memory.locations.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    recent: memory.recent.slice(0, 12),
    ...summarizeViewSeries(Object.fromEntries(memory.viewSeries), filters),
  }
}
```

Update `saveEvent` so only view events write the new field while all existing counters continue unchanged:

```js
async function saveEvent(event) {
  if (redis) {
    const writes = [
      redis.incr(keys.total),
      redis.incr(event.type === 'view' ? keys.views : keys.clicks),
      redis.hincrby(keys.locations, event.location, 1),
      redis.lpush(keys.recent, JSON.stringify(event)),
    ]
    if (event.type === 'view') writes.push(redis.hincrby(keys.viewSeries, getViewSeriesField(event), 1))
    await Promise.all(writes)
    await redis.ltrim(keys.recent, 0, 49)
    return
  }

  memory.total += 1
  if (event.type === 'view') {
    memory.views += 1
    const field = getViewSeriesField(event)
    memory.viewSeries.set(field, (memory.viewSeries.get(field) || 0) + 1)
  }
  if (event.type === 'click') memory.clicks += 1
  memory.locations.set(event.location, (memory.locations.get(event.location) || 0) + 1)
  memory.recent.unshift(event)
  memory.recent = memory.recent.slice(0, 50)
}
```

- [ ] **Step 5: Normalize POST events and validate GET filters at the handler boundary**

Replace the GET branch and event construction with the following behavior. Reuse one `getGeo` result and remove the now-unused `getLocation` helper.

```js
if (req.method === 'GET') {
  if (req.query?.geo) return json(res, 200, getGeo(req))
  return json(res, 200, await getStats(getAnalyticsFilters(req.query)))
}

if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

const body = parseBody(req)
const type = body.type === 'view' ? 'view' : 'click'
const path = String(body.path || '/')
const geo = getGeo(req, `${body.locale || ''} / ${body.timeZone || ''}`.trim())
const event = {
  country: geo.country || 'unknown',
  href: String(body.href || ''),
  id: String(body.id || 'unknown'),
  label: String(body.label || 'Lien inconnu'),
  locale: String(body.locale || ''),
  location: geo.label,
  page: normalizePage(path),
  path,
  referrer: String(body.referrer || ''),
  timeZone: String(body.timeZone || ''),
  timestamp: String(body.timestamp || new Date().toISOString()),
  type,
}
```

Change the catch block so validation errors are a 400 without hiding storage errors:

```js
} catch (error) {
  if (error instanceof RangeError) return json(res, 400, { error: 'Invalid analytics filters' })
  return json(res, 500, { error: 'Analytics unavailable' })
}
```

- [ ] **Step 6: Run the focused tests and verify GREEN**

Run:

```bash
node --test api/analytics.test.js
```

Expected: 6 tests pass, 0 fail.

- [ ] **Step 7: Verify formatting and commit the API increment**

Run:

```bash
git diff --check -- api/analytics.js api/analytics.test.js
git add api/analytics.js api/analytics.test.js
git commit -m "Add route-aware analytics series"
```

Expected: only `api/analytics.js` and `api/analytics.test.js` are committed; `package.json` and `package-lock.json` remain unstaged.

## Task 2: Shared base and freelance portfolio routes

**Files:**

- Modify: `src/main.tsx:21-42`
- Modify: `src/main.tsx:585-608`
- Modify: `src/main.tsx:651-690`
- Modify: `src/main.tsx:692-955`
- Modify: `src/main.tsx:1135-1155`

- [ ] **Step 1: Record the route UI RED state**

Start the existing app with `npm run dev`, open `/freelance`, and confirm the router has no freelance page. Open `/` and confirm `#services` plus the offers metric are still present. Stop the server after recording those two expected failures.

- [ ] **Step 2: Extend the client analytics types and local fallback**

Add the page, country, and series fields to the existing types:

```ts
type AnalyticsPage = 'base' | 'freelance'

type AnalyticsEvent = {
  country?: string
  href?: string
  id: string
  label: string
  locale: string
  location?: string
  page?: AnalyticsPage
  path: string
  referrer?: string
  timeZone: string
  timestamp: string
  type?: 'click' | 'view'
}

type AnalyticsStats = {
  clicks: number
  countries: string[]
  pageViews: Record<AnalyticsPage, number>
  persistent?: boolean
  storage?: string
  total: number
  views: number
  viewSeries: Array<{ date: string; base: number; freelance: number }>
  locations: Array<{ label: string; count: number }>
  recent: AnalyticsEvent[]
}
```

Add UTC range constants beside the existing analytics keys:

```ts
const analyticsDayMilliseconds = 24 * 60 * 60 * 1000
const analyticsDefaultTo = new Date().toISOString().slice(0, 10)
const analyticsDefaultFrom = new Date(Date.now() - 29 * analyticsDayMilliseconds).toISOString().slice(0, 10)
```

Replace `getAnalyticsStats` with the local equivalent below. Lifetime `pageViews` remain unfiltered while only `viewSeries` follows the selected country/date range.

```ts
function getAnalyticsStats(
  events: AnalyticsEvent[],
  from = analyticsDefaultFrom,
  to = analyticsDefaultTo,
  selectedCountry = 'all',
): AnalyticsStats {
  const countries = new Set<string>()
  const dailyViews = new Map<string, { base: number; freelance: number }>()
  const locationCounts = new Map<string, number>()
  const pageViews: Record<AnalyticsPage, number> = { base: 0, freelance: 0 }
  let clicks = 0
  let views = 0

  for (const event of events) {
    const type = event.type || 'click'
    if (type === 'click') clicks += 1
    if (type === 'view') {
      views += 1
      const country = event.country || 'unknown'
      const page = event.page || (event.path?.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base')
      const date = event.timestamp.slice(0, 10)
      countries.add(country)
      pageViews[page] += 1

      if (date >= from && date <= to && (selectedCountry === 'all' || selectedCountry === country)) {
        const point = dailyViews.get(date) || { base: 0, freelance: 0 }
        point[page] += 1
        dailyViews.set(date, point)
      }
    }

    const label = event.location || `${event.locale || 'locale inconnue'} / ${event.timeZone || 'zone inconnue'}`
    locationCounts.set(label, (locationCounts.get(label) || 0) + 1)
  }

  const viewSeries = []
  for (
    let time = Date.parse(`${from}T00:00:00.000Z`);
    time <= Date.parse(`${to}T00:00:00.000Z`);
    time += analyticsDayMilliseconds
  ) {
    const date = new Date(time).toISOString().slice(0, 10)
    viewSeries.push({ date, ...(dailyViews.get(date) || { base: 0, freelance: 0 }) })
  }

  return {
    clicks,
    countries: [...countries].sort(),
    pageViews,
    total: events.length,
    views,
    viewSeries,
    locations: [...locationCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    recent: [...events].reverse().slice(0, 12),
  }
}
```

- [ ] **Step 3: Make tracking page-aware without trusting the browser country**

At the start of `trackAnalyticsEvent`, derive `path` and `page`, then add `country: 'unknown'` and `page` to the local event. The server will replace the country from Vercel headers.

```ts
const path = window.location.pathname
const page: AnalyticsPage = path.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base'
```

The event fields must include:

```ts
country: 'unknown',
page,
path,
```

Replace `trackLandingView` with a normalized per-page session key:

```ts
function trackLandingView(label: string) {
  const page = window.location.pathname.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base'
  const sessionKey = `${analyticsViewSessionKey}:${page}`
  if (window.sessionStorage.getItem(sessionKey)) return
  window.sessionStorage.setItem(sessionKey, '1')
  trackAnalyticsEvent('view', `${page}-page`, label)
}
```

- [ ] **Step 4: Reuse one portfolio page for both routes**

Change `HomePage` to accept an optional flag while keeping the existing route callable:

```ts
function HomePage({ showServices = false }: { showServices?: boolean } = {}) {
```

Build `heroMetrics` without an offers metric on `/`:

```ts
const heroMetrics = [
  { label: text.home.stats.projects, value: String(projects.length) },
  ...(showServices ? [{ label: text.home.stats.services, value: String(services.length) }] : []),
  { label: text.home.stats.experience, value: String(experiences.length) },
  { label: text.home.stats.skills, value: String(skills.length) },
]
```

Guard the existing geo effect and add `showServices` to its dependency list:

```ts
useEffect(() => {
  if (!showServices) return

  fetch(`${analyticsEndpoint}?geo=1`)
    .then((response) => {
      if (!response.ok) throw new Error('geo unavailable')
      return response.json() as Promise<GeoResponse>
    })
    .then((geo) => {
      if (geo.pricingRegion === 'westAfrica' || geo.pricingRegion === 'world') {
        setVisitorRegion(geo.pricingRegion)
      }
    })
    .catch(() => setVisitorRegion(getVisitorRegion()))
}, [showServices])
```

Wrap the complete existing `<section id="services">…</section>` in `{showServices && (…)}` without moving or duplicating its contents. Change the navigation link to:

```tsx
<a href="/freelance#services" onClick={() => setMenuOpen(false)}>
  {text.nav.services}
</a>
```

Add the route and include it in the tree:

```tsx
const freelanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'freelance',
  component: () => <HomePage showServices />,
})

const routeTree = rootRoute.addChildren([indexRoute, freelanceRoute, cvRoute, countRoute])
```

- [ ] **Step 5: Verify the route increment**

Run:

```bash
node --test api/analytics.test.js
npm run build
git diff --check -- src/main.tsx
```

Expected: 6 tests pass, the production build exits 0, and the diff check is silent.

Start `npm run dev` and verify the GREEN route state:

- `/` has no offers metric and no `#services` section;
- `/freelance` has the offers metric and all five service cards;
- the “Offres” navigation link reaches `/freelance#services`;
- `/cv` and project/contact anchors still work.

- [ ] **Step 6: Commit the route increment**

```bash
git add src/main.tsx
git commit -m "Add freelance portfolio route"
```

Expected: only `src/main.tsx` is committed; package files remain unstaged.

## Task 3: Filtered Count dashboard and native SVG chart

**Files:**

- Modify: `src/main.tsx:128-154`
- Modify: `src/main.tsx:232-258`
- Modify: `src/main.tsx:1008-1108`
- Modify: `src/styles.css:963-1066`
- Modify: `src/styles.css:1572-1579`

- [ ] **Step 1: Record the Count UI RED state**

Open `/count` before editing and confirm it has no base/freelance cards, country/date controls, or chart. This is the expected missing UI behavior.

- [ ] **Step 2: Add exact bilingual Count copy**

Add these fields to the French `count` object:

```ts
baseViews: 'Chemin principal',
baseViewsHelp: 'vues depuis la mise en ligne du suivi séparé',
freelanceViews: 'Chemin freelance',
freelanceViewsHelp: 'vues depuis la mise en ligne du suivi séparé',
splitNotice: 'La séparation principal / freelance commence avec cette version.',
chartTitle: 'Évolution des vues',
chartDescription: 'Vues quotidiennes du chemin principal et du chemin freelance',
countryFilter: 'Pays',
allCountries: 'Tous les pays',
unknownCountry: 'Pays inconnu',
fromDate: 'Du',
toDate: 'Au',
baseLegend: 'Principal',
freelanceLegend: 'Freelance',
basePage: 'Chemin principal',
freelancePage: 'Chemin freelance',
```

Add the matching fields to the English `count` object:

```ts
baseViews: 'Main path',
baseViewsHelp: 'views since split tracking went live',
freelanceViews: 'Freelance path',
freelanceViewsHelp: 'views since split tracking went live',
splitNotice: 'The main / freelance split starts with this version.',
chartTitle: 'View evolution',
chartDescription: 'Daily views for the main and freelance paths',
countryFilter: 'Country',
allCountries: 'All countries',
unknownCountry: 'Unknown country',
fromDate: 'From',
toDate: 'To',
baseLegend: 'Main',
freelanceLegend: 'Freelance',
basePage: 'Main path',
freelancePage: 'Freelance path',
```

Update `statsLabel` to describe analytics statistics rather than clicks only in each language.

- [ ] **Step 3: Add filter state and filtered API requests**

At the start of `CountPage`, add:

```ts
const [country, setCountry] = useState('all')
const [from, setFrom] = useState(analyticsDefaultFrom)
const [to, setTo] = useState(analyticsDefaultTo)
```

Inside `refreshStats`, construct the endpoint without a new helper:

```ts
const params = new URLSearchParams({ from, to })
if (country !== 'all') params.set('country', country)
const response = await fetch(`${analyticsEndpoint}?${params}`)
```

Normalize a response from an older API during rollout:

```ts
const responseStats = (await response.json()) as AnalyticsStats
setRemoteStats({
  countries: [],
  pageViews: { base: 0, freelance: 0 },
  viewSeries: [],
  ...responseStats,
})
```

Replace the existing one-line catch with a real local-fallback switch so a failed filtered request cannot leave stale remote data visible:

```ts
.catch(() => {
  setRemoteStats(null)
  setRemoteError(text.count.apiError)
})
```

Add `country`, `from`, and `to` to the effect dependency list. Compute the local fallback with the same filters:

```ts
const localStats = useMemo(
  () => getAnalyticsStats(localEvents, from, to, country),
  [country, from, localEvents, to],
)
```

- [ ] **Step 4: Calculate SVG coordinates defensively**

After `const stats = remoteStats || localStats`, add:

```ts
const chartWidth = 720
const chartHeight = 280
const chartPadding = 42
const maxViews = Math.max(1, ...stats.viewSeries.flatMap((point) => [point.base, point.freelance]))
const pointSpacing = (chartWidth - chartPadding * 2) / Math.max(stats.viewSeries.length - 1, 1)
const basePoints = stats.viewSeries
  .map(
    (point, index) =>
      `${chartPadding + index * pointSpacing},${chartHeight - chartPadding - (point.base / maxViews) * (chartHeight - chartPadding * 2)}`,
  )
  .join(' ')
const freelancePoints = stats.viewSeries
  .map(
    (point, index) =>
      `${chartPadding + index * pointSpacing},${chartHeight - chartPadding - (point.freelance / maxViews) * (chartHeight - chartPadding * 2)}`,
  )
  .join(' ')
const hasChartViews = stats.viewSeries.some((point) => point.base || point.freelance)
```

The `Math.max(..., 1)` and denominator guard prevent invalid SVG coordinates for empty and one-day ranges.

- [ ] **Step 5: Render five cards, filters, chart, and route-aware recent events**

Keep the existing total views card. Add base and freelance cards using `stats.pageViews.base` and `.freelance`, then keep clicks and locations, producing five cards total. Place the approved split note immediately after the grid. Change the desktop grid declaration to `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));` so five cards fill the available width without a fixed empty column.

Insert this chart section before the location table:

```tsx
<section className="section analyticsChartSection">
  <div className="sectionHead">
    <div>
      <p className="eyebrow">Analytics</p>
      <h2>{text.count.chartTitle}</h2>
    </div>
  </div>

  <div className="analyticsFilters">
    <label>
      <span>{text.count.countryFilter}</span>
      <select value={country} onChange={(event) => setCountry(event.target.value)}>
        <option value="all">{text.count.allCountries}</option>
        {stats.countries.map((countryCode) => (
          <option key={countryCode} value={countryCode}>
            {countryCode === 'unknown' ? text.count.unknownCountry : countryCode}
          </option>
        ))}
      </select>
    </label>
    <label>
      <span>{text.count.fromDate}</span>
      <input type="date" value={from} max={to} onChange={(event) => setFrom(event.target.value)} />
    </label>
    <label>
      <span>{text.count.toDate}</span>
      <input type="date" value={to} min={from} onChange={(event) => setTo(event.target.value)} />
    </label>
  </div>

  <div className="analyticsLegend" aria-hidden="true">
    <span className="base">{text.count.baseLegend}</span>
    <span className="freelance">{text.count.freelanceLegend}</span>
  </div>

  {hasChartViews ? (
    <div className="analyticsChart">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={text.count.chartDescription}>
        <title>{text.count.chartDescription}</title>
        <line className="analyticsAxis" x1={chartPadding} y1={chartPadding} x2={chartPadding} y2={chartHeight - chartPadding} />
        <line className="analyticsAxis" x1={chartPadding} y1={chartHeight - chartPadding} x2={chartWidth - chartPadding} y2={chartHeight - chartPadding} />
        <text x="8" y={chartPadding + 4}>{maxViews}</text>
        <text x="24" y={chartHeight - chartPadding + 4}>0</text>
        <polyline className="analyticsLine base" points={basePoints} />
        <polyline className="analyticsLine freelance" points={freelancePoints} />
        {stats.viewSeries.map((point, index) => (
          <g key={point.date}>
            {point.base > 0 && (
              <circle
                className="analyticsDot base"
                cx={chartPadding + index * pointSpacing}
                cy={chartHeight - chartPadding - (point.base / maxViews) * (chartHeight - chartPadding * 2)}
                r="4"
              />
            )}
            {point.freelance > 0 && (
              <circle
                className="analyticsDot freelance"
                cx={chartPadding + index * pointSpacing}
                cy={chartHeight - chartPadding - (point.freelance / maxViews) * (chartHeight - chartPadding * 2)}
                r="4"
              />
            )}
          </g>
        ))}
      </svg>
      <div className="analyticsChartDates">
        <span>{new Date(`${stats.viewSeries[0].date}T12:00:00Z`).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
        <span>{new Date(`${stats.viewSeries[stats.viewSeries.length - 1].date}T12:00:00Z`).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
      </div>
    </div>
  ) : (
    <p>{text.count.empty}</p>
  )}
</section>
```

In recent events, prepend the normalized route label:

```tsx
{(event.page || (event.path?.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base')) === 'freelance'
  ? text.count.freelancePage
  : text.count.basePage}
```

Retain event type, label, location, referrer, and timestamp after that label.

- [ ] **Step 6: Add the minimal chart styles**

Add these rules beside the existing analytics styles in `src/styles.css`:

```css
.analyticsFilters {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) repeat(2, minmax(150px, 0.7fr));
  gap: 14px;
  margin: 24px 0 16px;
}

.analyticsFilters label {
  display: grid;
  gap: 7px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.analyticsFilters input,
.analyticsFilters select {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--paper);
  color: var(--ink);
  font: inherit;
}

.analyticsLegend {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 800;
}

.analyticsLegend span::before {
  display: inline-block;
  width: 24px;
  height: 3px;
  margin-right: 7px;
  content: '';
  vertical-align: middle;
}

.analyticsLegend .base::before {
  background: var(--ink);
}

.analyticsLegend .freelance::before {
  background: var(--coral-dark);
}

.analyticsChart {
  overflow: hidden;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--paper);
}

.analyticsChart svg {
  display: block;
  width: 100%;
  height: auto;
  min-height: 220px;
}

.analyticsChart text {
  fill: var(--muted);
  font-size: 12px;
}

.analyticsAxis {
  stroke: var(--line);
  stroke-width: 1;
}

.analyticsLine {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.analyticsLine.base {
  stroke: var(--ink);
}

.analyticsLine.freelance {
  stroke: var(--coral-dark);
}

.analyticsDot.base {
  fill: var(--ink);
}

.analyticsDot.freelance {
  fill: var(--coral-dark);
}

.analyticsChartDates {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 12px;
}
```

Inside the existing mobile media query that collapses `.analyticsGrid`, also add:

```css
.analyticsFilters {
  grid-template-columns: 1fr;
}
```

- [ ] **Step 7: Verify Count behavior and commit the UI increment**

Run:

```bash
node --test api/analytics.test.js
npm run build
git diff --check -- src/main.tsx src/styles.css
```

Expected: 6 tests pass, build exits 0, and diff check is silent.

Open `/count` at desktop and mobile widths and verify:

- five summary cards render;
- the split-start note is visible;
- country and inclusive date controls refetch without console errors;
- two lines render when data exists and the empty state renders when it does not;
- recent rows identify base/freelance while preserving location and referrer.

Commit only the owned UI files:

```bash
git add src/main.tsx src/styles.css
git commit -m "Add filtered view analytics chart"
```

## Task 4: Final integration verification

**Files:**

- Verify: `api/analytics.js`
- Verify: `api/analytics.test.js`
- Verify: `src/main.tsx`
- Verify: `src/styles.css`
- Verify untouched: `package.json`, `package-lock.json`

- [ ] **Step 1: Run the full automated verification fresh**

```bash
node --test api/analytics.test.js
npm run build
git diff --check origin/main..HEAD
```

Expected: 6 tests pass, build exits 0, and diff check is silent.

- [ ] **Step 2: Verify API edge cases against a local handler or deployed preview**

Confirm these response contracts:

- valid default GET returns `pageViews`, `countries`, and 30 zero-filled `viewSeries` points;
- `?from=2026-07-24&to=2026-07-24` returns one point;
- invalid date, reversed date, range over 366 days, and unavailable country return HTTP 400;
- `?geo=1` still returns geo/pricing data;
- a view POST stores normalized `page` and server country, while a click does not increment `analytics:view-series`.

- [ ] **Step 3: Run final browser verification**

Verify `/`, `/freelance`, `/count`, and `/cv` at approximately 1440px and 390px. Check console errors, navigation, offers visibility, five service cards, date/country controls, chart/empty state, recent-event route labels, and no horizontal overflow.

- [ ] **Step 4: Audit the exact release diff**

```bash
git status --short --branch
git diff --name-only origin/main..HEAD
git diff -- package.json package-lock.json
git log --oneline origin/main..HEAD
```

Expected release files: the approved design and plan documents, `api/analytics.js`, `api/analytics.test.js`, `src/main.tsx`, and `src/styles.css`. The package diff remains the user's pre-existing Neon addition and must not be staged or committed.

- [ ] **Step 5: Hand back to the primary for review and push**

Report:

- RED and GREEN evidence from `node --test`;
- build output summary;
- commits created;
- exact changed files;
- browser/API verification completed;
- any concern or deviation from this plan.

Do not push. The primary reviews the actual diff, sends required fixes back to Terra, reruns fresh verification, then pushes `main` because the user explicitly requested it.
