import { useCan } from '@/app/router/RoleGuard'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useRoles } from '../../hooks/useRoles'
import { RoleCard } from '../components/RoleCard'

export function RoleList() {
  const can = useCan()
  const { roles, selected, dirtyKeys, summary, select, openEdit, isLoading } = useRoles()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <nav aria-label="Danh sách vai trò" className="space-y-3">
      {roles.map((r) => (
        <RoleCard
          key={r.key}
          role={r}
          summary={summary(r)}
          active={selected?.key === r.key}
          dirty={dirtyKeys.has(r.key)}
          canEdit={can('permissions:update')}
          onSelect={() => select(r.key)}
          onEdit={() => openEdit(r.key)}
        />
      ))}
    </nav>
  )
}