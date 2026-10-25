import { isRole } from '@/shared/constants/roles'
import { useUsersStore } from './store'
import type { RoleFilter, StatusFilter, UserFilterState } from '../model/types'

const patch = (p: Partial<UserFilterState>) => useUsersStore.setState((s) => ({ filters: { ...s.filters, ...p } }))
const STATUSES: StatusFilter[] = ['ALL', 'ACTIVE', 'PENDING', 'LOCKED']

export const usersActions = {
  setRole(value: string) {
    if (value === 'ALL' || isRole(value)) patch({ role: value as RoleFilter })
  },
  setStatus(value: string) {
    if (STATUSES.includes(value as StatusFilter)) patch({ status: value as StatusFilter })
  },
  setSearch(search: string) {
    patch({ search })
  },
  select(userId: string | null) {
    useUsersStore.setState({ selectedId: userId })
  },
  openImport() {
    useUsersStore.setState({ importOpen: true })
  },
  closeImport() {
    useUsersStore.setState({ importOpen: false })
  }
}