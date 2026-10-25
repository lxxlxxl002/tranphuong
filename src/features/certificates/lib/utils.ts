import { parseDate } from '@/shared/lib/date'
import { normalizeText } from '@/shared/lib/format'

/** "ngày 02 tháng 07 năm 2026" */
export const vnDateLong = (value: string | null | undefined): string => {
  const d = parseDate(value)
  if (!d) return 'ngày … tháng … năm …'
  return `ngày ${d.format('DD')} tháng ${d.format('MM')} năm ${d.format('YYYY')}`
}

export const sanitizeFileName = (name: string): string =>
  normalizeText(name)
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const waitForImages = async (root: HTMLElement): Promise<void> => {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(images.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined))))
}

export const nextFrame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()))