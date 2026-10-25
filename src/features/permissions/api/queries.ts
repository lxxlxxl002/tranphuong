import { permissionsClient } from './client'
import { PERMISSIONS_ENDPOINTS } from './endpoints'

export const fetchRoles = () => permissionsClient.query<unknown>(PERMISSIONS_ENDPOINTS.roles)