import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { getErrorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { Select } from '@/shared/ui/Select'
import { useDepartments } from '../../hooks/useDepartments'
import { useDepartmentMutation } from '../../hooks/useDepartmentMutation'
import { departmentService } from '../../services/departmentService'
import { normalizeCode } from '../../lib/utils'
import { hasErrors, validateDepartmentInput } from '../../lib/validators'
import type { DepartmentErrors, DepartmentInput } from '../../model/types'

const FORM_ID = 'department-form'
const TEXTAREA =
  'w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10'

export function DepartmentFormModal() {
  const { editor, editing, departments, nextCode, leaderOptions, closeEditor } = useDepartments()
  const m = useDepartmentMutation()
  const [values, setValues] = useState<DepartmentInput>(departmentService.emptyInput())
  const [errors, setErrors] = useState<DepartmentErrors>({})

  useEffect(() => {
    if (!editor.open) return
    setValues(editing ? departmentService.toInput(editing) : departmentService.emptyInput(nextCode))
    setErrors({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.open, editing])

  const otherCodes = useMemo(() => departments.filter((d) => d.id !== editing?.id).map((d) => d.code), [departments, editing])
  const set = <K extends keyof DepartmentInput>(k: K, v: DepartmentInput[K]) => setValues((s) => ({ ...s, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateDepartmentInput(values, otherCodes)
    setErrors(errs)
    if (hasErrors(errs)) return
    try {
      if (editing) await m.updateDepartment({ departmentId: editing.id, input: values })
      else await m.createDepartment(values)
      closeEditor()
    } catch (err) {
      const msg = getErrorMessage(err)
      if (/mã/i.test(msg)) setErrors((s) => ({ ...s, code: msg }))
    }
  }

  return (
    <Modal
      open={editor.open}
      onClose={closeEditor}
      title={editing ? 'Chỉnh sửa phòng/ban' : 'Thêm phòng/ban'}
      footer={
        <>
          <Button variant="secondary" onClick={closeEditor}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} loading={m.isSaving}>
            {editing ? 'Lưu thay đổi' : 'Thêm phòng/ban'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={(e) => void submit(e)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <Input label="Mã" required value={values.code} onChange={(e) => set('code', normalizeCode(e.target.value))} error={errors.code} placeholder="P7" />
          <Input label="Tên phòng/ban" required autoFocus value={values.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
        </div>
        <Select label="Lãnh đạo phòng" value={values.leaderId} onChange={(e) => set('leaderId', e.target.value)} options={leaderOptions} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${FORM_ID}-desc`} className="text-sm font-medium text-ink-soft">
            Mô tả <span className="font-normal text-ink-faint">(không bắt buộc)</span>
          </label>
          <textarea
            id={`${FORM_ID}-desc`}
            rows={3}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Chức năng, nhiệm vụ chính của phòng"
            className={cn(TEXTAREA, errors.description && 'border-rose-400')}
          />
          {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
        </div>
        {editing && editing.staffCount > 0 && (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-ink-muted">Phòng đang có {editing.staffCount} công chức.</p>
        )}
      </form>
    </Modal>
  )
}