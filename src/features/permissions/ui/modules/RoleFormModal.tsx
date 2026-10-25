import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { Select } from '@/shared/ui/Select'
import { useRoles } from '../../hooks/useRoles'
import { useRoleMutation } from '../../hooks/useRoleMutation'
import { permissionService } from '../../services/permissionService'
import { slugKey } from '../../lib/utils'
import { hasErrors, validateRoleInput } from '../../lib/validators'
import type { RoleErrors, RoleInput } from '../../model/types'

const FORM_ID = 'role-form'
const TEXTAREA =
  'w-full rounded-lg border border-surface-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10'

export function RoleFormModal() {
  const { roles, editor, editing, closeEditor } = useRoles()
  const m = useRoleMutation()
  const [values, setValues] = useState<RoleInput>(permissionService.emptyInput())
  const [errors, setErrors] = useState<RoleErrors>({})
  const [keyTouched, setKeyTouched] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isEdit = !!editing

  useEffect(() => {
    if (!editor.open) return
    setValues(editing ? permissionService.toInput(editing) : permissionService.emptyInput())
    setErrors({})
    setKeyTouched(false)
  }, [editor.open, editing])

  const cloneOptions = useMemo(
    () => [{ value: '', label: 'Không sao chép (bắt đầu từ 0 quyền)' }, ...roles.map((r) => ({ value: r.key, label: `${r.name} (${r.locked ? 'toàn quyền' : `${r.permissions.length} quyền`})` }))],
    [roles]
  )

  const setName = (name: string) => setValues((s) => ({ ...s, name, key: isEdit || keyTouched ? s.key : slugKey(name) }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateRoleInput(values, roles.map((r) => r.key), isEdit)
    setErrors(errs)
    if (hasErrors(errs)) return
    try {
      if (editing) await m.updateRole({ roleKey: editing.key, input: values })
      else await m.createRole({ input: values, roles })
      closeEditor()
    } catch {
      /* toast */
    }
  }

  const doDelete = async () => {
    if (!editing) return
    try {
      await m.deleteRole(editing)
      setConfirmDelete(false)
      closeEditor()
    } catch {
      /* toast */
    }
  }

  const deletable = !!editing && !editing.system

  return (
    <>
      <Modal
        open={editor.open}
        onClose={closeEditor}
        title={isEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}
        description={isEdit && editing?.system ? 'Vai trò hệ thống: chỉ đổi được tên hiển thị và mô tả.' : undefined}
        footer={
          <>
            {deletable && (
              <Button variant="ghost" leftIcon={<Trash2 />} className="mr-auto text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => setConfirmDelete(true)}>
                Xóa vai trò
              </Button>
            )}
            <Button variant="secondary" onClick={closeEditor}>
              Hủy
            </Button>
            <Button type="submit" form={FORM_ID} loading={m.isSavingRole}>
              {isEdit ? 'Lưu thay đổi' : 'Tạo vai trò'}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={(e) => void submit(e)} noValidate className="space-y-4">
          <Input label="Tên vai trò" required autoFocus value={values.name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="VD: Thanh tra viên" />
          <Input
            label="Mã vai trò"
            required
            disabled={isEdit}
            value={values.key}
            onChange={(e) => {
              setKeyTouched(true)
              setValues((s) => ({ ...s, key: e.target.value.toUpperCase() }))
            }}
            error={errors.key}
            hint={isEdit ? 'Không thể đổi mã sau khi tạo' : 'Tự sinh từ tên, có thể sửa'}
            className="font-mono"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${FORM_ID}-desc`} className="text-sm font-medium text-ink-soft">
              Mô tả
            </label>
            <textarea
              id={`${FORM_ID}-desc`}
              rows={2}
              value={values.description}
              onChange={(e) => setValues((s) => ({ ...s, description: e.target.value }))}
              className={cn(TEXTAREA, errors.description && 'border-rose-400')}
            />
            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
          </div>
          {!isEdit && <Select label="Sao chép quyền từ" value={values.cloneFrom} onChange={(e) => setValues((s) => ({ ...s, cloneFrom: e.target.value }))} options={cloneOptions} />}
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Xóa vai trò?"
        message={
          editing && editing.userCount > 0
            ? `Còn ${editing.userCount} người dùng mang vai trò này — hãy đổi vai trò cho họ trước.`
            : `Vai trò "${editing?.name}" và toàn bộ cấu hình quyền sẽ bị xóa.`
        }
        confirmText="Xóa vai trò"
        loading={m.isDeleting}
        onConfirm={doDelete}
      />
    </>
  )
}