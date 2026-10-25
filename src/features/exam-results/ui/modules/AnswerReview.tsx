import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/Badge'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useResultDetail } from '../../hooks/useResultDetail'
import { optionLetter } from '../../lib/utils'
import { OUTCOME_META, REVIEW_FILTERS } from '../../model/constants'
import type { ReviewQuestion } from '../../model/types'

type OptionTone = 'correct' | 'wrong' | 'idle'

function QuestionReview({ q, revealed, outcome }: { q: ReviewQuestion; revealed: boolean; outcome: keyof typeof OUTCOME_META }) {
  const meta = OUTCOME_META[outcome]
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Câu {q.order}
          {q.type === 'MULTIPLE' && <span className="ml-2 normal-case tracking-normal text-ink-muted">· Nhiều đáp án</span>}
        </p>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>
      <h3 className="mt-3 whitespace-pre-line text-base font-semibold leading-relaxed text-ink">{q.text}</h3>

      <div className="mt-4 space-y-2.5">
        {q.options.map((o, i) => {
          const isSelected = q.selected.includes(o.id)
          const isAnswer = q.correct.includes(o.id)
          const tone: OptionTone = revealed
            ? isAnswer
              ? 'correct'
              : isSelected
                ? 'wrong'
                : 'idle'
            : isSelected
              ? q.isCorrect
                ? 'correct'
                : 'wrong'
              : 'idle'
          return (
            <div
              key={o.id}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm',
                tone === 'correct' && 'border-green-300 bg-green-50 text-green-800',
                tone === 'wrong' && 'border-rose-300 bg-rose-50 text-rose-700',
                tone === 'idle' && 'border-surface-line text-ink-soft'
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold',
                  q.type === 'MULTIPLE' ? 'rounded-md' : 'rounded-full',
                  tone === 'correct' ? 'bg-green-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-ink-muted'
                )}
              >
                {optionLetter(i)}
              </span>
              <span className="flex-1">{o.text}</span>
              {isSelected && <span className="shrink-0 text-xs font-semibold">Bạn chọn</span>}
              {tone === 'correct' && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
              {tone === 'wrong' && <XCircle className="h-5 w-5 shrink-0 text-rose-500" />}
            </div>
          )
        })}
      </div>

      {q.explanation && (
        <div className="mt-4 flex gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{q.explanation}</p>
        </div>
      )}
    </Card>
  )
}

export function AnswerReview({ attemptId }: { attemptId: string }) {
  const { questions, counts, filter, setFilter, answersRevealed, outcomeOf } = useResultDetail(attemptId)

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">Xem lại bài làm</h2>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lọc câu hỏi">
          {REVIEW_FILTERS.map((f) => {
            const active = filter === f.value
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ring-inset transition',
                  active ? 'bg-brand-500 text-white ring-brand-500' : 'bg-white text-ink-soft ring-surface-line hover:bg-slate-50'
                )}
              >
                {f.label}
                <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-white/20' : 'bg-slate-100 text-ink-muted')}>
                  {counts[f.value]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {!answersRevealed && counts.ALL > 0 && (
        <p className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-ink-muted">
          Đáp án đúng không được công bố cho bài kiểm tra này — chỉ hiển thị kết quả lựa chọn của bạn.
        </p>
      )}

      {questions.length === 0 ? (
        <Card>
          <EmptyState title="Không có câu hỏi nào trong mục này" compact />
        </Card>
      ) : (
        questions.map((q) => <QuestionReview key={q.id} q={q} revealed={answersRevealed} outcome={outcomeOf(q)} />)
      )}
    </section>
  )
}