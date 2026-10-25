import { settingsClient } from './client'
import { SETTINGS_ENDPOINTS } from './endpoints'

export const fetchSettings = () => settingsClient.query<unknown>(SETTINGS_ENDPOINTS.get)