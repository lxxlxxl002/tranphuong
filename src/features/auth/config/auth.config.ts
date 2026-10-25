import type { Role } from '@/shared/constants/roles'

export const AUTH_CONFIG = {
  timeout: 20_000,
  sessionSyncStaleMs: 5 * 60_000,
  rememberDefault: true,
  allowDemo: import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO === 'true',
  demoToken: 'dev-token',
  supportName: import.meta.env.VITE_SUPPORT_NAME || 'Liên hệ Phòng 1',
  supportPhone: import.meta.env.VITE_SUPPORT_PHONE || '0822 116 166',
  forgotPasswordHint: `Vui lòng liên hệ quản trị viên hệ thống (${import.meta.env.VITE_SUPPORT_NAME || 'Phòng 1'} – ${import.meta.env.VITE_SUPPORT_PHONE || '0822 116 166'}) để được cấp lại mật khẩu.`,
  mockAuth: import.meta.env.VITE_MOCK_AUTH === 'true'
} as const

export interface MockAccount {
  email: string
  password: string
  fullName: string
  role: Role
  departmentId: string | null
  departmentName: string | null
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  { email: 'admin@sbv.gov.vn', password: 'admin123', fullName: 'Quản trị viên', role: 'ADMIN', departmentId: null, departmentName: null },
  { email: 'lanhdao@sbv.gov.vn', password: 'admin123', fullName: 'Trần Phương', role: 'DEPT_LEAD', departmentId: 'P1', departmentName: 'Phòng Tổng hợp và chính sách' },
  { email: 'giangvien@sbv.gov.vn', password: 'admin123', fullName: 'Nguyễn Phương Chi', role: 'LECTURER', departmentId: 'P6', departmentName: 'Phòng Quản lý, giám sát TCTD phi NH' },
  { email: 'hocvien@sbv.gov.vn', password: 'admin123', fullName: 'Vũ Hoài Thanh', role: 'LEARNER', departmentId: 'P1', departmentName: 'Phòng Tổng hợp và chính sách' }
]