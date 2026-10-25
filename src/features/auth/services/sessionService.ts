import { ApiError } from '@/shared/api/errors'
import { ALL_PERMISSIONS } from '@/shared/constants/permissions'
import { fetchMe } from '../api/queries'
import { toMe } from '../adapters/authAdapter'
import { AUTH_CONFIG } from '../config/auth.config'
import { authActions } from '../state/actions'
import type { Session } from '../model/types'

export const sessionService = {
  isDemo(token: string | null): boolean {
    return AUTH_CONFIG.allowDemo && token === AUTH_CONFIG.demoToken
  },

  isExpired(expiresAt?: string | null): boolean {
    return !!expiresAt && Date.parse(expiresAt) <= Date.now()
  },

  /** Lấy lại hồ sơ + quyền mới nhất từ server, cập nhật store */
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
      user: {
        id: 'dev-admin',
        fullName: 'Quản trị viên',
        email: 'admin@sbv.gov.vn',
        role: 'ADMIN',
        departmentId: null,
        departmentName: null
      },
      permissions: ALL_PERMISSIONS
    }
  }
}