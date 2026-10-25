import { http, type RequestOptions } from '@/shared/api/httpClient'
import { COURSE_ADMIN_CONFIG } from '../config/course-admin.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: COURSE_ADMIN_CONFIG.timeout, ...opts })

export const courseAdminClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}