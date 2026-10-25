import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../services/settingsService'
import { useSettingsStore } from '../state/store'
import { selectApplied, selectDraft, selectErrors, selectTab } from '../state/selectors'
import { settingsActions } from '../state/actions'
import { sameSettings } from '../lib/utils'
import { sectionsWithErrors } from '../lib/validators'
import { SETTINGS_QUERY_KEYS } from '../model/constants'
import { SETTINGS_CONFIG } from '../config/settings.config'

/** Dùng trên trang Cài đặt: dữ liệu + bản nháp + lỗi */
export function useSettings() {
  const query = useQuery({ queryKey: SETTINGS_QUERY_KEYS.current, queryFn: () => settingsService.get(), staleTime: SETTINGS_CONFIG.staleTime })
  const applied = useSettingsStore(selectApplied)
  const draft = useSettingsStore(selectDraft)
  const errors = useSettingsStore(selectErrors)
  const tab = useSettingsStore(selectTab)

  const values = draft ?? applied
  const isDirty = useMemo(() => !!draft && !sameSettings(draft, applied), [draft, applied])
  const errorSections = useMemo(() => sectionsWithErrors(errors), [errors])

  return {
    values,
    applied,
    isDirty,
    errors,
    errorSections,
    tab,
    ...settingsActions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}

/** Dùng ở nơi khác (sidebar…): chỉ cần cài đặt đang áp dụng */
export function useAppSettings() {
  useQuery({ queryKey: SETTINGS_QUERY_KEYS.current, queryFn: () => settingsService.get(), staleTime: SETTINGS_CONFIG.staleTime })
  return useSettingsStore(selectApplied)
}