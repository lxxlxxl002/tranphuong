import type { PermissionAction, PermissionKey, PermissionModule } from '@/shared/constants/permissions'

export interface RoleDef {
  key: string
  name: string
  description: string | null
  /** Vai trò hệ thống: không xóa, không đổi mã */
  system: boolean
  /** Toàn quyền, không chỉnh quyền (ADMIN) */
  locked: boolean
  permissions: PermissionKey[]
  userCount: number
}

export interface RoleInput {
  key: string
  name: string
  description: string
  /** '' = không sao chép */
  cloneFrom: string
}

export type RoleErrors = Partial<Record<keyof RoleInput, string>>

export type ModuleState = 'all' | 'some' | 'none'

export interface PermissionRow {
  key: PermissionKey
  action: PermissionAction
  label: string
  granted: boolean
}

export interface PermissionGroup {
  module: PermissionModule
  label: string
  state: ModuleState
  rows: PermissionRow[]
}