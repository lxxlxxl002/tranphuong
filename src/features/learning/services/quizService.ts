import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { startQuizRequest, submitQuizRequest } from '../api/mutations'
import { toQuizResult, toQuizSession } from '../adapters/quizAdapter'
import { LEARNING_CONFIG } from '../config/learning.config'
import { generateCertificateCode } from '../lib/utils'
import type {
  CourseContent,
  Eligibility,
  QuizAnswers,
  QuizInfo,
  QuizQuestion,
  QuizResult,
  QuizSession
} from '../model/types'
import { lessonService } from './lessonService'
import { scoringService } from './scoringService'

/** Bài làm trong phiên demo — feature exam-results đọc để hiển thị lịch sử + chi tiết */
export interface DemoAttemptLog {
  result: QuizResult
  courseTitle: string
  questions: QuizQuestion[]
  answers: QuizAnswers
  key: Record<string, string[]>
}

const demoAttemptLog: DemoAttemptLog[] = []
export const getDemoAttemptLog = (): readonly DemoAttemptLog[] => demoAttemptLog
export const resetDemoAttemptLog = () => {
  demoAttemptLog.length = 0
}

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), LEARNING_CONFIG.demoDelayMs))

export const quizService = {
  checkEligibility(content: CourseContent): Eligibility {
    const quiz = content.quiz
    if (!quiz) return { ok: false, reason: 'Khóa học chưa có bài kiểm tra' }
    const { done, total } = lessonService.computeProgress(content.lessons)
    if (LEARNING_CONFIG.requireAllLessons && total > 0 && done < total) {
      return { ok: false, reason: `Hoàn thành ${total - done} bài học còn lại để mở bài kiểm tra` }
    }
    if (quiz.maxAttempts > 0 && quiz.attemptsUsed >= quiz.maxAttempts) {
      return { ok: false, reason: `Bạn đã dùng hết ${quiz.maxAttempts} lượt làm bài` }
    }
    if (quiz.questionCount === 0) return { ok: false, reason: 'Bài kiểm tra chưa có câu hỏi' }
    return { ok: true, reason: null }
  },

  async start(courseId: string, quiz: QuizInfo): Promise<QuizSession> {
    if (isDemoMode()) {
      const course = LEARNING_CONFIG.demo[courseId]
      if (!course) throw new ApiError('NOT_FOUND', 'Không tìm thấy bài kiểm tra')
      const startedAt = Date.now()
      const durationSec = Math.round(quiz.durationMin * 60)
      return delay({
        attemptId: `demo-${startedAt}`,
        courseId,
        quizId: quiz.id,
        title: quiz.title,
        questions: course.questions.map((q) => ({ id: q.id, text: q.text, type: q.type, options: q.options })),
        startedAt,
        durationSec,
        deadline: durationSec > 0 ? startedAt + durationSec * 1000 : null,
        passScore: quiz.passScore
      })
    }
    const raw = await startQuizRequest(courseId)
    try {
      return toQuizSession(raw, { courseId, quiz })
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu đề thi không hợp lệ')
    }
  },

  timeSpent(session: QuizSession): number {
    const s = Math.max(0, Math.round((Date.now() - session.startedAt) / 1000))
    return session.durationSec > 0 ? Math.min(s, session.durationSec) : s
  },

  async submit(session: QuizSession, answers: QuizAnswers): Promise<QuizResult> {
    const timeSpentSec = quizService.timeSpent(session)

    if (isDemoMode()) {
      const course = LEARNING_CONFIG.demo[session.courseId]
      if (!course) throw new ApiError('NOT_FOUND', 'Không tìm thấy bài kiểm tra')
      const key = Object.fromEntries(course.questions.map((q) => [q.id, q.correct]))
      const g = scoringService.grade(session.questions, answers, key, session.passScore)
      lessonService.recordDemoAttempt(session.courseId, g.score)
      const result: QuizResult = {
        attemptId: session.attemptId,
        courseId: session.courseId,
        score: g.score,
        correctCount: g.correctCount,
        total: g.total,
        passed: g.passed,
        passScore: session.passScore,
        timeSpentSec,
        certificateCode: g.passed ? generateCertificateCode() : null,
        submittedAt: new Date().toISOString()
      }
      demoAttemptLog.push({
        result,
        courseTitle: course.content.title,
        questions: session.questions,
        answers: structuredClone(answers),
        key
      })
      return delay(result)
    }

    const raw = await submitQuizRequest({
      attemptId: session.attemptId,
      courseId: session.courseId,
      answers,
      timeSpentSec
    })
    try {
      return toQuizResult(raw, { session, timeSpentSec })
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu kết quả không hợp lệ')
    }
  }
}