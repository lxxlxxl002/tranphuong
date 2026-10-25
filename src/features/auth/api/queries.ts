import { authClient } from './client'
import { AUTH_ENDPOINTS } from './endpoints'

/** Trả về dữ liệu thô — adapter chịu trách nhiệm parse */
export const fetchMe = () => authClient.query<unknown>(AUTH_ENDPOINTS.me)