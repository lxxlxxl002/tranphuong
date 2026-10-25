import { isRole, ROLES, type Role } from '@/shared/constants/roles'
import { ALL_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'
import { normalizeText } from '@/shared/lib/format'
import { ROLE_ALIASES } from '../model/constants'
import { rawLoginSchema, rawMeSchema, type RawUser } from '../model/schemas'
import type { Session, SessionUser } from '../model/types'

const VALID_PERMISSIONS = new Set<string>(ALL_PERMISSIONS)

export const toRole = (raw: unknown): Role => {
  const key = normalizeText(String(raw ?? ''))
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
  if (isRole(key)) return key
  return ROLE_ALIASES[key] ?? ROLES.LEARNER
}

export const toPermissions = (raw: unknown, role: Role): PermissionKey[] => {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_ROLE_PERMISSIONS[role]
  return raw.map(String).filter((p): p is PermissionKey => VALID_PERMISSIONS.has(p))
}

export const toSessionUser = (raw: RawUser): SessionUser => ({
  id: String(raw.id),
  code: raw.code ?? undefined,
  fullName: raw.full_name || raw.name || raw.email,
  email: raw.email,
  role: toRole(raw.role),
  departmentId: raw.department_id == null ? null : String(raw.department_id),
  departmentName: raw.department_name ?? null,
  avatarUrl: raw.avatar_url ?? null
})

export const toSession = (input: unknown): Session => {
  const raw = rawLoginSchema.parse(input)
  const user = toSessionUser(raw.user)
  return {
    token: raw.token,
    user,
    permissions: toPermissions(raw.permissions, user.role),
    expiresAt: raw.expires_at ?? null
  }
}

export const toMe = (input: unknown): { user: SessionUser; permissions: PermissionKey[] } => {
  const raw = rawMeSchema.parse(input)
  const user = toSessionUser(raw.user)
  return { user, permissions: toPermissions(raw.permissions, user.role) }
}