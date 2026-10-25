import { toKey } from '../lib/utils'
import { MULTIPLE_ALIASES, PASSED_ALIASES } from '../model/constants'
import { rawQuizResultSchema, rawQuizStartSchema } from '../model/schemas'
import type { QuestionType, QuizInfo, QuizResult, QuizSession } from '../model/types'

export const toQuestionType = (raw: unknown): QuestionType => (MULTIPLE_ALIASES.has(toKey(raw)) ? 'MULTIPLE' : 'SINGLE')

const toPassed = (raw: unknown): boolean | null => {
  if (raw == null || raw === '') return null
  return raw === true || PASSED_ALIASES.has(toKey(raw))
}

export const toQuizSession = (input: unknown, ctx: { courseId: string; quiz: QuizInfo }): QuizSession => {
  const raw = rawQuizStartSchema.parse(input)
  const parsedStart = raw.started_at ? Date.parse(raw.started_at) : NaN
  const startedAt = Number.isFinite(parsedStart) ? parsedStart : Date.now()
  const durationSec = raw.duration_sec > 0 ? Math.round(raw.duration_sec) : Math.round(ctx.quiz.durationMin * 60)
  return {
    attemptId: String(raw.attempt_id),
    courseId: ctx.courseId,
    quizId: ctx.quiz.id,
    title: ctx.quiz.title,
    questions: raw.questions.map((q) => ({
      id: String(q.id),
      text: q.text.trim(),
      type: toQuestionType(q.type),
      options: q.options.map((o) => ({ id: String(o.id), text: o.text.trim() }))
    })),
    startedAt,
    durationSec,
    deadline: durationSec > 0 ? startedAt + durationSec * 1000 : null,
    passScore: raw.pass_score ?? ctx.quiz.passScore
  }
}

export const toQuizResult = (input: unknown, ctx: { session: QuizSession; timeSpentSec: number }): QuizResult => {
  const raw = rawQuizResultSchema.parse(input)
  const score = Math.max(0, Math.min(100, Math.round(raw.score)))
  const passScore = raw.pass_score ?? ctx.session.passScore
  return {
    attemptId: String(raw.attempt_id),
    courseId: ctx.session.courseId,
    score,
    correctCount: Math.max(0, Math.round(raw.correct_count)),
    total: Math.max(0, Math.round(raw.total)) || ctx.session.questions.length,
    passed: toPassed(raw.passed) ?? score >= passScore,
    passScore,
    timeSpentSec: Math.round(raw.time_spent_sec ?? ctx.timeSpentSec),
    certificateCode: raw.certificate_code,
    submittedAt: raw.submitted_at ?? new Date().toISOString()
  }
}