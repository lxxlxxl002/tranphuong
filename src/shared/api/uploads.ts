export type UploadKind = 'image' | 'video' | 'document'

export const ACCEPT: Record<UploadKind, string> = {
  image: 'image/png,image/jpeg,image/webp,image/gif',
  video: 'video/mp4,video/webm,video/quicktime',
  document: 'application/pdf,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx'
}

const EXT_OK: Record<UploadKind, RegExp> = {
  image: /\.(png|jpe?g|webp|gif)$/i,
  video: /\.(mp4|webm|mov|m4v)$/i,
  document: /\.(pdf|docx?|pptx?|xlsx?)$/i
}

export interface UploadResult {
  url: string
  fileName: string
  mimeType: string
  size: number
}

export interface UploadOptions {
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}

export const validateUploadType = (file: File, kind: UploadKind): string | null =>
  EXT_OK[kind].test(file.name) ? null : `Định dạng không hỗ trợ cho ${kind === 'image' ? 'ảnh' : kind === 'video' ? 'video' : 'tài liệu'}`

export const formatBytes = (bytes: number): string => {
  if (!bytes) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(u.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}`
}

/**
 * Tải file lên và trả về URL.
 * HIỆN TẠI (frontend): tạo blob URL ở máy để xem trước + giả lập tiến trình.
 * NỐI BACKEND: thay phần thân bằng request thật (XHR có onprogress / fetch), giữ nguyên chữ ký hàm.
 */
export function uploadFile(file: File, kind: UploadKind, opts: UploadOptions = {}): Promise<UploadResult> {
  const err = validateUploadType(file, kind)
  if (err) return Promise.reject(new Error(err))

  return new Promise((resolve, reject) => {
    // TODO: nối backend — thay khối dưới bằng XHR thật:
    //   const xhr = new XMLHttpRequest()
    //   xhr.upload.onprogress = e => opts.onProgress?.(Math.round(e.loaded / e.total * 100))
    //   xhr.open('POST', UPLOAD_URL); xhr.send(form) ...
    const url = URL.createObjectURL(file)
    let percent = 0
    const timer = setInterval(() => {
      if (opts.signal?.aborted) {
        clearInterval(timer)
        URL.revokeObjectURL(url)
        reject(new DOMException('Đã hủy', 'AbortError'))
        return
      }
      percent = Math.min(100, percent + 12 + Math.random() * 18)
      opts.onProgress?.(Math.round(percent))
      if (percent >= 100) {
        clearInterval(timer)
        resolve({ url, fileName: file.name, mimeType: file.type, size: file.size })
      }
    }, 120)
  })
}