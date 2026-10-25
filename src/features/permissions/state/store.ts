import { create } from 'zustand'
import type { PermissionKey } from '@/shared/constants/permissions'

export interface PermissionsState {
  selectedKey: string | null
  /** Bản nháp quyền chưa lưu theo từng vai trò */
  drafts: Record<string, PermissionKey[]>
  editor: { open: boolean; roleKey: string | null }
}

export const usePermissionsStore = create<PermissionsState>(() => ({
  selectedKey: null,
  drafts: {},
  editor: { open: false, roleKey: null }
}))