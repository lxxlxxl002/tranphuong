import { describe, expect, it } from 'vitest'
import { toCertificates } from '../../adapters/certificateAdapter'
import { certificateService } from '../../services/certificateService'
import { certificatePdfService } from '../../services/certificatePdfService'
import { sanitizeFileName, vnDateLong } from '../../lib/utils'
import { isCertificateCode } from '../../lib/validators'
import type { Certificate } from '../../model/types'

const base: Certificate = {
  id: 'x',
  code: 'QLGS-2026-161451',
  courseId: 'cds',
  courseTitle: 'CHUYỂN ĐỔI SỐ',
  recipientName: 'Trần Phương',
  departmentName: null,
  score: 94,
  issuedAt: '2026-07-02',
  attemptId: null,
  pdfUrl: null
}

describe('certificateAdapter', () => {
  it('chuẩn hóa mã, id dự phòng, ép kiểu điểm', () => {
    const [c] = toCertificates([{ code: ' qlgs-2026-161451 ', course_id: 3, course_title: 'CHUYỂN ĐỔI SỐ', recipient_name: 'Trần Phương', score: '94', issued_at: '02/07/2026' }])
    expect(c).toMatchObject({ id: 'QLGS-2026-161451', code: 'QLGS-2026-161451', courseId: '3', score: 94, pdfUrl: null })
  })
})

describe('tiện ích', () => {
  it('ngày dạng văn bản hành chính', () => {
    expect(vnDateLong('2026-07-02')).toBe('ngày 02 tháng 07 năm 2026')
    expect(vnDateLong('02/07/2026')).toBe('ngày 02 tháng 07 năm 2026')
  })

  it('tên file không dấu', () => {
    expect(sanitizeFileName('CHUYỂN ĐỔI SỐ')).toBe('chuyen-doi-so')
    expect(certificateService.fileName(base)).toBe('Chung-chi-chuyen-doi-so-QLGS-2026-161451.pdf')
  })

  it('kiểm tra mã chứng chỉ', () => {
    expect(isCertificateCode('QLGS-2026-161451')).toBe(true)
    expect(isCertificateCode('abc')).toBe(false)
  })
})

describe('certificateService', () => {
  it('tìm kiếm không dấu theo khóa học hoặc mã', () => {
    expect(certificateService.filter([base], 'chuyen doi')).toHaveLength(1)
    expect(certificateService.filter([base], '161451')).toHaveLength(1)
    expect(certificateService.filter([base], 'basel')).toHaveLength(0)
  })

  it('mỗi khóa giữ chứng chỉ mới nhất', () => {
    const list = certificateService.latestPerCourse([base, { ...base, id: 'y', code: 'QLGS-2026-999999', issuedAt: '2026-08-01' }])
    expect(list.map((c) => c.id)).toEqual(['y'])
  })
})

describe('certificatePdfService', () => {
  it('QR chứa mã số và tạo được ảnh PNG', async () => {
    expect(certificatePdfService.qrPayload(base)).toContain('QLGS-2026-161451')
    const url = await certificatePdfService.buildQrDataUrl(base)
    expect(url.startsWith('data:image/png;base64,')).toBe(true)
  })
})