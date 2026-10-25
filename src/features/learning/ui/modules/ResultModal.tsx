import { Award, FileSearch, Trophy, XCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { formatClock } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import type { QuizResult } from '../../model/types'

interface ResultModalProps {
  open: boolean
  result: QuizResult | null
  onClose: () => void
  onViewDetail: () => void
  onBackToCourse: () => void
  onViewCertificate: () => void
}

export function ResultModal({ open, result, onClose, onViewDetail, onBackToCourse, onViewCertificate }: ResultModalProps) {
  if (!result) return null
  const passed = result.passed
  const stats: [string, string][] = [
    ['Số câu đúng', `${result.correctCount}/${result.total}`],
    ['Điểm đạt', `≥ ${result.passScore}`],
    ['Thời gian', formatClock(result.timeSpentSec)]
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      hideClose
      footer={
        <>
          <Button variant="secondary" onClick={onBackToCourse}>
            Về khóa học
          </Button>
          <Button variant="secondary" leftIcon={<FileSearch />} onClick={onViewDetail}>
            Xem chi tiết
          </Button>
          {passed && result.certificateCode && (
            <Button leftIcon={<Award />} onClick={onViewCertificate}>
              Xem chứng chỉ
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col items-center py-2 text-center">
        <span className={cn('flex h-20 w-20 items-center justify-center rounded-full', passed ? 'bg-green-50 text-green-500' : 'bg-rose-50 text-rose-500')}>
          {passed ? <Trophy className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
        </span>
        <h2 className="mt-4 text-xl font-bold text-ink">{passed ? 'Chúc mừng! Bạn đã đạt' : 'Chưa đạt yêu cầu'}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {passed ? 'Bạn đã hoàn thành bài kiểm tra cuối khóa.' : `Cần tối thiểu ${result.passScore} điểm để đạt. Hãy ôn tập và thử lại.`}
        </p>
        <p className={cn('mt-5 text-5xl font-extrabold tabular-nums', passed ? 'text-green-600' : 'text-rose-500')}>
          {result.score}
          <span className="text-2xl font-bold text-ink-faint">/100</span>
        </p>
        <dl className="mt-6 grid w-full grid-cols-3 gap-3">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 px-3 py-3">
              <dt className="text-xs text-ink-muted">{label}</dt>
              <dd className="mt-1 text-base font-bold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        {passed && result.certificateCode && (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
            <Award className="h-3.5 w-3.5" />
            Mã chứng chỉ: {result.certificateCode}
          </p>
        )}
      </div>
    </Modal>
  )
}