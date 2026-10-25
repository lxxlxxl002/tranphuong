import { create } from 'zustand'
import { DEFAULT_SETTINGS } from '../config/settings.config'
import type { AppSettings, SettingsErrors, SettingsTab } from '../model/types'

export interface SettingsState {
  /** Cài đặt đang áp dụng cho toàn app (sidebar, chứng chỉ, mặc định khóa học) */
  applied: AppSettings
  /** Bản nháp trên trang Cài đặt */
  draft: AppSettings | null
  errors: SettingsErrors
  tab: SettingsTab
}

export const useSettingsStore = create<SettingsState>(() => ({
  applied: DEFAULT_SETTINGS,
  draft: null,
  errors: {},
  tab: 'general'
}))