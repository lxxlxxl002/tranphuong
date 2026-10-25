import { http, type RequestOptions } from '@/shared/api/httpClient'
import { LEARNING_CONFIG } from '../config/learning.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: LEARNING_CONFIG.timeout, ...opts })

export const learningClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}