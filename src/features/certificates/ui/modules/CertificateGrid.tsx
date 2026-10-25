import { AlertTriangle, Award, RefreshCw } from 'lucide-react'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useCertificates } from '../../hooks/useCertificates'
import { useDownloadPdf } from '../../hooks/useDownloadPdf'
import { CertificateCard, CertificateCardSkeleton } from '../components/CertificateCard'
import { CertificatePdfTemplate } from './CertificatePdfTemplate'

const GRID = 'grid gap-5 md:grid-cols-2 xl:grid-cols-3'

export function CertificateGrid() {
  const { certificates, total, isLoading, isError, error, refetch } = useCertificates()
  const { download, downloadingId, job, templateRef } = useDownloadPdf()

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success(`Đã sao chép mã ${code}`)
    } catch {
      toast.error('Không sao chép được, vui lòng chọn và sao chép thủ công')
    }
  }

  if (isError) {
    return (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được chứng chỉ"
          description={getErrorMessage(error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 3 }).map((_, i) => (
          <CertificateCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (certificates.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Award}
          title={total === 0 ? 'Bạn chưa có chứng chỉ nào' : 'Không tìm thấy chứng chỉ phù hợp'}
          description={total === 0 ? 'Hoàn thành khóa học và đạt bài kiểm tra cuối khóa để nhận chứng chỉ.' : 'Thử từ khóa khác.'}
        />
      </Card>
    )
  }

  return (
    <>
      <div className={GRID}>
        {certificates.map((c) => (
          <CertificateCard
            key={c.id}
            cert={c}
            downloading={downloadingId === c.id}
            disabled={!!downloadingId && downloadingId !== c.id}
            onDownload={() => void download(c)}
            onCopyCode={() => void copyCode(c.code)}
          />
        ))}
      </div>
      {job && <CertificatePdfTemplate ref={templateRef} cert={job.cert} qrDataUrl={job.qrDataUrl} />}
    </>
  )
}