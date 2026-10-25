import type { Role } from '@/shared/constants/roles'

export interface Department {
  id: string
  code: string
  name: string
  leaderId: string | null
  leaderName: string | null
  staffCount: number
  description: string | null
  createdAt: string | null
}

export interface DepartmentInput {
  code: string
  name: string
  /** '' = chưa có lãnh đạo */
  leaderId: string
  description: string
}

export type DepartmentErrors = Partial<Record<keyof DepartmentInput, string>>

export interface LeaderCandidate {
  id: string
  fullName: string
  role: Role
  departmentId: string | null
}

export interface DeleteCheck {
  ok: boolean
  reason: string | null
}