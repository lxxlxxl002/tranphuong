import { Badge } from '@/shared/ui/Badge'
import { COURSE_STATUS_META } from '../../model/constants'
import type { CourseStatus } from '../../model/types'

export function CourseStatusBadge({ status, className }: { status: CourseStatus; className?: string }) {
  const meta = COURSE_STATUS_META[status]
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  )
}