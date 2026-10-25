export interface Certificate {
  id: string
  code: string
  courseId: string
  courseTitle: string
  recipientName: string
  departmentName: string | null
  score: number | null
  issuedAt: string | null
  attemptId: string | null
  /** File PDF do backend cấp sẵn (nếu có) — ưu tiên hơn tự tạo */
  pdfUrl: string | null
}

export interface PdfJob {
  cert: Certificate
  qrDataUrl: string
}