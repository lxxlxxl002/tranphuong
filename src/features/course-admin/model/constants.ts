import type { BadgeTone } from '@/shared/ui/Badge'
import type { AdminLessonType, PublishStatus, StatusFilter } from './types'

export const COURSE_ADMIN_QUERY_KEYS = {
  all: ['course-admin'] as const,
  list: ['course-admin', 'list'] as const,
  detail: (courseId: string) => ['course-admin', 'detail', courseId] as const
}

/** Dữ liệu feature khác cần làm mới khi khóa học / bài học thay đổi */
export const RELATED_QUERY_ROOTS = ['my-courses', 'learning', 'question-bank', 'dashboard', 'reports', 'progress'] as const

export const STATUS_META: Record<PublishStatus, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'Bản nháp', tone: 'warning' },
  PUBLISHED: { label: 'Đã xuất bản', tone: 'success' },
  ARCHIVED: { label: 'Đã lưu trữ', tone: 'neutral' }
}

export const STATUS_OPTIONS: { value: PublishStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'ARCHIVED', label: 'Đã lưu trữ' }
]

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  ...STATUS_OPTIONS
]

export const STATUS_ALIASES: Record<string, PublishStatus> = {
  PUBLISHED: 'PUBLISHED',
  PUBLIC: 'PUBLISHED',
  ACTIVE: 'PUBLISHED',
  DA_XUAT_BAN: 'PUBLISHED',
  XUAT_BAN: 'PUBLISHED',
  DRAFT: 'DRAFT',
  BAN_NHAP: 'DRAFT',
  NHAP: 'DRAFT',
  ARCHIVED: 'ARCHIVED',
  DA_LUU_TRU: 'ARCHIVED',
  LUU_TRU: 'ARCHIVED',
  HIDDEN: 'ARCHIVED',
  AN: 'ARCHIVED'
}

export const LESSON_TYPE_OPTIONS: { value: AdminLessonType; label: string }[] = [
  { value: 'VIDEO', label: 'Video bài giảng' },
  { value: 'DOCUMENT', label: 'Tài liệu (PDF / Drive)' },
  { value: 'TEXT', label: 'Bài đọc' }
]

export const LESSON_TYPE_ALIASES: Record<string, AdminLessonType> = {
  VIDEO: 'VIDEO',
  MP4: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  DOC: 'DOCUMENT',
  PDF: 'DOCUMENT',
  TAI_LIEU: 'DOCUMENT',
  TEXT: 'TEXT',
  BAI_DOC: 'TEXT'
}

export const COVER_ACCEPT = ['image/png', 'image/jpeg', 'image/webp']
export const COVER_MAX_BYTES = 2 * 1024 * 1024