import type { QuizAnswers, QuizQuestion } from '../model/types'

export const scoringService = {
  isAnswered(answers: QuizAnswers, questionId: string): boolean {
    return (answers[questionId]?.length ?? 0) > 0
  },

  countAnswered(questions: QuizQuestion[], answers: QuizAnswers): number {
    return questions.filter((q) => scoringService.isAnswered(answers, q.id)).length
  },

  unanswered(questions: QuizQuestion[], answers: QuizAnswers): string[] {
    return questions.filter((q) => !scoringService.isAnswered(answers, q.id)).map((q) => q.id)
  },

  /** Đúng khi chọn đủ và chỉ đúng các đáp án đúng */
  isCorrect(selected: string[], correct: string[]): boolean {
    return correct.length > 0 && selected.length === correct.length && correct.every((c) => selected.includes(c))
  },

  isPassed(score: number, passScore: number): boolean {
    return score >= passScore
  },

  grade(questions: QuizQuestion[], answers: QuizAnswers, key: Record<string, string[]>, passScore: number) {
    const correctCount = questions.filter((q) => scoringService.isCorrect(answers[q.id] ?? [], key[q.id] ?? [])).length
    const total = questions.length
    const score = total ? Math.round((correctCount / total) * 100) : 0
    return { correctCount, total, score, passed: scoringService.isPassed(score, passScore) }
  }
}