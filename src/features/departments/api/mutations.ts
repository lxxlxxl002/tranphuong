import { departmentsClient } from './client'
import { DEPARTMENTS_ENDPOINTS as E } from './endpoints'

export const createDepartmentRequest = (input: Record<string, unknown>) => departmentsClient.mutate<unknown>(E.create, { input })

export const updateDepartmentRequest = (departmentId: string, input: Record<string, unknown>) =>
  departmentsClient.mutate<unknown>(E.update, { departmentId, input })

export const deleteDepartmentRequest = (departmentId: string) => departmentsClient.mutate<void>(E.remove, { departmentId })