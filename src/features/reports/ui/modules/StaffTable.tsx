import { AlertTriangle, ChevronLeft, ChevronRight, Download, RefreshCw, Users } from 'lucide-react'
import { getErrorMessage } from '@/shared/api/errors'
import { roleLabel } from '@/shared/constants/roles'
import { Button } from '@/shared/ui/Button'
import { Card, CardHeader } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Table, type Column } from '@/shared/ui/Table'
import { useReport } from '../../hooks/useReport'
import { useExportReport } from '../../hooks/useExportReport'
import { NO_DEPT_LABEL } from '../../model/constants'
import type { StaffReport } from '../../model/types'
import { CompletionBadge } from '../components/CompletionBadge'
import { ReportFilters } from './ReportFilters'

const columns: Column<StaffReport>[] = [
  { key: 'fullName', header: 'Họ tên', render: (r) => <span className="text-ink-soft">{r.fullName}</span> },
  { key: 'email', header: 'Email', render: (r) => <span className="break-all text-ink-soft">{r.email}</span> },
  { key: 'department', header: 'Phòng / Ban', render: (r) => <span className="text-ink-soft">{r.departmentId ? r.departmentName : NO_DEPT_LABEL}</span> },
  { key: 'role', header: 'Vai trò', align: 'center', render: (r) => roleLabel(r.role) },
  { key: 'completed', header: 'Khóa hoàn thành', align: 'center', render: (r) => r.completedCourses },
  { key: 'avg', header: 'Điểm TB', align: 'center', render: (r) => <span className="tabular-nums">{r.averageScore ?? 0}/100</span> },
  { key: 'rate', header: 'Tỷ lệ hoàn thành', align: 'center', render: (r) => <CompletionBadge value={r.completionRate} /> }
]

export function StaffTable() {
  const report = useReport()
  const { exportExcel, isExporting } = useExportReport()
  const { pagination: p } = report

  return (
    <Card className="min-w-0">
      <CardHeader
        title="Danh sách công chức"
        action={
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Download />}
            loading={isExporting}
            disabled={report.isLoading || !report.stats}
            onClick={() =>
              report.stats &&
              exportExcel({ stats: report.stats, staff: report.staff, departments: report.departments, filterSummary: report.filterSummary })
            }
          >
            Xuất báo cáo
          </Button>
        }
      />
      <div className="px-5 pt-4">
        <ReportFilters />
      </div>

      {report.isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được báo cáo"
          description={getErrorMessage(report.error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void report.refetch()}>
              Thử lại
            </Button>
          }
        />
      ) : (
        <div className="px-1 pb-2 pt-3">
          <Table
            columns={columns}
            data={report.pageStaff}
            rowKey={(r) => r.userId}
            loading={report.isLoading}
            skeletonRows={6}
            empty={<EmptyState icon={Users} title="Không có công chức phù hợp bộ lọc" compact />}
          />
          {p.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-ink-muted">
              <span>
                {p.start}–{p.end} / {report.staff.length} công chức
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" leftIcon={<ChevronLeft />} disabled={!p.hasPrev} onClick={p.prev}>
                  Trước
                </Button>
                <Button size="sm" variant="secondary" rightIcon={<ChevronRight />} disabled={!p.hasNext} onClick={p.next}>
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}