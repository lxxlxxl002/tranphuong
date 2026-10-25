import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { AlertTriangle, ChevronLeft, ChevronRight, Eye, Lock, LockOpen, Pencil, RefreshCw, Trash2, Users } from 'lucide-react'
import { selectUser, useAuthStore } from '@/features/auth'
import { useCan } from '@/app/router/RoleGuard'
import { getErrorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Table, type Column } from '@/shared/ui/Table'
import { Tooltip } from '@/shared/ui/Tooltip'
import { useUserList } from '../../hooks/useUserList'
import { useUserMutation } from '../../hooks/useUserMutation'
import { editUserPath } from '../../lib/utils'
import { NO_DEPT_LABEL } from '../../model/constants'
import type { AdminUser } from '../../model/types'
import { RoleBadge } from '../components/RoleBadge'
import { UserAvatar } from '../components/UserAvatar'
import { UserStatusBadge } from '../components/UserStatusBadge'
import { UserFilters } from './UserFilters'

function Action({ label, danger, disabled, onClick, children }: { label: string; danger?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition disabled:cursor-not-allowed disabled:opacity-30',
          danger ? 'hover:bg-rose-50 hover:text-rose-600' : 'hover:bg-slate-100 hover:text-ink'
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}

export function UserTable() {
  const navigate = useNavigate()
  const can = useCan()
  const me = useAuthStore(selectUser)
  const list = useUserList()
  const m = useUserMutation()
  const [locking, setLocking] = useState<AdminUser | null>(null)
  const [deleting, setDeleting] = useState<AdminUser | null>(null)
  const p = list.pagination

  const isSelf = (u: AdminUser) => !!me && (me.id === u.id || me.email.toLowerCase() === u.email)

  const columns: Column<AdminUser>[] = [
    { key: 'id', header: 'Mã CC', width: '170px', render: (u) => <span className="block break-all font-mono text-[11px] leading-4 text-ink-muted">{u.id}</span> },
    {
      key: 'name',
      header: 'Họ và tên',
      render: (u) => (
        <span className="flex items-center gap-2.5">
          <UserAvatar name={u.fullName} />
          <span className="font-semibold text-ink">{u.fullName}</span>
        </span>
      )
    },
    { key: 'dept', header: 'Phòng / Ban', render: (u) => <span className="text-ink-soft">{u.departmentName ?? NO_DEPT_LABEL}</span> },
    { key: 'role', header: 'Vai trò', render: (u) => <RoleBadge role={u.role} /> },
    { key: 'status', header: 'Trạng thái', render: (u) => <UserStatusBadge status={u.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (u) => (
        <span className="inline-flex gap-0.5">
          <Action label="Xem chi tiết" onClick={() => list.select(u.id)}>
            <Eye className="h-4 w-4" />
          </Action>
          {can('users:update') && (
            <>
              <Action label="Chỉnh sửa" onClick={() => navigate(editUserPath(u.id))}>
                <Pencil className="h-4 w-4" />
              </Action>
              <Action label={u.status === 'LOCKED' ? 'Mở khóa' : 'Khóa tài khoản'} disabled={isSelf(u)} onClick={() => setLocking(u)}>
                {u.status === 'LOCKED' ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </Action>
            </>
          )}
          {can('users:delete') && (
            <Action label="Xóa" danger disabled={isSelf(u)} onClick={() => setDeleting(u)}>
              <Trash2 className="h-4 w-4" />
            </Action>
          )}
        </span>
      )
    }
  ]

  const confirmLock = async () => {
    if (!locking) return
    try {
      await m.setStatus({ userId: locking.id, status: locking.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED' })
      setLocking(null)
    } catch {
      /* toast */
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await m.deleteUser(deleting.id)
      if (list.selected?.id === deleting.id) list.select(null)
      setDeleting(null)
    } catch {
      /* toast */
    }
  }

  return (
    <Card className="min-w-0">
      <div className="border-b border-surface-line p-5">
        <UserFilters />
      </div>
      {list.isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được người dùng"
          description={getErrorMessage(list.error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void list.refetch()}>
              Thử lại
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto px-1 pb-2 pt-1 [-webkit-overflow-scrolling:touch]">
          <Table
            columns={columns}
            data={list.pageUsers}
            rowKey={(u) => u.id}
            loading={list.isLoading}
            skeletonRows={6}
            selectedKey={list.selected?.id ?? null}
            onRowClick={(u) => list.select(u.id)}
            empty={<EmptyState icon={Users} title={list.all.length === 0 ? 'Chưa có người dùng' : 'Không tìm thấy người dùng phù hợp'} compact />}
          />
          {p.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-ink-muted">
              <span>
                {p.start}–{p.end} / {list.users.length} người
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" leftIcon={<ChevronLeft />} disabled={!p.hasPrev} onClick={p.prev}>
                  Trước
                </Button>
                <Button size="sm" variant="secondary" rightIcon={<ChevronRight />} disabled={!p.hasNext} onClick={p.next}>
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!locking}
        onClose={() => setLocking(null)}
        tone={locking?.status === 'LOCKED' ? 'primary' : 'danger'}
        title={locking?.status === 'LOCKED' ? 'Mở khóa tài khoản?' : 'Khóa tài khoản?'}
        message={
          locking
            ? locking.status === 'LOCKED'
              ? `${locking.fullName} sẽ đăng nhập lại được.`
              : `${locking.fullName} sẽ không thể đăng nhập cho đến khi được mở khóa. Dữ liệu học tập vẫn được giữ.`
            : undefined
        }
        confirmText={locking?.status === 'LOCKED' ? 'Mở khóa' : 'Khóa tài khoản'}
        loading={m.isSettingStatus}
        onConfirm={confirmLock}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Xóa người dùng?"
        message={deleting ? `Tài khoản ${deleting.fullName} (${deleting.email}) sẽ bị xóa vĩnh viễn. Nên dùng "Khóa" nếu chỉ tạm ngừng.` : undefined}
        confirmText="Xóa vĩnh viễn"
        loading={m.isDeleting}
        onConfirm={confirmDelete}
      />
    </Card>
  )
}
