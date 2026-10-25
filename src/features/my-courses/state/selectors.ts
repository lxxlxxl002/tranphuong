import type { MyCoursesState } from './store'

export const selectStatusFilter = (s: MyCoursesState) => s.status
export const selectSearch = (s: MyCoursesState) => s.search