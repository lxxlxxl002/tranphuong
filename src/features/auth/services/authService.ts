import { ApiError } from '@/shared/api/errors'
import { loginRequest, logoutRequest } from '../api/mutations'
import { toSession } from '../adapters/authAdapter'
import { AUTH_CONFIG } from '../config/auth.config'
import { loginSchema } from '../model/schemas'
import type { LoginInput, Session } from '../model/types'
import { authActions } from '../state/actions'
import { sessionService } from './sessionService'

export const authService = {
  /** Xác thực → map dữ liệu → lưu phiên */
  async login(input: LoginInput): Promise<Session> {
    const parsed = loginSchema.safeParse(input)
    if (!parsed.success) throw new ApiError('VALIDATION', parsed.error.issues[0]?.message)

    const raw = await loginRequest({ email: parsed.data.email, password: parsed.data.password })
    let session: Session
    try {
      session = toSession(raw)
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu đăng nhập trả về không hợp lệ')
    }
    authActions.setSession(session, input.remember ?? AUTH_CONFIG.rememberDefault)
    return session
  },

  loginDemo(): void {
    if (!AUTH_CONFIG.allowDemo) return
    authActions.setSession(sessionService.buildDemoSession())
  },

  /** Luôn xóa phiên phía client kể cả khi server lỗi */
  async logout(): Promise<void> {
    try {
      await logoutRequest()
    } catch {
      /* bỏ qua lỗi server */
    } finally {
      authActions.clearSession()
    }
  }
}