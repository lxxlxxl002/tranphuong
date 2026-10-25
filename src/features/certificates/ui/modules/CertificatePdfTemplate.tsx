import { forwardRef } from 'react'
import { createPortal } from 'react-dom'
import logo from '@/assets/logo-quoc-huy.png'
import { CERTIFICATES_CONFIG } from '../../config/certificates.config'
import { vnDateLong } from '../../lib/utils'
import { PDF_PAGE_PX } from '../../model/constants'
import type { Certificate } from '../../model/types'

interface Props {
  cert: Certificate
  qrDataUrl: string
}

const NAVY = '#1e3a8a'
const GOLD = '#b8862b'
const SERIF = 'Georgia, "Times New Roman", serif'

/** Mẫu A4 ngang render ngoài màn hình để chụp thành PDF */
export const CertificatePdfTemplate = forwardRef<HTMLDivElement, Props>(function CertificatePdfTemplate({ cert, qrDataUrl }, ref) {
  const cfg = CERTIFICATES_CONFIG
  return createPortal(
    <div aria-hidden style={{ position: 'fixed', left: -10000, top: 0, width: PDF_PAGE_PX.width, height: PDF_PAGE_PX.height, pointerEvents: 'none' }}>
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: PDF_PAGE_PX.width,
          height: PDF_PAGE_PX.height,
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 42%, #ffffff 0%, #f8faff 58%, #edf2ff 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#0f172a'
        }}
      >
        <div style={{ position: 'absolute', inset: 22, border: `3px solid ${GOLD}`, borderRadius: 6 }} />
        <div style={{ position: 'absolute', inset: 32, border: '1px solid #d9b25b', borderRadius: 4 }} />
        <img
          src={logo}
          alt=""
          style={{ position: 'absolute', left: '50%', top: '50%', width: 430, height: 430, transform: 'translate(-50%, -46%)', opacity: 0.05 }}
        />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '58px 110px 0' }}>
          <p style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', color: NAVY, letterSpacing: '0.02em' }}>{cfg.parentOrg}</p>
          <p style={{ marginTop: 2, fontSize: 17, fontWeight: 800, textTransform: 'uppercase', color: NAVY }}>{cfg.orgName}</p>
          <img src={logo} alt="" style={{ marginTop: 16, width: 78, height: 78 }} />

          <p style={{ marginTop: 14, fontSize: 56, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: GOLD, lineHeight: 1.05 }}>
            Chứng chỉ
          </p>
          <p style={{ marginTop: 4, fontSize: 15, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.32em', color: NAVY }}>
            Hoàn thành khóa học
          </p>

          <p style={{ marginTop: 26, fontSize: 17, fontStyle: 'italic', color: '#475569' }}>Chứng nhận Ông/Bà</p>
          <p style={{ marginTop: 4, fontSize: 42, fontWeight: 700, color: NAVY, fontFamily: SERIF, lineHeight: 1.15 }}>{cert.recipientName}</p>
          {cert.departmentName && <p style={{ marginTop: 2, fontSize: 15, color: '#475569' }}>{cert.departmentName}</p>}

          <p style={{ marginTop: 16, fontSize: 17, color: '#475569' }}>Đã hoàn thành khóa học</p>
          <p style={{ marginTop: 4, fontSize: 27, fontWeight: 800, textTransform: 'uppercase', color: '#0f172a' }}>{cert.courseTitle}</p>
          {cert.score != null && (
            <p style={{ marginTop: 8, fontSize: 16, color: '#475569' }}>
              với kết quả <b style={{ color: NAVY }}>{cert.score}/100 điểm</b>
            </p>
          )}
        </div>

        <div style={{ position: 'absolute', left: 84, right: 96, bottom: 62, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <img src={qrDataUrl} alt="" style={{ width: 104, height: 104, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', padding: 4 }} />
            <div style={{ paddingBottom: 6 }}>
              <p style={{ fontSize: 12, color: '#64748b' }}>Mã số chứng chỉ</p>
              <p style={{ marginTop: 2, fontSize: 16, fontWeight: 700, color: NAVY, letterSpacing: '0.04em' }}>{cert.code}</p>
              <p style={{ marginTop: 4, fontSize: 11, color: '#94a3b8' }}>Quét mã QR để xác thực</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', minWidth: 300 }}>
            <p style={{ fontSize: 15, fontStyle: 'italic', color: '#475569' }}>
              {cfg.issuePlace}, {vnDateLong(cert.issuedAt)}
            </p>
            <p style={{ marginTop: 6, fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: NAVY }}>{cfg.signerTitle}</p>
            <div style={{ height: 70 }} />
            <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', fontFamily: SERIF }}>{cfg.signerName}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
})