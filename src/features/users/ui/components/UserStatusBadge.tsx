import { Badge } from '@/shared/ui/Badge'
import { STATUS_META } from '../../model/constants'
import type { UserStatus } from '../../model/types'

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const meta = STATUS_META[status]
  return (
    <Badge tone={meta.tone} className="text-xs">
      {meta.label}
    </Badge>
  )
}