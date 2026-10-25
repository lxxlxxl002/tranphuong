import { http, type RequestOptions } from '@/shared/api/httpClient'
import { DASHBOARD_CONFIG } from '../config/dashboard.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: DASHBOARD_CONFIG.timeout, ...opts })

export const dashboardClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}