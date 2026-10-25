import { emptyToNull, toKey } from '../lib/utils'
import { STATUS_ALIASES } from '../model/constants'
import { rawAdminCourseSchema, rawCourseDetailSchema, type RawAdminCourse } from '../model/schemas'
import type { AdminCourse, CourseDetail, CourseInput, PublishStatus } from '../model/types'
import { toAdminLesson } from './lessonAdapter'

export const toPublishStatus = (raw: unknown): PublishStatus => STATUS_ALIASES[toKey(raw)] ?? 'DRAFT'

export const toAdminCourse = (r: RawAdminCourse): AdminCourse => ({
  id: String(r.id),
  title: r.title.trim(),
  description: r.description,
  coverUrl: r.cover_url,
  status: toPublishStatus(r.status),
  lessonCount: Math.max(0, Math.round(r.lesson_count)),
  questionCount: Math.max(0, Math.round(r.question_count)),
  enrollmentCount: Math.max(0, Math.round(r.enrollment_count)),
  passScore: Math.max(0, Math.min(100, Math.round(r.pass_score))),
  durationMin: Math.max(0, Math.round(r.duration_min)),
  maxAttempts: Math.max(0, Math.round(r.max_attempts)),
  createdAt: r.created_at,
  updatedAt: r.updated_at
})

export const toAdminCourses = (input: unknown): AdminCourse[] => rawAdminCourseSchema.array().parse(input).map(toAdminCourse)

export const toAdminCourseOne = (input: unknown): AdminCourse => toAdminCourse(rawAdminCourseSchema.parse(input))

export const toCourseDetail = (input: unknown): CourseDetail => {
  const raw = rawCourseDetailSchema.parse(input)
  const lessons = (raw.lessons ?? []).map(toAdminLesson).sort((a, b) => a.order - b.order)
  return { course: { ...toAdminCourse(raw.course), lessonCount: lessons.length }, lessons }
}

/** Form → payload snake_case gửi backend */
export const toCoursePayload = (input: CourseInput): Record<string, unknown> => ({
  title: input.title.trim(),
  description: emptyToNull(input.description),
  cover_url: emptyToNull(input.coverUrl),
  status: input.status,
  pass_score: input.passScore,
  duration_min: input.durationMin,
  max_attempts: input.maxAttempts
})