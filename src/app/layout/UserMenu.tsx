import { useNavigate } from 'react-router'
import { ChevronDown, LogOut, Settings } from 'lucide-react'
import { selectUser, useAuthStore, useLogout } from '@/features/auth'
import { useCan } from '@/app/router/RoleGuard'
import { PATHS } from '@/app/router/paths'
import { roleLabel } from '@/shared/constants/roles'
import { Avatar } from '@/shared/ui/Avatar'
import { Dropdown, type DropdownItem } from '@/shared/ui/Dropdown'
import logo from '@/assets/logo-quoc-huy.png'

export function UserMenu() {
  const user = useAuthStore(selectUser)
  const navigate = useNavigate()
  const can = useCan()
  const logout = useLogout()
  if (!user) return null

  const items: DropdownItem[] = []
  if (can('settings:view')) {
    items.push(
      { key: 'settings', label: 'Cài đặt hệ thống', icon: Settings, onClick: () => navigate(PATHS.settings) },
      { key: 'divider', divider: true }
    )
  }
  items.push({
    key: 'logout',
    label: logout.isPending ? 'Đang đăng xuất...' : 'Đăng xuất',
    icon: LogOut,
    danger: true,
    disabled: logout.isPending,
    onClick: () => logout.mutate()
  })

  return (
    <Dropdown
      items={items}
      header={
        <div>
          <p className="text-sm font-semibold text-ink">{user.fullName}</p>
          <p className="truncate text-xs text-ink-muted">{user.email}</p>
        </div>
      }
      trigger={
        <span className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 transition hover:bg-slate-50">
          {user.avatarUrl ? (
            <Avatar name={user.fullName} src={user.avatarUrl} />
          ) : (
            <img src={logo} alt="" className="h-9 w-9 shrink-0" />
          )}
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-ink">{user.fullName}</span>
            <span className="block text-xs leading-tight text-ink-muted">{roleLabel(user.role)}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-ink-faint" />
        </span>
      }
    />
  )
}