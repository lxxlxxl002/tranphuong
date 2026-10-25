import { z } from 'zod'

/** Google Sheets hay trả số dạng chuỗi → coerce */
const total = z.coerce.number().nonnegative()
const loose = z.coerce.number().catch(0)
const id = z.union([z.string(), z.number()])

export const rawStatsSchema = z.object({
  total_users: total,
  total_courses: total,
  total_enrollments: total,
  total_certificates: total,
  role_distribution: z.array(z.object({ role: z.string(), count: loose })).nullish()
})

export const rawDeptStatSchema = z.object({
  department_id: id,
  department_name: z.string().catch(''),
  staff_count: loose,
  active_rate: loose,
  completion_rate: loose
})

export const rawDeptStatsSchema = z.array(rawDeptStatSchema)

export type RawStats = z.infer<typeof rawStatsSchema>
export type RawDeptStat = z.infer<typeof rawDeptStatSchema>