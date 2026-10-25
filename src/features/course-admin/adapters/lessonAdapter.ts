import { emptyToNull, toKey } from '../lib/utils'
import { LESSON_TYPE_ALIASES } from '../model/constants'
import { rawAdminLessonSchema, type RawAdminLesson } from '../model/schemas'
import type { AdminLesson, AdminLessonType, LessonInput } from '../model/types'

export const toLessonType = (raw: unknown, r: { video_url: string | null; document_url: string | null }): AdminLessonType =>
  LESSON_TYPE_ALIASES[toKey(raw)] ?? (r.video_url ? 'VIDEO' : r.document_url ? 'DOCUMENT' : 'TEXT')

export const toAdminLesson = (r: RawAdminLesson, index = 0): AdminLesson => ({
  id: String(r.id),
  courseId: String(r.course_id),
  order: r.order > 0 ? Math.round(r.order) : index + 1,
  title: r.title.trim(),
  type: toLessonType(r.type, r),
  durationSec: Math.max(0, Math.round(r.duration_sec)),
  videoUrl: r.video_url,
  documentUrl: r.document_url,
  content: r.content
})

export const toAdminLessonOne = (input: unknown): AdminLesson => toAdminLesson(rawAdminLessonSchema.parse(input))

/** Form → payload: chỉ gửi link đúng loại bài */
export const toLessonPayload = (input: LessonInput): Record<string, unknown> => ({
  title: input.title.trim(),
  type: input.type,
  duration_sec: Math.round(input.durationMin * 60),
  video_url: input.type === 'VIDEO' ? emptyToNull(input.videoUrl) : null,
  document_url: input.type === 'DOCUMENT' ? emptyToNull(input.documentUrl) : null,
  content: emptyToNull(input.content)
})