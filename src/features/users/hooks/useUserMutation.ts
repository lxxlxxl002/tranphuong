import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { userService } from '../services/userService'
import { userImportService, type ImportContext } from '../services/userImportService'
import { RELATED_QUERY_ROOTS, USERS_QUERY_KEYS } from '../model/constants'
import type { DepartmentOption, UserInput, UserStatus } from '../model/types'

export function useUserMutation() {
  const qc = useQueryClient()

  const refresh = useCallback(() => {
    void qc.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all })
    RELATED_QUERY_ROOTS.forEach((root) => void qc.invalidateQueries({ queryKey: [root] }))
  }, [qc])

  const onError = (err: unknown) => toast.error(getErrorMessage(err))

  const create = useMutation({
    mutationFn: (input: UserInput) => userService.create(input),
    onSuccess: (r) => {
      toast.success(`Đã thêm ${r.user.fullName}`)
      refresh()
    },
    onError
  })

  const update = useMutation({
    mutationFn: (v: { userId: string; input: UserInput }) => userService.update(v.userId, v.input),
    onSuccess: () => {
      toast.success('Đã lưu thông tin người dùng')
      refresh()
    },
    onError
  })

  const setStatus = useMutation({
    mutationFn: (v: { userId: string; status: UserStatus }) => userService.setStatus(v.userId, v.status),
    onSuccess: (_d, v) => {
      toast.success(v.status === 'LOCKED' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản')
      refresh()
    },
    onError
  })

  const remove = useMutation({
    mutationFn: (userId: string) => userService.remove(userId),
    onSuccess: () => {
      toast.success('Đã xóa người dùng')
      refresh()
    },
    onError
  })

  const reset = useMutation({ mutationFn: (userId: string) => userService.resetPassword(userId), onError })

  const bulk = useMutation({
    mutationFn: (inputs: UserInput[]) => userService.bulkCreate(inputs),
    onSuccess: (n) => {
      toast.success(`Đã nhập ${n} người dùng`)
      refresh()
    },
    onError
  })

  const downloadTemplate = useCallback(async (departments: DepartmentOption[]) => {
    try {
      await userImportService.downloadTemplate(departments)
    } catch (err) {
      onError(err)
    }
  }, [])

  const parseFile = useCallback((file: File, ctx: ImportContext) => userImportService.parseFile(file, ctx), [])

  return {
    createUser: create.mutateAsync,
    updateUser: update.mutateAsync,
    setStatus: setStatus.mutateAsync,
    deleteUser: remove.mutateAsync,
    resetPassword: reset.mutateAsync,
    importUsers: bulk.mutateAsync,
    downloadTemplate,
    parseFile,
    summarize: userImportService.summarize,
    isSaving: create.isPending || update.isPending,
    isSettingStatus: setStatus.isPending,
    isDeleting: remove.isPending,
    isResetting: reset.isPending,
    isImporting: bulk.isPending
  }
}