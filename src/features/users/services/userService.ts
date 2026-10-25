import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { normalizeText } from '@/shared/lib/format'
import { fetchDepartmentOptions, fetchUser, fetchUsers } from '../api/queries'
import {
  bulkCreateUsersRequest,
  createUserRequest,
  deleteUserRequest,
  resetPasswordRequest,
  setUserStatusRequest,
  updateUserRequest
} from '../api/mutations'
import { toCreatedUser, toDepartmentOptions, toUserOne, toUserPayload, toUsers } from '../adapters/userAdapter'
import { USERS_CONFIG } from '../config/users.config'
import { demoUuid, emptyToNull, generatePassword } from '../lib/utils'
import { rawPasswordSchema } from '../model/schemas'
import type { AdminUser, CreatedUser, DepartmentOption, UserFilterState, UserInput, UserStats, UserStatus } from '../model/types'

/* ---------- Demo ---------- */
let db: AdminUser[] | null = null
const udb = (): AdminUser[] => (db ??= structuredClone(USERS_CONFIG.demo.users))
export const resetDemoUsers = () => {
  db = null
}

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), USERS_CONFIG.demoDelayMs))

const findDemo = (userId: string): AdminUser => {
  const u = udb().find((x) => x.id === userId)
  if (!u) throw new ApiError('NOT_FOUND', 'Không tìm thấy người dùng')
  return u
}

const assertUniqueEmail = (email: string, exceptId?: string) => {
  const e = email.trim().toLowerCase()
  if (udb().some((u) => u.email === e && u.id !== exceptId)) throw new ApiError('CONFLICT', `Email ${e} đã được sử dụng`)
}

const applyInput = (input: UserInput) => {
  const deptId = emptyToNull(input.departmentId)
  return {
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    code: emptyToNull(input.code),
    phone: emptyToNull(input.phone),
    departmentId: deptId,
    departmentName: USERS_CONFIG.demo.departments.find((d) => d.id === deptId)?.name ?? null,
    role: input.role,
    status: input.status
  }
}

const parse = <T>(fn: () => T, message: string): T => {
  try {
    return fn()
  } catch {
    throw new ApiError('SERVER', message)
  }
}

const time = (iso: string | null) => (iso ? Date.parse(iso) || 0 : 0)

export const userService = {
  async list(): Promise<AdminUser[]> {
    if (isDemoMode()) return delay(userService.sortNewest(udb()))
    const raw = await fetchUsers()
    return userService.sortNewest(parse(() => toUsers(raw), 'Dữ liệu người dùng không hợp lệ'))
  },

  async detail(userId: string): Promise<AdminUser> {
    if (isDemoMode()) return delay(findDemo(userId))
    const raw = await fetchUser(userId)
    return parse(() => toUserOne(raw), 'Dữ liệu người dùng không hợp lệ')
  },

  async departments(): Promise<DepartmentOption[]> {
    if (isDemoMode()) return delay(USERS_CONFIG.demo.departments)
    const raw = await fetchDepartmentOptions()
    return parse(() => toDepartmentOptions(raw), 'Dữ liệu phòng ban không hợp lệ')
  },

  async create(input: UserInput): Promise<CreatedUser> {
    if (isDemoMode()) {
      assertUniqueEmail(input.email)
      const user: AdminUser = { id: demoUuid(), ...applyInput(input), createdAt: new Date().toISOString(), lastLoginAt: null }
      udb().push(user)
      return delay({ user, temporaryPassword: generatePassword() })
    }
    const raw = await createUserRequest(toUserPayload(input))
    return parse(() => toCreatedUser(raw), 'Dữ liệu người dùng không hợp lệ')
  },

  async update(userId: string, input: UserInput): Promise<AdminUser> {
    if (isDemoMode()) {
      assertUniqueEmail(input.email, userId)
      return delay(Object.assign(findDemo(userId), applyInput(input)))
    }
    const raw = await updateUserRequest(userId, toUserPayload(input))
    return parse(() => toUserOne(raw), 'Dữ liệu người dùng không hợp lệ')
  },

  async setStatus(userId: string, status: UserStatus): Promise<void> {
    if (isDemoMode()) {
      findDemo(userId).status = status
      return delay(undefined)
    }
    await setUserStatusRequest(userId, status)
  },

  async remove(userId: string): Promise<void> {
    if (isDemoMode()) {
      findDemo(userId)
      db = udb().filter((u) => u.id !== userId)
      return delay(undefined)
    }
    await deleteUserRequest(userId)
  },

  async resetPassword(userId: string): Promise<string> {
    if (isDemoMode()) {
      findDemo(userId)
      return delay(generatePassword())
    }
    const raw = await resetPasswordRequest(userId)
    return parse(() => rawPasswordSchema.parse(raw).temporary_password, 'Không nhận được mật khẩu tạm')
  },

  async bulkCreate(inputs: UserInput[]): Promise<number> {
    if (isDemoMode()) {
      let created = 0
      for (const input of inputs) {
        if (udb().some((u) => u.email === input.email.trim().toLowerCase())) continue
        udb().push({ id: demoUuid(), ...applyInput(input), createdAt: new Date().toISOString(), lastLoginAt: null })
        created++
      }
      return delay(created)
    }
    const raw = await bulkCreateUsersRequest(inputs.map(toUserPayload))
    const n = Number((raw as { created?: unknown } | null)?.created)
    return Number.isFinite(n) ? n : inputs.length
  },

  /* ---------- Thuần ---------- */

  sortNewest(list: AdminUser[]): AdminUser[] {
    return [...list].sort((a, b) => time(b.createdAt) - time(a.createdAt))
  },

  filter(list: AdminUser[], f: UserFilterState): AdminUser[] {
    const q = normalizeText(f.search)
    return list.filter(
      (u) =>
        (f.role === 'ALL' || u.role === f.role) &&
        (f.status === 'ALL' || u.status === f.status) &&
        (!q || normalizeText(`${u.fullName} ${u.email} ${u.code ?? ''} ${u.id}`).includes(q))
    )
  },

  stats(list: AdminUser[]): UserStats {
    return {
      total: list.length,
      active: list.filter((u) => u.status === 'ACTIVE').length,
      pending: list.filter((u) => u.status === 'PENDING').length,
      locked: list.filter((u) => u.status === 'LOCKED').length
    }
  },

  emptyInput(): UserInput {
    return { fullName: '', email: '', code: '', phone: '', departmentId: '', role: 'LEARNER', status: 'ACTIVE' }
  },

  toInput(u: AdminUser): UserInput {
    return {
      fullName: u.fullName,
      email: u.email,
      code: u.code ?? '',
      phone: u.phone ?? '',
      departmentId: u.departmentId ?? '',
      role: u.role,
      status: u.status
    }
  }
}