import { create } from 'zustand'
import type { UserFilterState } from '../model/types'

export interface UsersState {
  filters: UserFilterState
  selectedId: string | null
  importOpen: boolean
}

export const initialFilters: UserFilterState = { role: 'ALL', status: 'ALL', search: '' }

export const useUsersStore = create<UsersState>(() => ({
  filters: initialFilters,
  selectedId: null,
  importOpen: false
}))