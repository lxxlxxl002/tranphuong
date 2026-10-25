import { useNavigate } from 'react-router'
import { AlertTriangle, BookOpen, RefreshCw } from 'lucide-react'
import { coursePath } from '@/features/learning'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Card, CardHeader } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Select } from '@/shared/ui/Select'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useProgress } from '../../hooks/useProgress'
import { SORT_OPTIONS } from '../../model/constants'
import { CourseProgressRow } from '../components/CourseProgressRow'

export function CourseProgressList() {
  const navigate = useNavigate()
  const { courses, sortBy, setSortBy, isLoading, isError, error, refetch } = useProgress()

  return (
    <Card>
      <CardHeader
        title="Tiến độ từng khóa học"
        action={
          courses.length > 1 && (
            <Select
              aria-label="Sắp xếp"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={SORT_OPTIONS}
              className="h-9 w-48 text-sm"
            />
          )
        }
      />
      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được tiến độ"
          description={getErrorMessage(error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void refetch()}>
              Thử lại
            </Button>
          }
        />
      ) : isLoading ? (
        <div className="divide-y divide-surface-line">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 px-5 py-4">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="Chưa có khóa học nào" description="Khi được ghi danh, tiến độ sẽ hiển thị tại đây." />
      ) : (
        <div className="divide-y divide-surface-line">
          {courses.map((c) => (
            <CourseProgressRow key={c.courseId} course={c} onOpen={() => navigate(coursePath(c.courseId))} />
          ))}
        </div>
      )}
    </Card>
  )
}