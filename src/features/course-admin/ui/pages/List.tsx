import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AlertTriangle, GraduationCap, Plus, RefreshCw } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { useCourseList } from '../../hooks/useCourseList'
import { useCourseMutation } from '../../hooks/useCourseMutation'
import { detailPath } from '../../lib/utils'
import type { AdminCourse } from '../../model/types'
import { AdminCourseCard, AdminCourseCardSkeleton } from '../components/AdminCourseCard'
import { CourseFormDrawer } from '../modules/CourseFormDrawer'
import { Filters } from '../modules/Filters'

const GRID = 'grid gap-5 md:grid-cols-2 xl:grid-cols-3'

export default function CourseAdminList() {
  const navigate = useNavigate()
  const can = useCan()
  const { courses, total, isLoading, isError, error, refetch, openCreate, openEdit } = useCourseList()
  const m = useCourseMutation()
  const [deleting, setDeleting] = useState<AdminCourse | null>(null)

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await m.deleteCourse(deleting.id)
      setDeleting(null)
    } catch {
      /* toast đã hiển thị */
    }
  }

  return (
    <>
      <PageHeader
        title="Quản lý khóa học"
        actions={
          can('course-admin:create') && (
            <Button leftIcon={<Plus />} onClick={openCreate}>
              Tạo khóa học
            </Button>
          )
        }
      />
      <Filters />

      {isError ? (
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
      ) : isLoading ? (
        <div className={GRID}>
          {Array.from({ length: 3 }).map((_, i) => (
            <AdminCourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <EmptyState
            icon={GraduationCap}
            title={total === 0 ? 'Chưa có khóa học nào' : 'Không có khóa học phù hợp'}
            description={total === 0 ? 'Tạo khóa học đầu tiên để bắt đầu đào tạo.' : 'Thử đổi trạng thái hoặc từ khóa tìm kiếm.'}
            action={
              total === 0 &&
              can('course-admin:create') && (
                <Button size="sm" leftIcon={<Plus />} onClick={openCreate}>
                  Tạo khóa học
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className={GRID}>
          {courses.map((c) => (
            <AdminCourseCard
              key={c.id}
              course={c}
              canEdit={can('course-admin:update')}
              canDelete={can('course-admin:delete')}
              onEdit={() => openEdit(c.id)}
              onDelete={() => setDeleting(c)}
              onManage={() => navigate(detailPath(c.id))}
            />
          ))}
        </div>
      )}

      <CourseFormDrawer />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Xóa khóa học?"
        message={
          deleting
            ? `Khóa "${deleting.title}" cùng ${deleting.lessonCount} bài học, ${deleting.questionCount} câu hỏi sẽ bị xóa. Kết quả học tập và chứng chỉ đã cấp vẫn được giữ lại.`
            : undefined
        }
        confirmText="Xóa khóa học"
        loading={m.isDeletingCourse}
        onConfirm={confirmDelete}
      />
    </>
  )
}