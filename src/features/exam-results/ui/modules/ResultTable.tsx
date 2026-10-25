import { useNavigate } from 'react-router'
import { AlertTriangle, ClipboardList, RefreshCw } from 'lucide-react'
import { getErrorMessage } from '@/shared/api/errors'
import { formatDate } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Card, CardHeader } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Select } from '@/shared/ui/Select'
import { Table, type Column } from '@/shared/ui/Table'
import { useResultList } from '../../hooks/useResultList'
import { resultDetailPath } from '../../lib/utils'
import { RESULT_FILTERS } from '../../model/constants'
import type { ExamAttempt } from '../../model/types'
import { ResultBadge } from '../components/ResultBadge'

export function ResultTable() {
  const navigate = useNavigate()
  const { rows, total, filter, setFilter, isLoading, isError, error, refetch } = useResultList()

  const columns: Column<ExamAttempt>[] = [
    { key: 'courseTitle', header: 'Khóa học', render: (r) => <span className="font-medium uppercase text-ink-soft">{r.courseTitle}</span> },
    { key: 'submittedAt', header: 'Ngày làm', align: 'center', render: (r) => formatDate(r.submittedAt) },
    {
      key: 'score',
      header: 'Điểm',
      align: 'center',
      render: (r) => (
        <span className="tabular-nums">
          <b className="text-ink">{r.score}</b>/100
        </span>
      )
    },
    { key: 'passed', header: 'Kết quả', align: 'center', render: (r) => <ResultBadge passed={r.passed} /> },
    { key: 'correct', header: 'Số câu đúng', align: 'center', render: (r) => `${r.correctCount}/${r.total}` },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'center',
      width: '120px',
      render: (r) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            navigate(resultDetailPath(r.attemptId))
          }}
        >
          Xem
        </Button>
      )
    }
  ]

  return (
    <Card>
      <CardHeader
        title="Lịch sử làm bài"
        action={
          total > 0 && (
            <Select
              aria-label="Lọc kết quả"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={RESULT_FILTERS}
              className="h-9 w-44 text-sm"
            />
          )
        }
      />
      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được kết quả"
          description={getErrorMessage(error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void refetch()}>
              Thử lại
            </Button>
          }
        />
      ) : (
        <div className="px-1 pb-2 pt-2">
          <Table
            columns={columns}
            data={rows}
            rowKey={(r) => r.attemptId}
            loading={isLoading}
            skeletonRows={3}
            onRowClick={(r) => navigate(resultDetailPath(r.attemptId))}
            empty={
              <EmptyState
                icon={ClipboardList}
                title={total === 0 ? 'Bạn chưa làm bài kiểm tra nào' : 'Không có kết quả phù hợp'}
                compact
              />
            }
          />
        </div>
      )}
    </Card>
  )
}