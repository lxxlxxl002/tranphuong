import type { ProgressSortBy } from '../model/types'

export const isSortBy = (v: unknown): v is ProgressSortBy => v === 'status' || v === 'percent' || v === 'name'

export const isValidPercent = (v: unknown): v is number => typeof v === 'number' && v >= 0 && v <= 100