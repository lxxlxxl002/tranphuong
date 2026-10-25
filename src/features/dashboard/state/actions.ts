import { useDashboardStore } from './store'
import type { DeptSortKey } from '../model/types'

export const dashboardActions = {
  /** Không sắp xếp → tăng dần → giảm dần → không sắp xếp */
  toggleDeptSort(key: DeptSortKey) {
    const current = useDashboardStore.getState().deptSort
    let next: typeof current
    if (!current || current.key !== key) next = { key, dir: 'asc' }
    else if (current.dir === 'asc') next = { key, dir: 'desc' }
    else next = null
    useDashboardStore.setState({ deptSort: next })
  },

  resetDeptSort() {
    useDashboardStore.setState({ deptSort: null })
  }
}