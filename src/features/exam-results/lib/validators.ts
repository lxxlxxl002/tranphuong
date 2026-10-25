import type { ResultFilter, ReviewFilter } from '../model/types'

export const isResultFilter = (v: unknown): v is ResultFilter => v === 'ALL' || v === 'PASSED' || v === 'FAILED'

export const isReviewFilter = (v: unknown): v is ReviewFilter =>
  v === 'ALL' || v === 'CORRECT' || v === 'WRONG' || v === 'SKIPPED'