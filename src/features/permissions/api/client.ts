import { http, type RequestOptions } from '@/shared/api/httpClient'
import { PERMISSIONS_CONFIG } from '../config/permissions.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: PERMISSIONS_CONFIG.timeout, ...opts })

export const permissionsClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}