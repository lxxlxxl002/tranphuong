import { http, type RequestOptions } from '@/shared/api/httpClient'
import { EXAM_RESULTS_CONFIG } from '../config/exam-results.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: EXAM_RESULTS_CONFIG.timeout, ...opts })

export const examResultsClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}