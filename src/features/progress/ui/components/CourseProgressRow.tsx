import { CourseStatusBadge } from '@/features/my-courses'
import { fromNow } from '@/shared/lib/date'
import { formatScore } from '@/shared/lib/format'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import type { CourseProgress } from '../../model/types'

interface CourseProgressRowProps {
  course: CourseProgress
  onOpen: () => void
}

export function CourseProgressRow({ course, onOpen }: CourseProgressRowProps) {
  const meta = [
    `${course.lessonsDone}/${course.lessonsTotal} bài`,
    course.bestScore != null ? `Điểm cao nhất ${formatScore(course.bestScore)}` : null,
    course.lastAccessedAt ? `Học gần nhất ${fromNow(course.lastAccessedAt)}` : null
  ].filter(Boolean)

  return (
    <button type="button" onClick={onOpen} className="group block w-full px-5 py-4 text-left transition hover:bg-slate-50/70">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[15px] font-semibold uppercase text-ink transition group-hover:text-brand-700">{course.title}</span>
        <CourseStatusBadge status={course.status} />
      </div>
      <ProgressBar className="mt-3" value={course.percent} showLabel />
      <p className="mt-1.5 text-xs text-ink-muted">{meta.join(' · ')}</p>
    </button>
  )
}