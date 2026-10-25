import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, RefreshCw } from 'lucide-react'
import { getErrorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { formatNumber, formatPercent } from '@/shared/lib/format'
import { Badge, percentTone } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Card, CardHeader } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Table, type Column } from '@/shared/ui/Table'
import { useDeptStats } from '../../hooks/useDeptStats'
import { DEPT_SORT_LABELS } from '../../model/constants'
import type { DeptSortKey, DeptStat } from '../../model/types'

export function DeptStatsTable() {
  const { rows, sort, toggleSort, isLoading, isError, error, refetch } = useDeptStats()

  const sortHeader = (key: DeptSortKey) => {
    const active = sort?.key === key
    const Icon = !active ? ArrowUpDown : sort?.dir === 'asc' ? ArrowUp : ArrowDown
    return (
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className={cn('inline-flex items-center gap-1 uppercase tracking-wider transition hover:text-ink-soft', active && 'text-brand-600')}
      >
        {DEPT_SORT_LABELS[key]}
        <Icon className={cn('h-3 w-3', !active && 'opacity-40')} />
      </button>
    )
  }

  const columns: Column<DeptStat>[] = [
    {
      key: 'departmentName',
      header: sortHeader('departmentName'),
      render: (r) => <span className="text-ink-soft">{r.departmentName}</span>
    },
    { key: 'staffCount', header: sortHeader('staffCount'), align: 'center', width: '130px', render: (r) => formatNumber(r.staffCount) },
    { key: 'activeRate', header: sortHeader('activeRate'), align: 'center', width: '110px', render: (r) => formatPercent(r.activeRate) },
    {
      key: 'completionRate',
      header: sortHeader('completionRate'),
      align: 'center',
      width: '120px',
      render: (r) => <Badge tone={percentTone(r.completionRate)}>{formatPercent(r.completionRate)}</Badge>
    }
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader title="Thống kê theo phòng/ban" />
      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được dữ liệu"
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
            rowKey={(r) => r.departmentId}
            loading={isLoading}
            skeletonRows={6}
            dense
            empty={<EmptyState title="Chưa có phòng/ban" compact />}
          />
        </div>
      )}
    </Card>
  )
}