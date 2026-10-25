import type { LessonType, QuestionType, QuizAnswers, QuizQuestion } from '../model/types'

export const isLessonType = (v: unknown): v is LessonType => v === 'VIDEO' || v === 'DOCUMENT' || v === 'TEXT'

export const isQuestionType = (v: unknown): v is QuestionType => v === 'SINGLE' || v === 'MULTIPLE'

export const hasAnsweredAll = (questions: QuizQuestion[], answers: QuizAnswers): boolean =>
  questions.every((q) => (answers[q.id]?.length ?? 0) > 0)