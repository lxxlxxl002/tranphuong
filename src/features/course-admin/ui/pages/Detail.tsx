import { Link, useNavigate, useParams } from 'react-router'
import { AlertTriangle, ArrowLeft, Clock, EyeOff, ListChecks, Pencil, RefreshCw, RotateCcw, Send, Target, Users, BookOpen } from 'lucide-react'
import { CourseCover } from '@/features/my-courses'
import { useCan } from '@/app/router/RoleGuard'
import { PATHS } from '@/app/router/paths'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useCourseDetail } from '../../hooks/useCourseDetail'
import { useCourseMutation } from '../../hooks/useCourseMutation'
import { editPath, questionBankPath } from '../../lib/utils'
import { PublishBadge } from '../components/PublishBadge'
import { LessonTable } from '../modules/LessonTable'

export default function CourseAdminDetail() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const can = useCan()
  const { course, lessons, isLoading, isError, error, refetch } = useCourseDetail(courseId)
  const m = useCourseMutation()

  const back = (
    <Button variant="secondary" leftIcon={<ArrowLeft />} onClick={() => navigate(PATHS.courseAdmin)}>
      Danh sách khóa học
    </Button>
  )

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !course) {
    return (
      <>
        <PageHeader title="Quản lý bài học" actions={back} />
        <Card>
          <EmptyState
            icon={AlertTriangle}
            title="Không tải được khóa học"
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

  const published = course.status === 'PUBLISHED'
  const stats = [
    { icon: BookOpen, label: 'Bài học', value: lessons.length },
    { icon: ListChecks, label: 'Câu hỏi', value: course.questionCount },
    { icon: Users, label: 'Học viên', value: course.enrollmentCount },
    { icon: Target, label: 'Điểm đạt', value: `≥ ${course.passScore}` },
    { icon: Clock, label: 'Thời gian thi', value: course.durationMin > 0 ? `${course.durationMin} phút` : 'Không giới hạn' },
    { icon: RotateCcw, label: 'Lượt thi', value: course.maxAttempts > 0 ? course.maxAttempts : 'Không giới hạn' }
  ]

  return (
    <>
      <PageHeader
        title={course.title}
        description="Quản lý nội dung bài học của khóa"
        actions={
          <>
            {back}
            {can('course-admin:update') && (
              <>
                <Button variant="secondary" leftIcon={<Pencil />} onClick={() => navigate(editPath(course.id))}>
                  Chỉnh sửa
                </Button>
                <Button
                  variant={published ? 'secondary' : 'primary'}
                  leftIcon={published ? <EyeOff /> : <Send />}
                  loading={m.isSettingStatus}
                  onClick={() => void m.setStatus({ courseId: course.id, status: published ? 'DRAFT' : 'PUBLISHED' }).catch(() => undefined)}
                >
                  {published ? 'Chuyển về bản nháp' : 'Xuất bản'}
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="space-y-5">
        <Card className="flex flex-col gap-6 p-5 lg:flex-row">
          <CourseCover course={course} className="h-40 w-full shrink-0 rounded-xl lg:w-72" />
          <div className="min-w-0 flex-1">
            <PublishBadge status={course.status} />
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{course.description || 'Chưa có mô tả.'}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-slate-50 px-3 py-3">
                  <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-bold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>

        {course.questionCount === 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Khóa học chưa có câu hỏi kiểm tra — học viên sẽ không thể làm bài cuối khóa.
            </span>
            <Link to={questionBankPath(course.id)} className="font-semibold text-amber-900 underline-offset-2 hover:underline">
              Thêm câu hỏi →
            </Link>
          </div>
        )}

        <LessonTable courseId={course.id} />
      </div>
    </>
  )
}