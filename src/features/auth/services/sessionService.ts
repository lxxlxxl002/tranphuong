import { ApiError } from '@/shared/api/errors'
import { ALL_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from '@/shared/constants/permissions'
import { fetchMe } from '../api/queries'
import { toMe } from '../adapters/authAdapter'
import { AUTH_CONFIG, type MockAccount } from '../config/auth.config'
import { authActions } from '../state/actions'
import type { Session } from '../model/types'

const MOCK_TOKEN_PREFIX = 'mock-'

export const sessionService = {
  isDemo(token: string | null): boolean {
    if (!token) return false
    if (AUTH_CONFIG.allowDemo && token === AUTH_CONFIG.demoToken) return true
    return AUTH_CONFIG.mockAuth && token.startsWith(MOCK_TOKEN_PREFIX)
  },

  isExpired(expiresAt?: string | null): boolean {
    return !!expiresAt && Date.parse(expiresAt) <= Date.now()
  },

  async sync() {
    const raw = await fetchMe()
    let me: ReturnType<typeof toMe>
    try {
      me = toMe(raw)
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu phiên đăng nhập không hợp lệ')
    }
    authActions.updateUser(me.user)
    authActions.setPermissions(me.permissions)
    return me
  },

  buildDemoSession(): Session {
    return {
      token: AUTH_CONFIG.demoToken,
      user: { id: 'dev-admin', fullName: 'Quản trị viên', email: 'admin@sbv.gov.vn', role: 'ADMIN', departmentId: null, departmentName: null },
      permissions: ALL_PERMISSIONS
    }
  },

  buildMockSession(acc: MockAccount): Session {
    return {
      token: `${MOCK_TOKEN_PREFIX}${acc.role.toLowerCase()}-${Date.now()}`,
      user: {
        id: `mock-${acc.role.toLowerCase()}`,
        fullName: acc.fullName,
        email: acc.email,
        role: acc.role,
        departmentId: acc.departmentId,
        departmentName: acc.departmentName
      },
      permissions: acc.role === 'ADMIN' ? ALL_PERMISSIONS : DEFAULT_ROLE_PERMISSIONS[acc.role]
    }
  }
}