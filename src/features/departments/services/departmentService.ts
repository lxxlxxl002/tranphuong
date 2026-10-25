import { isDemoMode } from '@/features/auth'
import { userService } from '@/features/users'
import { ApiError } from '@/shared/api/errors'
import { roleLabel } from '@/shared/constants/roles'
import type { Option } from '@/shared/types/common'
import { fetchDepartments } from '../api/queries'
import { createDepartmentRequest, deleteDepartmentRequest, updateDepartmentRequest } from '../api/mutations'
import { toDepartmentOne, toDepartmentPayload, toDepartments } from '../adapters/departmentAdapter'
import { DEPARTMENTS_CONFIG } from '../config/departments.config'
import { compareCode, demoId, normalizeCode } from '../lib/utils'
import { CODE_PREFIX, NO_LEADER_LABEL } from '../model/constants'
import type { DeleteCheck, Department, DepartmentInput, LeaderCandidate } from '../model/types'

/* ---------- Demo ---------- */
let db: Department[] | null = null
const ddb = (): Department[] => (db ??= structuredClone(DEPARTMENTS_CONFIG.demo))
export const resetDemoDepartments = () => {
  db = null
}

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), DEPARTMENTS_CONFIG.demoDelayMs))

/** Demo: số công chức + tên lãnh đạo lấy trực tiếp từ dữ liệu người dùng */
const enrich = async (list: Department[]): Promise<Department[]> => {
  const users = await userService.list()
  return list.map((d) => ({
    ...d,
    staffCount: users.filter((u) => u.departmentId === d.id).length,
    leaderName: users.find((u) => u.id === d.leaderId)?.fullName ?? null
  }))
}

const assertUniqueCode = (code: string, exceptId?: string) => {
  if (ddb().some((d) => d.code === code && d.id !== exceptId)) throw new ApiError('CONFLICT', `Mã ${code} đã tồn tại`)
}

const parse = <T>(fn: () => T): T => {
  try {
    return fn()
  } catch {
    throw new ApiError('SERVER', 'Dữ liệu phòng/ban không hợp lệ')
  }
}

export const departmentService = {
  async list(): Promise<Department[]> {
    if (isDemoMode()) return delay(departmentService.sortByCode(await enrich(ddb())))
    const raw = await fetchDepartments()
    return departmentService.sortByCode(parse(() => toDepartments(raw)))
  },

  async create(input: DepartmentInput): Promise<Department> {
    if (isDemoMode()) {
      const code = normalizeCode(input.code)
      assertUniqueCode(code)
      const dept: Department = {
        id: demoId(),
        code,
        name: input.name.trim(),
        leaderId: input.leaderId || null,
        leaderName: null,
        staffCount: 0,
        description: input.description.trim() || null,
        createdAt: new Date().toISOString()
      }
      ddb().push(dept)
      return delay((await enrich([dept]))[0])
    }
    const raw = await createDepartmentRequest(toDepartmentPayload(input))
    return parse(() => toDepartmentOne(raw))
  },

  async update(departmentId: string, input: DepartmentInput): Promise<Department> {
    if (isDemoMode()) {
      const d = ddb().find((x) => x.id === departmentId)
      if (!d) throw new ApiError('NOT_FOUND', 'Không tìm thấy phòng/ban')
      const code = normalizeCode(input.code)
      assertUniqueCode(code, departmentId)
      Object.assign(d, { code, name: input.name.trim(), leaderId: input.leaderId || null, description: input.description.trim() || null })
      return delay((await enrich([d]))[0])
    }
    const raw = await updateDepartmentRequest(departmentId, toDepartmentPayload(input))
    return parse(() => toDepartmentOne(raw))
  },

  async remove(dept: Department): Promise<void> {
    const check = departmentService.canDelete(dept)
    if (!check.ok) throw new ApiError('VALIDATION', check.reason ?? undefined)
    if (isDemoMode()) {
      const [fresh] = await enrich(ddb().filter((d) => d.id === dept.id))
      if (!fresh) throw new ApiError('NOT_FOUND', 'Không tìm thấy phòng/ban')
      const again = departmentService.canDelete(fresh)
      if (!again.ok) throw new ApiError('VALIDATION', again.reason ?? undefined)
      db = ddb().filter((d) => d.id !== dept.id)
      return delay(undefined)
    }
    await deleteDepartmentRequest(dept.id)
  },

  /* ---------- Thuần ---------- */

  sortByCode(list: Department[]): Department[] {
    return [...list].sort((a, b) => compareCode(a.code, b.code))
  },

  canDelete(d: Department): DeleteCheck {
    if (d.staffCount > 0) {
      return { ok: false, reason: `Còn ${d.staffCount} công chức — chuyển công chức sang phòng khác trước khi xóa` }
    }
    return { ok: true, reason: null }
  },

  /** Mã gợi ý tiếp theo: P6 → P7 */
  nextCode(list: Department[]): string {
    const nums = list.map((d) => d.code.match(new RegExp(`^${CODE_PREFIX}(\\d+)$`))?.[1]).filter(Boolean).map(Number)
    return `${CODE_PREFIX}${(nums.length ? Math.max(...nums) : 0) + 1}`
  },

  /** Lãnh đạo phòng xếp trước, rồi theo tên */
  leaderOptions(users: LeaderCandidate[]): Option<string>[] {
    const rank = (u: LeaderCandidate) => (u.role === 'DEPT_LEAD' ? 0 : u.role === 'ADMIN' ? 2 : 1)
    return [
      { value: '', label: NO_LEADER_LABEL },
      ...[...users]
        .sort((a, b) => rank(a) - rank(b) || a.fullName.localeCompare(b.fullName, 'vi'))
        .map((u) => ({ value: u.id, label: `${u.fullName} · ${roleLabel(u.role)}` }))
    ]
  },

  totalStaff(list: Department[]): number {
    return list.reduce((s, d) => s + d.staffCount, 0)
  },

  emptyInput(code = ''): DepartmentInput {
    return { code, name: '', leaderId: '', description: '' }
  },

  toInput(d: Department): DepartmentInput {
    return { code: d.code, name: d.name, leaderId: d.leaderId ?? '', description: d.description ?? '' }
  }
}