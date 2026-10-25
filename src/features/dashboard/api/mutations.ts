import { dashboardClient } from './client'
import { DASHBOARD_ENDPOINTS } from './endpoints'

/** Yêu cầu backend tính lại cache thống kê (chỉ Quản trị viên) */
export const refreshStatsRequest = () => dashboardClient.mutate<void>(DASHBOARD_ENDPOINTS.refresh)