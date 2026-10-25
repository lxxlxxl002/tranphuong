import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.locale('vi')

export type DateInput = string | number | Date | null | undefined

const VN_FORMATS = ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY HH:mm', 'DD/MM/YYYY']

export const parseDate = (value: DateInput) => {
  if (value == null || value === '') return null
  const d =
    typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}/.test(value) ? dayjs(value, VN_FORMATS) : dayjs(value)
  return d.isValid() ? d : null
}

export const formatDate = (value: DateInput, fmt = 'DD/MM/YYYY'): string => parseDate(value)?.format(fmt) ?? '—'

export const formatDateTime = (value: DateInput): string => formatDate(value, 'DD/MM/YYYY HH:mm')

export const fromNow = (value: DateInput): string => parseDate(value)?.fromNow() ?? '—'

export const toISO = (value: DateInput): string | null => parseDate(value)?.toISOString() ?? null

export const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds || seconds <= 0) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`
  if (m > 0) return `${m} phút`
  return `${s} giây`
}

export const formatClock = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}