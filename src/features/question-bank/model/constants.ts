import type { BadgeTone } from '@/shared/ui/Badge'
import type { QuestionType, TypeFilter } from './types'

export const QUESTION_BANK_QUERY_KEYS = {
  all: ['question-bank'] as const,
  banks: ['question-bank', 'banks'] as const,
  questions: (courseId: string) => ['question-bank', 'questions', courseId] as const
}

export const RELATED_QUERY_ROOTS = ['course-admin', 'learning'] as const

export const TYPE_META: Record<QuestionType, { label: string; tone: BadgeTone }> = {
  SINGLE: { label: 'Một đáp án', tone: 'info' },
  MULTIPLE: { label: 'Nhiều đáp án', tone: 'purple' }
}

export const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'SINGLE', label: 'Một đáp án đúng' },
  { value: 'MULTIPLE', label: 'Nhiều đáp án đúng' }
]

export const TYPE_FILTER_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả loại câu' },
  { value: 'SINGLE', label: 'Một đáp án' },
  { value: 'MULTIPLE', label: 'Nhiều đáp án' }
]

export const MULTIPLE_ALIASES = new Set(['MULTIPLE', 'MULTI', 'CHECKBOX', 'NHIEU', 'NHIEU_DAP_AN', 'NHIEU_DAP_AN_DUNG', 'CHON_NHIEU'])

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const
export const MIN_OPTIONS = 2
export const MAX_OPTIONS = 6
export const PAGE_SIZE = 10

/* ---------- Import Excel ---------- */
export const MAX_IMPORT_ROWS = 500
export const IMPORT_ACCEPT = '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
export const TEMPLATE_FILE_NAME = 'Mau-nhap-cau-hoi.xlsx'
export const TEMPLATE_HEADERS = [
  'STT',
  'Câu hỏi',
  'Loại câu hỏi',
  'Đáp án A',
  'Đáp án B',
  'Đáp án C',
  'Đáp án D',
  'Đáp án E',
  'Đáp án F',
  'Đáp án đúng',
  'Giải thích'
] as const
export const TEMPLATE_WIDTHS = [6, 60, 16, 28, 28, 28, 28, 22, 22, 14, 40]