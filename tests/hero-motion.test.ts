import assert from 'node:assert/strict'
import test from 'node:test'
import { getHeroRevealProgress, getHeroScrollProgress } from '../src/hero-motion.ts'

test('normalizes and clamps hero sticky travel', () => {
  assert.equal(getHeroScrollProgress(120, 1400, 800), 0)
  assert.equal(getHeroScrollProgress(-300, 1400, 800), 0.5)
  assert.equal(getHeroScrollProgress(-900, 1400, 800), 1)
  assert.equal(getHeroScrollProgress(-20, 800, 800), 1)
  assert.equal(getHeroScrollProgress(-400, 3800, 1000, 2), 0.5)
  assert.equal(getHeroScrollProgress(-800, 3800, 1000, 2), 1)
})

test('delays hero content until motion has started', () => {
  assert.equal(getHeroRevealProgress(0), 0)
  assert.equal(getHeroRevealProgress(0.2), 0)
  assert.ok(Math.abs(getHeroRevealProgress(0.4) - 0.5) < Number.EPSILON)
  assert.equal(getHeroRevealProgress(0.6), 1)
})
