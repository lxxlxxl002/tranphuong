import { toRole } from '@/features/auth'
import type { Role } from '@/shared/constants/roles'
import { normalizeRate } from '../lib/utils'
import { UNASSIGNED_DEPT } from '../model/constants'
import { rawDeptStatsSchema, rawStatsSchema, type RawDeptStat } from '../model/schemas'
import type { DashboardStats, DeptStat } from '../model/types'

export const toDashboardStats = (input: unknown): DashboardStats => {
  const raw = rawStatsSchema.parse(input)
  const merged = new Map<Role, number>()
  for (const r of raw.role_distribution ?? []) {
    const role = toRole(r.role)
    merged.set(role, (merged.get(role) ?? 0) + Math.max(0, Math.round(r.count)))
  }
  return {
    totalUsers: Math.round(raw.total_users),
    totalCourses: Math.round(raw.total_courses),
    totalEnrollments: Math.round(raw.total_enrollments),
    totalCertificates: Math.round(raw.total_certificates),
    roleDistribution: [...merged].map(([role, count]) => ({ role, count }))
  }
}

export const toDeptStat = (r: RawDeptStat): DeptStat => ({
  departmentId: String(r.department_id),
  departmentName: r.department_name.trim() || UNASSIGNED_DEPT,
  staffCount: Math.max(0, Math.round(r.staff_count)),
  activeRate: normalizeRate(r.active_rate),
  completionRate: normalizeRate(r.completion_rate)
})

export const toDeptStats = (input: unknown): DeptStat[] => rawDeptStatsSchema.parse(input).map(toDeptStat)