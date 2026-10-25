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
const looseFlag = z.union([z.boolean(), z.string(), z.number()]).nullish()

/** Nhận mảng hoặc chuỗi "a,b" */
const idList = z
  .union([z.array(id), z.string(), z.number()])
  .nullish()
  .transform((v) => {
    if (v == null || v === '') return [] as string[]
    if (Array.isArray(v)) return v.map(String)
    return String(v)
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean)
  })

export const rawAttemptSchema = z.object({
  attempt_id: id,
  course_id: id,
  course_title: z.string().catch(''),
  submitted_at: optStr,
  score: z.coerce.number(),
  pass_score: optNum,
  passed: looseFlag,
  correct_count: num,
  total: num,
  time_spent_sec: optNum,
  certificate_code: optStr
})

export const rawAttemptListSchema = z.array(rawAttemptSchema)

export const rawReviewQuestionSchema = z.object({
  id,
  order: num,
  text: z.string(),
  type: z.string().nullish(),
  options: z.array(z.object({ id, text: z.string() })),
  selected: idList,
  correct: idList,
  is_correct: looseFlag,
  explanation: optStr
})

export const rawAttemptDetailSchema = rawAttemptSchema.extend({
  questions: z.array(rawReviewQuestionSchema)
})

export type RawAttempt = z.infer<typeof rawAttemptSchema>
export type RawReviewQuestion = z.infer<typeof rawReviewQuestionSchema>