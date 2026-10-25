import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { fetchCourseContent } from '../api/queries'
import { completeLessonRequest } from '../api/mutations'
import { toCourseContent } from '../adapters/lessonAdapter'
import { LEARNING_CONFIG } from '../config/learning.config'
import type { CourseContent, Lesson, LessonProgress } from '../model/types'

/** Trạng thái giả lập trong phiên demo (mất khi tải lại trang) */
const demoState = {
  completed: new Set<string>(),
  attempts: new Map<string, { used: number; best: number | null }>()
}

export const resetDemoState = () => {
  demoState.completed.clear()
  demoState.attempts.clear()
}

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), LEARNING_CONFIG.demoDelayMs))

export const lessonService = {
  async getCourseContent(courseId: string): Promise<CourseContent> {
    if (isDemoMode()) {
      const src = LEARNING_CONFIG.demo[courseId]
      if (!src) throw new ApiError('NOT_FOUND', 'Không tìm thấy khóa học')
      const content = structuredClone(src.content)
      content.lessons = content.lessons.map((l) => ({ ...l, completed: l.completed || demoState.completed.has(l.id) }))
      const attempts = demoState.attempts.get(courseId)
      if (attempts && content.quiz) {
        content.quiz = { ...content.quiz, attemptsUsed: attempts.used, bestScore: attempts.best }
      }
      return delay(content)
    }
    const raw = await fetchCourseContent(courseId)
    try {
      return toCourseContent(raw)
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu khóa học không hợp lệ')
    }
  },

  async completeLesson(courseId: string, lessonId: string): Promise<void> {
    if (isDemoMode()) {
      demoState.completed.add(lessonId)
      return delay(undefined)
    }
    await completeLessonRequest(courseId, lessonId)
  },

  recordDemoAttempt(courseId: string, score: number): void {
    const base = LEARNING_CONFIG.demo[courseId]?.content.quiz
    if (!base) return
    const cur = demoState.attempts.get(courseId) ?? { used: base.attemptsUsed, best: base.bestScore }
    demoState.attempts.set(courseId, { used: cur.used + 1, best: cur.best == null ? score : Math.max(cur.best, score) })
  },

  /** Cập nhật lạc quan (optimistic) */
  markCompleted(content: CourseContent, lessonId: string): CourseContent {
    return { ...content, lessons: content.lessons.map((l) => (l.id === lessonId ? { ...l, completed: true } : l)) }
  },

  pickInitialLesson(lessons: Lesson[]): Lesson | null {
    return lessons.find((l) => !l.completed) ?? lessons[0] ?? null
  },

  neighbors(lessons: Lesson[], lessonId: string | null): { prev: Lesson | null; next: Lesson | null } {
    const i = lessons.findIndex((l) => l.id === lessonId)
    if (i < 0) return { prev: null, next: null }
    return { prev: lessons[i - 1] ?? null, next: lessons[i + 1] ?? null }
  },

  computeProgress(lessons: Lesson[]): LessonProgress {
    const total = lessons.length
    const done = lessons.filter((l) => l.completed).length
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
  }
}