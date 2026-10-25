import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { PATHS } from '@/app/router/paths'
import { getErrorMessage } from '@/shared/api/errors'
import { ROLE_ORDER, roleLabel } from '@/shared/constants/roles'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Input } from '@/shared/ui/Input'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Select } from '@/shared/ui/Select'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useUserDetail } from '../../hooks/useUserDetail'
import { useUserList } from '../../hooks/useUserList'
import { useUserMutation } from '../../hooks/useUserMutation'
import { userService } from '../../services/userService'
import { hasErrors, validateUserInput } from '../../lib/validators'
import { NO_DEPT_LABEL, STATUS_OPTIONS } from '../../model/constants'
import type { UserErrors, UserInput } from '../../model/types'
import { TempPasswordModal } from '../modules/UserDetailPanel'

const ROLE_OPTIONS = ROLE_ORDER.map((r) => ({ value: r, label: roleLabel(r) }))

export default function UserForm() {
  const { userId } = useParams()
  const isEdit = !!userId
  const navigate = useNavigate()
  const { user, isLoading, isError, error } = useUserDetail(userId ?? '')
  const { departments, select } = useUserList()
  const m = useUserMutation()
  const [values, setValues] = useState<UserInput>(userService.emptyInput())
  const [errors, setErrors] = useState<UserErrors>({})
  const [created, setCreated] = useState<{ id: string; name: string; password: string | null } | null>(null)

  useEffect(() => {
    if (user) setValues(userService.toInput(user))
  }, [user])

  const set = <K extends keyof UserInput>(k: K, v: UserInput[K]) => setValues((s) => ({ ...s, [k]: v }))
  const back = () => navigate(PATHS.users)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateUserInput(values)
    setErrors(errs)
    if (hasErrors(errs)) return
    try {
      if (isEdit && userId) {
        await m.updateUser({ userId, input: values })
        select(userId)
        back()
      } else {
        const r = await m.createUser(values)
        setCreated({ id: r.user.id, name: r.user.fullName, password: r.temporaryPassword })
      }
    } catch (err) {
      const msg = getErrorMessage(err)
      if (/email/i.test(msg)) setErrors((s) => ({ ...s, email: msg }))
    }
  }

  const header = (
    <PageHeader
      title={isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
      description={isEdit ? user?.fullName : 'Tạo tài khoản đăng nhập cho công chức.'}
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
        <Skeleton className="h-[440px] w-full max-w-3xl rounded-2xl" />
      </div>
    )
  }
  if (isEdit && (isError || !user)) {
    return (
      <>
        {header}
        <Card>
          <EmptyState icon={AlertTriangle} title="Không tải được người dùng" description={getErrorMessage(error)} />
        </Card>
      </>
    )
  }

  return (
    <>
      {header}
      <Card className="max-w-3xl p-6">
        <form onSubmit={(e) => void submit(e)} noValidate className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Họ và tên" required autoFocus value={values.fullName} onChange={(e) => set('fullName', e.target.value)} error={errors.fullName} />
            <Input label="Email công vụ" required type="email" value={values.email} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="ten@sbv.gov.vn" />
            <Input label="Mã cán bộ" value={values.code} onChange={(e) => set('code', e.target.value)} error={errors.code} />
            <Input label="Số điện thoại" value={values.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
          </div>
          <Select
            label="Phòng / Ban"
            value={values.departmentId}
            onChange={(e) => set('departmentId', e.target.value)}
            options={[{ value: '', label: NO_DEPT_LABEL }, ...departments.map((d) => ({ value: d.id, label: d.name }))]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Vai trò" value={values.role} onChange={(e) => set('role', e.target.value as UserInput['role'])} options={ROLE_OPTIONS} />
            <Select label="Trạng thái" value={values.status} onChange={(e) => set('status', e.target.value as UserInput['status'])} options={STATUS_OPTIONS} />
          </div>
          {!isEdit && (
            <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-800">
              Mật khẩu tạm sẽ được tạo tự động và hiển thị một lần sau khi lưu.
            </p>
          )}
          <div className="flex justify-end gap-2 border-t border-surface-line pt-5">
            <Button variant="secondary" onClick={back}>
              Hủy
            </Button>
            <Button type="submit" loading={m.isSaving}>
              {isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </Button>
          </div>
        </form>
      </Card>

      <TempPasswordModal
        open={!!created}
        name={created?.name ?? ''}
        password={created?.password ?? null}
        onClose={() => {
          if (created) select(created.id)
          setCreated(null)
          back()
        }}
      />
    </>
  )
}