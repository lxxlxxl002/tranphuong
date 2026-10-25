import type { PermissionsState } from './store'

export const selectSelectedKey = (s: PermissionsState) => s.selectedKey
export const selectDrafts = (s: PermissionsState) => s.drafts
export const selectEditor = (s: PermissionsState) => s.editor