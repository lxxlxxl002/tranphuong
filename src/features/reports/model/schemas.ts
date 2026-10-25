import { z } from 'zod'

const id = z.union([z.string(), z.number()])
const num = z.coerce.number().catch(0)
const optStr = z
  .string()
  .nullish()
  .transform((v) => v?.trim() || null)
const optNum = z
  .union([z.number(), z.string()])
  .nullish()
  .transform((v) => {
    if (v == null || v === '') return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  })

export const rawStaffSchema = z.object({
  user_id: id,
  full_name: z.string(),
  email: z.string().catch(''),
  department_id: id.nullish(),
  department_name: optStr,
  role: z.string().nullish(),
  completed_courses: num,
  enrolled_courses: num,
  average_score: optNum,
  completion_rate: num
})

export const rawDeptSchema = z.object({
  department_id: id.nullish(),
  department_name: optStr,
  staff_count: num,
  completion_rate: num
})

export const rawReportSchema = z.object({
  stats: z.object({
    total_users: num,
    total_courses: num,
    total_enrollments: num,
    total_certificates: num
  }),
  staff: z.array(rawStaffSchema),
  departments: z.array(rawDeptSchema).nullish()
})

export type RawStaff = z.infer<typeof rawStaffSchema>
export type RawDept = z.infer<typeof rawDeptSchema>