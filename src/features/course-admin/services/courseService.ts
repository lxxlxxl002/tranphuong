import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { normalizeText } from '@/shared/lib/format'
import { fetchAdminCourseDetail, fetchAdminCourses } from '../api/queries'
import {
  createCourseRequest,
  deleteCourseRequest,
  setCourseStatusRequest,
  updateCourseRequest,
  uploadCoverRequest
} from '../api/mutations'
import { toAdminCourseOne, toAdminCourses, toCourseDetail, toCoursePayload } from '../adapters/courseAdapter'
import { COURSE_ADMIN_CONFIG } from '../config/course-admin.config'
import { demoId, fileToBase64 } from '../lib/utils'
import { rawUploadSchema } from '../model/schemas'
import type { AdminCourse, AdminLesson, CourseDetail, CourseInput, PublishStatus, StatusFilter } from '../model/types'

/* ---------- "Database" trong bộ nhớ cho phiên demo ---------- */
interface DemoDb {
  courses: AdminCourse[]
  lessons: AdminLesson[]
}
let db: DemoDb | null = null
export const demoDb = (): DemoDb => (db ??= structuredClone(COURSE_ADMIN_CONFIG.demo))
export const resetDemoDb = () => {
  db = null
}

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), COURSE_ADMIN_CONFIG.demoDelayMs))

const withLessonCount = (c: AdminCourse): AdminCourse => ({
  ...c,
  lessonCount: demoDb().lessons.filter((l) => l.courseId === c.id).length
})

const findDemo = (courseId: string): AdminCourse => {
  const c = demoDb().courses.find((x) => x.id === courseId)
  if (!c) throw new ApiError('NOT_FOUND', 'Không tìm thấy khóa học')
  return c
}

const parse = <T>(fn: () => T, message: string): T => {
  try {
    return fn()
  } catch {
    throw new ApiError('SERVER', message)
  }
}

const time = (iso: string | null) => (iso ? Date.parse(iso) || 0 : 0)

export const courseService = {
  async list(): Promise<AdminCourse[]> {
    if (isDemoMode()) return delay(courseService.sortNewest(demoDb().courses.map(withLessonCount)))
    const raw = await fetchAdminCourses()
    return courseService.sortNewest(parse(() => toAdminCourses(raw), 'Dữ liệu khóa học không hợp lệ'))
  },

  async detail(courseId: string): Promise<CourseDetail> {
    if (isDemoMode()) {
      const course = withLessonCount(findDemo(courseId))
      const lessons = demoDb()
        .lessons.filter((l) => l.courseId === courseId)
        .sort((a, b) => a.order - b.order)
      return delay({ course, lessons })
    }
    const raw = await fetchAdminCourseDetail(courseId)
    return parse(() => toCourseDetail(raw), 'Dữ liệu khóa học không hợp lệ')
  },

  async create(input: CourseInput): Promise<AdminCourse> {
    if (isDemoMode()) {
      const now = new Date().toISOString()
      const course: AdminCourse = {
        id: demoId('course'),
        title: input.title.trim(),
        description: input.description.trim() || null,
        coverUrl: input.coverUrl.trim() || null,
        status: input.status,
        lessonCount: 0,
        questionCount: 0,
        enrollmentCount: 0,
        passScore: input.passScore,
        durationMin: input.durationMin,
        maxAttempts: input.maxAttempts,
        createdAt: now,
        updatedAt: now
      }
      demoDb().courses.push(course)
      return delay(course)
    }
    const raw = await createCourseRequest(toCoursePayload(input))
    return parse(() => toAdminCourseOne(raw), 'Dữ liệu khóa học không hợp lệ')
  },

  async update(courseId: string, input: CourseInput): Promise<AdminCourse> {
    if (isDemoMode()) {
      const c = findDemo(courseId)
      Object.assign(c, {
        title: input.title.trim(),
        description: input.description.trim() || null,
        coverUrl: input.coverUrl.trim() || null,
        status: input.status,
        passScore: input.passScore,
        durationMin: input.durationMin,
        maxAttempts: input.maxAttempts,
        updatedAt: new Date().toISOString()
      })
      return delay(withLessonCount(c))
    }
    const raw = await updateCourseRequest(courseId, toCoursePayload(input))
    return parse(() => toAdminCourseOne(raw), 'Dữ liệu khóa học không hợp lệ')
  },

  async remove(courseId: string): Promise<void> {
    if (isDemoMode()) {
      findDemo(courseId)
      const d = demoDb()
      d.courses = d.courses.filter((c) => c.id !== courseId)
      d.lessons = d.lessons.filter((l) => l.courseId !== courseId)
      return delay(undefined)
    }
    await deleteCourseRequest(courseId)
  },

  async setStatus(courseId: string, status: PublishStatus): Promise<void> {
    if (isDemoMode()) {
      const c = findDemo(courseId)
      c.status = status
      c.updatedAt = new Date().toISOString()
      return delay(undefined)
    }
    await setCourseStatusRequest(courseId, status)
  },

  /** Trả về URL ảnh bìa (demo: data URL) */
  async uploadCover(file: File): Promise<string> {
    const encoded = await fileToBase64(file)
    if (isDemoMode()) return delay(encoded.dataUrl)
    const raw = await uploadCoverRequest({ fileName: encoded.fileName, mimeType: encoded.mimeType, base64: encoded.base64 })
    return parse(() => rawUploadSchema.parse(raw).url, 'Không nhận được đường dẫn ảnh')
  },

  sortNewest(list: AdminCourse[]): AdminCourse[] {
    return [...list].sort((a, b) => time(b.createdAt) - time(a.createdAt))
  },

  filter(list: AdminCourse[], status: StatusFilter, search: string): AdminCourse[] {
    const q = normalizeText(search)
    return list.filter((c) => (status === 'ALL' || c.status === status) && (!q || normalizeText(c.title).includes(q)))
  },

  countByStatus(list: AdminCourse[]): Record<StatusFilter, number> {
    const counts: Record<StatusFilter, number> = { ALL: list.length, DRAFT: 0, PUBLISHED: 0, ARCHIVED: 0 }
    for (const c of list) counts[c.status]++
    return counts
  },

  emptyInput(): CourseInput {
    const d = COURSE_ADMIN_CONFIG.defaults
    return { title: '', description: '', coverUrl: '', status: 'DRAFT', passScore: d.passScore, durationMin: d.durationMin, maxAttempts: d.maxAttempts }
  },

  toInput(c: AdminCourse): CourseInput {
    return {
      title: c.title,
      description: c.description ?? '',
      coverUrl: c.coverUrl ?? '',
      status: c.status,
      passScore: c.passScore,
      durationMin: c.durationMin,
      maxAttempts: c.maxAttempts
    }
  }
}