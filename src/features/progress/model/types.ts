import type { CourseStatus } from '@/features/my-courses'

export interface CourseProgress {
  courseId: string
  title: string
  status: CourseStatus
  /** 0–100 */
  percent: number
  lessonsDone: number
  lessonsTotal: number
  studySec: number
  lastAccessedAt: string | null
  bestScore: number | null
}

export interface ProgressSummary {
  /** % khóa đã hoàn thành */
  overallPercent: number
  totalStudySec: number | null
  lessonsDone: number
  lessonsTotal: number
  quizzesTaken: number
  quizzesPassed: number
  averageScore: number | null
}

export interface ProgressData {
  summary: ProgressSummary
  courses: CourseProgress[]
}

export type ProgressSortBy = 'status' | 'percent' | 'name'