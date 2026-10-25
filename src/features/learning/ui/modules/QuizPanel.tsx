import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardX,
  Clock,
  ListChecks,
  Lock,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Send,
  Target
} from 'lucide-react'
import { toast } from '@/app/providers/ToastProvider'
import { buildPath, PATHS } from '@/app/router/paths'
import { getErrorMessage } from '@/shared/api/errors'
import { useDisclosure } from '@/shared/hooks/useDisclosure'
import { cn } from '@/shared/lib/cn'
import { toPercent } from '@/shared/lib/format'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useQuizSession } from '../../hooks/useQuizSession'
import { useSubmitQuiz } from '../../hooks/useSubmitQuiz'
import { coursePath } from '../../lib/utils'
import type { Eligibility, QuizInfo } from '../../model/types'
import { QuestionCard } from '../components/QuestionCard'
import { QuizTimer } from '../components/QuizTimer'
import { ResultModal } from './ResultModal'

const RULES = [
  'Mỗi câu hỏi có thể có một hoặc nhiều đáp án đúng — đọc kỹ hướng dẫn dưới số câu.',
  'Bài làm được lưu tự động, tải lại trang không mất đáp án.',
  'Khi hết thời gian, hệ thống tự động nộp bài.',
  'Sau khi nộp, bạn không thể chỉnh sửa đáp án.'
]

export function QuizPanel({ courseId }: { courseId: string }) {
  const navigate = useNavigate()
  const q = useQuizSession(courseId)
  const { submit, isSubmitting } = useSubmitQuiz(courseId)
  const confirm = useDisclosure()

  const handleExpire = useCallback(() => {
    toast.info('Đã hết thời gian làm bài. Hệ thống tự động nộp bài.')
    submit()
  }, [submit])

  const result = q.result
  const resultModal = (
    <ResultModal
      open={!!result}
      result={result}
      onClose={q.closeResult}
      onBackToCourse={() => {
        q.closeResult()
        navigate(coursePath(courseId))
      }}
      onViewDetail={() => {
        if (!result) return
        q.closeResult()
        navigate(buildPath(PATHS.examResultDetail, { attemptId: result.attemptId }))
      }}
      onViewCertificate={() => {
        q.closeResult()
        navigate(PATHS.certificates)
      }}
    />
  )

  let body
  if (q.isLoading) {
    body = (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  } else if (q.isError) {
    body = (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được bài kiểm tra"
          description={getErrorMessage(q.error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void q.refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    )
  } else if (!q.quiz) {
    body = (
      <Card>
        <EmptyState
          icon={ClipboardX}
          title="Khóa học chưa có bài kiểm tra"
          action={
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft />} onClick={() => navigate(coursePath(courseId))}>
              Quay lại khóa học
            </Button>
          }
        />
      </Card>
    )
  } else if (!q.isActive) {
    body = (
      <QuizIntro
        quiz={q.quiz}
        eligibility={q.eligibility}
        starting={q.isStarting}
        onStart={q.start}
        onBack={() => navigate(coursePath(courseId))}
      />
    )
  } else {
    const question = q.currentQuestion
    body = (
      <div className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <Card className="sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{q.quiz.title}</p>
              <p className="text-xs text-ink-muted">
                Đã trả lời {q.answeredCount}/{q.total} câu
              </p>
            </div>
            <div className="flex items-center gap-3">
              {q.deadline && <QuizTimer deadline={q.deadline} onExpire={handleExpire} />}
              <Button leftIcon={<Send />} loading={isSubmitting} onClick={confirm.open}>
                Nộp bài
              </Button>
            </div>
          </Card>

          <ProgressBar value={toPercent(q.answeredCount, q.total)} size="xs" />

          {question && (
            <QuestionCard
              question={question}
              index={q.current}
              total={q.total}
              selected={q.answers[question.id] ?? []}
              flagged={q.flagged.includes(question.id)}
              onSelect={(optionId) => q.answer(question, optionId)}
              onToggleFlag={() => q.toggleFlag(question.id)}
              disabled={isSubmitting}
            />
          )}

          <div className="flex justify-between gap-3">
            <Button variant="secondary" leftIcon={<ChevronLeft />} disabled={q.current === 0} onClick={q.prev}>
              Câu trước
            </Button>
            {q.current < q.total - 1 ? (
              <Button variant="secondary" rightIcon={<ChevronRight />} onClick={q.next}>
                Câu tiếp
              </Button>
            ) : (
              <Button leftIcon={<Send />} loading={isSubmitting} onClick={confirm.open}>
                Nộp bài
              </Button>
            )}
          </div>
        </div>

        <Card className="p-5 xl:sticky xl:top-20 xl:self-start">
          <h3 className="text-sm font-semibold text-ink">Danh sách câu hỏi</h3>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {q.questions.map((item, i) => {
              const answered = (q.answers[item.id]?.length ?? 0) > 0
              const flagged = q.flagged.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => q.goTo(i)}
                  aria-label={`Câu ${i + 1}`}
                  aria-current={i === q.current ? 'step' : undefined}
                  className={cn(
                    'relative flex h-10 items-center justify-center rounded-lg text-sm font-semibold ring-1 ring-inset transition',
                    answered ? 'bg-brand-500 text-white ring-brand-500' : 'bg-white text-ink-soft ring-surface-line hover:bg-slate-50',
                    i === q.current && 'ring-2 ring-brand-600 ring-offset-2'
                  )}
                >
                  {i + 1}
                  {flagged && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />}
                </button>
              )
            })}
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-ink-muted">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-brand-500" />
              Đã trả lời
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded ring-1 ring-inset ring-surface-line" />
              Chưa trả lời
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Đánh dấu xem lại
            </li>
          </ul>
          <Button className="mt-5" fullWidth leftIcon={<Send />} loading={isSubmitting} onClick={confirm.open}>
            Nộp bài
          </Button>
        </Card>

        <ConfirmDialog
          open={confirm.isOpen}
          onClose={confirm.close}
          tone="primary"
          title="Nộp bài kiểm tra?"
          message={
            q.unansweredCount > 0
              ? `Bạn còn ${q.unansweredCount} câu chưa trả lời. Sau khi nộp sẽ không thể sửa đáp án.`
              : 'Bạn đã trả lời tất cả câu hỏi. Sau khi nộp sẽ không thể sửa đáp án.'
          }
          confirmText="Nộp bài"
          onConfirm={() => {
            confirm.close()
            submit()
          }}
        />
      </div>
    )
  }

  return (
    <>
      {body}
      {resultModal}
    </>
  )
}

