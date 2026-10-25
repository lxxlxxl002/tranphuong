import { normalizeText } from '@/shared/lib/format'
import { ALL_PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'

/** "Thanh tra viên" → "THANH_TRA_VIEN" */
export const slugKey = (name: string): string =>
  normalizeText(name)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^(\d)/, 'R_$1')
    .slice(0, 30)

const ORDER = new Map(ALL_PERMISSIONS.map((k, i) => [k, i]))

/** Bỏ trùng, bỏ khóa lạ, sắp theo thứ tự chuẩn */
export const sortPermissions = (keys: readonly string[]): PermissionKey[] =>
  [...new Set(keys)].filter((k): k is PermissionKey => ORDER.has(k as PermissionKey)).sort((a, b) => (ORDER.get(a) ?? 0) - (ORDER.get(b) ?? 0))

export const sameSet = (a: readonly string[], b: readonly string[]): boolean => {
  if (a.length !== b.length) return false
  const s = new Set(a)
  return b.every((x) => s.has(x))
}