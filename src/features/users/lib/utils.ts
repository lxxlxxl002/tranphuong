import { buildPath, PATHS } from '@/app/router/paths'
import { normalizeText } from '@/shared/lib/format'

export const toKey = (v: unknown): string =>
  normalizeText(String(v ?? ''))
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

export const editUserPath = (userId: string): string => buildPath(PATHS.userEdit, { userId })

export const percentOf = (part: number, total: number): string => `${(total ? (part / total) * 100 : 0).toFixed(1)}%`

export const emptyToNull = (v: string): string | null => v.trim() || null

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

/** Mật khẩu tạm 10 ký tự, luôn có chữ hoa + chữ thường + số + ký tự đặc biệt */
export const generatePassword = (length = 10): string => {
  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  const body = Array.from(bytes.slice(0, length - 4), (b) => CHARS[b % CHARS.length]).join('')
  const pick = (set: string, i: number) => set[bytes[length - 4 + i] % set.length]
  return body + pick('ABCDEFGHJKLMNPQRSTUVWXYZ', 0) + pick('abcdefghijkmnpqrstuvwxyz', 1) + pick('23456789', 2) + pick('@#$%&*', 3)
}

export const demoUuid = (): string =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })

export const cellText = (v: unknown): string => {
  if (v == null) return ''
  if (typeof v === 'object') {
    const o = v as { richText?: { text: string }[]; text?: unknown; result?: unknown; hyperlink?: unknown }
    if (Array.isArray(o.richText)) return o.richText.map((r) => r.text).join('').trim()
    if (o.text != null) return String(o.text).trim()
    if (o.result != null) return String(o.result).trim()
    return ''
  }
  return String(v).trim()
}

export const toArrayBuffer = (buf: ArrayBuffer | ArrayBufferView): ArrayBuffer => {
  if (buf instanceof ArrayBuffer) return buf
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('Không đọc được tệp'))
    reader.readAsArrayBuffer(file)
  })

export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}