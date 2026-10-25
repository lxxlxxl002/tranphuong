import type { Role } from '@/shared/constants/roles'

export type UserStatus = 'ACTIVE' | 'PENDING' | 'LOCKED'
export type StatusFilter = 'ALL' | UserStatus
export type RoleFilter = 'ALL' | Role

export interface AdminUser {
  id: string
  code: string | null
  fullName: string
  email: string
  phone: string | null
  departmentId: string | null
  departmentName: string | null
  role: Role
  status: UserStatus
  createdAt: string | null
  lastLoginAt: string | null
}

export interface DepartmentOption {
  id: string
  code: string
  name: string
}

export interface UserInput {
  fullName: string
  email: string
  code: string
  phone: string
  /** '' = chưa phân phòng */
  departmentId: string
  role: Role
  status: UserStatus
}

export type UserErrors = Partial<Record<keyof UserInput, string>>

export interface UserFilterState {
  role: RoleFilter
  status: StatusFilter
  search: string
}

export interface UserStats {
  total: number
  active: number
  pending: number
  locked: number
}

export interface CreatedUser {
  user: AdminUser
  temporaryPassword: string | null
}

export interface ImportUserRow {
  row: number
  preview: string
  email: string
  input: UserInput | null
  errors: string[]
}