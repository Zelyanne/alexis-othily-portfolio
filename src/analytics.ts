export const analyticsEndpoint = '/api/analytics'
const analyticsStorageKey = 'alexis-portfolio-clicks'
const analyticsViewSessionKey = 'alexis-portfolio-viewed'
const analyticsDayMilliseconds = 24 * 60 * 60 * 1000
export const analyticsDefaultTo = new Date().toISOString().slice(0, 10)
export const analyticsDefaultFrom = new Date(Date.now() - 29 * analyticsDayMilliseconds).toISOString().slice(0, 10)

type AnalyticsPage = 'base' | 'freelance'

export type AnalyticsEvent = {
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

export type AnalyticsStats = {
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

export function readLocalAnalyticsEvents() {
  try {
    const raw = window.localStorage.getItem(analyticsStorageKey)
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : []
  } catch {
    return []
  }
}

export function getAnalyticsStats(
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

export function getReferrerLabel(referrer: string | undefined, fallback: string) {
  if (!referrer) return fallback
  try {
    return new URL(referrer).hostname
  } catch {
    return referrer
  }
}

function trackAnalyticsEvent(type: 'click' | 'view', id: string, label: string, href?: string) {
  const path = window.location.pathname
  const page: AnalyticsPage = path.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base'
  const event: AnalyticsEvent = {
    country: 'unknown',
    href,
    id,
    label,
    locale: navigator.language,
    location: `${navigator.language} / ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    page,
    path,
    referrer: document.referrer,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    type,
  }

  const events = readLocalAnalyticsEvents()
  window.localStorage.setItem(analyticsStorageKey, JSON.stringify([...events, event]))

  const body = JSON.stringify(event)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(analyticsEndpoint, new Blob([body], { type: 'application/json' }))
    return
  }

  void fetch(analyticsEndpoint, {
    body,
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    method: 'POST',
  })
}

export function trackLandingClick(id: string, label: string, href: string) {
  trackAnalyticsEvent('click', id, label, href)
}

export function trackLandingView(label: string) {
  const page = window.location.pathname.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base'
  const sessionKey = `${analyticsViewSessionKey}:${page}`
  if (window.sessionStorage.getItem(sessionKey)) return
  window.sessionStorage.setItem(sessionKey, '1')
  trackAnalyticsEvent('view', `${page}-page`, label)
}
