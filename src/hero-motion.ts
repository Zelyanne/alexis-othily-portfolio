export function getHeroScrollProgress(sceneTop: number, sceneHeight: number, viewportHeight: number) {
  const travel = Math.max(sceneHeight - viewportHeight, 1)
  return Math.min(Math.max(-sceneTop / travel, 0), 1)
}
