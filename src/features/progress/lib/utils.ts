/** Nhận 0–1 hoặc 0–100 → 0–100 */
export const normalizePercent = (v: number): number => {
  const n = v > 0 && v <= 1 ? v * 100 : v
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(n) ? n : 0)))
}

/** Trung bình làm tròn 1 chữ số thập phân */
export const average = (values: number[]): number | null =>
  values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10 : null

export const formatAverage = (v: number | null): string => (v == null ? '—' : `${v.toFixed(1)}/100`)