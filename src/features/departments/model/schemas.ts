import { z } from 'zod'

const id = z.union([z.string(), z.number()])
const optStr = z
  .string()
  .nullish()
  .transform((v) => v?.trim() || null)
const optId = z
  .union([z.string(), z.number()])
  .nullish()
  .transform((v) => (v == null || v === '' ? null : String(v)))

export const rawDepartmentSchema = z.object({
  id,
  code: z.string().catch(''),
  name: z.string(),
  leader_id: optId,
  leader_name: optStr,
  staff_count: z.coerce.number().catch(0),
  description: optStr,
  created_at: optStr
})

export type RawDepartment = z.infer<typeof rawDepartmentSchema>

export const departmentInputSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập mã phòng/ban')
    .max(10, 'Tối đa 10 ký tự')
    .regex(/^[A-Z0-9_-]+$/, 'Chỉ gồm chữ in hoa, số, "-" hoặc "_"'),
  name: z.string().trim().min(1, 'Vui lòng nhập tên phòng/ban').max(150, 'Tối đa 150 ký tự'),
  leaderId: z.string(),
  description: z.string().max(500, 'Tối đa 500 ký tự')
})