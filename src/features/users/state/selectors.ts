import type { UsersState } from './store'

export const selectFilters = (s: UsersState) => s.filters
export const selectSelectedId = (s: UsersState) => s.selectedId
export const selectImportOpen = (s: UsersState) => s.importOpen