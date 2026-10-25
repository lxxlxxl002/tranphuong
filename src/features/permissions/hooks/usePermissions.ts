import { useCallback, useMemo } from 'react'
import type { PermissionKey, PermissionModule } from '@/shared/constants/permissions'
import { permissionService } from '../services/permissionService'
import { usePermissionsStore } from '../state/store'
import { selectDrafts } from '../state/selectors'
import { permissionsActions } from '../state/actions'
import type { RoleDef } from '../model/types'

const NONE: PermissionKey[] = []

/** Bản nháp quyền của 1 vai trò + thao tác bật/tắt */
export function usePermissions(role: RoleDef | null) {
  const drafts = usePermissionsStore(selectDrafts)
  const saved = role?.permissions ?? NONE
  const current = (role && drafts[role.key]) || saved
  const locked = !!role?.locked

  const groups = useMemo(() => permissionService.buildGroups(current), [current])
  const changes = role ? permissionService.diffCount(saved, current) : 0

  const toggle = useCallback(
    (key: PermissionKey) => {
      if (!role || locked) return
      permissionsActions.setDraft(role.key, permissionService.toggle(current, key))
    },
    [role, locked, current]
  )

  const setModule = useCallback(
    (module: PermissionModule, on: boolean) => {
      if (!role || locked) return
      permissionsActions.setDraft(role.key, permissionService.setModule(current, module, on))
    },
    [role, locked, current]
  )

  const reset = useCallback(() => {
    if (role) permissionsActions.clearDraft(role.key)
  }, [role])

  return { current, groups, changes, isDirty: changes > 0, locked, toggle, setModule, reset }
}