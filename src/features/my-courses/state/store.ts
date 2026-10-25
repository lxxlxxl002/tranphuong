import { create } from 'zustand'
import type { StatusFilter } from '../model/types'

export interface MyCoursesState {
  status: StatusFilter
  search: string
}

export const useMyCoursesStore = create<MyCoursesState>(() => ({
  status: 'ALL',
  search: ''
}))