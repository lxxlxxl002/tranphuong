import { describe, expect, it } from 'vitest'
import { toReportPayload } from '../../adapters/reportAdapter'
import { reportService } from '../../services/reportService'
import { REPORTS_CONFIG } from '../../config/reports.config'
import { exportFileName, normalizeRate } from '../../lib/utils'

const staff = REPORTS_CONFIG.demo.staff

describe('reportAdapter', () => {
  it('ép kiểu + vai trò tiếng Việt + phòng rỗng → null', () => {
    const p = toReportPayload({
      stats: { total_users: '9', total_courses: 3, total_enrollments: 8, total_certificates: 4 },
      staff: [{ user_id: 1, full_name: 'A', email: 'a@x', department_id: '', role: 'Giảng viên', completed_courses: '1', average_score: '82.46', completion_rate: 0.333 }]
    })
    expect(p.stats.totalUsers).toBe(9)
    expect(p.staff[0]).toMatchObject({ userId: '1', departmentId: null, role: 'LECTURER', averageScore: 82.5, completionRate: 33, enrolledCourses: 1 })
    expect(p.departments).toBeNull()
  })
})

describe('reportService', () => {
  it('thống kê phòng/ban khớp màn hình mẫu', () => {
    const d = reportService.computeDepartments(staff)
    expect(d.map((x) => [x.departmentName, x.staffCount, x.completionRate])).toEqual([
      ['(Chưa phân phòng)', 1, 0],
      ['Phòng Tổng hợp và chính sách', 3, 67],
      ['Phòng Quản lý, giám sát NHTMNN', 1, 0],
      ['Phòng QLGS NHNNg, TCTD hợp tác và tổ chức khác', 1, 0],
      ['Phòng Quản lý, giám sát NHTMCP1', 1, 0],
      ['Phòng Quản lý, giám sát NHTMCP2', 1, 0],
      ['Phòng Quản lý, giám sát TCTD phi NH', 1, 0]
    ])
  })

  it('phân bổ vai trò 1 / 1 / 2 / 5', () => {
    expect(reportService.buildRoleSlices(staff).map((r) => r.value)).toEqual([1, 1, 2, 5])
  })

  it('lọc kết hợp phòng + vai trò + tỷ lệ', () => {
    expect(reportService.filterStaff(staff, { departmentId: 'P1', role: 'ALL', rate: 'ALL' })).toHaveLength(3)
    expect(reportService.filterStaff(staff, { departmentId: 'P1', role: 'LEARNER', rate: 'DONE' }).map((s) => s.fullName)).toEqual(['Vũ Hoài Thanh'])
    expect(reportService.filterStaff(staff, { departmentId: '__none__', role: 'ALL', rate: 'PARTIAL' }).map((s) => s.fullName)).toEqual(['Quản trị viên'])
    expect(reportService.filterStaff(staff, { departmentId: 'ALL', role: 'ALL', rate: 'NONE' })).toHaveLength(5)
  })

  it('mô tả bộ lọc + tên file', () => {
    const depts = reportService.computeDepartments(staff)
    expect(reportService.describeFilters({ departmentId: 'P1', role: 'LEARNER', rate: 'DONE' }, depts)).toEqual([
      'Phòng/Ban: Phòng Tổng hợp và chính sách',
      'Vai trò: Học viên',
      'Tỷ lệ hoàn thành: Hoàn thành 100%'
    ])
    expect(exportFileName(new Date(2026, 6, 2, 9, 5))).toBe('Bao-cao-dao-tao-20260702-0905.xlsx')
    expect(normalizeRate(1.5)).toBe(2)
  })
})