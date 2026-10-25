import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => true)
}))

vi.mock('../../api/mutations', () => ({
  createUserRequest: vi.fn(async (input: Record<string, unknown>) => ({ user: { id: 'u-1', ...input }, temporary_password: 'Tmp@12345' })),
  updateUserRequest: vi.fn(),
  setUserStatusRequest: vi.fn(),
  deleteUserRequest: vi.fn(),
  resetPasswordRequest: vi.fn(),
  bulkCreateUsersRequest: vi.fn()
}))

import { isDemoMode } from '@/features/auth'
import { createUserRequest } from '../../api/mutations'
import { resetDemoUsers, userService } from '../../services/userService'
import { userImportService } from '../../services/userImportService'
import { USERS_CONFIG } from '../../config/users.config'

describe('Luồng Quản trị người dùng', () => {
  beforeEach(() => {
    resetDemoUsers()
    vi.mocked(isDemoMode).mockReturnValue(true)
  })

  it('demo: tạo (có mật khẩu tạm) → chặn trùng email → khóa → xóa', async () => {
    const r = await userService.create({ ...userService.emptyInput(), fullName: 'Lê Văn Nam', email: 'Nam.Le@sbv.gov.vn', departmentId: 'P2' })
    expect(r.user).toMatchObject({ email: 'nam.le@sbv.gov.vn', departmentName: 'Phòng Quản lý, giám sát NHTMNN' })
    expect(r.temporaryPassword).toHaveLength(10)

    await expect(userService.create({ ...userService.emptyInput(), fullName: 'X', email: 'NAM.LE@sbv.gov.vn' })).rejects.toMatchObject({ code: 'CONFLICT' })

    await userService.setStatus(r.user.id, 'LOCKED')
    expect(userService.stats(await userService.list()).locked).toBe(1)

    await userService.remove(r.user.id)
    await expect(userService.detail(r.user.id)).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('file mẫu → đọc lại 2 dòng hợp lệ → nhập hàng loạt', async () => {
    const departments = USERS_CONFIG.demo.departments
    const buffer = await userImportService.buildTemplateBuffer(departments)
    const rows = await userImportService.parseBuffer(buffer, { departments, existingEmails: new Set() })
    expect(userImportService.summarize(rows)).toEqual({ total: 2, valid: 2, invalid: 0 })
    expect(rows[1].input).toMatchObject({ role: 'LECTURER', departmentId: 'P2' })

    const created = await userService.bulkCreate(rows.flatMap((r) => (r.input ? [r.input] : [])))
    expect(created).toBe(2)
    expect((await userService.list()).length).toBe(11)
  })

  it('API: tạo gửi payload snake_case + nhận mật khẩu tạm', async () => {
    vi.mocked(isDemoMode).mockReturnValue(false)
    const r = await userService.create({ ...userService.emptyInput(), fullName: 'A', email: 'a@sbv.gov.vn', role: 'LECTURER' })
    expect(createUserRequest).toHaveBeenCalledWith(expect.objectContaining({ full_name: 'A', email: 'a@sbv.gov.vn', role: 'LECTURER' }))
    expect(r).toMatchObject({ user: { id: 'u-1', role: 'LECTURER' }, temporaryPassword: 'Tmp@12345' })
  })
})