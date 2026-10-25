import { http, type RequestOptions } from '@/shared/api/httpClient'
import { QUESTION_BANK_CONFIG } from '../config/question-bank.config'

const withDefaults = (opts?: RequestOptions): RequestOptions => ({ timeout: QUESTION_BANK_CONFIG.timeout, ...opts })

export const questionBankClient = {
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.query<T>(action, payload, withDefaults(opts)),
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    http.mutate<T>(action, payload, withDefaults(opts))
}