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
      '2026-07-23|BJ|base|': 99,
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
