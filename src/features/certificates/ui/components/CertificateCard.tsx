import { Award, Copy, Download, Loader2, QrCode } from 'lucide-react'
import { formatDate } from '@/shared/lib/date'
import { Skeleton } from '@/shared/ui/Skeleton'
import { CERTIFICATES_CONFIG } from '../../config/certificates.config'
import type { Certificate } from '../../model/types'

interface CertificateCardProps {
  cert: Certificate
  downloading?: boolean
  disabled?: boolean
  onDownload: () => void
  onCopyCode: () => void
}

export function CertificateCard({ cert, downloading, disabled, onDownload, onCopyCode }: CertificateCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-surface-line border-t-[3px] border-t-amber-400 bg-white shadow-card transition hover:shadow-pop">
      <div className="flex flex-1 flex-col items-center px-6 pb-5 pt-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <Award className="h-7 w-7" />
        </span>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">Chứng chỉ hoàn thành</p>
        <p className="mt-1 text-[13px] font-bold uppercase text-brand-600">{CERTIFICATES_CONFIG.orgName}</p>

        <p className="mt-4 text-xs text-ink-muted">Chứng nhận</p>
        <p className="mt-0.5 text-lg font-bold text-ink">{cert.recipientName || '—'}</p>

        <p className="mt-3 text-xs text-ink-muted">đã hoàn thành khóa học</p>
        <p className="mt-0.5 text-[15px] font-semibold uppercase text-ink">{cert.courseTitle}</p>

        <dl className="mt-4 flex gap-10">
          <div>
            <dt className="text-xs text-ink-muted">Điểm số</dt>
            <dd className="mt-0.5 font-bold tabular-nums text-brand-600">{cert.score != null ? `${cert.score}/100` : '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Ngày cấp</dt>
            <dd className="mt-0.5 font-bold tabular-nums text-ink">{formatDate(cert.issuedAt)}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onCopyCode}
          title="Sao chép mã số"
          className="group mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ink-muted transition hover:bg-slate-50 hover:text-ink"
        >
          <QrCode className="h-3.5 w-3.5" />
          Mã số: {cert.code}
          <Copy className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
        </button>
      </div>

      <button
        type="button"
        onClick={onDownload}
        disabled={disabled || downloading}
        className="flex items-center justify-center gap-2 bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {downloading ? 'Đang tạo PDF...' : 'Tải chứng chỉ (PDF)'}
      </button>
    </article>
  )
}

export function CertificateCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-surface-line bg-white p-6 shadow-card">
      <Skeleton className="h-14 w-14 rounded-full" />
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-4 h-10 w-full rounded-lg" />
    </div>
  )
}