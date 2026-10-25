import { z } from 'zod'

const id = z.union([z.string(), z.number()])
const num = z.coerce.number().catch(0)
const optStr = z
  .string()
  .nullish()
  .transform((v) => v?.trim() || null)
const flag = z
  .union([z.boolean(), z.string(), z.number()])
  .nullish()
  .transform((v) => v === true || v === 1 || (typeof v === 'string' && ['true', '1', 'x', 'yes', 'dung', 'đúng'].includes(v.trim().toLowerCase())))

export const rawBankSchema = z.object({
  course_id: id,
  course_title: z.string(),
  cover_url: optStr,
  question_count: num
})

export const rawOptionSchema = z.object({
  id: id.optional(),
  text: z.string(),
  correct: flag
})

export const rawQuestionSchema = z.object({
  id,
  order: num,
  text: z.string(),
  type: z.string().nullish(),
  options: z.array(rawOptionSchema),
  explanation: optStr,
  updated_at: optStr
})

export const rawBankQuestionsSchema = z.object({
  course: z.object({ id, title: z.string() }),
  questions: z.array(rawQuestionSchema)
})

export type RawBank = z.infer<typeof rawBankSchema>
export type RawQuestion = z.infer<typeof rawQuestionSchema>