import { Headphones } from 'lucide-react'
import { useAppSettings } from '@/features/settings'

export function SupportCard() {
  const { support } = useAppSettings()
  if (!support.name && !support.phone && !support.email) return null
  return (
    <div className="border-t border-sidebar-border p-3">
      <a
        href={support.phone ? `tel:${support.phone.replace(/\s/g, '')}` : support.email ? `mailto:${support.email}` : undefined}
        title={support.workingHours || undefined}
        className="block rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15"
      >
        <p className="flex items-center gap-2 text-sm font-bold">
          <Headphones className="h-4 w-4" />
          Hỗ trợ hệ thống
        </p>
        {support.name && <p className="mt-1 pl-6 text-xs text-white/80">{support.name}</p>}
        {support.phone && <p className="pl-6 text-xs font-semibold text-white/90">{support.phone}</p>}
        {support.email && <p className="truncate pl-6 text-xs text-white/80">{support.email}</p>}
      </a>
    </div>
  )
}