import assert from 'node:assert/strict'
import test from 'node:test'
import { getHeroScrollProgress } from '../src/hero-motion.ts'

test('normalizes and clamps hero sticky travel', () => {
  assert.equal(getHeroScrollProgress(120, 1400, 800), 0)
  assert.equal(getHeroScrollProgress(-300, 1400, 800), 0.5)
  assert.equal(getHeroScrollProgress(-900, 1400, 800), 1)
  assert.equal(getHeroScrollProgress(-20, 800, 800), 1)
})
