import { userInputSchema } from '../model/schemas'
import type { UserErrors, UserInput } from '../model/types'

export const validateUserInput = (input: UserInput): UserErrors => {
  const r = userInputSchema.safeParse(input)
  if (r.success) return {}
  const errors: UserErrors = {}
  for (const issue of r.error.issues) {
    const key = issue.path[0] as keyof UserInput | undefined
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}

export const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export const hasErrors = (e: object): boolean => Object.values(e).some(Boolean)