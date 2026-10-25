import { reportsClient } from './client'
import { REPORTS_ENDPOINTS } from './endpoints'

export const fetchReportOverview = () => reportsClient.query<unknown>(REPORTS_ENDPOINTS.overview)