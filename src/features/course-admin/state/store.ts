import { create } from 'zustand'
import type { StatusFilter } from '../model/types'

export interface CourseAdminState {
  status: StatusFilter
  search: string
  drawer: { open: boolean; courseId: string | null }
}

export const useCourseAdminStore = create<CourseAdminState>(() => ({
  status: 'ALL',
  search: '',
  drawer: { open: false, courseId: null }
}))