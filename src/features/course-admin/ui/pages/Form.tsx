import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { PATHS } from '@/app/router/paths'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useCourseDetail } from '../../hooks/useCourseDetail'
import { useCourseMutation } from '../../hooks/useCourseMutation'
import { courseService } from '../../services/courseService'
import { detailPath } from '../../lib/utils'
import type { CourseInput } from '../../model/types'
import { CourseForm } from '../modules/CourseFormDrawer'

export default function CourseAdminForm() {
  const { courseId } = useParams()
  const isEdit = !!courseId
  const navigate = useNavigate()
  const { course, isLoading, isError, error } = useCourseDetail(courseId ?? '')
  const m = useCourseMutation()
  const initial = useMemo(() => (course ? courseService.toInput(course) : courseService.emptyInput()), [course])

  const back = () => navigate(isEdit && courseId ? detailPath(courseId) : PATHS.courseAdmin)

  const onSubmit = async (input: CourseInput) => {
    try {
      if (isEdit && courseId) {
        await m.updateCourse({ courseId, input })
        navigate(detailPath(courseId))
      } else {
        const created = await m.createCourse(input)
        navigate(detailPath(created.id))
      }
    } catch {
      /* toast đã hiển thị */
    }
  }

  const header = (
    <PageHeader
      title={isEdit ? 'Chỉnh sửa khóa học' : 'Tạo khóa học'}
      description={isEdit ? course?.title : 'Nhập thông tin cơ bản, sau đó thêm bài học và câu hỏi.'}
      actions={
        <Button variant="secondary" leftIcon={<ArrowLeft />} onClick={back}>
          Quay lại
        </Button>
      }
    />
  )

  if (isEdit && isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[520px] w-full max-w-3xl rounded-2xl" />
      </div>
    )
  }

  if (isEdit && (isError || !course)) {
    return (
      <>
        {header}
        <Card>
          <EmptyState icon={AlertTriangle} title="Không tải được khóa học" description={getErrorMessage(error)} />
        </Card>
      </>
    )
  }

  return (
    <>
      {header}
      <Card className="max-w-3xl p-6">
        <CourseForm
          formId="course-page-form"
          initial={initial}
          showActions
          submitting={m.isSavingCourse}
          submitLabel={isEdit ? 'Lưu thay đổi' : 'Tạo khóa học'}
          onSubmit={(v) => void onSubmit(v)}
          onCancel={back}
        />
      </Card>
    </>
  )
}