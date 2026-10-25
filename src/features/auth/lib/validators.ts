import { loginSchema } from '../model/schemas'

type LoginField = 'email' | 'password'
export type LoginErrors = Partial<Record<LoginField, string>>

export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export function validateLogin(input: { email: string; password: string }): LoginErrors {
  const result = loginSchema.safeParse(input)
  if (result.success) return {}
  const errors: LoginErrors = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0]
    if ((key === 'email' || key === 'password') && !errors[key]) errors[key] = issue.message
  }
  return errors
}

/** 0 yếu → 3 mạnh */
export const passwordStrength = (pw: string): 0 | 1 | 2 | 3 => {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++
  return score as 0 | 1 | 2 | 3
}