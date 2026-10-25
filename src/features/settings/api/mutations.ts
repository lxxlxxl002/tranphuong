import type { FlatSettings } from '../model/types'
import { settingsClient } from './client'
import { SETTINGS_ENDPOINTS } from './endpoints'

/** Gửi dạng phẳng { "support.phone": "..." } — mỗi khóa = 1 dòng sheet Settings */
export const updateSettingsRequest = (values: FlatSettings) => settingsClient.mutate<unknown>(SETTINGS_ENDPOINTS.update, { values })