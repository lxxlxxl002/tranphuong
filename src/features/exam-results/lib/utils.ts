import { buildPath, PATHS } from '@/app/router/paths'
import { normalizeText } from '@/shared/lib/format'

export const toKey = (v: unknown): string =>
  normalizeText(String(v ?? ''))
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

export const sameSet = (a: string[], b: string[]): boolean => a.length === b.length && a.every((x) => b.includes(x))

export const resultDetailPath = (attemptId: string): string => buildPath(PATHS.examResultDetail, { attemptId })

export const optionLetter = (index: number): string => String.fromCharCode(65 + index)