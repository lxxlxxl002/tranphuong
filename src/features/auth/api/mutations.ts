import { authClient } from './client'
import { AUTH_ENDPOINTS } from './endpoints'

export const loginRequest = (payload: { email: string; password: string }) =>
  authClient.mutate<unknown>(AUTH_ENDPOINTS.login, payload, { auth: false })

export const logoutRequest = () => authClient.mutate<void>(AUTH_ENDPOINTS.logout)

export const changePasswordRequest = (payload: { currentPassword: string; newPassword: string }) =>
  authClient.mutate<void>(AUTH_ENDPOINTS.changePassword, payload)