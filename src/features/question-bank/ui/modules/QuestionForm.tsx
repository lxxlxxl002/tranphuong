import { useEffect, useState, type FormEvent } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Select } from '@/shared/ui/Select'
import { useQuestionList } from '../../hooks/useQuestionList'
import { useQuestionMutation } from '../../hooks/useQuestionMutation'
import { questionService } from '../../services/questionService'
import { hasErrors, validateQuestionInput } from '../../lib/validators'
import { TYPE_OPTIONS } from '../../model/constants'
import type { QuestionErrors, QuestionInput, QuestionType } from '../../model/types'
import { OptionEditor } from '../components/OptionEditor'

const TEXTAREA =
  'w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10'
const FORM_ID = 'question-form'

export function QuestionForm({ courseId }: { courseId: string }) {
  const { editor, editingQuestion, closeEditor } = useQuestionList(courseId)
  const m = useQuestionMutation(courseId)
  const [values, setValues] = useState<QuestionInput>(() => questionService.emptyInput())
  const [errors, setErrors] = useState<QuestionErrors>({})
  const isEdit = !!editingQuestion

  useEffect(() => {
    if (!editor.open) return
    setValues(editingQuestion ? questionService.toInput(editingQuestion) : questionService.emptyInput())
    setErrors({})
  }, [editor.open, editingQuestion])

  const save = async (andNext: boolean) => {
    const clean = questionService.normalizeInput(values)
    const errs = validateQuestionInput(clean)
    setErrors(errs)
    if (hasErrors(errs)) return
    try {
      if (editingQuestion) await m.updateQuestion({ questionId: editingQuestion.id, input: values })
      else await m.createQuestion(values)
      if (andNext) {
        setValues(questionService.emptyInput(values.type))
        setErrors({})
      } else closeEditor()
    } catch {
      /* toast đã hiển thị */
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void save(false)
  }

  return (
    <Modal
      open={editor.open}
      onClose={closeEditor}
      size="lg"
      title={isEdit ? `Chỉnh sửa câu ${editingQuestion?.order}` : 'Thêm câu hỏi'}
      footer={
        <>
          <Button variant="secondary" onClick={closeEditor}>
            Hủy
          </Button>
          {!isEdit && (
            <Button variant="secondary" loading={m.isSaving} onClick={() => void save(true)}>
              Lưu & thêm câu khác
            </Button>
          )}
          <Button type="submit" form={FORM_ID} loading={m.isSaving}>
            {isEdit ? 'Lưu thay đổi' : 'Lưu câu hỏi'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${FORM_ID}-text`} className="text-sm font-medium text-ink-soft">
            Nội dung câu hỏi <span className="text-rose-500">*</span>
          </label>
          <textarea
            id={`${FORM_ID}-text`}
            rows={3}
            autoFocus
            value={values.text}
            onChange={(e) => setValues((s) => ({ ...s, text: e.target.value }))}
            placeholder="Nhập câu hỏi..."
            className={cn(TEXTAREA, errors.text && 'border-rose-400')}
          />
          {errors.text && <p className="text-xs text-rose-500">{errors.text}</p>}
        </div>

        <Select
          label="Loại câu hỏi"
          value={values.type}
          onChange={(e) => setValues((s) => questionService.setType(s, e.target.value as QuestionType))}
          options={TYPE_OPTIONS}
          containerClassName="sm:w-64"
        />

        <OptionEditor
          type={values.type}
          options={values.options}
          error={errors.options}
          onChange={(options) => setValues((s) => ({ ...s, options }))}
          onToggleCorrect={(key) => setValues((s) => questionService.toggleCorrect(s, key))}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${FORM_ID}-exp`} className="text-sm font-medium text-ink-soft">
            Giải thích <span className="font-normal text-ink-faint">(không bắt buộc)</span>
          </label>
          <textarea
            id={`${FORM_ID}-exp`}
            rows={2}
            value={values.explanation}
            onChange={(e) => setValues((s) => ({ ...s, explanation: e.target.value }))}
            placeholder="Hiển thị cho học viên khi xem lại bài làm"
            className={cn(TEXTAREA, errors.explanation && 'border-rose-400')}
          />
          {errors.explanation && <p className="text-xs text-rose-500">{errors.explanation}</p>}
        </div>
      </form>
    </Modal>
  )
}