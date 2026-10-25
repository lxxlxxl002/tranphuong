import type { QuizSessionState } from './store'

export const selectSession = (s: QuizSessionState) => s.session
export const selectAnswers = (s: QuizSessionState) => s.answers
export const selectFlagged = (s: QuizSessionState) => s.flagged
export const selectCurrent = (s: QuizSessionState) => s.current
export const selectResult = (s: QuizSessionState) => s.result