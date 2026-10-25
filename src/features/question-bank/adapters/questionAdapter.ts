import { toKey } from '../lib/utils'
import { MULTIPLE_ALIASES } from '../model/constants'
import { rawBankQuestionsSchema, rawBankSchema, rawQuestionSchema, type RawBank, type RawQuestion } from '../model/schemas'
import type { BankQuestions, Question, QuestionBank, QuestionInput, QuestionType } from '../model/types'

export const toQuestionType = (raw: unknown, correctCount: number): QuestionType =>
  MULTIPLE_ALIASES.has(toKey(raw)) || correctCount > 1 ? 'MULTIPLE' : 'SINGLE'

export const toBank = (r: RawBank): QuestionBank => ({
  courseId: String(r.course_id),
  courseTitle: r.course_title.trim(),
  coverUrl: r.cover_url,
  questionCount: Math.max(0, Math.round(r.question_count))
})

export const toBanks = (input: unknown): QuestionBank[] => rawBankSchema.array().parse(input).map(toBank)

export const toQuestion = (r: RawQuestion, courseId: string, index = 0): Question => {
  const qid = String(r.id)
  const options = r.options.map((o, i) => ({ id: o.id != null ? String(o.id) : `${qid}-${i}`, text: o.text.trim(), correct: o.correct }))
  return {
    id: qid,
    courseId,
    order: r.order > 0 ? Math.round(r.order) : index + 1,
    text: r.text.trim(),
    type: toQuestionType(r.type, options.filter((o) => o.correct).length),
    options,
    explanation: r.explanation,
    updatedAt: r.updated_at
  }
}

export const toQuestionOne = (input: unknown, courseId: string): Question => toQuestion(rawQuestionSchema.parse(input), courseId)

export const toBankQuestions = (input: unknown): BankQuestions => {
  const raw = rawBankQuestionsSchema.parse(input)
  const courseId = String(raw.course.id)
  return {
    course: { id: courseId, title: raw.course.title.trim() },
    questions: raw.questions.map((q, i) => toQuestion(q, courseId, i)).sort((a, b) => a.order - b.order)
  }
}

/** Form → payload gửi backend */
export const toQuestionPayload = (input: QuestionInput): Record<string, unknown> => ({
  text: input.text.trim(),
  type: input.type,
  options: input.options.map((o) => ({ text: o.text.trim(), correct: o.correct })),
  explanation: input.explanation.trim() || null
})