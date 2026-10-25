import type { PermissionKey } from '@/shared/constants/permissions'
import { usePermissionsStore } from './store'

export const permissionsActions = {
  select(roleKey: string) {
    usePermissionsStore.setState({ selectedKey: roleKey })
  },
  setDraft(roleKey: string, permissions: PermissionKey[]) {
    usePermissionsStore.setState((s) => ({ drafts: { ...s.drafts, [roleKey]: permissions } }))
  },
  clearDraft(roleKey: string) {
    usePermissionsStore.setState((s) => {
      const { [roleKey]: _removed, ...rest } = s.drafts
      return { drafts: rest }
    })
  },
  openCreate() {
    usePermissionsStore.setState({ editor: { open: true, roleKey: null } })
  },
  openEdit(roleKey: string) {
    usePermissionsStore.setState({ editor: { open: true, roleKey } })
  },
  closeEditor() {
    usePermissionsStore.setState({ editor: { open: false, roleKey: null } })
  }
}