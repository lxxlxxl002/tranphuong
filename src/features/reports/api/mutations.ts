import { reportsClient } from './client'
import { REPORTS_ENDPOINTS } from './endpoints'

/** Ghi nhật ký xuất báo cáo (phục vụ kiểm soát nội bộ) */
export const logExportRequest = (payload: { fileName: string; rows: number; filters: string[] }) =>
  reportsClient.mutate<void>(REPORTS_ENDPOINTS.exportLog, payload)