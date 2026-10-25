import { flatten, toFlatMap } from '../lib/utils'
import { NUMBER_KEYS } from '../model/constants'
import { rawSettingsSchema } from '../model/schemas'
import type { AppSettings, FlatKey, FlatSettings } from '../model/types'

/** Đè dữ liệu backend lên mặc định; khóa lạ bị bỏ qua, số sai kiểu giữ mặc định */
export const toAppSettings = (input: unknown, defaults: AppSettings): AppSettings => {
  const raw = rawSettingsSchema.parse(input)
  const map = toFlatMap(raw)
  const result = structuredClone(defaults)
  for (const key of Object.keys(flatten(defaults)) as FlatKey[]) {
    if (!map.has(key)) continue
    const value = map.get(key)
    const [section, field] = key.split('.') as [keyof Omit<AppSettings, 'updatedAt'>, string]
    const target = result[section] as unknown as Record<string, string | number>
    if (NUMBER_KEYS.includes(key)) {
      const n = Number(value)
      if (value !== '' && value != null && Number.isFinite(n)) target[field] = Math.round(n)
    } else if (value != null) {
      target[field] = String(value).trim()
    }
  }
  const updated = map.get('updatedAt') ?? map.get('updated_at')
  result.updatedAt = updated ? String(updated) : null
  return result
}

export const toSettingsPayload = (s: AppSettings): FlatSettings => {
  const flat = flatten(s)
  for (const k of Object.keys(flat) as FlatKey[]) {
    const v = flat[k]
    flat[k] = typeof v === 'string' ? v.trim() : v
  }
  return flat
}