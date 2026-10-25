import { departmentInputSchema } from '../model/schemas'
import { normalizeCode } from './utils'
import type { DepartmentErrors, DepartmentInput } from '../model/types'

/** existingCodes: mã các phòng khác (đã chuẩn hóa) để chặn trùng phía client */
export const validateDepartmentInput = (input: DepartmentInput, existingCodes: string[] = []): DepartmentErrors => {
  const normalized = { ...input, code: normalizeCode(input.code) }
  const r = departmentInputSchema.safeParse(normalized)
  const errors: DepartmentErrors = {}
  if (!r.success) {
    for (const issue of r.error.issues) {
      const key = issue.path[0] as keyof DepartmentInput | undefined
      if (key && !errors[key]) errors[key] = issue.message
    }
  }
  if (!errors.code && existingCodes.includes(normalized.code)) errors.code = `Mã ${normalized.code} đã tồn tại`
  return errors
}

export const hasErrors = (e: object): boolean => Object.values(e).some(Boolean)