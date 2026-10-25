import type { Role } from '@/shared/constants/roles'

export interface RoleCount {
  role: Role
  count: number
}

export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalCertificates: number
  roleDistribution: RoleCount[]
}

export interface DeptStat {
  departmentId: string
  departmentName: string
  staffCount: number
  /** 0–100 */
  activeRate: number
  /** 0–100 */
  completionRate: number
}

export type DeptSortKey = 'departmentName' | 'staffCount' | 'activeRate' | 'completionRate'

export interface RoleSlice {
  role: Role
  label: string
  value: number
  color: string
}