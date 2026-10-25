import type { BadgeTone } from '@/shared/ui/Badge'
import type { Role } from '@/shared/constants/roles'
import type { StatusFilter, UserStatus } from './types'

export const USERS_QUERY_KEYS = {
  all: ['users'] as const,
  list: ['users', 'list'] as const,
  detail: (userId: string) => ['users', 'detail', userId] as const,
  departments: ['users', 'departments'] as const
}

export const RELATED_QUERY_ROOTS = ['dashboard', 'reports', 'departments'] as const

export const STATUS_META: Record<UserStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Hoạt động', tone: 'success' },
  PENDING: { label: 'Chưa kích hoạt', tone: 'warning' },
  LOCKED: { label: 'Đã khóa', tone: 'danger' }
}

export const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'PENDING', label: 'Chưa kích hoạt' },
  { value: 'LOCKED', label: 'Đã khóa' }
]

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  ...STATUS_OPTIONS
]

export const STATUS_ALIASES: Record<string, UserStatus> = {
  ACTIVE: 'ACTIVE',
  HOAT_DONG: 'ACTIVE',
  '1': 'ACTIVE',
  TRUE: 'ACTIVE',
  PENDING: 'PENDING',
  INACTIVE: 'PENDING',
  CHUA_KICH_HOAT: 'PENDING',
  MOI: 'PENDING',
  LOCKED: 'LOCKED',
  DA_KHOA: 'LOCKED',
  KHOA: 'LOCKED',
  BLOCKED: 'LOCKED',
  DISABLED: 'LOCKED',
  '0': 'LOCKED'
}

/** Cách ghi vai trò khi import (đã bỏ dấu, chữ thường) */
export const ROLE_INPUT_ALIASES: Record<string, Role> = {
  'hoc vien': 'LEARNER',
  learner: 'LEARNER',
  'giang vien': 'LECTURER',
  lecturer: 'LECTURER',
  'lanh dao phong': 'DEPT_LEAD',
  'dept lead': 'DEPT_LEAD',
  'quan tri vien': 'ADMIN',
  admin: 'ADMIN'
}

export const PAGE_SIZE = 10
export const NO_DEPT_LABEL = '(Chưa phân phòng)'

/* ---------- Import ---------- */
export const MAX_IMPORT_ROWS = 500
export const IMPORT_ACCEPT = '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
export const TEMPLATE_FILE_NAME = 'Mau-nhap-nguoi-dung.xlsx'
export const TEMPLATE_HEADERS = ['STT', 'Họ và tên', 'Email', 'Mã cán bộ', 'Số điện thoại', 'Phòng/Ban (mã hoặc tên)', 'Vai trò'] as const
export const TEMPLATE_WIDTHS = [6, 28, 32, 14, 16, 40, 18]