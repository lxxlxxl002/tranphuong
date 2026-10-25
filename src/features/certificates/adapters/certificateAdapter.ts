import { rawCertificateListSchema, rawCertificateSchema, type RawCertificate } from '../model/schemas'
import type { Certificate } from '../model/types'

export const toCertificate = (r: RawCertificate): Certificate => {
  const code = r.code.trim().toUpperCase()
  return {
    id: r.id != null ? String(r.id) : code,
    code,
    courseId: String(r.course_id),
    courseTitle: r.course_title.trim(),
    recipientName: r.recipient_name.trim(),
    departmentName: r.department_name,
    score: r.score == null ? null : Math.max(0, Math.min(100, Math.round(r.score))),
    issuedAt: r.issued_at,
    attemptId: r.attempt_id != null ? String(r.attempt_id) : null,
    pdfUrl: r.pdf_url
  }
}

export const toCertificates = (input: unknown): Certificate[] => rawCertificateListSchema.parse(input).map(toCertificate)

export const toVerifiedCertificate = (input: unknown): Certificate => toCertificate(rawCertificateSchema.parse(input))