import { AlignLeft, CheckCircle2, FileText, PlayCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { formatDuration } from '@/shared/lib/date'
import { LESSON_TYPE_LABELS } from '../../model/constants'
import type { Lesson, LessonType } from '../../model/types'

const TYPE_ICONS: Record<LessonType, typeof PlayCircle> = {
  VIDEO: PlayCircle,
  DOCUMENT: FileText,
  TEXT: AlignLeft
}

interface LessonItemProps {
  lesson: Lesson
  active: boolean
  onClick: () => void
}

export function LessonItem({ lesson, active, onClick }: LessonItemProps) {
  const Icon = lesson.completed ? CheckCircle2 : TYPE_ICONS[lesson.type]
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'step' : undefined}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition',
        active ? 'bg-brand-50 ring-1 ring-inset ring-brand-200' : 'hover:bg-slate-50'
      )}
    >
      <Icon
        className={cn('mt-0.5 h-5 w-5 shrink-0', lesson.completed ? 'text-green-500' : active ? 'text-brand-600' : 'text-ink-faint')}
      />
      <span className="min-w-0 flex-1">
        <span className={cn('block text-sm leading-snug', active ? 'font-semibold text-brand-700' : 'font-medium text-ink-soft')}>
          Bài {lesson.order}. {lesson.title}
        </span>
        <span className="mt-0.5 block text-xs text-ink-faint">
          {LESSON_TYPE_LABELS[lesson.type]}
          {lesson.durationSec > 0 && ` · ${formatDuration(lesson.durationSec)}`}
        </span>
      </span>
    </button>
  )
}