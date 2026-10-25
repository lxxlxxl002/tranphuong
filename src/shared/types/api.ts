export interface ApiErrorPayload {
  code: string
  message?: string
  details?: unknown
}

export type ApiEnvelope<T> = { ok: true; data: T } | { ok: false; error: ApiErrorPayload }

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface UploadPayload {
  fileName: string
  mimeType: string
  base64: string
}