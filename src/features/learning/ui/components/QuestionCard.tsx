import { Check, Flag } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Card } from '@/shared/ui/Card'
import type { QuizQuestion } from '../../model/types'

interface QuestionCardProps {
  question: QuizQuestion
  index: number
  total: number
  selected: string[]
  flagged: boolean
  onSelect: (optionId: string) => void
  onToggleFlag: () => void
  disabled?: boolean
}

export function QuestionCard({ question, index, total, selected, flagged, onSelect, onToggleFlag, disabled }: QuestionCardProps) {
  const multiple = question.type === 'MULTIPLE'
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Câu {index + 1}/{total}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">{multiple ? 'Chọn tất cả đáp án đúng' : 'Chọn một đáp án đúng'}</p>
        </div>
        <button
          type="button"
          onClick={onToggleFlag}
          aria-pressed={flagged}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset transition',
            flagged ? 'bg-amber-50 text-amber-600 ring-amber-200' : 'text-ink-muted ring-surface-line hover:bg-slate-50'
          )}
        >
          <Flag className={cn('h-3.5 w-3.5', flagged && 'fill-current')} />
          {flagged ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}
        </button>
      </div>

      <h2 className="mt-4 whitespace-pre-line text-lg font-semibold leading-relaxed text-ink">{question.text}</h2>

      <div role={multiple ? 'group' : 'radiogroup'} className="mt-5 space-y-3">
        {question.options.map((o, i) => {
          const checked = selected.includes(o.id)
          return (
            <button
              key={o.id}
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={checked}
              disabled={disabled}
              onClick={() => onSelect(o.id)}
              className={cn(
                'flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left text-[15px] transition disabled:cursor-not-allowed',
                checked
                  ? 'border-brand-500 bg-brand-50 text-ink shadow-sm'
                  : 'border-surface-line bg-white text-ink-soft hover:border-brand-200 hover:bg-slate-50'
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold',
                  multiple ? 'rounded-md' : 'rounded-full',
                  checked ? 'bg-brand-500 text-white' : 'bg-slate-100 text-ink-muted'
                )}
              >
                {checked && multiple ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{o.text}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}