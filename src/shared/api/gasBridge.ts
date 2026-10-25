import type { ApiEnvelope } from '@/shared/types/api'
import { ApiError, normalizeCode } from './errors'

export const GAS_URL = import.meta.env.VITE_API_BASE_URL
export const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 15000

export interface GasRequest {
  action: string
  payload?: unknown
  token?: string | null
}

export interface TransportOptions {
  timeout?: number
  signal?: AbortSignal
}

/**
 * Apps Script Web App không trả lời preflight (OPTIONS)
 * → gửi dạng "simple request": POST + text/plain, token nằm trong body.
 */
export async function postToGas<T>(req: GasRequest, opts: TransportOptions = {}): Promise<T> {
  if (!GAS_URL) throw new ApiError('SERVER', 'Chưa cấu hình VITE_API_BASE_URL')

  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, opts.timeout ?? DEFAULT_TIMEOUT)
  const onAbort = () => controller.abort()
  if (opts.signal?.aborted) controller.abort()
  opts.signal?.addEventListener('abort', onAbort, { once: true })

  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(req),
      redirect: 'follow',
      signal: controller.signal
    })
    if (!res.ok) throw new ApiError(res.status >= 500 ? 'SERVER' : 'UNKNOWN', `HTTP ${res.status}`)

    const text = await res.text()
    let envelope: ApiEnvelope<T>
    try {
      envelope = JSON.parse(text) as ApiEnvelope<T>
    } catch {
      throw new ApiError('SERVER', 'Phản hồi máy chủ không hợp lệ')
    }
    if (!envelope.ok) {
      throw new ApiError(normalizeCode(envelope.error?.code), envelope.error?.message, envelope.error?.details)
    }
    return envelope.data
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (controller.signal.aborted) throw new ApiError(timedOut ? 'TIMEOUT' : 'ABORTED')
    throw new ApiError('NETWORK')
  } finally {
    clearTimeout(timer)
    opts.signal?.removeEventListener('abort', onAbort)
  }
}