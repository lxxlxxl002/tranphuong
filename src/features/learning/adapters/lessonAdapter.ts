import { toKey } from '../lib/utils'
import { DEFAULT_PASS_SCORE, LESSON_TYPE_ALIASES } from '../model/constants'
import { rawCourseContentSchema, type RawLesson, type RawQuizInfo } from '../model/schemas'
import type { CourseContent, Lesson, LessonType, QuizInfo } from '../model/types'

export const toLessonType = (raw: unknown, r: { video_url: string | null; document_url: string | null }): LessonType =>
  LESSON_TYPE_ALIASES[toKey(raw)] ?? (r.video_url ? 'VIDEO' : r.document_url ? 'DOCUMENT' : 'TEXT')

export const toLesson = (r: RawLesson, index: number): Lesson => ({
  id: String(r.id),
  order: r.order > 0 ? Math.round(r.order) : index + 1,
  title: r.title.trim(),
  type: toLessonType(r.type, r),
  durationSec: Math.max(0, Math.round(r.duration_sec)),
  videoUrl: r.video_url,
  documentUrl: r.document_url,
  content: r.content,
  completed: r.completed
})

export const toQuizInfo = (r: RawQuizInfo, courseTitle: string): QuizInfo => ({
  id: String(r.id),
  title: r.title || `Bài kiểm tra: ${courseTitle}`,
  questionCount: Math.max(0, Math.round(r.question_count)),
  durationMin: Math.max(0, r.duration_min),
  passScore: Math.max(0, Math.min(100, r.pass_score ?? DEFAULT_PASS_SCORE)),
  maxAttempts: Math.max(0, Math.round(r.max_attempts)),
  attemptsUsed: Math.max(0, Math.round(r.attempts_used)),
  bestScore: r.best_score
})

export const toCourseContent = (input: unknown): CourseContent => {
  const raw = rawCourseContentSchema.parse(input)
  const title = raw.course.title.trim()
  return {
    courseId: String(raw.course.id),
    title,
    description: raw.course.description,
    lessons: (raw.lessons ?? []).map(toLesson).sort((a, b) => a.order - b.order),
    quiz: raw.quiz ? toQuizInfo(raw.quiz, title) : null
  }
}