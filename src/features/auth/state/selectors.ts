import type { AuthState } from './store'

export const selectToken = (s: AuthState) => s.token
export const selectUser = (s: AuthState) => s.user
export const selectRole = (s: AuthState) => s.user?.role ?? null
export const selectPermissions = (s: AuthState) => s.permissions
export const selectIsAuthenticated = (s: AuthState) => s.status === 'authenticated' && s.user !== null