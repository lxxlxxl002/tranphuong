import type { LessonType } from './types'

export const LEARNING_QUERY_KEYS = {
  all: ['learning'] as const,
  course: (courseId: string) => ['learning', 'course', courseId] as const
}

/** Dữ liệu feature khác cần làm mới khi tiến độ / kết quả thay đổi */
export const RELATED_QUERY_ROOTS = ['my-courses', 'progress', 'exam-results', 'certificates', 'dashboard', 'reports'] as const

export const SUBMIT_MUTATION_KEY = ['quiz', 'submit'] as const

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  VIDEO: 'Video',
  DOCUMENT: 'Tài liệu',
  TEXT: 'Bài đọc'
}

export const LESSON_TYPE_ALIASES: Record<string, LessonType> = {
  VIDEO: 'VIDEO',
  MP4: 'VIDEO',
  BAI_GIANG: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  DOC: 'DOCUMENT',
  PDF: 'DOCUMENT',
  TAI_LIEU: 'DOCUMENT',
  TEXT: 'TEXT',
  ARTICLE: 'TEXT',
  BAI_DOC: 'TEXT'
}

export const MULTIPLE_ALIASES = new Set(['MULTIPLE', 'MULTI', 'CHECKBOX', 'NHIEU', 'NHIEU_DAP_AN', 'CHON_NHIEU'])

export const PASSED_ALIASES = new Set(['TRUE', '1', 'X', 'DAT', 'PASS', 'PASSED', 'YES'])

export const DEFAULT_PASS_SCORE = 70

export const QUIZ_STORAGE_PREFIX = 'quiz-session:'