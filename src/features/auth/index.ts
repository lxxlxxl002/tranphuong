import { sessionService } from './services/sessionService'
import { useAuthStore } from './state/store'

export { useAuthStore, type AuthState } from './state/store'
export { authActions } from './state/actions'
export * from './state/selectors'
export type * from './model/types'
export { useSession } from './hooks/useSession'
export { useLogin } from './hooks/useLogin'
export { useLogout } from './hooks/useLogout'
export { authService } from './services/authService'
export { sessionService } from './services/sessionService'
export { toRole } from './adapters/authAdapter'
export { authRoutes } from './routes'

/** true khi đang ở phiên demo (chỉ môi trường dev) — feature khác dùng để trả dữ liệu mẫu */
export const isDemoMode = (): boolean => sessionService.isDemo(useAuthStore.getState().token)