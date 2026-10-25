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

export const rawCourseProgressSchema = z
  .object({
    id: id.optional(),
    course_id: id.optional(),
    title: z.string(),
    status: z.string().nullish(),
    progress: num,
    lessons_done: num,
    lessons_total: num,
    study_sec: num,
    last_accessed_at: optStr,
    best_score: optNum
  })
  .refine((r) => r.id != null || r.course_id != null, { message: 'Thiếu mã khóa học' })

export const rawSummarySchema = z.object({
  overall_percent: optNum,
  total_study_sec: optNum,
  lessons_done: optNum,
  lessons_total: optNum,
  quizzes_taken: optNum,
  quizzes_passed: optNum,
  average_score: optNum
})

export const rawProgressSchema = z.union([
  z.array(rawCourseProgressSchema),
  z.object({
    summary: rawSummarySchema.nullish(),
    courses: z.array(rawCourseProgressSchema)
  })
])

export type RawCourseProgress = z.infer<typeof rawCourseProgressSchema>
export type RawSummary = z.infer<typeof rawSummarySchema>