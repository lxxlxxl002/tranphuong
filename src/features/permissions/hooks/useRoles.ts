import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { permissionService } from '../services/permissionService'
import { usePermissionsStore } from '../state/store'
import { selectDrafts, selectEditor, selectSelectedKey } from '../state/selectors'
import { permissionsActions } from '../state/actions'
import { PERMISSIONS_QUERY_KEYS } from '../model/constants'
import { PERMISSIONS_CONFIG } from '../config/permissions.config'
import type { RoleDef } from '../model/types'

const EMPTY: RoleDef[] = []

export function useRoles() {
  const query = useQuery({
    queryKey: PERMISSIONS_QUERY_KEYS.roles,
    queryFn: () => permissionService.listRoles(),
    staleTime: PERMISSIONS_CONFIG.staleTime
  })
  const selectedKey = usePermissionsStore(selectSelectedKey)
  const drafts = usePermissionsStore(selectDrafts)
  const editor = usePermissionsStore(selectEditor)
  const roles = query.data ?? EMPTY

  useEffect(() => {
    if (roles.length && (!selectedKey || !roles.some((r) => r.key === selectedKey))) permissionsActions.select(roles[0].key)
  }, [roles, selectedKey])

  const selected = useMemo(() => roles.find((r) => r.key === selectedKey) ?? null, [roles, selectedKey])
  const editing = useMemo(() => (editor.roleKey ? roles.find((r) => r.key === editor.roleKey) ?? null : null), [roles, editor.roleKey])
  const dirtyKeys = useMemo(
    () => new Set(roles.filter((r) => permissionService.isDirty(r.permissions, drafts[r.key])).map((r) => r.key)),
    [roles, drafts]
  )

  return {
    roles,
    selected,
    editor,
    editing,
    dirtyKeys,
    summary: permissionService.summary,
    ...permissionsActions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}