import { create } from 'zustand'

export interface DepartmentsState {
  editor: { open: boolean; departmentId: string | null }
}

export const useDepartmentsStore = create<DepartmentsState>(() => ({
  editor: { open: false, departmentId: null }
}))