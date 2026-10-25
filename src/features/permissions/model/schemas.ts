import { z } from 'zod'

const flag = z
  .union([z.boolean(), z.string(), z.number()])
  .nullish()
  .transform((v) => v === true || v === 1 || (typeof v === 'string' && ['true', '1', 'x'].includes(v.trim().toLowerCase())))

export const rawRoleSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z
    .string()
    .nullish()
    .transform((v) => v?.trim() || null),
  system: flag,
  permissions: z
    .union([z.array(z.string()), z.string()])
    .nullish()
    .transform((v) => (v == null ? [] : Array.isArray(v) ? v : v.split(/[,;\s]+/).filter(Boolean))),
  user_count: z.coerce.number().catch(0)
})

export type RawRole = z.infer<typeof rawRoleSchema>

export const roleInputSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[A-Z][A-Z0-9_]{1,29}$/, 'Mã gồm 2–30 ký tự IN HOA, số hoặc "_", bắt đầu bằng chữ'),
  name: z.string().trim().min(1, 'Vui lòng nhập tên vai trò').max(60, 'Tối đa 60 ký tự'),
  description: z.string().max(300, 'Tối đa 300 ký tự'),
  cloneFrom: z.string()
})