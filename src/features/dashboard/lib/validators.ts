export const isNonNegativeInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0

export const isPercent = (v: unknown): v is number => typeof v === 'number' && v >= 0 && v <= 100