import { buildPath, PATHS } from '@/app/router/paths'
import { normalizeText } from '@/shared/lib/format'

export const toKey = (v: unknown): string =>
  normalizeText(String(v ?? ''))
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

export const detailPath = (courseId: string): string => buildPath(PATHS.courseAdminDetail, { courseId })
export const editPath = (courseId: string): string => buildPath(PATHS.courseAdminEdit, { courseId })
export const questionBankPath = (courseId: string): string => buildPath(PATHS.questionBankDetail, { courseId })

export const emptyToNull = (v: string): string | null => v.trim() || null

export const demoId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export interface EncodedFile {
  fileName: string
  mimeType: string
  base64: string
  dataUrl: string
}

export const fileToBase64 = (file: File): Promise<EncodedFile> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result)
      resolve({ fileName: file.name, mimeType: file.type, base64: dataUrl.split(',')[1] ?? '', dataUrl })
    }
    reader.onerror = () => reject(new Error('Không đọc được tệp'))
    reader.readAsDataURL(file)
  })