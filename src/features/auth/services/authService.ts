import { ApiError } from '@/shared/api/errors'
import { loginRequest, logoutRequest } from '../api/mutations'
import { toSession } from '../adapters/authAdapter'
import { AUTH_CONFIG, MOCK_ACCOUNTS } from '../config/auth.config'
import { loginSchema } from '../model/schemas'
import type { LoginInput, Session } from '../model/types'
import { authActions } from '../state/actions'
import { sessionService } from './sessionService'

const matchMock = (email: string, password: string) =>
  MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password)

export const authService = {
  async login(input: LoginInput): Promise<Session> {
    const parsed = loginSchema.safeParse(input)
    if (!parsed.success) throw new ApiError('VALIDATION', parsed.error.issues[0]?.message)

    if (AUTH_CONFIG.mockAuth) {
      const acc = matchMock(parsed.data.email, parsed.data.password)
      if (acc) {
        const session = sessionService.buildMockSession(acc)
        authActions.setSession(session, input.remember ?? AUTH_CONFIG.rememberDefault)
        return session
      }
      throw new ApiError('UNAUTHORIZED', 'Email hoặc mật khẩu không đúng')
    }

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

  async logout(): Promise<void> {
    if (!AUTH_CONFIG.mockAuth) {
      try {
        await logoutRequest()
      } catch {
        /* bỏ qua lỗi server */
      }
    }
    authActions.clearSession()
  }
}