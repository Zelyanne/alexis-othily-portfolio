import { useEffect, useMemo, useState } from 'react'
import { useCopy } from './copy'
import { analyticsEndpoint, analyticsDefaultFrom, analyticsDefaultTo, readLocalAnalyticsEvents, getAnalyticsStats, getReferrerLabel } from './analytics'
import type { AnalyticsEvent, AnalyticsStats } from './analytics'
import { email } from './portfolio-data'

const cvUrl = '/Alexis-OTHILY-CV.pdf'

export function CountPage() {
  const { language, text } = useCopy()
  const [country, setCountry] = useState('all')
  const [from, setFrom] = useState(analyticsDefaultFrom)
  const [to, setTo] = useState(analyticsDefaultTo)
  const [remoteStats, setRemoteStats] = useState<AnalyticsStats | null>(null)
  const [remoteError, setRemoteError] = useState('')
  const [localEvents, setLocalEvents] = useState<AnalyticsEvent[]>([])

  useEffect(() => {
    setLocalEvents(readLocalAnalyticsEvents())

    const refreshStats = () => {
      const params = new URLSearchParams({ from, to })
      if (country !== 'all') params.set('country', country)
      fetch(`${analyticsEndpoint}?${params}`)
        .then((response) => {
          if (!response.ok) throw new Error('analytics unavailable')
          return response.json() as Promise<AnalyticsStats>
        })
        .then((responseStats) => {
          setRemoteStats({
            ...responseStats,
            countries: responseStats.countries || [],
            pageViews: responseStats.pageViews || { base: 0, freelance: 0 },
            viewSeries: responseStats.viewSeries || [],
          })
          setRemoteError('')
        })
        .catch(() => {
          setRemoteStats(null)
          setRemoteError(text.count.apiError)
        })
    }

    refreshStats()
    const timer = window.setInterval(refreshStats, 5000)
    return () => window.clearInterval(timer)
  }, [country, from, text.count.apiError, to])

  const localStats = useMemo(
    () => getAnalyticsStats(localEvents, from, to, country),
    [country, from, localEvents, to],
  )
  const stats = remoteStats || localStats
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

  return (
    <main id="main-content" className="page countPage">
      <section className="section">
        <p className="eyebrow">{text.count.eyebrow}</p>
        <h1>{text.count.h1}</h1>
        <p className="lead">{text.count.lead}</p>
        <p className="analyticsNotice">
          {text.count.noticePrefix}: {analyticsEndpoint}. {text.count.noticeSuffix}
        </p>
        <p className="analyticsNotice">
          {text.count.storage}: {stats.persistent ? text.count.persistentStorage : text.count.temporaryStorage}
        </p>
        {remoteError && <p className="analyticsNotice">{remoteError}</p>}
      </section>

      <section className="analyticsGrid" aria-label={text.count.statsLabel}>
        <article>
          <span>{text.count.views}</span>
          <strong>{stats.views}</strong>
          <p>{text.count.viewsHelp}</p>
        </article>
        <article>
          <span>{text.count.baseViews}</span>
          <strong>{stats.pageViews.base}</strong>
          <p>{text.count.baseViewsHelp}</p>
        </article>
        <article>
          <span>{text.count.freelanceViews}</span>
          <strong>{stats.pageViews.freelance}</strong>
          <p>{text.count.freelanceViewsHelp}</p>
        </article>
        <article>
          <span>{text.count.clicks}</span>
          <strong>{stats.clicks}</strong>
          <p>{text.count.clicksHelp}</p>
        </article>
        <article>
          <span>{text.count.locations}</span>
          <strong>{stats.locations.length}</strong>
          <p>{text.count.locationsHelp}</p>
        </article>
      </section>
      <p className="analyticsNotice">{text.count.splitNotice}</p>

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

      <section className="section analyticsTable">
        <h2>{text.count.locationTitle}</h2>
        {stats.locations.length ? (
          <ul>
            {stats.locations.map((location) => (
              <li key={location.label}>
                <span>{location.label}</span>
                <strong>{location.count}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>{text.count.empty}</p>
        )}
      </section>

      <section className="section analyticsTable">
        <h2>{text.count.recentTitle}</h2>
        {stats.recent.length ? (
          <ul>
            {stats.recent.map((event) => (
              <li key={`${event.timestamp}-${event.id}`}>
                <span>
                  {(event.page || (event.path?.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base')) === 'freelance'
                    ? text.count.freelancePage
                    : text.count.basePage}{' '}
                  - {event.type === 'view' ? text.count.viewEvent : text.count.clickEvent} - {event.label} -{' '}
                  {event.location || `${event.locale || 'locale inconnue'} / ${event.timeZone || 'zone inconnue'}`} -{' '}
                  {getReferrerLabel(event.referrer, text.count.directReferrer)}
                </span>
                <strong>{new Date(event.timestamp).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>{text.count.empty}</p>
        )}
      </section>
    </main>
  )
}

export function CvPage() {
  const { text } = useCopy()

  return (
    <main id="main-content" className="page cvPage">
      <section className="section">
        <p className="eyebrow">{text.cvPage.eyebrow}</p>
        <h1>{text.cvPage.h1}</h1>
        <p className="lead">{text.cvPage.lead}</p>
        <div className="actions">
          <a className="button primary" href={cvUrl} target="_blank" rel="noreferrer">
            {text.cvPage.open}
          </a>
          <a className="button" href={`mailto:${email}`}>
            {text.cvPage.contact}
          </a>
        </div>
      </section>
      <object className="pdfFrame" data={cvUrl} title={text.cvPage.h1} type="application/pdf">
        <a href={cvUrl}>{text.cvPage.fallback}</a>
      </object>
    </main>
  )
}
