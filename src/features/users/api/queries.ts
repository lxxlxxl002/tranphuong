import { usersClient } from './client'
import { USERS_ENDPOINTS } from './endpoints'

export const fetchUsers = () => usersClient.query<unknown>(USERS_ENDPOINTS.list)

export const fetchUser = (userId: string) => usersClient.query<unknown>(USERS_ENDPOINTS.detail, { userId })

export const fetchDepartmentOptions = () => usersClient.query<unknown>(USERS_ENDPOINTS.departments)