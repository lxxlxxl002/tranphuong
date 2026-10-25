import { describe, expect, it } from 'vitest'
import { toPermissions, toRole, toSession } from '../../adapters/authAdapter'
import { validateLogin } from '../../lib/validators'

describe('authAdapter', () => {
  it('map vai trò tiếng Việt / alias về mã chuẩn', () => {
    expect(toRole('Quản trị viên')).toBe('ADMIN')
    expect(toRole('giang_vien')).toBe('LECTURER')
    expect(toRole('Lãnh đạo phòng')).toBe('DEPT_LEAD')
    expect(toRole('???')).toBe('LEARNER')
  })

  it('không có quyền → dùng quyền mặc định của vai trò', () => {
    expect(toPermissions([], 'LEARNER')).toContain('my-courses:view')
  })

  it('lọc bỏ quyền không hợp lệ', () => {
    expect(toPermissions(['users:view', 'abc'], 'ADMIN')).toEqual(['users:view'])
  })

  it('map phản hồi đăng nhập', () => {
    const s = toSession({
      token: 't',
      user: {
        id: 1,
        full_name: 'Vũ Hoài Thanh',
        email: 'thanh@sbv.gov.vn',
        role: 'HOC_VIEN',
        department_id: 'P1',
        department_name: 'Phòng Tổng hợp và chính sách'
      }
    })
    expect(s.user.id).toBe('1')
    expect(s.user.role).toBe('LEARNER')
    expect(s.user.departmentId).toBe('P1')
  })
})

describe('validateLogin', () => {
  it('báo lỗi khi bỏ trống', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Vui lòng nhập email',
      password: 'Vui lòng nhập mật khẩu'
    })
  })

  it('hợp lệ khi đủ thông tin', () => {
    expect(validateLogin({ email: 'a@sbv.gov.vn', password: '123456' })).toEqual({})
  })
})