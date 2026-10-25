import { http, type RequestOptions } from '@/shared/api/httpClient'
import { PROGRESS_CONFIG } from '../config/progress.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: PROGRESS_CONFIG.timeout, ...opts })

export const progressClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}