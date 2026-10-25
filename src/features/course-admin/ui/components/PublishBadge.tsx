import { Badge } from '@/shared/ui/Badge'
import { STATUS_META } from '../../model/constants'
import type { PublishStatus } from '../../model/types'

export function PublishBadge({ status, className }: { status: PublishStatus; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  )
}