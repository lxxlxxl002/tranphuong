export type LessonType = 'VIDEO' | 'DOCUMENT' | 'TEXT'
export type QuestionType = 'SINGLE' | 'MULTIPLE'

export interface Lesson {
  id: string
  order: number
  title: string
  type: LessonType
  durationSec: number
  videoUrl: string | null
  documentUrl: string | null
  content: string | null
  completed: boolean
}

export interface QuizInfo {
  id: string
  title: string
  questionCount: number
  durationMin: number
  /** 0–100 */
  passScore: number
  /** 0 = không giới hạn */
  maxAttempts: number
  attemptsUsed: number
  bestScore: number | null
}

export interface CourseContent {
  courseId: string
  title: string
  description: string | null
  lessons: Lesson[]
  quiz: QuizInfo | null
}

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  text: string
  type: QuestionType
  options: QuizOption[]
}

export type QuizAnswers = Record<string, string[]>

export interface QuizSession {
  attemptId: string
  courseId: string
  quizId: string
  title: string
  questions: QuizQuestion[]
  /** epoch ms */
  startedAt: number
  durationSec: number
  /** epoch ms — null nếu không giới hạn thời gian */
  deadline: number | null
  passScore: number
}

export interface QuizResult {
  attemptId: string
  courseId: string
  score: number
  correctCount: number
  total: number
  passed: boolean
  passScore: number
  timeSpentSec: number
  certificateCode: string | null
  submittedAt: string
}

export interface LessonProgress {
  done: number
  total: number
  percent: number
}

export interface Eligibility {
  ok: boolean
  reason: string | null
}