import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { storage } from '@/shared/lib/storage'
import { fetchSettings } from '../api/queries'
import { updateSettingsRequest } from '../api/mutations'
import { toAppSettings, toSettingsPayload } from '../adapters/settingsAdapter'
import { SETTINGS_CONFIG } from '../config/settings.config'
import { hasErrors, validateSettings } from '../lib/validators'
import { DEMO_STORAGE_KEY } from '../model/constants'
import { settingsActions } from '../state/actions'
import type { AppSettings } from '../model/types'

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), SETTINGS_CONFIG.demoDelayMs))

export const settingsService = {
  async get(): Promise<AppSettings> {
    let result: AppSettings
    if (isDemoMode()) {
      const saved = storage.get<unknown>(DEMO_STORAGE_KEY)
      result = saved ? toAppSettings(saved, SETTINGS_CONFIG.defaults) : structuredClone(SETTINGS_CONFIG.defaults)
      result = await delay(result)
    } else {
      const raw = await fetchSettings()
      try {
        result = toAppSettings(raw, SETTINGS_CONFIG.defaults)
      } catch {
        throw new ApiError('SERVER', 'Dữ liệu cài đặt không hợp lệ')
      }
    }
    settingsActions.setApplied(result)
    return result
  },

  async save(settings: AppSettings): Promise<AppSettings> {
    const errors = validateSettings(settings)
    if (hasErrors(errors)) throw new ApiError('VALIDATION', 'Cài đặt chưa hợp lệ', errors)
    const payload = toSettingsPayload(settings)
    const saved: AppSettings = { ...toAppSettings(payload, SETTINGS_CONFIG.defaults), updatedAt: new Date().toISOString() }
    if (isDemoMode()) {
      storage.set(DEMO_STORAGE_KEY, { ...payload, updatedAt: saved.updatedAt })
      await delay(undefined)
    } else {
      await updateSettingsRequest(payload)
    }
    settingsActions.setApplied(saved)
    return saved
  },

  defaults(): AppSettings {
    return structuredClone(SETTINGS_CONFIG.defaults)
  }
}