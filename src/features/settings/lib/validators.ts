import { appSettingsSchema } from '../model/schemas'
import type { AppSettings, FlatKey, SettingsErrors, SectionKey } from '../model/types'

export const validateSettings = (s: AppSettings): SettingsErrors => {
  const r = appSettingsSchema.safeParse(s)
  if (r.success) return {}
  const errors: SettingsErrors = {}
  for (const issue of r.error.issues) {
    const key = issue.path.slice(0, 2).join('.') as FlatKey
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}

export const sectionsWithErrors = (errors: SettingsErrors): Set<SectionKey> =>
  new Set(Object.keys(errors).map((k) => k.split('.')[0] as SectionKey))

export const hasErrors = (e: object): boolean => Object.values(e).some(Boolean)