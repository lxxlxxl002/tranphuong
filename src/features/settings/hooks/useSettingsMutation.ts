import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { ApiError, getErrorMessage } from '@/shared/api/errors'
import { settingsService } from '../services/settingsService'
import { settingsActions } from '../state/actions'
import { SETTINGS_QUERY_KEYS } from '../model/constants'
import type { AppSettings, SettingsErrors } from '../model/types'

export function useSettingsMutation() {
  const qc = useQueryClient()
  const m = useMutation({
    mutationFn: (s: AppSettings) => settingsService.save(s),
    onSuccess: (saved) => {
      qc.setQueryData(SETTINGS_QUERY_KEYS.current, saved)
      settingsActions.discard()
      toast.success('Đã lưu cài đặt — áp dụng ngay cho toàn hệ thống')
    },
    onError: (err) => {
      if (err instanceof ApiError && err.code === 'VALIDATION' && err.details) {
        settingsActions.setErrors(err.details as SettingsErrors)
        toast.error('Vui lòng kiểm tra lại các trường được đánh dấu')
      } else toast.error(getErrorMessage(err))
    }
  })
  return { save: m.mutate, isSaving: m.isPending }
}