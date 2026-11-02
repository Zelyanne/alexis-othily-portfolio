export function getHeroPointerPosition(x: number, y: number, width: number, height: number) {
  const position = (value: number, size: number) =>
    size > 0 ? Math.max(-0.5, Math.min(0.5, value / size - 0.5)) : 0
  return { x: position(x, width), y: position(y, height) }
}
