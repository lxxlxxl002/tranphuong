export type ReviewQuestionType = 'SINGLE' | 'MULTIPLE'
export type QuestionOutcome = 'CORRECT' | 'WRONG' | 'SKIPPED'
export type ReviewFilter = 'ALL' | QuestionOutcome
export type ResultFilter = 'ALL' | 'PASSED' | 'FAILED'

export interface ExamAttempt {
  attemptId: string
  courseId: string
  courseTitle: string
  submittedAt: string | null
  score: number
  passScore: number
  passed: boolean
  correctCount: number
  total: number
  timeSpentSec: number | null
  certificateCode: string | null
}

export interface ReviewOption {
  id: string
  text: string
}

export interface ReviewQuestion {
  id: string
  order: number
  text: string
  type: ReviewQuestionType
  options: ReviewOption[]
  selected: string[]
  /** Rỗng = backend ẩn đáp án đúng */
  correct: string[]
  isCorrect: boolean
  explanation: string | null
}

export interface AttemptDetail extends ExamAttempt {
  questions: ReviewQuestion[]
}