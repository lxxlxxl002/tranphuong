import { useAppSettings } from '@/features/settings'
import { cn } from '@/shared/lib/cn'
import logo from '@/assets/logo-quoc-huy.png'
import { SidebarNav } from './SidebarNav'
import { SupportCard } from './SupportCard'

interface SidebarProps {
  open: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ open, mobileOpen, onCloseMobile }: SidebarProps) {
  const { general } = useAppSettings()
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onCloseMobile} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-sidebar text-white transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          open ? 'lg:translate-x-0' : 'lg:-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5">
          <img src={logo} alt="Quốc huy" className="h-16 w-16 shrink-0 drop-shadow -my-2" />
          <div className="min-w-0 flex-1 text-center">
            <p className="text-balance text-[13px] font-extrabold uppercase leading-snug tracking-tight">{general.orgName}</p>
            <p className="mt-1.5 text-[11px] text-white/80">{general.systemName}</p>
          </div>
        </div>
        <SidebarNav onNavigate={onCloseMobile} />
        <SupportCard />
      </aside>
    </>
  )
}


