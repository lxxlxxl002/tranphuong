import { useNavigate, useParams } from 'react-router'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { PATHS } from '@/app/router/paths'
import { getErrorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { formatClock, formatDateTime } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useResultDetail } from '../../hooks/useResultDetail'
import { AnswerReview } from '../modules/AnswerReview'
import { ResultBadge } from '../components/ResultBadge'

export default function ExamResultDetail() {
  const { attemptId = '' } = useParams()
  const navigate = useNavigate()
  const { attempt, isLoading, isError, error, refetch } = useResultDetail(attemptId)

  const back = (
    <Button variant="secondary" leftIcon={<ArrowLeft />} onClick={() => navigate(PATHS.examResults)}>
      Danh sách kết quả
    </Button>
  )

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !attempt) {
    return (
      <>
        <PageHeader title="Chi tiết bài làm" actions={back} />
        <Card>
          <EmptyState
            icon={AlertTriangle}
            title="Không tải được bài làm"
            description={getErrorMessage(error)}
            action={
              <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void refetch()}>
                Thử lại
              </Button>
            }
          />
        </Card>
      </>
    )
  }

  const passed = attempt.passed
  const facts: [string, string][] = [
    ['Ngày làm', formatDateTime(attempt.submittedAt)],
    ['Số câu đúng', `${attempt.correctCount}/${attempt.total}`],
    ['Điểm đạt', `≥ ${attempt.passScore}/100`],
    ['Thời gian làm bài', attempt.timeSpentSec != null ? formatClock(attempt.timeSpentSec) : '—'],
    ['Mã chứng chỉ', attempt.certificateCode ?? '—']
  ]

  return (
    <>
      <PageHeader title="Chi tiết bài làm" actions={back} />
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div
            className={cn(
              'flex flex-wrap items-center gap-6 px-6 py-6',
              passed ? 'bg-gradient-to-r from-green-50 to-white' : 'bg-gradient-to-r from-rose-50 to-white'
            )}
          >
            <div
              className={cn(
                'flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full bg-white ring-4',
                passed ? 'ring-green-200' : 'ring-rose-200'
              )}
            >
              <span className={cn('text-3xl font-extrabold tabular-nums', passed ? 'text-green-600' : 'text-rose-500')}>
                {attempt.score}
              </span>
              <span className="text-xs text-ink-muted">/100 điểm</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Khóa học</p>
              <h2 className="mt-0.5 text-lg font-bold uppercase text-ink">{attempt.courseTitle}</h2>
              <div className="mt-2">
                <ResultBadge passed={passed} />
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-px border-t border-surface-line bg-surface-line md:grid-cols-5">
            {facts.map(([label, value]) => (
              <div key={label} className="bg-white px-5 py-4">
                <dt className="text-xs text-ink-muted">{label}</dt>
                <dd className="mt-1 font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <AnswerReview attemptId={attemptId} />
      </div>
    </>
  )
}