import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => true)
}))

import { permissionService, resetDemoRoles } from '../../services/permissionService'

describe('Luồng Phân quyền', () => {
  beforeEach(() => resetDemoRoles())

  it('demo: 4 vai trò hệ thống + số người theo vai trò', async () => {
    const roles = await permissionService.listRoles()
    expect(roles.map((r) => [r.key, r.userCount])).toEqual([
      ['ADMIN', 1],
      ['DEPT_LEAD', 1],
      ['LECTURER', 2],
      ['LEARNER', 5]
    ])
    expect(permissionService.summary(roles[0])).toBe('Toàn quyền · Hệ thống')
  })

  it('demo: lưu quyền Học viên; không cho sửa ADMIN', async () => {
    await permissionService.savePermissions('LEARNER', ['dashboard:view', 'certificates:view'])
    const roles = await permissionService.listRoles()
    expect(roles.find((r) => r.key === 'LEARNER')?.permissions).toEqual(['dashboard:view', 'certificates:view'])
    await expect(permissionService.savePermissions('ADMIN', [])).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('demo: tạo vai trò sao chép quyền → xóa; không xóa vai trò hệ thống', async () => {
    let roles = await permissionService.listRoles()
    const created = await permissionService.createRole({ key: 'THANH_TRA', name: 'Thanh tra viên', description: '', cloneFrom: 'DEPT_LEAD' }, roles)
    expect(created.permissions).toEqual(roles.find((r) => r.key === 'DEPT_LEAD')?.permissions)

    roles = await permissionService.listRoles()
    expect(roles).toHaveLength(5)
    await permissionService.deleteRole(roles[4])
    expect(await permissionService.listRoles()).toHaveLength(4)
    await expect(permissionService.deleteRole(roles[0])).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})