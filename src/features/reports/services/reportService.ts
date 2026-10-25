import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { ROLE_META, ROLE_ORDER, roleLabel } from '@/shared/constants/roles'
import type { Option } from '@/shared/types/common'
import { fetchReportOverview } from '../api/queries'
import { toReportPayload } from '../adapters/reportAdapter'
import { REPORTS_CONFIG } from '../config/reports.config'
import { NO_DEPT, NO_DEPT_LABEL, RATE_OPTIONS } from '../model/constants'
import type { DeptReport, RateFilter, ReportData, ReportFilterState, RoleSlice, StaffReport } from '../model/types'

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), REPORTS_CONFIG.demoDelayMs))

export const reportService = {
  async getReport(): Promise<ReportData> {
    if (isDemoMode()) {
      const { stats, staff } = await delay(REPORTS_CONFIG.demo)
      return { stats, staff, departments: reportService.computeDepartments(staff), roles: reportService.buildRoleSlices(staff) }
    }
    const raw = await fetchReportOverview()
    let payload: ReturnType<typeof toReportPayload>
    try {
      payload = toReportPayload(raw)
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu báo cáo không hợp lệ')
    }
    return {
      stats: payload.stats,
      staff: payload.staff,
      departments: payload.departments ?? reportService.computeDepartments(payload.staff),
      roles: reportService.buildRoleSlices(payload.staff)
    }
  },

  /** Nhóm theo phòng: chưa phân phòng lên đầu, còn lại theo mã phòng */
  computeDepartments(staff: StaffReport[]): DeptReport[] {
    const groups = new Map<string, { id: string | null; name: string; total: number; done: number }>()
    for (const s of staff) {
      const key = s.departmentId ?? NO_DEPT
      const g = groups.get(key) ?? { id: s.departmentId, name: s.departmentId ? s.departmentName : NO_DEPT_LABEL, total: 0, done: 0 }
      g.total++
      if (s.completionRate >= 100) g.done++
      groups.set(key, g)
    }
    return [...groups.values()]
      .sort((a, b) => (a.id == null ? -1 : b.id == null ? 1 : a.id.localeCompare(b.id, 'vi', { numeric: true })))
      .map((g) => ({
        departmentId: g.id,
        departmentName: g.name,
        staffCount: g.total,
        completionRate: g.total ? Math.round((g.done / g.total) * 100) : 0
      }))
  },

  buildRoleSlices(staff: StaffReport[]): RoleSlice[] {
    return ROLE_ORDER.map((role) => ({
      role,
      label: ROLE_META[role].label,
      value: staff.filter((s) => s.role === role).length,
      color: ROLE_META[role].color
    }))
  },

  rateBucket(rate: number): Exclude<RateFilter, 'ALL'> {
    if (rate >= 100) return 'DONE'
    if (rate > 0) return 'PARTIAL'
    return 'NONE'
  },

  filterStaff(staff: StaffReport[], f: ReportFilterState): StaffReport[] {
    return staff.filter(
      (s) =>
        (f.departmentId === 'ALL' || (s.departmentId ?? NO_DEPT) === f.departmentId) &&
        (f.role === 'ALL' || s.role === f.role) &&
        (f.rate === 'ALL' || reportService.rateBucket(s.completionRate) === f.rate)
    )
  },

  departmentOptions(departments: DeptReport[]): Option<string>[] {
    return [
      { value: 'ALL', label: 'Tất cả phòng ban' },
      ...departments.map((d) => ({ value: d.departmentId ?? NO_DEPT, label: d.departmentName }))
    ]
  },

  roleOptions(): Option<string>[] {
    return [{ value: 'ALL', label: 'Tất cả vai trò' }, ...ROLE_ORDER.map((r) => ({ value: r, label: roleLabel(r) }))]
  },

  /** Mô tả bộ lọc đang áp dụng (in vào file xuất) */
  describeFilters(f: ReportFilterState, departments: DeptReport[]): string[] {
    const dept = f.departmentId === 'ALL' ? 'Tất cả' : departments.find((d) => (d.departmentId ?? NO_DEPT) === f.departmentId)?.departmentName ?? f.departmentId
    const role = f.role === 'ALL' ? 'Tất cả' : roleLabel(f.role)
    const rate = RATE_OPTIONS.find((o) => o.value === f.rate)?.label ?? 'Tất cả'
    return [`Phòng/Ban: ${dept}`, `Vai trò: ${role}`, `Tỷ lệ hoàn thành: ${f.rate === 'ALL' ? 'Tất cả' : rate}`]
  }
}