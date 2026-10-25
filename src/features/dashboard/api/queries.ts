import { dashboardClient } from './client'
import { DASHBOARD_ENDPOINTS } from './endpoints'

export const fetchStats = () => dashboardClient.query<unknown>(DASHBOARD_ENDPOINTS.stats)

export const fetchDeptStats = () => dashboardClient.query<unknown>(DASHBOARD_ENDPOINTS.deptStats)