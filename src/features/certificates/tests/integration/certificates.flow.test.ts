import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => false)
}))

vi.mock('../../api/queries', () => ({
  fetchCertificates: vi.fn(async () => [
    { id: 1, code: 'QLGS-2026-000001', course_id: 'a', course_title: 'A', recipient_name: 'X', issued_at: '2026-01-01' },
    { id: 2, code: 'QLGS-2026-000002', course_id: 'b', course_title: 'B', recipient_name: 'X', issued_at: '2026-06-01', pdf_url: 'https://drive.google.com/file/d/abc/view' }
  ]),
  verifyCertificate: vi.fn()
}))

import { isDemoMode, useAuthStore } from '@/features/auth'
import { lessonService, quizService } from '@/features/learning'
import { certificateService } from '../../services/certificateService'

describe('Luồng Chứng chỉ', () => {
  beforeEach(() => {
    vi.mocked(isDemoMode).mockReturnValue(false)
  })

  it('API: map + sắp mới nhất + giữ pdf_url', async () => {
    const list = await certificateService.getCertificates()
    expect(list.map((c) => c.id)).toEqual(['2', '1'])
    expect(list[0].pdfUrl).toContain('drive.google.com')
  })

  it('demo: đạt bài kiểm tra ở learning → có chứng chỉ mang tên người đang đăng nhập', async () => {
    vi.mocked(isDemoMode).mockReturnValue(true)
    useAuthStore.setState({
      token: 'dev-token',
      status: 'authenticated',
      permissions: [],
      user: { id: 'u', fullName: 'Nguyễn Hà My', email: 'my@sbv.gov.vn', role: 'LEARNER', departmentId: 'P5', departmentName: 'Phòng Quản lý, giám sát NHTMCP2' }
    })
    const content = await lessonService.getCourseContent('cong-tac-giam-sat')
    const session = await quizService.start('cong-tac-giam-sat', content.quiz!)
    const result = await quizService.submit(session, { g1: ['g1-0'] })
    expect(result.passed).toBe(true)

    const list = await certificateService.getCertificates()
    const cert = list.find((c) => c.courseId === 'cong-tac-giam-sat')
    expect(cert).toMatchObject({ code: result.certificateCode, recipientName: 'Nguyễn Hà My', departmentName: 'Phòng Quản lý, giám sát NHTMCP2' })
    expect(list.some((c) => c.code === 'QLGS-2026-161451')).toBe(true)
  })
})