import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { USERS_QUERY_KEYS, userService } from '@/features/users'
import { departmentService } from '../services/departmentService'
import { useDepartmentsStore } from '../state/store'
import { selectEditor } from '../state/selectors'
import { departmentsActions } from '../state/actions'
import { DEPARTMENTS_QUERY_KEYS } from '../model/constants'
import { DEPARTMENTS_CONFIG } from '../config/departments.config'
import type { Department } from '../model/types'

const EMPTY: Department[] = []

export function useDepartments() {
  const query = useQuery({
    queryKey: DEPARTMENTS_QUERY_KEYS.list,
    queryFn: () => departmentService.list(),
    staleTime: DEPARTMENTS_CONFIG.staleTime
  })
  const users = useQuery({ queryKey: USERS_QUERY_KEYS.list, queryFn: () => userService.list(), staleTime: 30_000 })
  const editor = useDepartmentsStore(selectEditor)

  const departments = query.data ?? EMPTY
  const leaderOptions = useMemo(() => departmentService.leaderOptions(users.data ?? []), [users.data])
  const editing = useMemo(
    () => (editor.departmentId ? departments.find((d) => d.id === editor.departmentId) ?? null : null),
    [departments, editor.departmentId]
  )

  return {
    departments,
    totalStaff: departmentService.totalStaff(departments),
    nextCode: departmentService.nextCode(departments),
    leaderOptions,
    editor,
    editing,
    canDelete: departmentService.canDelete,
    ...departmentsActions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}