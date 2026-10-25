import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { certificatePdfService } from '../services/certificatePdfService'
import { certificateService } from '../services/certificateService'
import type { Certificate, PdfJob } from '../model/types'

/**
 * download(cert) → tạo QR → render mẫu A4 ẩn → chụp thành PDF.
 * UI chỉ cần gắn `templateRef` vào CertificatePdfTemplate khi `job` khác null.
 */
export function useDownloadPdf() {
  const [job, setJob] = useState<PdfJob | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const templateRef = useRef<HTMLDivElement>(null)
  const runningJob = useRef<PdfJob | null>(null)

  const download = useCallback(
    async (cert: Certificate) => {
      if (downloadingId) return
      setDownloadingId(cert.id)
      try {
        if (cert.pdfUrl) {
          certificatePdfService.openRemote(cert.pdfUrl)
          setDownloadingId(null)
          return
        }
        const qrDataUrl = await certificatePdfService.buildQrDataUrl(cert)
        setJob({ cert, qrDataUrl })
      } catch (err) {
        toast.error(getErrorMessage(err))
        setDownloadingId(null)
      }
    },
    [downloadingId]
  )

  useEffect(() => {
    if (!job || runningJob.current === job) return
    runningJob.current = job
    const run = async () => {
      const el = templateRef.current
      if (!el) throw new Error('Không khởi tạo được mẫu chứng chỉ')
      await certificatePdfService.exportElement(el, certificateService.fileName(job.cert))
      toast.success('Đã tải chứng chỉ')
    }
    run()
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => {
        runningJob.current = null
        setJob(null)
        setDownloadingId(null)
      })
  }, [job])

  return { download, downloadingId, job, templateRef }
}