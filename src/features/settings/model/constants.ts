import type { FlatKey, SettingsTab } from './types'

export const SETTINGS_QUERY_KEYS = {
  all: ['settings'] as const,
  current: ['settings', 'current'] as const
}

export const NUMBER_KEYS: FlatKey[] = ['general.defaultPassScore', 'general.defaultDurationMin', 'general.defaultMaxAttempts']

export const TABS: { key: SettingsTab; label: string; description: string }[] = [
  { key: 'general', label: 'Thông tin chung', description: 'Tên hệ thống, đơn vị, mặc định khóa học' },
  { key: 'support', label: 'Liên hệ hỗ trợ', description: 'Đầu mối hỗ trợ người dùng' },
  { key: 'certificate', label: 'Chứng chỉ & nhận diện', description: 'Thông tin in trên chứng chỉ' }
]

export const DEMO_STORAGE_KEY = 'settings-demo'