import { isDemoMode } from '@/features/auth'
import { getDemoAttemptLog } from '@/features/learning'
import { ApiError } from '@/shared/api/errors'
import { fetchAttemptDetail, fetchAttempts } from '../api/queries'
import { fromDemoLog, toAttemptDetail, toAttempts } from '../adapters/resultAdapter'
import { EXAM_RESULTS_CONFIG } from '../config/exam-results.config'
import type {
  AttemptDetail,
  ExamAttempt,
  QuestionOutcome,
  ResultFilter,
  ReviewFilter,
  ReviewQuestion
} from '../model/types'

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), EXAM_RESULTS_CONFIG.demoDelayMs))

const demoDetails = (): AttemptDetail[] => [...getDemoAttemptLog().map(fromDemoLog), ...EXAM_RESULTS_CONFIG.demo.attempts]

const stripQuestions = ({ questions: _q, ...attempt }: AttemptDetail): ExamAttempt => attempt

const time = (iso: string | null) => (iso ? Date.parse(iso) || 0 : 0)

export const resultService = {
  async getAttempts(): Promise<ExamAttempt[]> {
    if (isDemoMode()) return resultService.sortNewest(await delay(demoDetails().map(stripQuestions)))
    const raw = await fetchAttempts()
    try {
      return resultService.sortNewest(toAttempts(raw))
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu kết quả kiểm tra không hợp lệ')
    }
  },

  async getAttemptDetail(attemptId: string): Promise<AttemptDetail> {
    if (isDemoMode()) {
      const found = demoDetails().find((a) => a.attemptId === attemptId)
      if (!found) throw new ApiError('NOT_FOUND', 'Không tìm thấy bài làm')
      return delay(found)
    }
    const raw = await fetchAttemptDetail(attemptId)
    try {
      return toAttemptDetail(raw)
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu bài làm không hợp lệ')
    }
  },

  sortNewest(list: ExamAttempt[]): ExamAttempt[] {
    return [...list].sort((a, b) => time(b.submittedAt) - time(a.submittedAt))
  },

  filterAttempts(list: ExamAttempt[], filter: ResultFilter): ExamAttempt[] {
    if (filter === 'PASSED') return list.filter((a) => a.passed)
    if (filter === 'FAILED') return list.filter((a) => !a.passed)
    return list
  },

  outcomeOf(q: ReviewQuestion): QuestionOutcome {
    if (q.selected.length === 0) return 'SKIPPED'
    return q.isCorrect ? 'CORRECT' : 'WRONG'
  },

  filterQuestions(list: ReviewQuestion[], filter: ReviewFilter): ReviewQuestion[] {
    return filter === 'ALL' ? list : list.filter((q) => resultService.outcomeOf(q) === filter)
  },

  countOutcomes(list: ReviewQuestion[]): Record<ReviewFilter, number> {
    const counts: Record<ReviewFilter, number> = { ALL: list.length, CORRECT: 0, WRONG: 0, SKIPPED: 0 }
    for (const q of list) counts[resultService.outcomeOf(q)]++
    return counts
  }
}