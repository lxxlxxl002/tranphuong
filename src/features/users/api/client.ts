import { http, type RequestOptions } from '@/shared/api/httpClient'
import { USERS_CONFIG } from '../config/users.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: USERS_CONFIG.timeout, ...opts })

export const usersClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}