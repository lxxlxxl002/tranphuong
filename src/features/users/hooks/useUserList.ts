import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePagination } from '@/shared/hooks/usePagination'
import { userService } from '../services/userService'
import { useUsersStore } from '../state/store'
import { selectFilters, selectImportOpen, selectSelectedId } from '../state/selectors'
import { usersActions } from '../state/actions'
import { PAGE_SIZE, USERS_QUERY_KEYS } from '../model/constants'
import { USERS_CONFIG } from '../config/users.config'
import type { AdminUser, DepartmentOption } from '../model/types'

const NO_USERS: AdminUser[] = []
const NO_DEPTS: DepartmentOption[] = []

export function useUserList() {
  const query = useQuery({ queryKey: USERS_QUERY_KEYS.list, queryFn: () => userService.list(), staleTime: USERS_CONFIG.staleTime })
  const depts = useQuery({ queryKey: USERS_QUERY_KEYS.departments, queryFn: () => userService.departments(), staleTime: 5 * 60_000 })
  const filters = useUsersStore(selectFilters)
  const selectedId = useUsersStore(selectSelectedId)
  const importOpen = useUsersStore(selectImportOpen)

  const all = query.data ?? NO_USERS
  const users = useMemo(() => userService.filter(all, filters), [all, filters])
  const stats = useMemo(() => userService.stats(all), [all])
  const pagination = usePagination({ total: users.length, pageSize: PAGE_SIZE })
  const { setPage } = pagination
  useEffect(() => setPage(1), [filters, setPage])

  const selected = useMemo(() => (selectedId ? all.find((u) => u.id === selectedId) ?? null : null), [all, selectedId])

  return {
    all,
    users,
    pageUsers: pagination.slice(users),
    pagination,
    stats,
    filters,
    selected,
    importOpen,
    departments: depts.data ?? NO_DEPTS,
    ...usersActions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}