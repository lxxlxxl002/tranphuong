import type { CourseStatus } from '@/features/my-courses'
import type { ProgressSortBy } from './types'

export const PROGRESS_QUERY_KEYS = {
  all: ['progress'] as const,
  overview: ['progress', 'overview'] as const
}

export const SORT_OPTIONS: { value: ProgressSortBy; label: string }[] = [
  { value: 'status', label: 'Theo trạng thái' },
  { value: 'percent', label: 'Theo % hoàn thành' },
  { value: 'name', label: 'Theo tên khóa học' }
]

/** Đang học → Hoàn thành → Chưa bắt đầu */
export const STATUS_RANK: Record<CourseStatus, number> = {
  IN_PROGRESS: 0,
  COMPLETED: 1,
  NOT_STARTED: 2
}