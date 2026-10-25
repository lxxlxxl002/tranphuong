import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { MediaField } from '@/shared/ui/MediaField'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Drawer } from '@/shared/ui/Drawer'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { useCourseList } from '../../hooks/useCourseList'
import { useCourseMutation } from '../../hooks/useCourseMutation'
import { courseService } from '../../services/courseService'
import { detailPath } from '../../lib/utils'
import { validateCourseInput } from '../../lib/validators'
import { STATUS_OPTIONS } from '../../model/constants'
import type { CourseInput, FieldErrors } from '../../model/types'

const TEXTAREA =
  'w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10'

export interface CourseFormProps {
  formId: string
  initial: CourseInput
  submitting?: boolean
  submitLabel?: string
  showActions?: boolean
  onSubmit: (input: CourseInput) => void
  onCancel?: () => void
}

/** Form khóa học dùng chung cho Drawer và trang Form */
export function CourseForm({ formId, initial, submitting, submitLabel = 'Lưu', showActions, onSubmit, onCancel }: CourseFormProps) {
  const [values, setValues] = useState<CourseInput>(initial)
  const [errors, setErrors] = useState<FieldErrors<CourseInput>>({})

  useEffect(() => {
    setValues(initial)
    setErrors({})
  }, [initial])

  const set = <K extends keyof CourseInput>(key: K, value: CourseInput[K]) => setValues((s) => ({ ...s, [key]: value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateCourseInput(values)
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSubmit(values)
  }


  return (
    <form id={formId} onSubmit={submit} noValidate className="space-y-5">
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-soft">Ảnh bìa</p>
        <MediaField
          kind="image"
          value={values.coverUrl}
          onChange={(url) => set('coverUrl', url)}
          error={errors.coverUrl}
          linkPlaceholder="Dán đường dẫn ảnh (https://...)"
          linkHint="Tỷ lệ khuyến nghị 16:6"
          previewClassName="h-40"
        />
      </div>

      <Input label="Tên khóa học" required value={values.title} onChange={(e) => set('title', e.target.value)} error={errors.title} placeholder="VD: TÌM HIỂU VỀ BASEL II" />

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-desc`} className="text-sm font-medium text-ink-soft">
          Mô tả
        </label>
        <textarea
          id={`${formId}-desc`}
          rows={4}
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Mục tiêu, đối tượng, nội dung chính của khóa học..."
          className={cn(TEXTAREA, errors.description && 'border-rose-400')}
        />
        {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
      </div>

      <Select label="Trạng thái" value={values.status} onChange={(e) => set('status', e.target.value as CourseInput['status'])} options={STATUS_OPTIONS} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Điểm đạt" type="number" min={0} max={100} value={values.passScore} onChange={(e) => set('passScore', e.target.valueAsNumber)} error={errors.passScore} hint="Thang 100" />
        <Input label="Thời gian thi (phút)" type="number" min={0} value={values.durationMin} onChange={(e) => set('durationMin', e.target.valueAsNumber)} error={errors.durationMin} hint="0 = không giới hạn" />
        <Input label="Lượt thi tối đa" type="number" min={0} value={values.maxAttempts} onChange={(e) => set('maxAttempts', e.target.valueAsNumber)} error={errors.maxAttempts} hint="0 = không giới hạn" />
      </div>

      {showActions && (
        <div className="flex justify-end gap-2 border-t border-surface-line pt-5">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Hủy
            </Button>
          )}
          <Button type="submit" loading={submitting}>
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  )
}

const FORM_ID = 'course-drawer-form'

export function CourseFormDrawer() {
  const navigate = useNavigate()
  const { drawer, editingCourse, closeDrawer } = useCourseList()
  const m = useCourseMutation()
  const initial = useMemo(() => (editingCourse ? courseService.toInput(editingCourse) : courseService.emptyInput()), [editingCourse])

  const onSubmit = async (input: CourseInput) => {
    try {
      if (editingCourse) {
        await m.updateCourse({ courseId: editingCourse.id, input })
        closeDrawer()
      } else {
        const created = await m.createCourse(input)
        closeDrawer()
        navigate(detailPath(created.id))
      }
    } catch {
      /* lỗi đã hiển thị bằng toast */
    }
  }

  return (
    <Drawer
      open={drawer.open}
      onClose={closeDrawer}
      title={editingCourse ? 'Chỉnh sửa khóa học' : 'Tạo khóa học'}
      description={editingCourse ? editingCourse.title : 'Nhập thông tin cơ bản, sau đó thêm bài học và câu hỏi.'}
      footer={
        <>
          <Button variant="secondary" onClick={closeDrawer}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} loading={m.isSavingCourse}>
            {editingCourse ? 'Lưu thay đổi' : 'Tạo khóa học'}
          </Button>
        </>
      }
    >
      <CourseForm formId={FORM_ID} initial={initial} onSubmit={(v) => void onSubmit(v)} />
    </Drawer>
  )
}
