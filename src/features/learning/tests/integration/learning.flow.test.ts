import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => true)
}))

vi.mock('../../api/queries', () => ({ fetchCourseContent: vi.fn() }))

vi.mock('../../api/mutations', () => ({
  completeLessonRequest: vi.fn(async () => undefined),
  startQuizRequest: vi.fn(async () => ({
    attempt_id: 'att-1',
    started_at: '2026-07-02T08:00:00Z',
    duration_sec: 600,
    questions: [{ id: 1, text: 'Câu 1', type: 'single', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }] }]
  })),
  submitQuizRequest: vi.fn(async () => ({
    attempt_id: 'att-1',
    score: '94',
    correct_count: 14,
    total: 15,
    certificate_code: 'QLGS-2026-161451'
  }))
}))

import { isDemoMode } from '@/features/auth'
import { completeLessonRequest, submitQuizRequest } from '../../api/mutations'
import { lessonService, resetDemoState } from '../../services/lessonService'
import { quizService } from '../../services/quizService'
import { LEARNING_CONFIG } from '../../config/learning.config'
import type { QuizInfo } from '../../model/types'

describe('Luồng học + kiểm tra', () => {
  beforeEach(() => {
    resetDemoState()
    vi.mocked(isDemoMode).mockReturnValue(true)
    vi.mocked(completeLessonRequest).mockClear()
    vi.mocked(submitQuizRequest).mockClear()
  })

  it('demo: tải nội dung + đánh dấu hoàn thành được ghi nhớ', async () => {
    const c = await lessonService.getCourseContent('basel-2')
    expect(c.lessons).toHaveLength(4)
    await lessonService.completeLesson('basel-2', 'b2-l1')
    const c2 = await lessonService.getCourseContent('basel-2')
    expect(c2.lessons[0].completed).toBe(true)
    expect(completeLessonRequest).not.toHaveBeenCalled()
  })

  it('demo: đề không lộ đáp án, làm đúng hết → 100 điểm + tăng lượt làm', async () => {
    const c = await lessonService.getCourseContent('chuyen-doi-so')
    const session = await quizService.start('chuyen-doi-so', c.quiz!)
    expect(session.questions[0]).not.toHaveProperty('correct')
    const answers = Object.fromEntries(LEARNING_CONFIG.demo['chuyen-doi-so'].questions.map((q) => [q.id, q.correct]))
    const result = await quizService.submit(session, answers)
    expect(result).toMatchObject({ score: 100, passed: true, correctCount: 5, total: 5 })
    expect(result.certificateCode).toMatch(/^QLGS-\d{4}-\d{6}$/)
    const after = await lessonService.getCourseContent('chuyen-doi-so')
    expect(after.quiz).toMatchObject({ attemptsUsed: 2, bestScore: 100 })
  })

  it('API: bắt đầu + nộp bài map đúng dữ liệu', async () => {
    vi.mocked(isDemoMode).mockReturnValue(false)
    const quiz: QuizInfo = { id: 'q', title: 'Bài kiểm tra', questionCount: 1, durationMin: 10, passScore: 70, maxAttempts: 3, attemptsUsed: 0, bestScore: null }
    const session = await quizService.start('c1', quiz)
    expect(session.deadline).toBe(Date.parse('2026-07-02T08:00:00Z') + 600_000)
    expect(session.questions[0].id).toBe('1')
    const result = await quizService.submit(session, { '1': ['a'] })
    expect(submitQuizRequest).toHaveBeenCalledWith(
      expect.objectContaining({ attemptId: 'att-1', courseId: 'c1', answers: { '1': ['a'] }, timeSpentSec: 600 })
    )
    expect(result).toMatchObject({ score: 94, correctCount: 14, total: 15, passed: true, certificateCode: 'QLGS-2026-161451' })
  })
})