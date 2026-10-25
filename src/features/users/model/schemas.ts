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

export const rawUserSchema = z.object({
  id,
  code: optStr,
  full_name: z.string(),
  email: z.string(),
  phone: optStr,
  department_id: optId,
  department_name: optStr,
  role: z.string().nullish(),
  status: z.string().nullish(),
  created_at: optStr,
  last_login_at: optStr
})

export const rawCreatedUserSchema = z.object({
  user: rawUserSchema,
  temporary_password: optStr
})

export const rawDepartmentOptionSchema = z.object({
  id,
  code: z.string().catch(''),
  name: z.string()
})

export const rawPasswordSchema = z.object({ temporary_password: z.string().min(1) })

export type RawUser = z.infer<typeof rawUserSchema>

/* ---------- Form ---------- */
export const userInputSchema = z.object({
  fullName: z.string().trim().min(1, 'Vui lòng nhập họ và tên').max(100, 'Tối đa 100 ký tự'),
  email: z.string().trim().min(1, 'Vui lòng nhập email').email('Email không hợp lệ').max(120, 'Tối đa 120 ký tự'),
  code: z.string().trim().max(30, 'Tối đa 30 ký tự'),
  phone: z
    .string()
    .trim()
    .refine((v) => v === '' || /^[0-9+\s().-]{8,15}$/.test(v), 'Số điện thoại không hợp lệ'),
  departmentId: z.string(),
  role: z.enum(['ADMIN', 'DEPT_LEAD', 'LECTURER', 'LEARNER']),
  status: z.enum(['ACTIVE', 'PENDING', 'LOCKED'])
})