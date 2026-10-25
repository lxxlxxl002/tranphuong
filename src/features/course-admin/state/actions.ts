import { useCourseAdminStore } from './store'
import type { StatusFilter } from '../model/types'

const STATUSES: StatusFilter[] = ['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED']

export const courseAdminActions = {
  setStatus(value: string) {
    if (STATUSES.includes(value as StatusFilter)) useCourseAdminStore.setState({ status: value as StatusFilter })
  },
  setSearch(search: string) {
    useCourseAdminStore.setState({ search })
  },
  openCreate() {
    useCourseAdminStore.setState({ drawer: { open: true, courseId: null } })
  },
  openEdit(courseId: string) {
    useCourseAdminStore.setState({ drawer: { open: true, courseId } })
  },
  closeDrawer() {
    useCourseAdminStore.setState({ drawer: { open: false, courseId: null } })
  }
}