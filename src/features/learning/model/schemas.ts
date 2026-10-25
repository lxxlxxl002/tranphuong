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

export const rawLessonSchema = z.object({
  id,
  order: num,
  title: z.string(),
  type: z.string().nullish(),
  duration_sec: num,
  video_url: optStr,
  document_url: optStr,
  content: optStr,
  completed: flag
})

export const rawQuizInfoSchema = z.object({
  id,
  title: optStr,
  question_count: num,
  duration_min: num,
  pass_score: optNum,
  max_attempts: num,
  attempts_used: num,
  best_score: optNum
})

export const rawCourseContentSchema = z.object({
  course: z.object({ id, title: z.string(), description: optStr }),
  lessons: z.array(rawLessonSchema).nullish(),
  quiz: rawQuizInfoSchema.nullish()
})

export const rawQuizStartSchema = z.object({
  attempt_id: id,
  started_at: optStr,
  duration_sec: num,
  pass_score: optNum,
  questions: z.array(
    z.object({
      id,
      text: z.string(),
      type: z.string().nullish(),
      options: z.array(z.object({ id, text: z.string() }))
    })
  )
})

export const rawQuizResultSchema = z.object({
  attempt_id: id,
  score: z.coerce.number(),
  correct_count: num,
  total: num,
  passed: z.union([z.boolean(), z.string(), z.number()]).nullish(),
  pass_score: optNum,
  certificate_code: optStr,
  time_spent_sec: optNum,
  submitted_at: optStr
})

export type RawLesson = z.infer<typeof rawLessonSchema>
export type RawQuizInfo = z.infer<typeof rawQuizInfoSchema>