interface QuizIntroProps {
  quiz: QuizInfo
  eligibility: Eligibility
  starting: boolean
  onStart: () => void
  onBack: () => void
}

function QuizIntro({ quiz, eligibility, starting, onStart, onBack }: QuizIntroProps) {
  const remaining = quiz.maxAttempts > 0 ? Math.max(0, quiz.maxAttempts - quiz.attemptsUsed) : null
  const tiles = [
    { icon: ListChecks, label: 'Số câu hỏi', value: `${quiz.questionCount} câu` },
    { icon: Clock, label: 'Thời gian', value: quiz.durationMin > 0 ? `${quiz.durationMin} phút` : 'Không giới hạn' },
    { icon: Target, label: 'Điểm đạt', value: `≥ ${quiz.passScore}/100` },
    { icon: RotateCcw, label: 'Lượt làm còn lại', value: remaining == null ? 'Không giới hạn' : `${remaining}/${quiz.maxAttempts}` }
  ]

  return (
    <Card className="mx-auto max-w-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-7 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Bài kiểm tra cuối khóa</p>
        <h1 className="mt-1 text-2xl font-bold">{quiz.title}</h1>
        {quiz.bestScore != null && (
          <p className="mt-2 text-sm text-white/80">
            Điểm cao nhất của bạn: <b className="text-white">{quiz.bestScore}/100</b>
          </p>
        )}
      </div>
      <div className="p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl border border-surface-line bg-slate-50/60 p-4">
              <t.icon className="h-5 w-5 text-brand-500" />
              <p className="mt-2 text-xs text-ink-muted">{t.label}</p>
              <p className="mt-0.5 font-bold text-ink">{t.value}</p>
            </div>
          ))}
        </div>

        <ul className="mt-6 space-y-2 text-sm text-ink-soft">
          {RULES.map((r) => (
            <li key={r} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              {r}
            </li>
          ))}
        </ul>

        {!eligibility.ok && eligibility.reason && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" />
            {eligibility.reason}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" leftIcon={<ArrowLeft />} onClick={onBack}>
            Quay lại khóa học
          </Button>
          <Button size="lg" leftIcon={<PlayCircle />} disabled={!eligibility.ok} loading={starting} onClick={onStart}>
            Bắt đầu làm bài
          </Button>
        </div>
      </div>
    </Card>
  )
}
