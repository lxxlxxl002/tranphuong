import { useDepartmentsStore } from './store'

export const departmentsActions = {
  openCreate() {
    useDepartmentsStore.setState({ editor: { open: true, departmentId: null } })
  },
  openEdit(departmentId: string) {
    useDepartmentsStore.setState({ editor: { open: true, departmentId } })
  },
  closeEditor() {
    useDepartmentsStore.setState({ editor: { open: false, departmentId: null } })
  }
}