import { certificatesClient } from './client'
import { CERTIFICATES_ENDPOINTS } from './endpoints'

export const fetchCertificates = () => certificatesClient.query<unknown>(CERTIFICATES_ENDPOINTS.list)

/** Xác thực công khai theo mã số (không cần đăng nhập) */
export const verifyCertificate = (code: string) =>
  certificatesClient.query<unknown>(CERTIFICATES_ENDPOINTS.verify, { code }, { auth: false })