import { NavLink } from 'react-router'
import { NAV_GROUPS } from '@/app/navigation/navConfig'
import { useCan } from '@/app/router/RoleGuard'
import { cn } from '@/shared/lib/cn'

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const can = useCan()
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-sidebar">
      {NAV_GROUPS.map((group) => {
        const items = group.items.filter((i) => can(i.permission))
        if (!items.length) return null
        return (
          <div key={group.key} className={cn(group.title && 'mt-6')}>
            {group.title && (
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-sidebar-muted">{group.title}</p>
            )}
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold transition-colors',
                        isActive
                          ? 'bg-sidebar-active text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)]'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      )
                    }
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.9} />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}