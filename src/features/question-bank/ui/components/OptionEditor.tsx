import { Check, Plus, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { letter, newOptionKey } from '../../lib/utils'
import { MAX_OPTIONS, MIN_OPTIONS } from '../../model/constants'
import type { OptionDraft, QuestionType } from '../../model/types'

interface OptionEditorProps {
  type: QuestionType
  options: OptionDraft[]
  error?: string
  onChange: (options: OptionDraft[]) => void
  onToggleCorrect: (key: string) => void
}

export function OptionEditor({ type, options, error, onChange, onToggleCorrect }: OptionEditorProps) {
  const multiple = type === 'MULTIPLE'
  const update = (key: string, text: string) => onChange(options.map((o) => (o.key === key ? { ...o, text } : o)))
  const remove = (key: string) => onChange(options.filter((o) => o.key !== key))
  const add = () => onChange([...options, { key: newOptionKey(), text: '', correct: false }])

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-sm font-medium text-ink-soft">
          Đáp án <span className="text-rose-500">*</span>
        </p>
        <p className="text-xs text-ink-muted">{multiple ? 'Tích chọn tất cả đáp án đúng' : 'Chọn 1 đáp án đúng'}</p>
      </div>

      <div className="space-y-2">
        {options.map((o, i) => (
          <div
            key={o.key}
            className={cn('flex items-center gap-2 rounded-xl border p-2 transition', o.correct ? 'border-green-300 bg-green-50/60' : 'border-surface-line bg-white')}
          >
            <button
              type="button"
              onClick={() => onToggleCorrect(o.key)}
              aria-pressed={o.correct}
              aria-label={`Đánh dấu đáp án ${letter(i)} là đúng`}
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center border-2 transition',
                multiple ? 'rounded-md' : 'rounded-full',
                o.correct ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 text-transparent hover:border-green-400'
              )}
            >
              <Check className="h-4 w-4" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-ink-muted">{letter(i)}</span>
            <input
              value={o.text}
              onChange={(e) => update(o.key, e.target.value)}
              placeholder={`Nội dung đáp án ${letter(i)}`}
              className="h-9 flex-1 rounded-lg border border-transparent bg-transparent px-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand-300 focus:bg-white focus:outline-none"
            />
            <button
              type="button"
              onClick={() => remove(o.key)}
              disabled={options.length <= MIN_OPTIONS}
              aria-label="Xóa đáp án"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {options.length < MAX_OPTIONS && (
        <Button size="sm" variant="ghost" leftIcon={<Plus />} className="mt-2" onClick={add}>
          Thêm đáp án
        </Button>
      )}
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
    </div>
  )
}