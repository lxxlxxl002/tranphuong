import type { Role } from '@/shared/constants/roles'
import type { PermissionKey } from '@/shared/constants/permissions'

export interface SessionUser {
  id: string
  code?: string
  fullName: string
  email: string
  role: Role
  departmentId: string | null
  departmentName: string | null
  avatarUrl?: string | null
}

export interface Session {
  token: string
  user: SessionUser
  permissions: PermissionKey[]
  expiresAt?: string | null
}

export interface PersistedSession {
  user: SessionUser
  permissions: PermissionKey[]
}

export type AuthStatus = 'authenticated' | 'unauthenticated'

export interface LoginInput {
  email: string
  password: string
  remember?: boolean
}