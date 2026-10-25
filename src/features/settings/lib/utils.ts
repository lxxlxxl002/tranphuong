import type { AppSettings, FlatKey, FlatSettings, SectionKey } from '../model/types'

const SECTIONS: SectionKey[] = ['general', 'support', 'certificate']

/** { general: { systemName } } → { "general.systemName": ... } */
export const flatten = (s: AppSettings): FlatSettings => {
  const out = {} as Record<string, string | number>
  for (const section of SECTIONS) {
    for (const [k, v] of Object.entries(s[section])) out[`${section}.${k}`] = v as string | number
  }
  return out as FlatSettings
}

/** Mọi dạng dữ liệu đầu vào → map khóa phẳng */
export const toFlatMap = (input: unknown): Map<string, unknown> => {
  const map = new Map<string, unknown>()
  const walk = (obj: Record<string, unknown>, prefix: string) => {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v as Record<string, unknown>, key)
      else map.set(key, v)
    }
  }
  if (Array.isArray(input)) {
    for (const row of input as { key: string; value: unknown }[]) map.set(String(row.key).trim(), row.value)
  } else if (input && typeof input === 'object') {
    walk(input as Record<string, unknown>, '')
  }
  return map
}

export const sectionOf = (key: FlatKey): SectionKey => key.split('.')[0] as SectionKey

export const sameSettings = (a: AppSettings, b: AppSettings): boolean => JSON.stringify(flatten(a)) === JSON.stringify(flatten(b))