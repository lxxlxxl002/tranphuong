import type { Certificate } from '../model/types'

const demo: Certificate[] = [
  {
    id: 'QLGS-2026-161451',
    code: 'QLGS-2026-161451',
    courseId: 'chuyen-doi-so',
    courseTitle: 'CHUYỂN ĐỔI SỐ',
    recipientName: '',
    departmentName: null,
    score: 94,
    issuedAt: '2026-07-02',
    attemptId: 'demo-cds-1',
    pdfUrl: null
  }
]

export const CERTIFICATES_CONFIG = {
  timeout: 20_000,
  staleTime: 60_000,
  demoDelayMs: 300,
  /** Nội dung in trên PDF */
  parentOrg: 'Ngân hàng Nhà nước Việt Nam',
  orgName: 'Cục Quản lý, Giám sát Tổ chức Tín dụng',
  issuePlace: 'Hà Nội',
  signerTitle: 'Cục trưởng',
  signerName: '',
  /** URL trang xác thực — QR = verifyBaseUrl + mã số. Để trống: QR chứa thông tin chứng chỉ */
  verifyBaseUrl: (import.meta.env.VITE_CERT_VERIFY_URL as string | undefined) ?? '',
  pdfScale: 2,
  demo
}