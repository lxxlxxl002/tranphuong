import { buildPath, PATHS } from '@/app/router/paths'
import { normalizeText } from '@/shared/lib/format'
import { QUIZ_STORAGE_PREFIX } from '../model/constants'

export const toKey = (v: unknown): string =>
  normalizeText(String(v ?? ''))
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

export type VideoSource = { kind: 'drive' | 'youtube' | 'file'; src: string } | { kind: 'none'; src: null }

const BARE_DRIVE_ID = /^[\w-]{25,}$/

const extractDriveId = (u: string): string | null => {
  if (BARE_DRIVE_ID.test(u)) return u
  if (!/(drive|docs)\.google\.com/.test(u)) return null
  const m = u.match(/\/d\/([\w-]{10,})/) ?? u.match(/[?&]id=([\w-]{10,})/)
  return m ? m[1] : null
}

export function resolveVideoSource(url?: string | null): VideoSource {
  const u = url?.trim()
  if (!u) return { kind: 'none', src: null }
  const driveId = extractDriveId(u)
  if (driveId) return { kind: 'drive', src: `https://drive.google.com/file/d/${driveId}/preview` }
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1` }
  return { kind: 'file', src: u }
}

export function resolveDocumentSource(url?: string | null): string | null {
  const u = url?.trim()
  if (!u) return null
  const driveId = extractDriveId(u)
  return driveId ? `https://drive.google.com/file/d/${driveId}/preview` : u
}

/** Chọn đáp án: câu 1 đáp án thay thế, câu nhiều đáp án bật/tắt */
export const toggleOption = (current: string[], optionId: string, multiple: boolean): string[] => {
  if (!multiple) return [optionId]
  return current.includes(optionId) ? current.filter((x) => x !== optionId) : [...current, optionId]
}

export const coursePath = (courseId: string): string => buildPath(PATHS.learn, { courseId })
export const quizPath = (courseId: string): string => buildPath(PATHS.quiz, { courseId })
export const quizStorageKey = (courseId: string): string => `${QUIZ_STORAGE_PREFIX}${courseId}`

export const generateCertificateCode = (date = new Date()): string =>
  `QLGS-${date.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`