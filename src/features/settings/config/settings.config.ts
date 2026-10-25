import type { AppSettings } from '../model/types'

const env = import.meta.env

export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    systemName: env.VITE_APP_NAME || 'Hệ thống Đào tạo Trực tuyến',
    orgName: env.VITE_ORG_NAME || 'Cục Quản lý, Giám sát Tổ chức Tín dụng',
    parentOrg: 'Ngân hàng Nhà nước Việt Nam',
    defaultPassScore: 70,
    defaultDurationMin: 15,
    defaultMaxAttempts: 3
  },
  support: {
    name: env.VITE_SUPPORT_NAME || 'Liên hệ Phòng 1',
    phone: env.VITE_SUPPORT_PHONE || '0822 116 166',
    email: '',
    workingHours: 'Thứ 2 – Thứ 6, 8:00 – 17:00'
  },
  certificate: {
    issuePlace: 'Hà Nội',
    signerTitle: 'Cục trưởng',
    signerName: ''
  },
  updatedAt: null
}

export const SETTINGS_CONFIG = {
  timeout: 20_000,
  staleTime: 5 * 60_000,
  demoDelayMs: 300,
  defaults: DEFAULT_SETTINGS
}