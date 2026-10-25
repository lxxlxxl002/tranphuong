import { CheckCircle2, Lightbulb, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/Badge'
import { Tooltip } from '@/shared/ui/Tooltip'
import { letter } from '../../lib/utils'
import { TYPE_META } from '../../model/constants'
import type { Question } from '../../model/types'

interface QuestionItemProps {
  question: Question
  canEdit: boolean
  canDelete: boolean
  onEdit: () => void
  onDelete: () => void
}

export function QuestionItem({ question: q, canEdit, canDelete, onEdit, onDelete }: QuestionItemProps) {
  const meta = TYPE_META[q.type]
  return (
    <article className="rounded-2xl border border-surface-line bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">{q.order}</span>
        <div className="min-w-0 flex-1">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          <p className="mt-2 whitespace-pre-line font-medium leading-relaxed text-ink">{q.text}</p>
        </div>
        {(canEdit || canDelete) && (
          <div className="flex shrink-0 gap-0.5">
            {canEdit && (
              <Tooltip content="Chỉnh sửa">
                <button type="button" aria-label="Chỉnh sửa" onClick={onEdit} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:bg-slate-100 hover:text-ink">
                  <Pencil className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip content="Xóa">
                <button type="button" aria-label="Xóa" onClick={onDelete} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:bg-rose-50 hover:text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      <ul className="mt-3 grid gap-2 pl-11 sm:grid-cols-2">
        {q.options.map((o, i) => (
          <li
            key={o.id}
            className={cn(
              'flex items-start gap-2 rounded-lg px-3 py-2 text-sm',
              o.correct ? 'bg-green-50 text-green-800 ring-1 ring-inset ring-green-200' : 'bg-slate-50 text-ink-soft'
            )}
          >
            <span className="font-bold">{letter(i)}.</span>
            <span className="flex-1">{o.text}</span>
            {o.correct && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />}
          </li>
        ))}
      </ul>

      {q.explanation && (
        <p className="mt-3 flex gap-1.5 pl-11 text-xs text-ink-muted">
          <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          {q.explanation}
        </p>
      )}
    </article>
  )
}