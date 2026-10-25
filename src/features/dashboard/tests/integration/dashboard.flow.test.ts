import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => false)
}))

vi.mock('../../api/queries', () => ({
  fetchStats: vi.fn(async () => ({
    total_users: 9,
    total_courses: 3,
    total_enrollments: 8,
    total_certificates: 4,
    role_distribution: [{ role: 'ADMIN', count: 1 }]
  })),
  fetchDeptStats: vi.fn(async () => [
    { department_id: 'P1', department_name: 'Phòng Tổng hợp và chính sách', staff_count: 3, active_rate: 0, completion_rate: 100 }
  ])
}))

import { isDemoMode } from '@/features/auth'
import { fetchStats } from '../../api/queries'
import { dashboardService } from '../../services/dashboardService'

describe('Luồng dữ liệu Trang chủ', () => {
  beforeEach(() => {
    vi.mocked(isDemoMode).mockReturnValue(false)
    vi.mocked(fetchStats).mockClear()
  })

  it('gọi API và map dữ liệu thống kê', async () => {
    const s = await dashboardService.getStats()
    expect(fetchStats).toHaveBeenCalledOnce()
    expect(s.totalCertificates).toBe(4)
  })

  it('gọi API phòng/ban', async () => {
    const list = await dashboardService.getDeptStats()
    expect(list[0].completionRate).toBe(100)
  })

  it('phiên demo → dùng dữ liệu mẫu, không gọi API', async () => {
    vi.mocked(isDemoMode).mockReturnValue(true)
    const s = await dashboardService.getStats()
    expect(fetchStats).not.toHaveBeenCalled()
    expect(s.totalUsers).toBe(9)
  })

  it('dữ liệu hỏng → ApiError SERVER', async () => {
    vi.mocked(fetchStats).mockResolvedValueOnce({ foo: 1 })
    await expect(dashboardService.getStats()).rejects.toMatchObject({ code: 'SERVER' })
  })
})