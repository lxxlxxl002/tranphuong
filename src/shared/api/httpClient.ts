import { postToGas, type TransportOptions } from './gasBridge'
import { toApiError } from './errors'
import { storage, STORAGE_KEYS } from '@/shared/lib/storage'

export interface RequestOptions extends TransportOptions {
  retries?: number
  auth?: boolean
}

interface HttpHooks {
  getToken: () => string | null
  onUnauthorized: () => void
}

const hooks: HttpHooks = {
  getToken: () => storage.get<string>(STORAGE_KEYS.token),
  onUnauthorized: () => {}
}

/** Gắn từ auth feature: lấy token + xử lý hết phiên */
export const configureHttp = (partial: Partial<HttpHooks>) => {
  Object.assign(hooks, partial)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function request<T>(action: string, payload?: unknown, opts: RequestOptions = {}): Promise<T> {
  const { retries = 0, auth = true, ...transport } = opts
  let attempt = 0
  for (;;) {
    try {
      return await postToGas<T>({ action, payload, token: auth ? hooks.getToken() : null }, transport)
    } catch (e) {
      const err = toApiError(e)
      if (err.code === 'UNAUTHORIZED' && auth) hooks.onUnauthorized()
      if (!err.retryable || attempt >= retries) throw err
      attempt++
      await sleep(Math.min(400 * 2 ** (attempt - 1), 3000))
    }
  }
}

export const http = {
  /** Đọc dữ liệu — tự retry 2 lần khi lỗi mạng/timeout */
  query: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    request<T>(action, payload, { retries: 2, ...opts }),
  /** Ghi dữ liệu — không retry để tránh ghi trùng */
  mutate: <T>(action: string, payload?: unknown, opts?: RequestOptions) =>
    request<T>(action, payload, { retries: 0, ...opts })
}