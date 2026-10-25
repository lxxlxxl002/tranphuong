export const normalizeCode = (v: string): string => v.trim().toUpperCase().replace(/\s+/g, '')

/** So sánh tự nhiên: P2 < P10 */
export const compareCode = (a: string, b: string): number => a.localeCompare(b, 'vi', { numeric: true, sensitivity: 'base' })

export const demoId = (): string => `dept-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`