import { z } from 'zod'

const id = z.union([z.string(), z.number()])
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

export const rawCertificateSchema = z.object({
  id: id.optional(),
  code: z.string().min(1),
  course_id: id,
  course_title: z.string().catch(''),
  recipient_name: z.string().catch(''),
  department_name: optStr,
  score: optNum,
  issued_at: optStr,
  attempt_id: id.nullish(),
  pdf_url: optStr
})

export const rawCertificateListSchema = z.array(rawCertificateSchema)

export type RawCertificate = z.infer<typeof rawCertificateSchema>