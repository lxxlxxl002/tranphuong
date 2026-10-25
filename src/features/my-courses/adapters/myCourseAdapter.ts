import { normalizeText } from '@/shared/lib/format'
import { clampProgress } from '../lib/utils'
import { STATUS_ALIASES } from '../model/constants'
import { rawMyCoursesSchema, type RawMyCourse } from '../model/schemas'
import type { CourseStatus, MyCourse } from '../model/types'

export const toCourseStatus = (raw: string | null | undefined, progress: number): CourseStatus => {
  const key = normalizeText(raw ?? '')
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
  const mapped = STATUS_ALIASES[key]
  if (mapped) return mapped
  if (progress >= 100) return 'COMPLETED'
  if (progress > 0) return 'IN_PROGRESS'
  return 'NOT_STARTED'
}

export const toMyCourse = (r: RawMyCourse): MyCourse => {
  const lessonsTotal = Math.max(0, Math.round(r.lessons_total))
  const lessonsDone = Math.min(lessonsTotal, Math.max(0, Math.round(r.lessons_done)))
  const rawProgress = clampProgress(r.progress)
  const status = toCourseStatus(r.status, rawProgress)
  return {
    id: String(r.id ?? r.course_id),
    title: r.title.trim(),
    description: r.description,
    coverUrl: r.cover_url,
    status,
    progress: status === 'COMPLETED' ? 100 : rawProgress,
    lessonsTotal,
    lessonsDone,
    enrolledAt: r.enrolled_at,
    completedAt: r.completed_at,
    lastAccessedAt: r.last_accessed_at,
    score: r.score,
    hasCertificate: r.has_certificate
  }
}

export const toMyCourses = (input: unknown): MyCourse[] => rawMyCoursesSchema.parse(input).map(toMyCourse)