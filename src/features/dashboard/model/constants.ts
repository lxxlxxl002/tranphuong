import type { DeptSortKey } from './types'

export const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard'] as const,
  stats: ['dashboard', 'stats'] as const,
  deptStats: ['dashboard', 'dept-stats'] as const
}

export const DEPT_SORT_LABELS: Record<DeptSortKey, string> = {
  departmentName: 'Phòng / Ban',
  staffCount: 'Số công chức',
  activeRate: 'Hoạt động',
  completionRate: 'Hoàn thành'
}

export const UNASSIGNED_DEPT = '(Chưa phân phòng)'