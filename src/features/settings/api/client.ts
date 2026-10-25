import { http, type RequestOptions } from '@/shared/api/httpClient'
import { SETTINGS_CONFIG } from '../config/settings.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: SETTINGS_CONFIG.timeout, ...opts })

export const settingsClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}