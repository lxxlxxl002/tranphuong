import { z } from 'zod'

const text = (label: string, max = 150) => z.string().trim().min(1, `Vui lòng nhập ${label}`).max(max, `Tối đa ${max} ký tự`)
const optional = (max = 150) => z.string().trim().max(max, `Tối đa ${max} ký tự`)
const int = (min: number, max: number, unit = '') =>
  z.number('Vui lòng nhập số').int('Phải là số nguyên').min(min, `Từ ${min} đến ${max}${unit}`).max(max, `Từ ${min} đến ${max}${unit}`)

export const appSettingsSchema = z.object({
  general: z.object({
    systemName: text('tên hệ thống', 80),
    orgName: text('tên đơn vị'),
    parentOrg: optional(),
    defaultPassScore: int(0, 100),
    defaultDurationMin: int(0, 300, ' phút'),
    defaultMaxAttempts: int(0, 20, ' lượt')
  }),
  support: z.object({
    name: optional(80),
    phone: z
      .string()
      .trim()
      .refine((v) => v === '' || /^[0-9+\s().-]{8,20}$/.test(v), 'Số điện thoại không hợp lệ'),
    email: z
      .string()
      .trim()
      .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Email không hợp lệ'),
    workingHours: optional(100)
  }),
  certificate: z.object({
    issuePlace: text('nơi cấp', 60),
    signerTitle: text('chức danh người ký', 60),
    signerName: optional(80)
  })
})

/** Backend có thể trả: object lồng nhau, object khóa phẳng, hoặc mảng {key, value} (sheet Settings) */
export const rawSettingsSchema = z.union([
  z.array(z.object({ key: z.string(), value: z.unknown() })),
  z.record(z.string(), z.unknown())
])