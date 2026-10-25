import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => false)
}))

vi.mock('../../api/queries', () => ({
  fetchReportOverview: vi.fn(async () => ({
    stats: { total_users: 2, total_courses: 1, total_enrollments: 2, total_certificates: 1 },
    staff: [
      { user_id: 'a', full_name: 'A', email: 'a@sbv.gov.vn', department_id: 'P2', department_name: 'Phòng B', role: 'HOC_VIEN', completed_courses: 1, enrolled_courses: 1, average_score: 90, completion_rate: 100 },
      { user_id: 'b', full_name: 'B', email: 'b@sbv.gov.vn', department_id: 'P1', department_name: 'Phòng A', role: 'LEARNER', completion_rate: 0 }
    ]
  }))
}))

import ExcelJS from 'exceljs'
import { isDemoMode } from '@/features/auth'
import { reportService } from '../../services/reportService'
import { exportService } from '../../services/exportService'

describe('Luồng Báo cáo thống kê', () => {
  beforeEach(() => vi.mocked(isDemoMode).mockReturnValue(false))

  it('API thiếu departments → tự tính, sắp theo mã phòng', async () => {
    const r = await reportService.getReport()
    expect(r.departments.map((d) => [d.departmentId, d.completionRate])).toEqual([
      ['P1', 0],
      ['P2', 100]
    ])
    expect(r.roles.find((x) => x.role === 'LEARNER')?.value).toBe(2)
  })

  it('demo → 9 công chức, 7 nhóm phòng/ban', async () => {
    vi.mocked(isDemoMode).mockReturnValue(true)
    const r = await reportService.getReport()
    expect(r.staff).toHaveLength(9)
    expect(r.departments).toHaveLength(7)
  })

  it('file Excel có 3 sheet + đúng số dòng', async () => {
    vi.mocked(isDemoMode).mockReturnValue(true)
    const r = await reportService.getReport()
    const buffer = await exportService.buildWorkbookBuffer({
      stats: r.stats,
      staff: r.staff,
      departments: r.departments,
      filterSummary: ['Phòng/Ban: Tất cả'],
      generatedAt: new Date(2026, 6, 2)
    })
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.load(buffer)
    expect(wb.worksheets.map((w) => w.name)).toEqual(['Tong hop', 'Cong chuc', 'Phong ban'])
    expect(wb.getWorksheet('Cong chuc')?.rowCount).toBe(10)
    expect(wb.getWorksheet('Cong chuc')?.getCell('B2').value).toBe('Quản trị viên')
    expect(wb.getWorksheet('Phong ban')?.getCell('D3').value).toBe(67)
  })
})