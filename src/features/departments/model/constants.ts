export const DEPARTMENTS_QUERY_KEYS = {
  all: ['departments'] as const,
  list: ['departments', 'list'] as const
}

export const RELATED_QUERY_ROOTS = ['users', 'reports', 'dashboard'] as const

export const CODE_PREFIX = 'P'
export const NO_LEADER_LABEL = '— Chưa có —'