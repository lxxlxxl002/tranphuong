import { useEffect, useState, type FormEvent } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Card, CardHeader } from '@/shared/ui/Card'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { Select } from '@/shared/ui/Select'
import { Skeleton } from '@/shared/ui/Skeleton'
import { MediaField } from '@/shared/ui/MediaField'
import { useCourseDetail } from '../../hooks/useCourseDetail'
import { useCourseMutation } from '../../hooks/useCourseMutation'
import { lessonService } from '../../services/lessonService'
import { validateLessonInput } from '../../lib/validators'
import { LESSON_TYPE_OPTIONS } from '../../model/constants'
import type { AdminLesson, FieldErrors, LessonInput } from '../../model/types'
import { LessonRow } from '../components/LessonRow'

const TEXTAREA =
  'w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10'

export function LessonTable({ courseId }: { courseId: string }) {
  const can = useCan()
  const { lessons, isLoading } = useCourseDetail(courseId)
  const m = useCourseMutation()
  const [editing, setEditing] = useState<AdminLesson | 'new' | null>(null)
  const [deleting, setDeleting] = useState<AdminLesson | null>(null)
  const canEdit = can('course-admin:update')
  const canDelete = can('course-admin:delete')

  const save = async (input: LessonInput) => {
    try {
      if (editing && editing !== 'new') await m.updateLesson({ lessonId: editing.id, input })
      else await m.createLesson({ courseId, input })
      setEditing(null)
    } catch {
      /* toast đã hiển thị */
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await m.deleteLesson(deleting.id)
      setDeleting(null)
    } catch {
      /* toast đã hiển thị */
    }
  }

  return (
    <Card>
      <CardHeader
        title="Danh sách bài học"
        subtitle={`${lessons.length} bài học`}
        action={
          canEdit && (
            <Button size="sm" leftIcon={<Plus />} onClick={() => setEditing('new')}>
              Thêm bài học
            </Button>
          )
        }
      />
      {isLoading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Chưa có bài học"
          description="Thêm video, tài liệu hoặc bài đọc cho khóa học."
          action={
            canEdit && (
              <Button size="sm" leftIcon={<Plus />} onClick={() => setEditing('new')}>
                Thêm bài học đầu tiên
              </Button>
            )
          }
        />
      ) : (
        <ul className="divide-y divide-surface-line">
          {lessons.map((l, i) => (
            <LessonRow
              key={l.id}
              lesson={l}
              isFirst={i === 0}
              isLast={i === lessons.length - 1}
              canEdit={canEdit}
              canDelete={canDelete}
              busy={m.isReordering}
              onMoveUp={() => m.reorderLessons({ courseId, lessonIds: lessonService.move(lessons, l.id, -1) })}
              onMoveDown={() => m.reorderLessons({ courseId, lessonIds: lessonService.move(lessons, l.id, 1) })}
              onEdit={() => setEditing(l)}
              onDelete={() => setDeleting(l)}
            />
          ))}
        </ul>
      )}

      <LessonFormModal
        open={editing !== null}
        lesson={editing && editing !== 'new' ? editing : null}
        submitting={m.isSavingLesson}
        onClose={() => setEditing(null)}
        onSubmit={(v) => void save(v)}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Xóa bài học?"
        message={deleting ? `Bài "${deleting.title}" và tiến độ học của học viên ở bài này sẽ bị xóa.` : undefined}
        confirmText="Xóa bài học"
        loading={m.isDeletingLesson}
        onConfirm={confirmDelete}
      />
    </Card>
  )
}

const FORM_ID = 'lesson-form'

interface LessonFormModalProps {
  open: boolean
  lesson: AdminLesson | null
  submitting: boolean
  onClose: () => void
  onSubmit: (input: LessonInput) => void
}

function LessonFormModal({ open, lesson, submitting, onClose, onSubmit }: LessonFormModalProps) {
  const [values, setValues] = useState<LessonInput>(lessonService.emptyInput())
  const [errors, setErrors] = useState<FieldErrors<LessonInput>>({})

  useEffect(() => {
    if (!open) return
    setValues(lesson ? lessonService.toInput(lesson) : lessonService.emptyInput())
    setErrors({})
  }, [open, lesson])

  const set = <K extends keyof LessonInput>(key: K, value: LessonInput[K]) => setValues((s) => ({ ...s, [key]: value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateLessonInput(values)
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSubmit(values)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={lesson ? 'Chỉnh sửa bài học' : 'Thêm bài học'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} loading={submitting}>
            {lesson ? 'Lưu thay đổi' : 'Thêm bài học'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate className="space-y-4">
        <Input label="Tên bài học" required value={values.title} onChange={(e) => set('title', e.target.value)} error={errors.title} autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Loại bài" value={values.type} onChange={(e) => set('type', e.target.value as LessonInput['type'])} options={LESSON_TYPE_OPTIONS} />
          <Input label="Thời lượng (phút)" type="number" min={0} value={values.durationMin} onChange={(e) => set('durationMin', e.target.valueAsNumber)} error={errors.durationMin} />
        </div>
        {values.type === 'VIDEO' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-soft">Video bài giảng</label>
            <MediaField
              kind="video"
              value={values.videoUrl}
              onChange={(url) => set('videoUrl', url)}
              error={errors.videoUrl}
              linkPlaceholder="Dán link Drive / YouTube / .mp4"
              linkHint="Video Drive cần chia sẻ 'Bất kỳ ai có đường liên kết'"
              previewClassName="h-52"
            />
          </div>
        )}
        {values.type === 'DOCUMENT' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-soft">Tài liệu</label>
            <MediaField
              kind="document"
              value={values.documentUrl}
              onChange={(url) => set('documentUrl', url)}
              error={errors.documentUrl}
              linkPlaceholder="Dán link Drive hoặc link PDF"
            />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${FORM_ID}-content`} className="text-sm font-medium text-ink-soft">
            {values.type === 'TEXT' ? 'Nội dung bài đọc' : 'Mô tả bài học'}
          </label>
          <textarea
            id={`${FORM_ID}-content`}
            rows={values.type === 'TEXT' ? 10 : 4}
            value={values.content}
            onChange={(e) => set('content', e.target.value)}
            className={cn(TEXTAREA, errors.content && 'border-rose-400')}
            placeholder={values.type === 'TEXT' ? 'Mỗi đoạn cách nhau một dòng trống...' : 'Tóm tắt nội dung bài học'}
          />
          {errors.content && <p className="text-xs text-rose-500">{errors.content}</p>}
        </div>
      </form>
    </Modal>
  )
}