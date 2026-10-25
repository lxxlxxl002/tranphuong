import { create } from 'zustand'
import { PROGRESS_CONFIG } from '../config/progress.config'
import type { ProgressSortBy } from '../model/types'

export interface ProgressState {
  sortBy: ProgressSortBy
}

export const useProgressStore = create<ProgressState>(() => ({
  sortBy: PROGRESS_CONFIG.defaultSort
}))