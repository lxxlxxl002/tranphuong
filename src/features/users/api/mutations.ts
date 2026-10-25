import { usersClient } from './client'
import { USERS_ENDPOINTS as E } from './endpoints'

export const createUserRequest = (input: Record<string, unknown>) => usersClient.mutate<unknown>(E.create, { input })

export const updateUserRequest = (userId: string, input: Record<string, unknown>) =>
  usersClient.mutate<unknown>(E.update, { userId, input })

export const setUserStatusRequest = (userId: string, status: string) => usersClient.mutate<void>(E.setStatus, { userId, status })

export const deleteUserRequest = (userId: string) => usersClient.mutate<void>(E.remove, { userId })

export const resetPasswordRequest = (userId: string) => usersClient.mutate<unknown>(E.resetPassword, { userId })

export const bulkCreateUsersRequest = (inputs: Record<string, unknown>[]) =>
  usersClient.mutate<unknown>(E.bulkCreate, { inputs }, { timeout: 120_000 })