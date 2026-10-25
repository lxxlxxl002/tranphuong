import { buildPath, PATHS } from '@/app/router/paths'
import { normalizeText } from '@/shared/lib/format'
import { OPTION_LETTERS } from '../model/constants'

export const toKey = (v: unknown): string =>
  normalizeText(String(v ?? ''))
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

export const letter = (index: number): string => OPTION_LETTERS[index] ?? String(index + 1)

let keySeq = 0
export const newOptionKey = (): string => `opt-${Date.now().toString(36)}-${++keySeq}`

export const bankDetailPath = (courseId: string): string => buildPath(PATHS.questionBankDetail, { courseId })

export const demoId = (prefix: string): string => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** Đọc mọi kiểu giá trị ô Excel (rich text, công thức, hyperlink) thành chuỗi */
export const cellText = (v: unknown): string => {
  if (v == null) return ''
  if (v instanceof Date) return v.toISOString()
  if (typeof v === 'object') {
    const o = v as { richText?: { text: string }[]; text?: unknown; result?: unknown }
    if (Array.isArray(o.richText)) return o.richText.map((r) => r.text).join('').trim()
    if (o.text != null) return String(o.text).trim()
    if (o.result != null) return String(o.result).trim()
    return ''
  }
  return String(v).trim()
}

/** "A, C" | "1;3" → [0, 2] */
export const parseCorrectLetters = (raw: string): number[] => {
  const out = raw
    .toUpperCase()
    .split(/[\s,;|/]+/)
    .filter(Boolean)
    .map((s) => (/^\d+$/.test(s) ? Number(s) - 1 : OPTION_LETTERS.indexOf(s as (typeof OPTION_LETTERS)[number])))
    .filter((i) => i >= 0)
  return [...new Set(out)]
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