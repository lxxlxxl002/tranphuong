import { http, type RequestOptions } from '@/shared/api/httpClient'
import { CERTIFICATES_CONFIG } from '../config/certificates.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: CERTIFICATES_CONFIG.timeout, ...opts })

export const certificatesClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}