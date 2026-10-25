import type { CourseAdminState } from './store'

export const selectStatus = (s: CourseAdminState) => s.status
export const selectSearch = (s: CourseAdminState) => s.search
export const selectDrawer = (s: CourseAdminState) => s.drawer