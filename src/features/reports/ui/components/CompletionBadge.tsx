import { formatPercent } from '@/shared/lib/format'
import { Badge, percentTone } from '@/shared/ui/Badge'

export function CompletionBadge({ value }: { value: number }) {
  return <Badge tone={percentTone(value)}>{formatPercent(value)}</Badge>
}