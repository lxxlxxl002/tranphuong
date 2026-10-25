export type QuestionType = 'SINGLE' | 'MULTIPLE'
export type TypeFilter = 'ALL' | QuestionType

export interface QuestionOption {
  id: string
  text: string
  correct: boolean
}

export interface Question {
  id: string
  courseId: string
  order: number
  text: string
  type: QuestionType
  options: QuestionOption[]
  explanation: string | null
  updatedAt: string | null
}

export interface QuestionBank {
  courseId: string
  courseTitle: string
  coverUrl: string | null
  questionCount: number
}

export interface BankQuestions {
  course: { id: string; title: string }
  questions: Question[]
}

/** Đáp án trong form (key chỉ dùng phía client) */
export interface OptionDraft {
  key: string
  text: string
  correct: boolean
}

export interface QuestionInput {
  text: string
  type: QuestionType
  options: OptionDraft[]
  explanation: string
}

export interface QuestionErrors {
  text?: string
  options?: string
  explanation?: string
}

export interface ImportRow {
  /** Số dòng trong Excel */
  row: number
  preview: string
  type: QuestionType
  optionCount: number
  input: QuestionInput | null
  errors: string[]
}