const numberFmt = new Intl.NumberFormat('vi-VN')

export const formatNumber = (n: number | null | undefined): string =>
  n == null || Number.isNaN(n) ? '—' : numberFmt.format(n)

export const toPercent = (part: number, total: number): number =>
  total > 0 ? Math.round((part / total) * 100) : 0

export const formatPercent = (value: number, digits = 0): string =>
  `${(Number.isFinite(value) ? value : 0).toFixed(digits)}%`

export const formatScore = (score: number | null | undefined, max = 100): string =>
  score == null ? '—' : `${Number.isInteger(score) ? score : score.toFixed(1)}/${max}`

export const formatCount = (n: number, unit: string): string => `${formatNumber(n)} ${unit}`

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const truncate = (text: string, max = 60): string =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

export const normalizeText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()