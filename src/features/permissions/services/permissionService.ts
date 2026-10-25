import { isDemoMode } from '@/features/auth'
import { userService } from '@/features/users'
import { ApiError } from '@/shared/api/errors'
import {
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  perm,
  type PermissionKey,
  type PermissionModule
} from '@/shared/constants/permissions'
import { fetchRoles } from '../api/queries'
import { createRoleRequest, deleteRoleRequest, saveRolePermissionsRequest, updateRoleRequest } from '../api/mutations'
import { toRoleDefOne, toRoleDefs } from '../adapters/permissionAdapter'
import { PERMISSIONS_CONFIG } from '../config/permissions.config'
import { sameSet, sortPermissions } from '../lib/utils'
import { ADMIN_KEY } from '../model/constants'
import type { ModuleState, PermissionGroup, RoleDef, RoleInput } from '../model/types'

/* ---------- Demo ---------- */
let db: RoleDef[] | null = null
const rdb = (): RoleDef[] => (db ??= structuredClone(PERMISSIONS_CONFIG.demo))
export const resetDemoRoles = () => {
  db = null
}

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), PERMISSIONS_CONFIG.demoDelayMs))

const findDemo = (key: string): RoleDef => {
  const r = rdb().find((x) => x.key === key)
  if (!r) throw new ApiError('NOT_FOUND', 'Không tìm thấy vai trò')
  return r
}

const parse = <T>(fn: () => T): T => {
  try {
    return fn()
  } catch {
    throw new ApiError('SERVER', 'Dữ liệu phân quyền không hợp lệ')
  }
}

const VIEW = (m: PermissionModule) => perm(m, 'view')
const moduleOf = (key: PermissionKey) => key.split(':')[0] as PermissionModule

export const permissionService = {
  async listRoles(): Promise<RoleDef[]> {
    if (isDemoMode()) {
      const users = await userService.list()
      return delay(rdb().map((r) => ({ ...r, userCount: users.filter((u) => u.role === r.key).length })))
    }
    const raw = await fetchRoles()
    return parse(() => toRoleDefs(raw))
  },

  async savePermissions(roleKey: string, permissions: PermissionKey[]): Promise<PermissionKey[]> {
    if (roleKey === ADMIN_KEY) throw new ApiError('FORBIDDEN', 'Không thể chỉnh quyền của Quản trị viên')
    const clean = permissionService.normalize(permissions)
    if (isDemoMode()) {
      findDemo(roleKey).permissions = clean
      return delay(clean)
    }
    await saveRolePermissionsRequest(roleKey, clean)
    return clean
  },

  async createRole(input: RoleInput, roles: RoleDef[]): Promise<RoleDef> {
    const source = roles.find((r) => r.key === input.cloneFrom)
    const permissions = source ? permissionService.normalize(source.permissions) : []
    if (isDemoMode()) {
      if (rdb().some((r) => r.key === input.key)) throw new ApiError('CONFLICT', `Mã ${input.key} đã tồn tại`)
      const role: RoleDef = {
        key: input.key,
        name: input.name.trim(),
        description: input.description.trim() || null,
        system: false,
        locked: false,
        permissions,
        userCount: 0
      }
      rdb().push(role)
      return delay(role)
    }
    const raw = await createRoleRequest({ key: input.key, name: input.name.trim(), description: input.description.trim() || null, permissions })
    return parse(() => toRoleDefOne(raw))
  },

  async updateRole(roleKey: string, input: RoleInput): Promise<void> {
    if (isDemoMode()) {
      Object.assign(findDemo(roleKey), { name: input.name.trim(), description: input.description.trim() || null })
      return delay(undefined)
    }
    await updateRoleRequest(roleKey, { name: input.name.trim(), description: input.description.trim() || null })
  },

  async deleteRole(role: RoleDef): Promise<void> {
    if (role.system) throw new ApiError('FORBIDDEN', 'Không thể xóa vai trò hệ thống')
    if (role.userCount > 0) throw new ApiError('VALIDATION', `Còn ${role.userCount} người dùng mang vai trò này`)
    if (isDemoMode()) {
      findDemo(role.key)
      db = rdb().filter((r) => r.key !== role.key)
      return delay(undefined)
    }
    await deleteRoleRequest(role.key)
  },

  /* ---------- Thuần ---------- */

  normalize(keys: readonly string[]): PermissionKey[] {
    return sortPermissions(keys)
  },

  /** Bật Thêm/Sửa/Xóa → tự bật Xem; tắt Xem → tắt cả nhóm */
  toggle(current: readonly PermissionKey[], key: PermissionKey): PermissionKey[] {
    const set = new Set(current)
    const m = moduleOf(key)
    if (set.has(key)) {
      set.delete(key)
      if (key === VIEW(m)) PERMISSION_ACTIONS.forEach((a) => set.delete(perm(m, a.key)))
    } else {
      set.add(key)
      set.add(VIEW(m))
    }
    return sortPermissions([...set])
  },

  setModule(current: readonly PermissionKey[], module: PermissionModule, on: boolean): PermissionKey[] {
    const set = new Set(current)
    PERMISSION_ACTIONS.forEach((a) => (on ? set.add(perm(module, a.key)) : set.delete(perm(module, a.key))))
    return sortPermissions([...set])
  },

  moduleState(current: readonly PermissionKey[], module: PermissionModule): ModuleState {
    const n = PERMISSION_ACTIONS.filter((a) => current.includes(perm(module, a.key))).length
    return n === 0 ? 'none' : n === PERMISSION_ACTIONS.length ? 'all' : 'some'
  },

  buildGroups(current: readonly PermissionKey[]): PermissionGroup[] {
    return PERMISSION_MODULES.map((m) => ({
      module: m.key,
      label: m.label,
      state: permissionService.moduleState(current, m.key),
      rows: PERMISSION_ACTIONS.map((a) => {
        const key = perm(m.key, a.key)
        return { key, action: a.key, label: a.label, granted: current.includes(key) }
      })
    }))
  },

  diffCount(saved: readonly string[], draft: readonly string[]): number {
    const s = new Set(saved)
    const d = new Set(draft)
    return [...s].filter((x) => !d.has(x)).length + [...d].filter((x) => !s.has(x)).length
  },

  isDirty(saved: readonly string[], draft: readonly string[] | undefined): boolean {
    return !!draft && !sameSet(saved, draft)
  },

  summary(role: RoleDef): string {
    return `${role.locked ? 'Toàn quyền' : `${role.permissions.length} quyền`} · ${role.system ? 'Hệ thống' : 'Tùy chỉnh'}`
  },

  emptyInput(): RoleInput {
    return { key: '', name: '', description: '', cloneFrom: '' }
  },

  toInput(r: RoleDef): RoleInput {
    return { key: r.key, name: r.name, description: r.description ?? '', cloneFrom: '' }
  }
}