import { http, type RequestOptions } from '@/shared/api/httpClient'
import { REPORTS_CONFIG } from '../config/reports.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: REPORTS_CONFIG.timeout, ...opts })

export const reportsClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}