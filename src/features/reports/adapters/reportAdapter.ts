import { toRole } from '@/features/auth'
import { normalizeRate } from '../lib/utils'
import { NO_DEPT_LABEL } from '../model/constants'
import { rawReportSchema, type RawDept, type RawStaff } from '../model/schemas'
import type { DeptReport, ReportStats, StaffReport } from '../model/types'

export const toStaff = (r: RawStaff): StaffReport => {
  const enrolled = Math.max(0, Math.round(r.enrolled_courses))
  const completed = Math.max(0, Math.round(r.completed_courses))
  return {
    userId: String(r.user_id),
    fullName: r.full_name.trim(),
    email: r.email.trim(),
    departmentId: r.department_id == null || r.department_id === '' ? null : String(r.department_id),
    departmentName: r.department_name ?? '',
    role: toRole(r.role),
    completedCourses: completed,
    enrolledCourses: Math.max(enrolled, completed),
    averageScore: r.average_score == null ? null : Math.max(0, Math.min(100, Math.round(r.average_score * 10) / 10)),
    completionRate: normalizeRate(r.completion_rate)
  }
}

export const toDept = (r: RawDept): DeptReport => ({
  departmentId: r.department_id == null || r.department_id === '' ? null : String(r.department_id),
  departmentName: r.department_name ?? NO_DEPT_LABEL,
  staffCount: Math.max(0, Math.round(r.staff_count)),
  completionRate: normalizeRate(r.completion_rate)
})

export const toReportPayload = (input: unknown): { stats: ReportStats; staff: StaffReport[]; departments: DeptReport[] | null } => {
  const raw = rawReportSchema.parse(input)
  return {
    stats: {
      totalUsers: Math.round(raw.stats.total_users),
      totalCourses: Math.round(raw.stats.total_courses),
      totalEnrollments: Math.round(raw.stats.total_enrollments),
      totalCertificates: Math.round(raw.stats.total_certificates)
    },
    staff: raw.staff.map(toStaff),
    departments: raw.departments ? raw.departments.map(toDept) : null
  }
}