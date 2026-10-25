import type { RateFilter } from './types'

export const REPORTS_QUERY_KEYS = {
  all: ['reports'] as const,
  overview: ['reports', 'overview'] as const
}

export const NO_DEPT = '__none__'
export const NO_DEPT_LABEL = '(Chưa phân phòng)'
export const PAGE_SIZE = 10

export const RATE_OPTIONS: { value: RateFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả tỷ lệ' },
  { value: 'DONE', label: 'Hoàn thành 100%' },
  { value: 'PARTIAL', label: 'Đang học (1–99%)' },
  { value: 'NONE', label: 'Chưa hoàn thành (0%)' }
]

export const EXPORT_COLORS = {
  header: 'FF2563EB',
  title: 'FF1E3A8A',
  zebra: 'FFF4F7FD'
} as const