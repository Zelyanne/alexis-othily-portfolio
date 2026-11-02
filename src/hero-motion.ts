function clamp(value: number) {
  if (value >= 1 - Number.EPSILON) return 1
  return Math.min(Math.max(value, 0), 1)
}

export function getHeroScrollProgress(sceneTop: number, sceneHeight: number, viewportHeight: number, holdViewports = 0) {
  const travel = Math.max(sceneHeight - viewportHeight * (1 + Math.max(holdViewports, 0)), 1)
  return clamp(-sceneTop / travel)
}

export function getHeroRevealProgress(progress: number) {
  return clamp((progress - 0.2) / 0.4)
}
