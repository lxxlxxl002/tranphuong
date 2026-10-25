import { http, type RequestOptions } from '@/shared/api/httpClient'
import { DEPARTMENTS_CONFIG } from '../config/departments.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: DEPARTMENTS_CONFIG.timeout, ...opts })

export const departmentsClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}