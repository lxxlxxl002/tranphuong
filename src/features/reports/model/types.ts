import type { Role } from '@/shared/constants/roles'

export type RateFilter = 'ALL' | 'DONE' | 'PARTIAL' | 'NONE'
export type RoleFilter = 'ALL' | Role

export interface StaffReport {
  userId: string
  fullName: string
  email: string
  departmentId: string | null
  departmentName: string
  role: Role
  completedCourses: number
  enrolledCourses: number
  averageScore: number | null
  /** 0–100 */
  completionRate: number
}

export interface ReportStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalCertificates: number
}

export interface DeptReport {
  departmentId: string | null
  departmentName: string
  staffCount: number
  /** % công chức đã hoàn thành toàn bộ khóa được giao */
  completionRate: number
}

export interface RoleSlice {
  role: Role
  label: string
  value: number
  color: string
}

export interface ReportData {
  stats: ReportStats
  staff: StaffReport[]
  departments: DeptReport[]
  roles: RoleSlice[]
}

export interface ReportFilterState {
  /** 'ALL' | departmentId | NO_DEPT */
  departmentId: string
  role: RoleFilter
  rate: RateFilter
}

export interface ExportInput {
  stats: ReportStats
  staff: StaffReport[]
  departments: DeptReport[]
  filterSummary: string[]
  generatedAt: Date
}