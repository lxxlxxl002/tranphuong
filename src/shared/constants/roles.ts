export const ROLES = {
  ADMIN: 'ADMIN',
  DEPT_LEAD: 'DEPT_LEAD',
  LECTURER: 'LECTURER',
  LEARNER: 'LEARNER'
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_META: Record<Role, { label: string; color: string; badge: string }> = {
  ADMIN: { label: 'Quản trị viên', color: '#a855f7', badge: 'bg-purple-50 text-purple-700 ring-purple-200' },
  DEPT_LEAD: { label: 'Lãnh đạo phòng', color: '#22c55e', badge: 'bg-green-50 text-green-700 ring-green-200' },
  LECTURER: { label: 'Giảng viên', color: '#f59e0b', badge: 'bg-blue-50 text-blue-700 ring-blue-200' },
  LEARNER: { label: 'Học viên', color: '#3b82f6', badge: 'bg-blue-50 text-blue-700 ring-blue-200' }
}

export const ROLE_ORDER: Role[] = ['ADMIN', 'DEPT_LEAD', 'LECTURER', 'LEARNER']

export const isRole = (v: unknown): v is Role => typeof v === 'string' && v in ROLE_META

export const roleLabel = (role: Role): string => ROLE_META[role].label