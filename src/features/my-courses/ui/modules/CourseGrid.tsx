import { AlertTriangle, BookOpen, RefreshCw } from 'lucide-react'
import { getErrorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useMyCourses } from '../../hooks/useMyCourses'
import { useCourseStatus } from '../../hooks/useCourseStatus'
import { STATUS_FILTERS } from '../../model/constants'
import type { MyCourse } from '../../model/types'
import { CourseCard, CourseCardSkeleton } from '../components/CourseCard'

function GridItem({ course }: { course: MyCourse }) {
  const status = useCourseStatus(course)
  return <CourseCard course={course} actionLabel={status.actionLabel} onAction={status.open} loading={status.isOpening} />
}

const GRID = 'grid gap-5 md:grid-cols-2 xl:grid-cols-3'

export function CourseGrid() {
  const { courses, total, counts, status, setStatus, isLoading, isError, error, refetch } = useMyCourses()

  if (isError) {
    return (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được danh sách khóa học"
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

  return (
    <div>
      {total > 0 && (
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Lọc theo trạng thái">
          {STATUS_FILTERS.map((f) => {
            const active = status === f.value
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatus(f.value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ring-inset transition',
                  active ? 'bg-brand-500 text-white ring-brand-500' : 'bg-white text-ink-soft ring-surface-line hover:bg-slate-50'
                )}
              >
                {f.label}
                <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-white/20' : 'bg-slate-100 text-ink-muted')}>
                  {counts[f.value]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {isLoading ? (
        <div className={GRID}>
          {Array.from({ length: 3 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <EmptyState
            icon={BookOpen}
            title={total === 0 ? 'Bạn chưa được ghi danh khóa học nào' : 'Không có khóa học phù hợp'}
            description={total === 0 ? 'Khi được ghi danh, khóa học sẽ xuất hiện tại đây.' : 'Thử chọn trạng thái khác.'}
          />
        </Card>
      ) : (
        <div className={GRID}>
          {courses.map((c) => (
            <GridItem key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  )
}