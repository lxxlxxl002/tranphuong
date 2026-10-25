import { toCourseStatus } from '@/features/my-courses'
import { normalizePercent } from '../lib/utils'
import { rawProgressSchema, type RawCourseProgress, type RawSummary } from '../model/schemas'
import type { CourseProgress } from '../model/types'

export const toCourseProgress = (r: RawCourseProgress): CourseProgress => {
  const lessonsTotal = Math.max(0, Math.round(r.lessons_total))
  const lessonsDone = Math.min(lessonsTotal, Math.max(0, Math.round(r.lessons_done)))
  const raw = normalizePercent(r.progress)
  const status = toCourseStatus(r.status, raw)
  return {
    courseId: String(r.id ?? r.course_id),
    title: r.title.trim(),
    status,
    percent: status === 'COMPLETED' ? 100 : raw,
    lessonsDone,
    lessonsTotal,
    studySec: Math.max(0, Math.round(r.study_sec)),
    lastAccessedAt: r.last_accessed_at,
    bestScore: r.best_score
  }
}

/** Backend có thể trả mảng khóa học hoặc { summary, courses } */
export const toProgressPayload = (input: unknown): { courses: CourseProgress[]; summary: RawSummary | null } => {
  const raw = rawProgressSchema.parse(input)
  if (Array.isArray(raw)) return { courses: raw.map(toCourseProgress), summary: null }
  return { courses: raw.courses.map(toCourseProgress), summary: raw.summary ?? null }
}