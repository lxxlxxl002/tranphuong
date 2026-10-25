import { ClipboardCheck, Lock } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import type { Eligibility, Lesson, LessonProgress, QuizInfo } from '../../model/types'
import { LessonItem } from '../components/LessonItem'

interface LessonSidebarProps {
  lessons: Lesson[]
  currentId: string | null
  progress: LessonProgress
  quiz: QuizInfo | null
  eligibility: Eligibility
  onSelect: (lessonId: string) => void
  onStartQuiz: () => void
}

export function LessonSidebar({ lessons, currentId, progress, quiz, eligibility, onSelect, onStartQuiz }: LessonSidebarProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
      <Card>
        <div className="border-b border-surface-line px-5 py-4">
          <h3 className="text-[15px] font-semibold text-ink">Nội dung khóa học</h3>
          <div className="mt-3">
            <ProgressBar value={progress.percent} showLabel />
            <p className="mt-1 text-xs text-ink-muted">
              Đã học {progress.done}/{progress.total} bài
            </p>
          </div>
        </div>
        {lessons.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-ink-muted">Khóa học chưa có bài học.</p>
        ) : (
          <div className="max-h-[calc(100vh-24rem)] min-h-[120px] space-y-1 overflow-y-auto p-2 scrollbar-thin">
            {lessons.map((l) => (
              <LessonItem key={l.id} lesson={l} active={l.id === currentId} onClick={() => onSelect(l.id)} />
            ))}
          </div>
        )}
      </Card>

      {quiz && (
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Bài kiểm tra cuối khóa</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {quiz.questionCount} câu · {quiz.durationMin > 0 ? `${quiz.durationMin} phút` : 'Không giới hạn'} · Đạt ≥ {quiz.passScore}
              </p>
              {quiz.bestScore != null && (
                <p className="mt-1.5 text-xs text-ink-soft">
                  Điểm cao nhất:{' '}
                  <span className={quiz.bestScore >= quiz.passScore ? 'font-semibold text-green-600' : 'font-semibold text-rose-500'}>
                    {quiz.bestScore}/100
                  </span>
                </p>
              )}
            </div>
          </div>
          <Button className="mt-4" fullWidth leftIcon={<ClipboardCheck />} disabled={!eligibility.ok} onClick={onStartQuiz}>
            {quiz.attemptsUsed > 0 ? 'Làm lại bài kiểm tra' : 'Làm bài kiểm tra'}
          </Button>
          {!eligibility.ok && eligibility.reason && (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-muted">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {eligibility.reason}
            </p>
          )}
        </Card>
      )}
    </aside>
  )
}