import { describe, expect, it } from 'vitest'
import { toAttemptDetail, toAttempts } from '../../adapters/resultAdapter'
import { resultService } from '../../services/resultService'
import { EXAM_RESULTS_CONFIG } from '../../config/exam-results.config'

describe('resultAdapter', () => {
  it('ép kiểu + suy ra Đạt khi thiếu cờ passed', () => {
    const [a] = toAttempts([
      { attempt_id: 9, course_id: 'c', course_title: 'CHUYỂN ĐỔI SỐ', submitted_at: '2026-07-02', score: '94', correct_count: '14', total: '15' }
    ])
    expect(a).toMatchObject({ attemptId: '9', score: 94, passScore: 70, passed: true, correctCount: 14, total: 15 })
  })

  it('cờ passed tiếng Việt được ưu tiên', () => {
    const [a] = toAttempts([{ attempt_id: 1, course_id: 'c', score: 90, passed: 'Không đạt', correct_count: 9, total: 10 }])
    expect(a.passed).toBe(false)
  })

  it('đáp án dạng chuỗi "a,b" + thứ tự câu', () => {
    const d = toAttemptDetail({
      attempt_id: 1,
      course_id: 'c',
      course_title: 'X',
      score: 50,
      correct_count: 1,
      total: 2,
      questions: [
        { id: 'q2', order: 2, text: 'Câu 2', type: 'multi', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], selected: 'a', correct: 'a,b' },
        { id: 'q1', order: 1, text: 'Câu 1', options: [{ id: 'a', text: 'A' }], selected: ['a'], correct: ['a'] }
      ]
    })
    expect(d.questions.map((q) => q.id)).toEqual(['q1', 'q2'])
    expect(d.questions[1]).toMatchObject({ type: 'MULTIPLE', correct: ['a', 'b'], isCorrect: false })
    expect(d.questions[0].isCorrect).toBe(true)
  })
})

describe('resultService', () => {
  const sample = EXAM_RESULTS_CONFIG.demo.attempts[0]

  it('bài mẫu khớp màn hình: 14 đúng / 1 sai', () => {
    expect(resultService.countOutcomes(sample.questions)).toEqual({ ALL: 15, CORRECT: 14, WRONG: 1, SKIPPED: 0 })
    expect(resultService.filterQuestions(sample.questions, 'WRONG').map((q) => q.order)).toEqual([4])
  })

  it('câu không chọn → Bỏ trống', () => {
    expect(resultService.outcomeOf({ ...sample.questions[0], selected: [] })).toBe('SKIPPED')
  })

  it('lọc Đạt / Không đạt + sắp mới nhất', () => {
    const list = [
      { ...sample, attemptId: 'old', submittedAt: '2026-06-01', passed: false },
      { ...sample, attemptId: 'new', submittedAt: '2026-07-10' }
    ]
    expect(resultService.sortNewest(list).map((a) => a.attemptId)).toEqual(['new', 'old'])
    expect(resultService.filterAttempts(list, 'FAILED').map((a) => a.attemptId)).toEqual(['old'])
  })
})