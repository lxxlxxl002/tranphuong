export type PublishStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type StatusFilter = 'ALL' | PublishStatus
export type AdminLessonType = 'VIDEO' | 'DOCUMENT' | 'TEXT'

export interface AdminCourse {
  id: string
  title: string
  description: string | null
  coverUrl: string | null
  status: PublishStatus
  lessonCount: number
  questionCount: number
  enrollmentCount: number
  passScore: number
  durationMin: number
  /** 0 = không giới hạn */
  maxAttempts: number
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminLesson {
  id: string
  courseId: string
  order: number
  title: string
  type: AdminLessonType
  durationSec: number
  videoUrl: string | null
  documentUrl: string | null
  content: string | null
}

export interface CourseDetail {
  course: AdminCourse
  lessons: AdminLesson[]
}

/** Dữ liệu form khóa học (chuỗi rỗng = không có) */
export interface CourseInput {
  title: string
  description: string
  coverUrl: string
  status: PublishStatus
  passScore: number
  durationMin: number
  maxAttempts: number
}

/** Dữ liệu form bài học */
export interface LessonInput {
  title: string
  type: AdminLessonType
  durationMin: number
  videoUrl: string
  documentUrl: string
  content: string
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>