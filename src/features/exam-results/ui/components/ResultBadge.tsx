import { Badge } from '@/shared/ui/Badge'

export function ResultBadge({ passed, className }: { passed: boolean; className?: string }) {
  return (
    <Badge tone={passed ? 'success' : 'danger'} className={className}>
      {passed ? 'Đạt' : 'Không đạt'}
    </Badge>
  )
}