import { toRole } from '@/features/auth'
import { emptyToNull, toKey } from '../lib/utils'
import { STATUS_ALIASES } from '../model/constants'
import { rawCreatedUserSchema, rawDepartmentOptionSchema, rawUserSchema, type RawUser } from '../model/schemas'
import type { AdminUser, CreatedUser, DepartmentOption, UserInput, UserStatus } from '../model/types'

export const toUserStatus = (raw: unknown): UserStatus => STATUS_ALIASES[toKey(raw)] ?? 'PENDING'

export const toUser = (r: RawUser): AdminUser => ({
  id: String(r.id),
  code: r.code,
  fullName: r.full_name.trim(),
  email: r.email.trim().toLowerCase(),
  phone: r.phone,
  departmentId: r.department_id,
  departmentName: r.department_name,
  role: toRole(r.role),
  status: toUserStatus(r.status),
  createdAt: r.created_at,
  lastLoginAt: r.last_login_at
})

export const toUsers = (input: unknown): AdminUser[] => rawUserSchema.array().parse(input).map(toUser)
export const toUserOne = (input: unknown): AdminUser => toUser(rawUserSchema.parse(input))

export const toCreatedUser = (input: unknown): CreatedUser => {
  const raw = rawCreatedUserSchema.parse(input)
  return { user: toUser(raw.user), temporaryPassword: raw.temporary_password }
}

export const toDepartmentOptions = (input: unknown): DepartmentOption[] =>
  rawDepartmentOptionSchema
    .array()
    .parse(input)
    .map((d) => ({ id: String(d.id), code: d.code.trim() || String(d.id), name: d.name.trim() }))

export const toUserPayload = (input: UserInput): Record<string, unknown> => ({
  full_name: input.fullName.trim(),
  email: input.email.trim().toLowerCase(),
  code: emptyToNull(input.code),
  phone: emptyToNull(input.phone),
  department_id: emptyToNull(input.departmentId),
  role: input.role,
  status: input.status
})