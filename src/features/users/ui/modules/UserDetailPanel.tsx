import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Copy, KeyRound, Lock, LockOpen, Pencil, UserRound, X } from 'lucide-react'
import { selectUser, useAuthStore } from '@/features/auth'
import { toast } from '@/app/providers/ToastProvider'
import { useCan } from '@/app/router/RoleGuard'
import { formatDateTime } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Modal } from '@/shared/ui/Modal'
import { useUserList } from '../../hooks/useUserList'
import { useUserMutation } from '../../hooks/useUserMutation'
import { editUserPath } from '../../lib/utils'
import { NO_DEPT_LABEL } from '../../model/constants'
import { RoleBadge } from '../components/RoleBadge'
import { UserAvatar } from '../components/UserAvatar'
import { UserStatusBadge } from '../components/UserStatusBadge'

/** Hiển thị mật khẩu tạm đúng 1 lần */
export function TempPasswordModal({ open, name, password, onClose }: { open: boolean; name: string; password: string | null; onClose: () => void }) {
  const copy = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      toast.success('Đã sao chép mật khẩu tạm')
    } catch {
      toast.error('Không sao chép được, vui lòng ghi lại thủ công')
    }
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Mật khẩu tạm thời"
      description={`Gửi cho ${name}. Người dùng nên đổi mật khẩu ở lần đăng nhập đầu tiên.`}
      footer={<Button onClick={onClose}>Đã ghi lại</Button>}
    >
      <button
        type="button"
        onClick={() => void copy()}
        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50 px-4 py-4 font-mono text-xl font-bold tracking-wider text-brand-800"
      >
        {password ?? '—'}
        <Copy className="h-5 w-5 text-brand-500 transition group-hover:scale-110" />
      </button>
      <p className="mt-3 text-xs text-ink-muted">Mật khẩu chỉ hiển thị một lần và không được lưu lại trên trình duyệt.</p>
    </Modal>
  )
}

export function UserDetailPanel() {
  const navigate = useNavigate()
  const can = useCan()
  const me = useAuthStore(selectUser)
  const { selected: u, select } = useUserList()
  const m = useUserMutation()
  const [confirmReset, setConfirmReset] = useState(false)
  const [tempPassword, setTempPassword] = useState<string | null>(null)

  if (!u) {
    return (
      <aside className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-surface-line px-6 text-center text-sm text-ink-muted xl:sticky xl:top-20 xl:self-start">
        <UserRound className="h-8 w-8 text-ink-faint" />
        Chọn một công chức để xem chi tiết
      </aside>
    )
  }

  const self = !!me && (me.id === u.id || me.email.toLowerCase() === u.email)
  const facts: [string, string][] = [
    ['Mã công chức', u.id],
    ['Mã cán bộ', u.code ?? '—'],
    ['Email', u.email],
    ['Số điện thoại', u.phone ?? '—'],
    ['Phòng / Ban', u.departmentName ?? NO_DEPT_LABEL],
    ['Ngày tạo', formatDateTime(u.createdAt)],
    ['Đăng nhập gần nhất', u.lastLoginAt ? formatDateTime(u.lastLoginAt) : 'Chưa đăng nhập']
  ]

  const doReset = async () => {
    try {
      setTempPassword(await m.resetPassword(u.id))
      setConfirmReset(false)
    } catch {
      /* toast */
    }
  }

  return (
    <aside className="xl:sticky xl:top-20 xl:self-start">
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-brand-50 to-white px-5 pb-5 pt-6 text-center">
          <button type="button" aria-label="Đóng" onClick={() => select(null)} className="absolute right-3 top-3 rounded-lg p-1.5 text-ink-faint hover:bg-white hover:text-ink">
            <X className="h-4 w-4" />
          </button>
          <div className="flex justify-center">
            <UserAvatar name={u.fullName} size="lg" />
          </div>
          <h3 className="mt-3 text-base font-bold text-ink">{u.fullName}</h3>
          <div className="mt-2 flex justify-center gap-2">
            <RoleBadge role={u.role} />
            <UserStatusBadge status={u.status} />
          </div>
        </div>
        <dl className="divide-y divide-surface-line border-t border-surface-line">
          {facts.map(([k, v]) => (
            <div key={k} className="px-5 py-2.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{k}</dt>
              <dd className="mt-0.5 break-all text-sm text-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
        {can('users:update') && (
          <div className="grid gap-2 border-t border-surface-line p-4">
            <Button variant="secondary" leftIcon={<Pencil />} onClick={() => navigate(editUserPath(u.id))}>
              Chỉnh sửa
            </Button>
            <Button
              variant="secondary"
              leftIcon={u.status === 'LOCKED' ? <LockOpen /> : <Lock />}
              disabled={self}
              loading={m.isSettingStatus}
              onClick={() => void m.setStatus({ userId: u.id, status: u.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED' }).catch(() => undefined)}
            >
              {u.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            </Button>
            <Button variant="secondary" leftIcon={<KeyRound />} onClick={() => setConfirmReset(true)}>
              Đặt lại mật khẩu
            </Button>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        tone="primary"
        title="Đặt lại mật khẩu?"
        message={`Mật khẩu hiện tại của ${u.fullName} sẽ không dùng được nữa. Hệ thống tạo một mật khẩu tạm mới.`}
        confirmText="Đặt lại"
        loading={m.isResetting}
        onConfirm={doReset}
      />
      <TempPasswordModal open={!!tempPassword} name={u.fullName} password={tempPassword} onClose={() => setTempPassword(null)} />
    </aside>
  )
}