export const clampPercent = (v: number): number => Math.max(0, Math.min(100, Math.round(Number.isFinite(v) ? v : 0)))

/** Backend có thể trả 0–1 hoặc 0–100 → luôn về 0–100 */
export const normalizeRate = (v: number): number => clampPercent(v > 0 && v <= 1 ? v * 100 : v)