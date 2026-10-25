import { ALL_PERMISSIONS } from '@/shared/constants/permissions'
import { sortPermissions } from '../lib/utils'
import { ADMIN_KEY } from '../model/constants'
import { rawRoleSchema, type RawRole } from '../model/schemas'
import type { RoleDef } from '../model/types'

export const toRoleDef = (r: RawRole): RoleDef => {
  const key = r.key.trim().toUpperCase()
  const locked = key === ADMIN_KEY
  return {
    key,
    name: r.name.trim(),
    description: r.description,
    system: r.system || locked,
    locked,
    permissions: locked ? [...ALL_PERMISSIONS] : sortPermissions(r.permissions),
    userCount: Math.max(0, Math.round(r.user_count))
  }
}

export const toRoleDefs = (input: unknown): RoleDef[] => rawRoleSchema.array().parse(input).map(toRoleDef)
export const toRoleDefOne = (input: unknown): RoleDef => toRoleDef(rawRoleSchema.parse(input))