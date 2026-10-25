import { isDemoMode, useAuthStore } from '@/features/auth'
import { getDemoAttemptLog } from '@/features/learning'
import { ApiError } from '@/shared/api/errors'
import { normalizeText } from '@/shared/lib/format'
import { fetchCertificates } from '../api/queries'
import { toCertificates } from '../adapters/certificateAdapter'
import { CERTIFICATES_CONFIG } from '../config/certificates.config'
import { sanitizeFileName } from '../lib/utils'
import type { Certificate } from '../model/types'

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), CERTIFICATES_CONFIG.demoDelayMs))

const time = (iso: string | null) => (iso ? Date.parse(iso) || 0 : 0)

const demoCertificates = (): Certificate[] => {
  const user = useAuthStore.getState().user
  const recipientName = user?.fullName ?? 'Học viên'
  const departmentName = user?.departmentName ?? null
  const fromQuiz: Certificate[] = getDemoAttemptLog()
    .filter((l) => l.result.passed && l.result.certificateCode)
    .map((l) => ({
      id: l.result.certificateCode as string,
      code: l.result.certificateCode as string,
      courseId: l.result.courseId,
      courseTitle: l.courseTitle,
      recipientName,
      departmentName,
      score: l.result.score,
      issuedAt: l.result.submittedAt,
      attemptId: l.result.attemptId,
      pdfUrl: null
    }))
  const fixed = CERTIFICATES_CONFIG.demo.map((c) => ({ ...c, recipientName, departmentName }))
  return certificateService.latestPerCourse([...fromQuiz, ...fixed])
}

export const certificateService = {
  async getCertificates(): Promise<Certificate[]> {
    if (isDemoMode()) return delay(certificateService.sortNewest(demoCertificates()))
    const raw = await fetchCertificates()
    try {
      return certificateService.sortNewest(toCertificates(raw))
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu chứng chỉ không hợp lệ')
    }
  },

  sortNewest(list: Certificate[]): Certificate[] {
    return [...list].sort((a, b) => time(b.issuedAt) - time(a.issuedAt))
  },

  /** Mỗi khóa chỉ giữ chứng chỉ mới nhất */
  latestPerCourse(list: Certificate[]): Certificate[] {
    const map = new Map<string, Certificate>()
    for (const c of list) {
      const cur = map.get(c.courseId)
      if (!cur || time(c.issuedAt) > time(cur.issuedAt)) map.set(c.courseId, c)
    }
    return [...map.values()]
  },

  filter(list: Certificate[], search: string): Certificate[] {
    const q = normalizeText(search)
    if (!q) return list
    return list.filter((c) => normalizeText(`${c.courseTitle} ${c.code}`).includes(q))
  },

  fileName(cert: Certificate): string {
    return `Chung-chi-${sanitizeFileName(cert.courseTitle) || 'khoa-hoc'}-${cert.code}.pdf`
  }
}