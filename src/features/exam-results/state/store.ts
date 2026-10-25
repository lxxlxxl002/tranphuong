import { create } from 'zustand'
import type { ResultFilter, ReviewFilter } from '../model/types'

export interface ExamResultsState {
  listFilter: ResultFilter
  reviewFilter: ReviewFilter
}

export const useExamResultsStore = create<ExamResultsState>(() => ({
  listFilter: 'ALL',
  reviewFilter: 'ALL'
}))