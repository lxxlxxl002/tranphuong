import { z } from 'zod'

/** Form đăng nhập */
export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  remember: z.boolean().optional()
})

/** Dữ liệu thô từ Apps Script */
const idSchema = z.union([z.string(), z.number()])

export const rawUserSchema = z.object({
  id: idSchema,
  code: z.string().nullish(),
  full_name: z.string().nullish(),
  name: z.string().nullish(),
  email: z.string(),
  role: z.string().nullish(),
  department_id: idSchema.nullish(),
  department_name: z.string().nullish(),
  avatar_url: z.string().nullish()
})

export const rawLoginSchema = z.object({
  token: z.string().min(1),
  user: rawUserSchema,
  permissions: z.array(z.string()).nullish(),
  expires_at: z.string().nullish()
})

export const rawMeSchema = z.object({
  user: rawUserSchema,
  permissions: z.array(z.string()).nullish()
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RawUser = z.infer<typeof rawUserSchema>
export type RawLogin = z.infer<typeof rawLoginSchema>
export type RawMe = z.infer<typeof rawMeSchema>