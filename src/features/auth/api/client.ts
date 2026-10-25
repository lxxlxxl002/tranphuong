import { http, type RequestOptions } from '@/shared/api/httpClient'
import { AUTH_CONFIG } from '../config/auth.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: AUTH_CONFIG.timeout, ...opts })

export const authClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}