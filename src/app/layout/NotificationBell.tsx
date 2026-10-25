import { Bell, BellOff } from 'lucide-react'
import { Dropdown } from '@/shared/ui/Dropdown'

export function NotificationBell({ count = 0 }: { count?: number }) {
  return (
    <Dropdown
      items={[]}
      header={
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <BellOff className="h-6 w-6 text-ink-faint" />
          <p className="text-sm text-ink-muted">Chưa có thông báo mới</p>
        </div>
      }
      trigger={
        <span className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition hover:bg-slate-100 hover:text-ink">
          <Bell className="h-5 w-5" />
          {count > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}
        </span>
      }
    />
  )
}