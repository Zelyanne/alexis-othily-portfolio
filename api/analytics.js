import { Redis } from '@upstash/redis'

const memory = globalThis.__alexisAnalytics || {
  clicks: 0,
  locations: new Map(),
  recent: [],
  total: 0,
  viewSeries: new Map(),
  views: 0,
}

memory.viewSeries ||= new Map()
globalThis.__alexisAnalytics = memory

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
const hasRedis = Boolean(redisUrl && redisToken)
const redis = hasRedis ? Redis.fromEnv() : null
const storage = hasRedis ? 'upstash-redis' : 'memory'
const keys = {
  clicks: 'analytics:clicks',
  locations: 'analytics:locations',
  recent: 'analytics:recent',
  total: 'analytics:total',
  // ponytail: one aggregate hash suits portfolio traffic; partition by month if HGETALL becomes expensive.
  viewSeries: 'analytics:view-series',
  views: 'analytics:views',
}
const dayMilliseconds = 24 * 60 * 60 * 1000
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const westAfricaCountries = new Set([
  'BJ',
  'BF',
  'CV',
  'CI',
  'GM',
  'GH',
  'GN',
  'GW',
  'LR',
  'ML',
  'MR',
  'NE',
  'NG',
  'SN',
  'SL',
  'TG',
])

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json')
  res.status(status).json(body)
}

function getHeader(req, name) {
  const value = req.headers[name]
  return Array.isArray(value) ? value[0] : value || ''
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function getGeo(req, fallback) {
  const country = getHeader(req, 'x-vercel-ip-country')
  const region = getHeader(req, 'x-vercel-ip-country-region')
  const city = safeDecode(getHeader(req, 'x-vercel-ip-city') || '')
  const precise = [city, region, country].filter(Boolean).join(', ')
  const pricingRegion = country ? (westAfricaCountries.has(country) ? 'westAfrica' : 'world') : undefined
  return {
    city,
    country,
    label: precise || fallback || 'Localisation inconnue',
    pricingRegion,
    region,
  }
}

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
    const parts = field.split('|')
    if (parts.length !== 3) continue
    const [date, country, page] = parts
    const count = Number(rawCount)
    if (!isValidDate(date) || !country || !['base', 'freelance'].includes(page)) continue
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

function parseBody(req) {
  if (!req.body) return {}
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
}

function normalizeRecent(items) {
  return items
    .map((item) => {
      if (!item) return null
      if (typeof item === 'string') {
        try {
          return JSON.parse(item)
        } catch {
          return null
        }
      }
      return item
    })
    .filter(Boolean)
}

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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()

  try {
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

    await saveEvent(event)
    return json(res, 200, { ok: true })
  } catch (error) {
    if (error instanceof RangeError) return json(res, 400, { error: 'Invalid analytics filters' })
    return json(res, 500, { error: 'Analytics unavailable' })
  }
}
