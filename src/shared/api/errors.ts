export type ApiErrorCode =
  | 'NETWORK'
  | 'TIMEOUT'
  | 'ABORTED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SERVER'
  | 'UNKNOWN'

const MESSAGES: Record<ApiErrorCode, string> = {
  NETWORK: 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.',
  TIMEOUT: 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.',
  ABORTED: 'Yêu cầu đã bị hủy.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  VALIDATION: 'Dữ liệu không hợp lệ.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  CONFLICT: 'Dữ liệu đã tồn tại hoặc đã bị thay đổi.',
  SERVER: 'Máy chủ gặp sự cố. Vui lòng thử lại sau.',
  UNKNOWN: 'Đã có lỗi xảy ra.'
}

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly details?: unknown

  constructor(code: ApiErrorCode, message?: string, details?: unknown) {
    super(message || MESSAGES[code])
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }

  get retryable(): boolean {
    return this.code === 'NETWORK' || this.code === 'TIMEOUT' || this.code === 'SERVER'
  }
}

const KNOWN = new Set<string>(Object.keys(MESSAGES))

export const normalizeCode = (code: unknown): ApiErrorCode =>
  typeof code === 'string' && KNOWN.has(code) ? (code as ApiErrorCode) : 'UNKNOWN'

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err
  if (err instanceof DOMException && err.name === 'AbortError') return new ApiError('ABORTED')
  if (err instanceof TypeError) return new ApiError('NETWORK')
  return new ApiError('UNKNOWN', err instanceof Error ? err.message : undefined)
}

export const getErrorMessage = (err: unknown): string => toApiError(err).message