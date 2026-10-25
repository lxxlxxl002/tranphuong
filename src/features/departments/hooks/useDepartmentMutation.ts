import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { departmentService } from '../services/departmentService'
import { DEPARTMENTS_QUERY_KEYS, RELATED_QUERY_ROOTS } from '../model/constants'
import type { Department, DepartmentInput } from '../model/types'

export function useDepartmentMutation() {
  const qc = useQueryClient()

  const refresh = useCallback(() => {
    void qc.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.all })
    RELATED_QUERY_ROOTS.forEach((root) => void qc.invalidateQueries({ queryKey: [root] }))
  }, [qc])

  const onError = (err: unknown) => toast.error(getErrorMessage(err))

  const create = useMutation({
    mutationFn: (input: DepartmentInput) => departmentService.create(input),
    onSuccess: (d) => {
      toast.success(`Đã thêm ${d.name}`)
      refresh()
    },
    onError
  })

  const update = useMutation({
    mutationFn: (v: { departmentId: string; input: DepartmentInput }) => departmentService.update(v.departmentId, v.input),
    onSuccess: () => {
      toast.success('Đã lưu phòng/ban')
      refresh()
    },
    onError
  })

  const remove = useMutation({
    mutationFn: (dept: Department) => departmentService.remove(dept),
    onSuccess: () => {
      toast.success('Đã xóa phòng/ban')
      refresh()
    },
    onError
  })

  return {
    createDepartment: create.mutateAsync,
    updateDepartment: update.mutateAsync,
    deleteDepartment: remove.mutateAsync,
    isSaving: create.isPending || update.isPending,
    isDeleting: remove.isPending
  }
}