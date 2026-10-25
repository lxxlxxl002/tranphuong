import { buildPath, PATHS } from '@/app/router/paths'
import { COVER_THEMES, type CoverTheme } from '../model/constants'

export const clampProgress = (v: number): number => {
  const n = v > 0 && v <= 1 ? v * 100 : v
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(n) ? n : 0)))
}

/** Chọn bìa dự phòng ổn định theo id */
export const pickCoverTheme = (id: string): CoverTheme => {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return COVER_THEMES[hash % COVER_THEMES.length]
}

export const learnPath = (courseId: string): string => buildPath(PATHS.learn, { courseId })