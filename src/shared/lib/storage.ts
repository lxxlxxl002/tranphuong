const PREFIX = 'lms-sbv:'

export const STORAGE_KEYS = {
  token: 'token',
  user: 'user',
  sidebarCollapsed: 'sidebar-collapsed'
} as const

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* storage không khả dụng */
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      /* storage không khả dụng */
    }
  },
  clear(): void {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k))
    } catch {
      /* storage không khả dụng */
    }
  }
}