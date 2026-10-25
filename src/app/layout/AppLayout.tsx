import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useMatches } from 'react-router'
import { useSession } from '@/features/auth'
import type { RouteMeta } from '@/app/router/paths'
import { cn } from '@/shared/lib/cn'
import { storage, STORAGE_KEYS } from '@/shared/lib/storage'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Breadcrumbs } from './Breadcrumbs'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Hệ thống Đào tạo Trực tuyến'

export function AppLayout() {
  useSession({ sync: true })
  const [open, setOpen] = useState(() => !storage.get<boolean>(STORAGE_KEYS.sidebarCollapsed))
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const matches = useMatches()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const meta = [...matches].reverse().find((m) => (m.handle as RouteMeta | undefined)?.title)?.handle as
      | RouteMeta
      | undefined
    document.title = meta?.title ? `${meta.title} | ${APP_NAME}` : APP_NAME
  }, [matches])

  const toggle = useCallback(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      const next = !open
      setOpen(next)
      storage.set(STORAGE_KEYS.sidebarCollapsed, !next)
    } else {
      setMobileOpen((v) => !v)
    }
  }, [open])

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar open={open} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className={cn('flex min-h-screen flex-col transition-[padding] duration-300', open && 'lg:pl-[264px]')}>
        <Topbar onToggleSidebar={toggle} />
        <main className="flex-1 bg-app-gradient px-4 py-5 lg:px-7">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  )
}