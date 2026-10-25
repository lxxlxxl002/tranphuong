import { useMyCoursesStore } from './store'
import type { StatusFilter } from '../model/types'

export const myCoursesActions = {
  setStatus(status: StatusFilter) {
    useMyCoursesStore.setState({ status })
  },
  setSearch(search: string) {
    useMyCoursesStore.setState({ search })
  },
  reset() {
    useMyCoursesStore.setState({ status: 'ALL', search: '' })
  }
}