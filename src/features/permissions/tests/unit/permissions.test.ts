import { describe, expect, it } from 'vitest'
import { ALL_PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'
import { toRoleDefs } from '../../adapters/permissionAdapter'
import { permissionService } from '../../services/permissionService'
import { slugKey, sortPermissions } from '../../lib/utils'
import { validateRoleInput } from '../../lib/validators'

describe('permissionAdapter', () => {
  it('ADMIN luôn toàn quyền + quyền dạng chuỗi', () => {
    const [admin, lead] = toRoleDefs([
      { key: 'admin', name: 'Quản trị', permissions: [] },
      { key: 'DEPT_LEAD', name: 'Lãnh đạo', system: 'x', permissions: 'reports:view, abc, dashboard:view', user_count: '1' }
    ])
    expect(admin).toMatchObject({ key: 'ADMIN', locked: true, system: true })
    expect(admin.permissions).toHaveLength(ALL_PERMISSIONS.length)
    expect(lead).toMatchObject({ system: true, userCount: 1, permissions: ['dashboard:view', 'reports:view'] })
  })
})

describe('permissionService (thuần)', () => {
  it('bật Thêm → tự bật Xem; tắt Xem → tắt cả nhóm', () => {
    let p: PermissionKey[] = []
    p = permissionService.toggle(p, 'users:create')
    expect(p).toEqual(['users:view', 'users:create'])
    p = permissionService.toggle(p, 'users:update')
    p = permissionService.toggle(p, 'users:view')
    expect(p).toEqual([])
  })

  it('bật/tắt cả nhóm + trạng thái nhóm', () => {
    const all = permissionService.setModule([], 'reports', true)
    expect(permissionService.moduleState(all, 'reports')).toBe('all')
    expect(permissionService.moduleState(['reports:view'], 'reports')).toBe('some')
    expect(permissionService.moduleState(permissionService.setModule(all, 'reports', false), 'reports')).toBe('none')
  })

  it('đếm thay đổi + nhóm hiển thị đủ 12 chức năng × 4 quyền', () => {
    expect(permissionService.diffCount(['a:view', 'b:view'], ['b:view', 'c:view'])).toBe(2)
    const groups = permissionService.buildGroups(['certificates:view'])
    expect(groups).toHaveLength(12)
    expect(groups.find((g) => g.module === 'certificates')?.rows.map((r) => [r.label, r.granted])).toEqual([
      ['Xem', true],
      ['Thêm mới', false],
      ['Chỉnh sửa', false],
      ['Xóa', false]
    ])
  })
})

describe('tiện ích + validators', () => {
  it('sinh mã + sắp xếp quyền', () => {
    expect(slugKey('Thanh tra viên')).toBe('THANH_TRA_VIEN')
    expect(slugKey('2 cấp')).toBe('R_2_CAP')
    expect(sortPermissions(['users:view', 'dashboard:view', 'users:view', 'x:y'])).toEqual(['dashboard:view', 'users:view'])
  })

  it('chặn mã hệ thống / trùng / sai định dạng', () => {
    const base = { name: 'X', description: '', cloneFrom: '' }
    expect(validateRoleInput({ ...base, key: 'ADMIN' }, [], false).key).toBe('Mã này dành cho vai trò hệ thống')
    expect(validateRoleInput({ ...base, key: 'TT' }, ['TT'], false).key).toBe('Mã TT đã tồn tại')
    expect(validateRoleInput({ ...base, key: 'tt' }, [], false).key).toBeDefined()
    expect(validateRoleInput({ ...base, key: 'THANH_TRA' }, [], false)).toEqual({})
  })
})