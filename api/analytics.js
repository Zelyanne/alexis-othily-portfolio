import { Redis } from '@upstash/redis'

const memory = globalThis.__alexisAnalytics || {
  locations: new Map(),
  recent: [],
  total: 0,
}

globalThis.__alexisAnalytics = memory

const hasRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
const redis = hasRedis ? Redis.fromEnv() : null
const keys = {
  locations: 'analytics:locations',
  recent: 'analytics:recent',
  total: 'analytics:total',
}

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

function getLocation(req, fallback) {
  const country = getHeader(req, 'x-vercel-ip-country')
  const region = getHeader(req, 'x-vercel-ip-country-region')
  const city = safeDecode(getHeader(req, 'x-vercel-ip-city') || '')
  const precise = [city, region, country].filter(Boolean).join(', ')
  return precise || fallback || 'Localisation inconnue'
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

async function getStats() {
  if (redis) {
    const [total, locations, recent] = await Promise.all([
      redis.get(keys.total),
      redis.hgetall(keys.locations),
      redis.lrange(keys.recent, 0, 11),
    ])

    return {
      total: Number(total || 0),
      locations: Object.entries(locations || {})
        .map(([label, count]) => ({ label, count: Number(count) }))
        .sort((a, b) => b.count - a.count),
      recent: normalizeRecent(recent),
    }
  }

  return {
    total: memory.total,
    locations: [...memory.locations.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    recent: memory.recent.slice(0, 12),
  }
}

async function saveEvent(event) {
  if (redis) {
    await Promise.all([
      redis.incr(keys.total),
      redis.hincrby(keys.locations, event.location, 1),
      redis.lpush(keys.recent, JSON.stringify(event)),
    ])
    await redis.ltrim(keys.recent, 0, 49)
    return
  }

  memory.total += 1
  memory.locations.set(event.location, (memory.locations.get(event.location) || 0) + 1)
  memory.recent.unshift(event)
  memory.recent = memory.recent.slice(0, 50)
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()

  try {
    if (req.method === 'GET') return json(res, 200, await getStats())

    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

    const body = parseBody(req)
    const location = getLocation(req, `${body.locale || ''} / ${body.timeZone || ''}`.trim())
    const event = {
      href: String(body.href || ''),
      id: String(body.id || 'unknown'),
      label: String(body.label || 'Lien inconnu'),
      locale: String(body.locale || ''),
      location,
      path: String(body.path || '/'),
      timeZone: String(body.timeZone || ''),
      timestamp: String(body.timestamp || new Date().toISOString()),
    }

    await saveEvent(event)
    return json(res, 200, { ok: true })
  } catch {
    return json(res, 500, { error: 'Analytics unavailable' })
  }
}
