import type { ReactNode } from 'react'
import { AlertCircle, AlignLeft, ArrowDown, ArrowUp, FileText, Pencil, PlayCircle, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { formatDuration } from '@/shared/lib/date'
import { Tooltip } from '@/shared/ui/Tooltip'
import { LESSON_TYPE_OPTIONS } from '../../model/constants'
import type { AdminLesson, AdminLessonType } from '../../model/types'

const TYPE_ICONS: Record<AdminLessonType, typeof PlayCircle> = { VIDEO: PlayCircle, DOCUMENT: FileText, TEXT: AlignLeft }
const TYPE_LABEL = Object.fromEntries(LESSON_TYPE_OPTIONS.map((o) => [o.value, o.label])) as Record<AdminLessonType, string>

function IconButton({ label, danger, disabled, onClick, children }: { label: string; danger?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition disabled:cursor-not-allowed disabled:opacity-30',
          danger ? 'hover:bg-rose-50 hover:text-rose-600' : 'hover:bg-slate-100 hover:text-ink'
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}

interface LessonRowProps {
  lesson: AdminLesson
  isFirst: boolean
  isLast: boolean
  canEdit: boolean
  canDelete: boolean
  busy?: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onEdit: () => void
  onDelete: () => void
}

export function LessonRow({ lesson, isFirst, isLast, canEdit, canDelete, busy, onMoveUp, onMoveDown, onEdit, onDelete }: LessonRowProps) {
  const Icon = TYPE_ICONS[lesson.type]
  const missingMedia = (lesson.type === 'VIDEO' && !lesson.videoUrl) || (lesson.type === 'DOCUMENT' && !lesson.documentUrl)
  return (
    <li className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-slate-50/60">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
        {lesson.order}
      </span>
      <Icon className="h-5 w-5 shrink-0 text-ink-faint" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{lesson.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-muted">
          <span>{TYPE_LABEL[lesson.type]}</span>
          {lesson.durationSec > 0 && <span>· {formatDuration(lesson.durationSec)}</span>}
          {missingMedia && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              · <AlertCircle className="h-3.5 w-3.5" />
              {lesson.type === 'VIDEO' ? 'Chưa có video' : 'Chưa có tài liệu'}
            </span>
          )}
        </p>
      </div>
      {(canEdit || canDelete) && (
        <div className="flex shrink-0 items-center gap-0.5">
          {canEdit && (
            <>
              <IconButton label="Lên trên" disabled={isFirst || busy} onClick={onMoveUp}>
                <ArrowUp className="h-4 w-4" />
              </IconButton>
              <IconButton label="Xuống dưới" disabled={isLast || busy} onClick={onMoveDown}>
                <ArrowDown className="h-4 w-4" />
              </IconButton>
              <IconButton label="Chỉnh sửa" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </IconButton>
            </>
          )}
          {canDelete && (
            <IconButton label="Xóa" danger onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      )}
    </li>
  )
}