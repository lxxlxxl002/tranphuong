import type { DemoAttemptLog } from '@/features/learning'
import { sameSet, toKey } from '../lib/utils'
import { DEFAULT_PASS_SCORE, PASSED_ALIASES } from '../model/constants'
import {
  rawAttemptDetailSchema,
  rawAttemptListSchema,
  type RawAttempt,
  type RawReviewQuestion
} from '../model/schemas'
import type { AttemptDetail, ExamAttempt, ReviewQuestion } from '../model/types'

const toFlag = (v: unknown): boolean | null => (v == null || v === '' ? null : v === true || PASSED_ALIASES.has(toKey(v)))

export const toAttempt = (r: RawAttempt): ExamAttempt => {
  const score = Math.max(0, Math.min(100, Math.round(r.score)))
  const passScore = r.pass_score ?? DEFAULT_PASS_SCORE
  return {
    attemptId: String(r.attempt_id),
    courseId: String(r.course_id),
    courseTitle: r.course_title.trim(),
    submittedAt: r.submitted_at,
    score,
    passScore,
    passed: toFlag(r.passed) ?? score >= passScore,
    correctCount: Math.max(0, Math.round(r.correct_count)),
    total: Math.max(0, Math.round(r.total)),
    timeSpentSec: r.time_spent_sec,
    certificateCode: r.certificate_code
  }
}

export const toReviewQuestion = (r: RawReviewQuestion, index: number): ReviewQuestion => {
  const flagged = toFlag(r.is_correct)
  return {
    id: String(r.id),
    order: r.order > 0 ? Math.round(r.order) : index + 1,
    text: r.text.trim(),
    type: ['MULTIPLE', 'MULTI', 'CHECKBOX', 'NHIEU'].includes(toKey(r.type)) ? 'MULTIPLE' : 'SINGLE',
    options: r.options.map((o) => ({ id: String(o.id), text: o.text.trim() })),
    selected: r.selected,
    correct: r.correct,
    isCorrect: flagged ?? (r.correct.length > 0 && sameSet(r.selected, r.correct)),
    explanation: r.explanation
  }
}

export const toAttempts = (input: unknown): ExamAttempt[] => rawAttemptListSchema.parse(input).map(toAttempt)

export const toAttemptDetail = (input: unknown): AttemptDetail => {
  const raw = rawAttemptDetailSchema.parse(input)
  return {
    ...toAttempt(raw),
    questions: raw.questions.map(toReviewQuestion).sort((a, b) => a.order - b.order)
  }
}

/** Bài làm trong phiên demo của feature learning → chi tiết kết quả */
export const fromDemoLog = (log: DemoAttemptLog): AttemptDetail => ({
  attemptId: log.result.attemptId,
  courseId: log.result.courseId,
  courseTitle: log.courseTitle,
  submittedAt: log.result.submittedAt,
  score: log.result.score,
  passScore: log.result.passScore,
  passed: log.result.passed,
  correctCount: log.result.correctCount,
  total: log.result.total,
  timeSpentSec: log.result.timeSpentSec,
  certificateCode: log.result.certificateCode,
  questions: log.questions.map((q, i) => {
    const selected = log.answers[q.id] ?? []
    const correct = log.key[q.id] ?? []
    return {
      id: q.id,
      order: i + 1,
      text: q.text,
      type: q.type,
      options: q.options,
      selected,
      correct,
      isCorrect: correct.length > 0 && sameSet(selected, correct),
      explanation: null
    }
  })
})