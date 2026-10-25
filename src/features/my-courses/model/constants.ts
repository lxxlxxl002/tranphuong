import type { BadgeTone } from '@/shared/ui/Badge'
import type { CourseStatus, StatusFilter } from './types'

export const MY_COURSES_QUERY_KEYS = {
  all: ['my-courses'] as const,
  list: ['my-courses', 'list'] as const
}

export const COURSE_STATUS_META: Record<CourseStatus, { label: string; tone: BadgeTone; actionLabel: string }> = {
  NOT_STARTED: { label: 'Chưa bắt đầu', tone: 'warning', actionLabel: 'Bắt đầu học' },
  IN_PROGRESS: { label: 'Đang học', tone: 'info', actionLabel: 'Tiếp tục học' },
  COMPLETED: { label: 'Hoàn thành', tone: 'success', actionLabel: 'Xem lại' }
}

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'IN_PROGRESS', label: 'Đang học' },
  { value: 'NOT_STARTED', label: 'Chưa bắt đầu' },
  { value: 'COMPLETED', label: 'Hoàn thành' }
]

/** Các cách backend có thể ghi trạng thái */
export const STATUS_ALIASES: Record<string, CourseStatus> = {
  NOT_STARTED: 'NOT_STARTED',
  CHUA_BAT_DAU: 'NOT_STARTED',
  NEW: 'NOT_STARTED',
  ENROLLED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  DANG_HOC: 'IN_PROGRESS',
  LEARNING: 'IN_PROGRESS',
  STARTED: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  HOAN_THANH: 'COMPLETED',
  DONE: 'COMPLETED',
  PASSED: 'COMPLETED',
  DAT: 'COMPLETED'
}

export const COVER_THEMES = ['navy', 'gold', 'night'] as const
export type CoverTheme = (typeof COVER_THEMES)[number]