import { create } from 'zustand'
import type { QuizAnswers, QuizResult, QuizSession } from '../model/types'

export interface QuizSessionState {
  session: QuizSession | null
  answers: QuizAnswers
  flagged: string[]
  current: number
  result: QuizResult | null
}

export const useQuizStore = create<QuizSessionState>(() => ({
  session: null,
  answers: {},
  flagged: [],
  current: 0,
  result: null
}))