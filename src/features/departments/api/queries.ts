import { departmentsClient } from './client'
import { DEPARTMENTS_ENDPOINTS } from './endpoints'

export const fetchDepartments = () => departmentsClient.query<unknown>(DEPARTMENTS_ENDPOINTS.list)