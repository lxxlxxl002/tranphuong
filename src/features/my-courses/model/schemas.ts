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
const flag = z
  .union([z.boolean(), z.string(), z.number()])
  .nullish()
  .transform((v) => v === true || v === 1 || (typeof v === 'string' && ['true', '1', 'x', 'yes', 'co', 'có'].includes(v.trim().toLowerCase())))

export const rawMyCourseSchema = z
  .object({
    id: id.optional(),
    course_id: id.optional(),
    title: z.string(),
    description: optStr,
    cover_url: optStr,
    status: z.string().nullish(),
    progress: num,
    lessons_total: num,
    lessons_done: num,
    enrolled_at: optStr,
    completed_at: optStr,
    last_accessed_at: optStr,
    score: optNum,
    has_certificate: flag
  })
  .refine((r) => r.id != null || r.course_id != null, { message: 'Thiếu mã khóa học' })

export const rawMyCoursesSchema = z.array(rawMyCourseSchema)

export type RawMyCourse = z.infer<typeof rawMyCourseSchema>