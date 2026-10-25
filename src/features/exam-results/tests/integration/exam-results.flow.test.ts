import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => false)
}))

vi.mock('../../api/queries', () => ({
  fetchAttempts: vi.fn(async () => [
    { attempt_id: 'a1', course_id: 'c1', course_title: 'CHUYỂN ĐỔI SỐ', submitted_at: '2026-07-02T09:30:00Z', score: 94, correct_count: 14, total: 15 }
  ]),
  fetchAttemptDetail: vi.fn(async () => ({
    attempt_id: 'a1',
    course_id: 'c1',
    course_title: 'CHUYỂN ĐỔI SỐ',
    score: 94,
    correct_count: 1,
    total: 1,
    questions: [{ id: 'q1', text: 'Câu 1', options: [{ id: 'a', text: 'A' }], selected: ['a'], correct: [], is_correct: true }]
  }))
}))

import { isDemoMode } from '@/features/auth'
import { lessonService, quizService } from '@/features/learning'
import { resultService } from '../../services/resultService'

describe('Luồng Kết quả kiểm tra', () => {
  beforeEach(() => {
    vi.mocked(isDemoMode).mockReturnValue(false)
  })

  it('API: danh sách + chi tiết (đáp án ẩn, dựa vào is_correct)', async () => {
    const list = await resultService.getAttempts()
    expect(list[0]).toMatchObject({ attemptId: 'a1', passed: true })
    const detail = await resultService.getAttemptDetail('a1')
    expect(detail.questions[0]).toMatchObject({ correct: [], isCorrect: true })
  })

  it('demo: bài vừa làm ở feature learning xuất hiện trong lịch sử + xem được chi tiết', async () => {
    vi.mocked(isDemoMode).mockReturnValue(true)
    const content = await lessonService.getCourseContent('chuyen-doi-so')
    const session = await quizService.start('chuyen-doi-so', content.quiz!)
    const result = await quizService.submit(session, {})

    const list = await resultService.getAttempts()
    expect(list.map((a) => a.attemptId)).toContain(result.attemptId)
    expect(list.map((a) => a.attemptId)).toContain('demo-cds-1')

    const detail = await resultService.getAttemptDetail(result.attemptId)
    expect(resultService.countOutcomes(detail.questions).SKIPPED).toBe(session.questions.length)
  })

  it('demo: mã bài không tồn tại → NOT_FOUND', async () => {
    vi.mocked(isDemoMode).mockReturnValue(true)
    await expect(resultService.getAttemptDetail('khong-co')).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})