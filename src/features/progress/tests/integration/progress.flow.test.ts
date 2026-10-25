import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => false)
}))

vi.mock('../../api/queries', () => ({
  fetchProgressOverview: vi.fn(async () => ({
    summary: { total_study_sec: 3600 },
    courses: [
      { course_id: 'c1', title: 'CHUYỂN ĐỔI SỐ', status: 'COMPLETED', progress: 100, lessons_total: 4, lessons_done: 4, study_sec: 2400, best_score: 94 },
      { course_id: 'c2', title: 'TÌM HIỂU VỀ BASEL II', status: 'DANG_HOC', progress: 25, lessons_total: 4, lessons_done: 1, study_sec: 1200 }
    ]
  }))
}))

import { isDemoMode } from '@/features/auth'
import { fetchProgressOverview } from '../../api/queries'
import { progressService } from '../../services/progressService'

describe('Luồng Tiến độ học tập', () => {
  beforeEach(() => {
    vi.mocked(isDemoMode).mockReturnValue(false)
    vi.mocked(fetchProgressOverview).mockClear()
  })

  it('API → map + tổng hợp + ưu tiên số liệu backend', async () => {
    const data = await progressService.getProgress()
    expect(fetchProgressOverview).toHaveBeenCalledOnce()
    expect(data.summary).toMatchObject({
      overallPercent: 50,
      totalStudySec: 3600,
      lessonsDone: 5,
      lessonsTotal: 8,
      quizzesTaken: 1,
      averageScore: 94
    })
    expect(data.courses[1].status).toBe('IN_PROGRESS')
  })

  it('phiên demo → dữ liệu mẫu', async () => {
    vi.mocked(isDemoMode).mockReturnValue(true)
    const data = await progressService.getProgress()
    expect(fetchProgressOverview).not.toHaveBeenCalled()
    expect(data.summary.overallPercent).toBe(33)
  })

  it('dữ liệu hỏng → ApiError SERVER', async () => {
    vi.mocked(fetchProgressOverview).mockResolvedValueOnce({ courses: [{ title: 'Thiếu id' }] })
    await expect(progressService.getProgress()).rejects.toMatchObject({ code: 'SERVER' })
  })
})