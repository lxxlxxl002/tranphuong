import { isRateFilter, isRoleFilter } from '../lib/validators'
import { initialFilters, useReportsStore } from './store'

const patch = (p: Partial<typeof initialFilters>) => useReportsStore.setState((s) => ({ filters: { ...s.filters, ...p } }))

export const reportsActions = {
  setDepartment(departmentId: string) {
    patch({ departmentId: departmentId || 'ALL' })
  },
  setRole(value: string) {
    if (isRoleFilter(value)) patch({ role: value })
  },
  setRate(value: string) {
    if (isRateFilter(value)) patch({ rate: value })
  },
  resetFilters() {
    useReportsStore.setState({ filters: initialFilters })
  }
}