import type { BadgeTone } from '@/shared/ui/Badge'
import type { QuestionOutcome, ResultFilter, ReviewFilter } from './types'

export const EXAM_RESULTS_QUERY_KEYS = {
  all: ['exam-results'] as const,
  list: ['exam-results', 'list'] as const,
  detail: (attemptId: string) => ['exam-results', 'detail', attemptId] as const
}

export const DEFAULT_PASS_SCORE = 70

export const OUTCOME_META: Record<QuestionOutcome, { label: string; tone: BadgeTone }> = {
  CORRECT: { label: 'Đúng', tone: 'success' },
  WRONG: { label: 'Sai', tone: 'danger' },
  SKIPPED: { label: 'Bỏ trống', tone: 'neutral' }
}

export const REVIEW_FILTERS: { value: ReviewFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'CORRECT', label: 'Đúng' },
  { value: 'WRONG', label: 'Sai' },
  { value: 'SKIPPED', label: 'Bỏ trống' }
]

export const RESULT_FILTERS: { value: ResultFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả kết quả' },
  { value: 'PASSED', label: 'Đạt' },
  { value: 'FAILED', label: 'Không đạt' }
]

export const PASSED_ALIASES = new Set(['TRUE', '1', 'X', 'DAT', 'PASS', 'PASSED', 'YES'])