import { Menu } from 'lucide-react'
import { selectRole, useAuthStore } from '@/features/auth'
import { roleLabel } from '@/shared/constants/roles'
import { NotificationBell } from './NotificationBell'
import { UserMenu } from './UserMenu'

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const role = useAuthStore(selectRole)
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-surface-line bg-white/95 px-4 backdrop-blur lg:px-7">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Ẩn/hiện menu"
        className="rounded-lg p-2 text-ink-muted transition hover:bg-slate-100 hover:text-ink"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h2 className="truncate text-xl font-semibold text-ink">{role ? roleLabel(role) : ''}</h2>
      <div className="ml-auto flex items-center gap-2">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}