import { roleInputSchema } from '../model/schemas'
import { RESERVED_KEYS } from '../model/constants'
import type { RoleErrors, RoleInput } from '../model/types'

export const validateRoleInput = (input: RoleInput, existingKeys: string[], isEdit: boolean): RoleErrors => {
  const r = roleInputSchema.safeParse(input)
  const errors: RoleErrors = {}
  if (!r.success) {
    for (const issue of r.error.issues) {
      const k = issue.path[0] as keyof RoleInput | undefined
      if (k && !errors[k]) errors[k] = issue.message
    }
  }
  if (!isEdit && !errors.key) {
    if (RESERVED_KEYS.includes(input.key)) errors.key = 'Mã này dành cho vai trò hệ thống'
    else if (existingKeys.includes(input.key)) errors.key = `Mã ${input.key} đã tồn tại`
  }
  return errors
}

export const hasErrors = (e: object): boolean => Object.values(e).some(Boolean)