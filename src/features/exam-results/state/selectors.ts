import type { ExamResultsState } from './store'

export const selectListFilter = (s: ExamResultsState) => s.listFilter
export const selectReviewFilter = (s: ExamResultsState) => s.reviewFilter