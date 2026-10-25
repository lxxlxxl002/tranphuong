import { http, type RequestOptions } from '@/shared/api/httpClient'
import { MY_COURSES_CONFIG } from '../config/my-courses.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: MY_COURSES_CONFIG.timeout, ...opts })

export const myCoursesClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}