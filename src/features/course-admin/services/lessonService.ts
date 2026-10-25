import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { createLessonRequest, deleteLessonRequest, reorderLessonsRequest, updateLessonRequest } from '../api/mutations'
import { toAdminLessonOne, toLessonPayload } from '../adapters/lessonAdapter'
import { COURSE_ADMIN_CONFIG } from '../config/course-admin.config'
import { demoId, emptyToNull } from '../lib/utils'
import type { AdminLesson, LessonInput } from '../model/types'
import { demoDb } from './courseService'

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), COURSE_ADMIN_CONFIG.demoDelayMs))

const parse = (raw: unknown): AdminLesson => {
  try {
    return toAdminLessonOne(raw)
  } catch {
    throw new ApiError('SERVER', 'Dữ liệu bài học không hợp lệ')
  }
}

const applyInput = (input: LessonInput) => ({
  title: input.title.trim(),
  type: input.type,
  durationSec: Math.round(input.durationMin * 60),
  videoUrl: input.type === 'VIDEO' ? emptyToNull(input.videoUrl) : null,
  documentUrl: input.type === 'DOCUMENT' ? emptyToNull(input.documentUrl) : null,
  content: emptyToNull(input.content)
})

const renumber = (courseId: string) => {
  demoDb()
    .lessons.filter((l) => l.courseId === courseId)
    .sort((a, b) => a.order - b.order)
    .forEach((l, i) => (l.order = i + 1))
}

export const lessonService = {
  async create(courseId: string, input: LessonInput): Promise<AdminLesson> {
    if (isDemoMode()) {
      const siblings = demoDb().lessons.filter((l) => l.courseId === courseId)
      const lesson: AdminLesson = { id: demoId('lesson'), courseId, order: siblings.length + 1, ...applyInput(input) }
      demoDb().lessons.push(lesson)
      return delay(lesson)
    }
    return parse(await createLessonRequest(courseId, toLessonPayload(input)))
  },

  async update(lessonId: string, input: LessonInput): Promise<AdminLesson> {
    if (isDemoMode()) {
      const lesson = demoDb().lessons.find((l) => l.id === lessonId)
      if (!lesson) throw new ApiError('NOT_FOUND', 'Không tìm thấy bài học')
      Object.assign(lesson, applyInput(input))
      return delay(lesson)
    }
    return parse(await updateLessonRequest(lessonId, toLessonPayload(input)))
  },

  async remove(lessonId: string): Promise<void> {
    if (isDemoMode()) {
      const d = demoDb()
      const lesson = d.lessons.find((l) => l.id === lessonId)
      if (!lesson) throw new ApiError('NOT_FOUND', 'Không tìm thấy bài học')
      d.lessons = d.lessons.filter((l) => l.id !== lessonId)
      renumber(lesson.courseId)
      return delay(undefined)
    }
    await deleteLessonRequest(lessonId)
  },

  async reorder(courseId: string, lessonIds: string[]): Promise<void> {
    if (isDemoMode()) {
      lessonIds.forEach((id, i) => {
        const l = demoDb().lessons.find((x) => x.id === id && x.courseId === courseId)
        if (l) l.order = i + 1
      })
      return delay(undefined)
    }
    await reorderLessonsRequest(courseId, lessonIds)
  },

  /** Thứ tự id mới sau khi dời 1 bài lên (-1) / xuống (+1) */
  move(lessons: AdminLesson[], lessonId: string, dir: -1 | 1): string[] {
    const ids = [...lessons].sort((a, b) => a.order - b.order).map((l) => l.id)
    const i = ids.indexOf(lessonId)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ids.length) return ids
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    return ids
  },

  applyOrder(lessons: AdminLesson[], lessonIds: string[]): AdminLesson[] {
    const byId = new Map(lessons.map((l) => [l.id, l]))
    return lessonIds.flatMap((id, i) => {
      const l = byId.get(id)
      return l ? [{ ...l, order: i + 1 }] : []
    })
  },

  emptyInput(): LessonInput {
    return { title: '', type: 'VIDEO', durationMin: 15, videoUrl: '', documentUrl: '', content: '' }
  },

  toInput(l: AdminLesson): LessonInput {
    return {
      title: l.title,
      type: l.type,
      durationMin: Math.round(l.durationSec / 60),
      videoUrl: l.videoUrl ?? '',
      documentUrl: l.documentUrl ?? '',
      content: l.content ?? ''
    }
  }
}