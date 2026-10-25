import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../api/mutations', () => ({
  loginRequest: vi.fn(async () => ({
    token: 'tok-123',
    user: { id: 'u1', full_name: 'Trần Phương', email: 'phuong@sbv.gov.vn', role: 'LANH_DAO_PHONG' },
    permissions: ['dashboard:view', 'reports:view']
  })),
  logoutRequest: vi.fn(async () => undefined)
}))

import { authService } from '../../services/authService'
import { useAuthStore } from '../../state/store'

describe('Luồng đăng nhập / đăng xuất', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ token: null, user: null, permissions: [], status: 'unauthenticated' })
  })

  it('đăng nhập → lưu phiên + ghi nhớ', async () => {
    await authService.login({ email: 'phuong@sbv.gov.vn', password: '123456', remember: true })
    const s = useAuthStore.getState()
    expect(s.status).toBe('authenticated')
    expect(s.user?.role).toBe('DEPT_LEAD')
    expect(s.permissions).toEqual(['dashboard:view', 'reports:view'])
    expect(localStorage.getItem('lms-sbv:token')).toBe('"tok-123"')
  })

  it('không ghi nhớ → không lưu localStorage', async () => {
    await authService.login({ email: 'phuong@sbv.gov.vn', password: '123456', remember: false })
    expect(useAuthStore.getState().token).toBe('tok-123')
    expect(localStorage.getItem('lms-sbv:token')).toBeNull()
  })

  it('đăng xuất → xóa sạch phiên', async () => {
    await authService.login({ email: 'phuong@sbv.gov.vn', password: '123456' })
    await authService.logout()
    expect(useAuthStore.getState().user).toBeNull()
    expect(localStorage.getItem('lms-sbv:token')).toBeNull()
  })

  it('chặn dữ liệu đầu vào sai', async () => {
    await expect(authService.login({ email: 'sai', password: '' })).rejects.toMatchObject({ code: 'VALIDATION' })
  })
})