import type { Role } from './roles'

export const PERMISSION_MODULES = [
  { key: 'dashboard', label: 'Trang chủ' },
  { key: 'my-courses', label: 'Khóa học của tôi' },
  { key: 'progress', label: 'Tiến độ học tập' },
  { key: 'exam-results', label: 'Kết quả kiểm tra' },
  { key: 'certificates', label: 'Chứng chỉ' },
  { key: 'course-admin', label: 'Khóa học' },
  { key: 'question-bank', label: 'Ngân hàng câu hỏi' },
  { key: 'reports', label: 'Báo cáo thống kê' },
  { key: 'users', label: 'Người dùng' },
  { key: 'departments', label: 'Phòng / Ban' },
  { key: 'permissions', label: 'Phân quyền' },
  { key: 'settings', label: 'Cài đặt hệ thống' }
] as const

export const PERMISSION_ACTIONS = [
  { key: 'view', label: 'Xem' },
  { key: 'create', label: 'Thêm mới' },
  { key: 'update', label: 'Chỉnh sửa' },
  { key: 'delete', label: 'Xóa' }
] as const

export type PermissionModule = (typeof PERMISSION_MODULES)[number]['key']
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]['key']
export type PermissionKey = `${PermissionModule}:${PermissionAction}`

export const perm = (m: PermissionModule, a: PermissionAction): PermissionKey => `${m}:${a}`

export const ALL_PERMISSIONS: PermissionKey[] = PERMISSION_MODULES.flatMap((m) =>
  PERMISSION_ACTIONS.map((a) => perm(m.key, a.key))
)

const LEARNER_BASE: PermissionKey[] = [
  'dashboard:view',
  'my-courses:view',
  'progress:view',
  'exam-results:view',
  'certificates:view'
]

const crud = (m: PermissionModule): PermissionKey[] => PERMISSION_ACTIONS.map((a) => perm(m, a.key))

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, PermissionKey[]> = {
  ADMIN: ALL_PERMISSIONS,
  DEPT_LEAD: [...LEARNER_BASE, 'reports:view', 'users:view', 'departments:view'],
  LECTURER: [...LEARNER_BASE, ...crud('course-admin'), ...crud('question-bank'), 'reports:view'],
  LEARNER: LEARNER_BASE
}

export const hasPermission = (
  granted: ReadonlySet<string> | readonly string[],
  key: PermissionKey,
  role?: Role | null
): boolean => {
  if (role === 'ADMIN') return true
  return Array.isArray(granted) ? granted.includes(key) : (granted as ReadonlySet<string>).has(key)
}