import { z } from 'zod'

const id = z.union([z.string(), z.number()])
const num = z.coerce.number().catch(0)
const optStr = z
  .string()
  .nullish()
  .transform((v) => v?.trim() || null)

/* ---------- Dữ liệu thô từ Apps Script ---------- */

export const rawAdminCourseSchema = z.object({
  id,
  title: z.string(),
  description: optStr,
  cover_url: optStr,
  status: z.string().nullish(),
  lesson_count: num,
  question_count: num,
  enrollment_count: num,
  pass_score: z.coerce.number().catch(70),
  duration_min: num,
  max_attempts: num,
  created_at: optStr,
  updated_at: optStr
})

export const rawAdminLessonSchema = z.object({
  id,
  course_id: id,
  order: num,
  title: z.string(),
  type: z.string().nullish(),
  duration_sec: num,
  video_url: optStr,
  document_url: optStr,
  content: optStr
})

export const rawCourseDetailSchema = z.object({
  course: rawAdminCourseSchema,
  lessons: z.array(rawAdminLessonSchema).nullish()
})

export const rawUploadSchema = z.object({ url: z.string().min(1) })

export type RawAdminCourse = z.infer<typeof rawAdminCourseSchema>
export type RawAdminLesson = z.infer<typeof rawAdminLessonSchema>

/* ---------- Form ---------- */

const linkOrEmpty = (message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || /^(https?:\/\/|data:image\/)/i.test(v) || /^[\w-]{25,}$/.test(v), message)

export const courseInputSchema = z.object({
  title: z.string().trim().min(1, 'Vui lòng nhập tên khóa học').max(200, 'Tối đa 200 ký tự'),
  description: z.string().max(2000, 'Tối đa 2.000 ký tự'),
  coverUrl: linkOrEmpty('Đường dẫn ảnh không hợp lệ'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  passScore: z.number('Vui lòng nhập số').int('Phải là số nguyên').min(0, 'Từ 0 đến 100').max(100, 'Từ 0 đến 100'),
  durationMin: z.number('Vui lòng nhập số').int('Phải là số nguyên').min(0, 'Không được âm').max(300, 'Tối đa 300 phút'),
  maxAttempts: z.number('Vui lòng nhập số').int('Phải là số nguyên').min(0, 'Không được âm').max(20, 'Tối đa 20 lượt')
})

export const lessonInputSchema = z.object({
  title: z.string().trim().min(1, 'Vui lòng nhập tên bài học').max(200, 'Tối đa 200 ký tự'),
  type: z.enum(['VIDEO', 'DOCUMENT', 'TEXT']),
  durationMin: z.number('Vui lòng nhập số').int('Phải là số nguyên').min(0, 'Không được âm').max(600, 'Tối đa 600 phút'),
  videoUrl: linkOrEmpty('Link video không hợp lệ'),
  documentUrl: linkOrEmpty('Link tài liệu không hợp lệ'),
  content: z.string().max(10000, 'Tối đa 10.000 ký tự')
})