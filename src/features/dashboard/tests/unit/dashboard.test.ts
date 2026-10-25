import { describe, expect, it } from 'vitest'
import { toDashboardStats, toDeptStats } from '../../adapters/dashboardAdapter'
import { dashboardService } from '../../services/dashboardService'
import { normalizeRate } from '../../lib/utils'
import type { DeptStat } from '../../model/types'

describe('dashboardAdapter', () => {
  it('ép kiểu số từ Google Sheets + gộp vai trò trùng', () => {
    const s = toDashboardStats({
      total_users: '9',
      total_courses: 3,
      total_enrollments: '8',
      total_certificates: 4,
      role_distribution: [
        { role: 'Quản trị viên', count: 1 },
        { role: 'HOC_VIEN', count: '3' },
        { role: 'LEARNER', count: 2 },
        { role: 'giang_vien', count: 2 },
        { role: 'Lãnh đạo phòng', count: 1 }
      ]
    })
    expect(s.totalUsers).toBe(9)
    expect(s.roleDistribution.find((r) => r.role === 'LEARNER')?.count).toBe(5)
  })

  it('chuẩn hóa tỷ lệ 0–1 và 0–100', () => {
    expect(normalizeRate(0.33)).toBe(33)
    expect(normalizeRate(67)).toBe(67)
    expect(normalizeRate(150)).toBe(100)
    expect(normalizeRate(-5)).toBe(0)
  })

  it('map phòng/ban', () => {
    const [d] = toDeptStats([
      { department_id: 'P1', department_name: 'Phòng Tổng hợp và chính sách', staff_count: '3', active_rate: 0, completion_rate: 1 }
    ])
    expect(d).toEqual({
      departmentId: 'P1',
      departmentName: 'Phòng Tổng hợp và chính sách',
      staffCount: 3,
      activeRate: 0,
      completionRate: 100
    })
  })
})

describe('dashboardService', () => {
  it('biểu đồ vai trò luôn đủ 4 nhóm theo thứ tự chuẩn', () => {
    const chart = dashboardService.buildRoleChart({
      totalUsers: 6,
      totalCourses: 0,
      totalEnrollments: 0,
      totalCertificates: 0,
      roleDistribution: [
        { role: 'LEARNER', count: 5 },
        { role: 'ADMIN', count: 1 }
      ]
    })
    expect(chart.map((c) => c.label)).toEqual(['Quản trị viên', 'Lãnh đạo phòng', 'Giảng viên', 'Học viên'])
    expect(chart.map((c) => c.value)).toEqual([1, 0, 0, 5])
  })

  it('sắp xếp phòng/ban theo tỷ lệ hoàn thành', () => {
    const list: DeptStat[] = [
      { departmentId: 'a', departmentName: 'A', staffCount: 1, activeRate: 0, completionRate: 33 },
      { departmentId: 'b', departmentName: 'B', staffCount: 3, activeRate: 0, completionRate: 100 }
    ]
    const desc = dashboardService.sortDeptStats(list, { key: 'completionRate', dir: 'desc' })
    expect(desc.map((d) => d.departmentId)).toEqual(['b', 'a'])
    expect(dashboardService.summarize(list)).toEqual({ departments: 2, staff: 4, avgCompletion: 83 })
  })
})