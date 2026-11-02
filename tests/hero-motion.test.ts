import assert from 'node:assert/strict'
import test from 'node:test'
import { getHeroPointerPosition } from '../src/hero-motion.ts'

test('normalizes and clamps pointer positions', () => {
  assert.deepEqual(getHeroPointerPosition(50, 100, 100, 200), { x: 0, y: 0 })
  assert.deepEqual(getHeroPointerPosition(0, 200, 100, 200), { x: -0.5, y: 0.5 })
  assert.deepEqual(getHeroPointerPosition(-20, 400, 100, 200), { x: -0.5, y: 0.5 })
  assert.deepEqual(getHeroPointerPosition(20, 20, 0, 0), { x: 0, y: 0 })
})
