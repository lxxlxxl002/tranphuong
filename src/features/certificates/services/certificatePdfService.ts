import { CERTIFICATES_CONFIG } from '../config/certificates.config'
import { PDF_PAGE_MM } from '../model/constants'
import { nextFrame, waitForImages } from '../lib/utils'
import { formatDate } from '@/shared/lib/date'
import type { Certificate } from '../model/types'

export const certificatePdfService = {
  /** Nội dung mã QR: link xác thực (nếu cấu hình) hoặc thông tin chứng chỉ */
  qrPayload(cert: Certificate): string {
    if (CERTIFICATES_CONFIG.verifyBaseUrl) return `${CERTIFICATES_CONFIG.verifyBaseUrl}${encodeURIComponent(cert.code)}`
    return [
      `Ma so: ${cert.code}`,
      `Ho ten: ${cert.recipientName}`,
      `Khoa hoc: ${cert.courseTitle}`,
      `Ngay cap: ${formatDate(cert.issuedAt)}`,
      CERTIFICATES_CONFIG.orgName
    ].join('\n')
  },

  async buildQrDataUrl(cert: Certificate): Promise<string> {
    const QRCode = await import('qrcode')
    return QRCode.toDataURL(certificatePdfService.qrPayload(cert), {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 260,
      color: { dark: '#1e3a8a', light: '#ffffff' }
    })
  },

  /** Chụp phần tử A4 → PDF (thư viện nặng được tải khi cần) */
  async exportElement(element: HTMLElement, fileName: string): Promise<void> {
    await document.fonts?.ready
    await waitForImages(element)
    await nextFrame()
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])
    const canvas = await html2canvas(element, {
      scale: CERTIFICATES_CONFIG.pdfScale,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    })
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, PDF_PAGE_MM.width, PDF_PAGE_MM.height)
    pdf.setProperties({ title: fileName.replace(/\.pdf$/, ''), creator: CERTIFICATES_CONFIG.orgName })
    pdf.save(fileName)
  },

  openRemote(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}