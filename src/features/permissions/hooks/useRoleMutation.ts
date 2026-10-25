import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { authActions, useAuthStore } from '@/features/auth'
import { getErrorMessage } from '@/shared/api/errors'
import type { PermissionKey } from '@/shared/constants/permissions'
import { permissionService } from '../services/permissionService'
import { permissionsActions } from '../state/actions'
import { PERMISSIONS_QUERY_KEYS } from '../model/constants'
import type { RoleDef, RoleInput } from '../model/types'

export function useRoleMutation() {
  const qc = useQueryClient()
  const refresh = useCallback(() => void qc.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEYS.all }), [qc])
  const onError = (err: unknown) => toast.error(getErrorMessage(err))

  const save = useMutation({
    mutationFn: (v: { roleKey: string; permissions: PermissionKey[] }) => permissionService.savePermissions(v.roleKey, v.permissions),
    onSuccess: (perms, v) => {
      permissionsActions.clearDraft(v.roleKey)
      // Áp dụng ngay nếu đang sửa đúng vai trò của người đang đăng nhập
      if (useAuthStore.getState().user?.role === v.roleKey) authActions.setPermissions(perms)
      toast.success('Đã lưu phân quyền')
      refresh()
    },
    onError
  })

  const create = useMutation({
    mutationFn: (v: { input: RoleInput; roles: RoleDef[] }) => permissionService.createRole(v.input, v.roles),
    onSuccess: (role) => {
      permissionsActions.select(role.key)
      toast.success(`Đã tạo vai trò ${role.name}`)
      refresh()
    },
    onError
  })

  const update = useMutation({
    mutationFn: (v: { roleKey: string; input: RoleInput }) => permissionService.updateRole(v.roleKey, v.input),
    onSuccess: () => {
      toast.success('Đã lưu vai trò')
      refresh()
    },
    onError
  })

  const remove = useMutation({
    mutationFn: (role: RoleDef) => permissionService.deleteRole(role),
    onSuccess: (_d, role) => {
      permissionsActions.clearDraft(role.key)
      toast.success(`Đã xóa vai trò ${role.name}`)
      refresh()
    },
    onError
  })

  return {
    savePermissions: save.mutateAsync,
    createRole: create.mutateAsync,
    updateRole: update.mutateAsync,
    deleteRole: remove.mutateAsync,
    isSavingPermissions: save.isPending,
    isSavingRole: create.isPending || update.isPending,
    isDeleting: remove.isPending
  }
}