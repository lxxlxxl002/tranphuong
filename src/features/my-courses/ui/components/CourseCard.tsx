import { BookOpen, Landmark, Play, Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { Skeleton } from '@/shared/ui/Skeleton'
import { pickCoverTheme } from '../../lib/utils'
import type { CoverTheme } from '../../model/constants'
import type { MyCourse } from '../../model/types'
import { CourseStatusBadge } from './CourseStatusBadge'

const THEMES: Record<CoverTheme, { bg: string; text: string; Icon: typeof BookOpen }> = {
  navy: { bg: 'from-[#071a46] via-[#0f3a91] to-[#0a2766]', text: 'text-white', Icon: Sparkles },
  gold: { bg: 'from-[#f8eedb] via-[#efdcb5] to-[#dcbc7f]', text: 'text-brand-900', Icon: Landmark },
  night: { bg: 'from-[#0b1220] via-[#1e293b] to-[#7c2d12]', text: 'text-white', Icon: BookOpen }
}

export function CourseCover({ course, className }: { course: Pick<MyCourse, 'id' | 'title' | 'coverUrl'>; className?: string }) {
  if (course.coverUrl) {
    return (
      <div className={cn('relative overflow-hidden bg-slate-100', className)}>
        <img
          src={course.coverUrl}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    )
  }
  const theme = THEMES[pickCoverTheme(course.id)]
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br', theme.bg, className)}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:28px_28px]"
      />
      <theme.Icon aria-hidden className={cn('absolute -bottom-4 -right-4 h-36 w-36 opacity-15', theme.text)} strokeWidth={1.2} />
      <div className="relative flex h-full items-center px-6">
        <p className={cn('line-clamp-2 text-2xl font-extrabold uppercase leading-tight tracking-tight drop-shadow', theme.text)}>
          {course.title}
        </p>
      </div>
    </div>
  )
}

interface CourseCardProps {
  course: MyCourse
  actionLabel: string
  onAction: () => void
  loading?: boolean
}

export function CourseCard({ course, actionLabel, onAction, loading }: CourseCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-pop">
      <CourseCover course={course} className="h-[180px]" />
      <div className="flex flex-1 flex-col p-4">
        <div>
          <CourseStatusBadge status={course.status} />
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold uppercase leading-5 text-ink" title={course.title}>
          {course.title}
        </h3>
        {course.status === 'IN_PROGRESS' && (
          <div className="mt-2">
            <ProgressBar value={course.progress} showLabel />
            <p className="mt-1 text-xs text-ink-muted">
              {course.lessonsDone}/{course.lessonsTotal} bài
            </p>
          </div>
        )}
        <Button className="mt-4" fullWidth leftIcon={<Play />} loading={loading} onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </article>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-card">
      <Skeleton className="h-[180px] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}