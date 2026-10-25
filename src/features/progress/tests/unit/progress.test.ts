import { describe, expect, it } from 'vitest'
import { toProgressPayload } from '../../adapters/progressAdapter'
import { progressService } from '../../services/progressService'
import { PROGRESS_CONFIG } from '../../config/progress.config'
import { average, formatAverage, normalizePercent } from '../../lib/utils'

describe('progressAdapter', () => {
  it('nhận cả mảng lẫn { summary, courses }', () => {
    const a = toProgressPayload([{ course_id: 1, title: 'A', progress: 0.5, lessons_total: 4, lessons_done: 2 }])
    expect(a.summary).toBeNull()
    expect(a.courses[0]).toMatchObject({ courseId: '1', percent: 50, status: 'IN_PROGRESS' })

    const b = toProgressPayload({ summary: { average_score: '88.5' }, courses: [{ id: 'x', title: 'B', status: 'Hoàn thành' }] })
    expect(b.summary?.average_score).toBe(88.5)
    expect(b.courses[0]).toMatchObject({ status: 'COMPLETED', percent: 100 })
  })

  it('chặn lessons_done vượt tổng', () => {
    const { courses } = toProgressPayload([{ id: 1, title: 'A', lessons_total: 3, lessons_done: 9 }])
    expect(courses[0].lessonsDone).toBe(3)
  })
})

describe('progressService', () => {
  it('tổng hợp đúng như màn hình mẫu: 33% · 0/0 · 1/1 · 94.0', () => {
    const s = progressService.computeSummary(PROGRESS_CONFIG.demo.courses)
    expect(s).toEqual({
      overallPercent: 33,
      totalStudySec: null,
      lessonsDone: 0,
      lessonsTotal: 0,
      quizzesTaken: 1,
      quizzesPassed: 1,
      averageScore: 94
    })
    expect(formatAverage(s.averageScore)).toBe('94.0/100')
  })

  it('số liệu backend được ưu tiên', () => {
    const computed = progressService.computeSummary(PROGRESS_CONFIG.demo.courses)
    const merged = progressService.mergeSummary(computed, {
      overall_percent: null,
      total_study_sec: 5400,
      lessons_done: null,
      lessons_total: null,
      quizzes_taken: null,
      quizzes_passed: null,
      average_score: null
    })
    expect(merged.totalStudySec).toBe(5400)
    expect(merged.overallPercent).toBe(33)
  })

  it('sắp xếp theo trạng thái: hoàn thành trước chưa bắt đầu, cùng nhóm theo tên', () => {
    const sorted = progressService.sortCourses(PROGRESS_CONFIG.demo.courses, 'status')
    expect(sorted.map((c) => c.courseId)).toEqual(['chuyen-doi-so', 'cong-tac-giam-sat', 'basel-2'])
  })

  it('tiện ích', () => {
    expect(normalizePercent(0.333)).toBe(33)
    expect(average([90, 95])).toBe(92.5)
    expect(average([])).toBeNull()
  })
})