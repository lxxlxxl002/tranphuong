import { normalizeCode } from '../lib/utils'
import { rawDepartmentSchema, type RawDepartment } from '../model/schemas'
import type { Department, DepartmentInput } from '../model/types'

export const toDepartment = (r: RawDepartment): Department => ({
  id: String(r.id),
  code: normalizeCode(r.code) || String(r.id),
  name: r.name.trim(),
  leaderId: r.leader_id,
  leaderName: r.leader_name,
  staffCount: Math.max(0, Math.round(r.staff_count)),
  description: r.description,
  createdAt: r.created_at
})

export const toDepartments = (input: unknown): Department[] => rawDepartmentSchema.array().parse(input).map(toDepartment)
export const toDepartmentOne = (input: unknown): Department => toDepartment(rawDepartmentSchema.parse(input))

export const toDepartmentPayload = (input: DepartmentInput): Record<string, unknown> => ({
  code: normalizeCode(input.code),
  name: input.name.trim(),
  leader_id: input.leaderId || null,
  description: input.description.trim() || null
})