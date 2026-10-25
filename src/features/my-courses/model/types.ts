export type CourseStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
export type StatusFilter = 'ALL' | CourseStatus

export interface MyCourse {
  id: string
  title: string
  description: string | null
  coverUrl: string | null
  status: CourseStatus
  /** 0–100 */
  progress: number
  lessonsTotal: number
  lessonsDone: number
  enrolledAt: string | null
  completedAt: string | null
  lastAccessedAt: string | null
  score: number | null
  hasCertificate: boolean
}