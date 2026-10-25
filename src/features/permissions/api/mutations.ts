import { permissionsClient } from './client'
import { PERMISSIONS_ENDPOINTS as E } from './endpoints'

export const saveRolePermissionsRequest = (roleKey: string, permissions: string[]) =>
  permissionsClient.mutate<void>(E.savePermissions, { roleKey, permissions })

export const createRoleRequest = (input: { key: string; name: string; description: string | null; permissions: string[] }) =>
  permissionsClient.mutate<unknown>(E.createRole, { input })

export const updateRoleRequest = (roleKey: string, input: { name: string; description: string | null }) =>
  permissionsClient.mutate<unknown>(E.updateRole, { roleKey, input })

export const deleteRoleRequest = (roleKey: string) => permissionsClient.mutate<void>(E.deleteRole, { roleKey })