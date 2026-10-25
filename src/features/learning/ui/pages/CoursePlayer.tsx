import { useNavigate, useParams } from 'react-router'
import { AlertTriangle, ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, FileText, RefreshCw } from 'lucide-react'
import { PATHS } from '@/app/router/paths'
import { getErrorMessage } from '@/shared/api/errors'
import { formatDuration } from '@/shared/lib/date'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useLessonPlayer } from '../../hooks/useLessonPlayer'
import { resolveDocumentSource } from '../../lib/utils'
import { LESSON_TYPE_LABELS } from '../../model/constants'
import type { Lesson } from '../../model/types'
import { VideoPlayer } from '../components/VideoPlayer'
import { LessonSidebar } from '../modules/LessonSidebar'

export default function CoursePlayer() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const p = useLessonPlayer(courseId)

  if (p.isLoading) return <PlayerSkeleton />

  if (p.isError || !p.content) {
    return (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được khóa học"
          description={getErrorMessage(p.error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void p.refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <>
      <PageHeader
        title={p.content.title}
        description={p.content.description ?? undefined}
        actions={
          <Button variant="secondary" leftIcon={<ArrowLeft />} onClick={() => navigate(PATHS.myCourses)}>
            Khóa học của tôi
          </Button>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          {p.lesson ? (
            <LessonView
              lesson={p.lesson}
              prev={p.prev}
              next={p.next}
              onSelect={p.select}
              onComplete={p.completeCurrent}
              completing={p.isCompleting}
            />
          ) : (
            <Card>
              <EmptyState
                icon={BookOpen}
                title="Khóa học chưa có bài học"
                description={p.content.quiz ? 'Bạn có thể làm bài kiểm tra cuối khóa ở khung bên phải.' : 'Nội dung đang được cập nhật.'}
              />
            </Card>
          )}
        </div>
        <LessonSidebar
          lessons={p.lessons}
          currentId={p.lesson?.id ?? null}
          progress={p.progress}
          quiz={p.content.quiz}
          eligibility={p.eligibility}
          onSelect={p.select}
          onStartQuiz={() => navigate(p.quizPath)}
        />
      </div>
    </>
  )
}

interface LessonViewProps {
  lesson: Lesson
  prev: Lesson | null
  next: Lesson | null
  onSelect: (id: string) => void
  onComplete: () => void
  completing: boolean
}

function LessonView({ lesson, prev, next, onSelect, onComplete, completing }: LessonViewProps) {
  return (
    <div className="space-y-4">
      {lesson.type === 'VIDEO' && <VideoPlayer url={lesson.videoUrl} title={lesson.title} onEnded={onComplete} />}
      {lesson.type === 'DOCUMENT' && <DocumentView url={lesson.documentUrl} title={lesson.title} />}

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Bài {lesson.order} · {LESSON_TYPE_LABELS[lesson.type]}
              {lesson.durationSec > 0 && ` · ${formatDuration(lesson.durationSec)}`}
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink">{lesson.title}</h2>
          </div>
          {lesson.completed && (
            <Badge tone="success" dot>
              Đã hoàn thành
            </Badge>
          )}
        </div>

        {lesson.content ? (
          <div className="mt-4 whitespace-pre-line text-[15px] leading-7 text-ink-soft">{lesson.content}</div>
        ) : (
          lesson.type === 'TEXT' && <p className="mt-4 text-sm text-ink-muted">Nội dung bài học đang được cập nhật.</p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-surface-line pt-5">
          <Button variant="secondary" leftIcon={<ChevronLeft />} disabled={!prev} onClick={() => prev && onSelect(prev.id)}>
            Bài trước
          </Button>
          <div className="flex flex-wrap gap-2">
            {!lesson.completed && (
              <Button leftIcon={<CheckCircle2 />} loading={completing} onClick={onComplete}>
                Đánh dấu hoàn thành
              </Button>
            )}
            <Button
              variant={lesson.completed ? 'primary' : 'secondary'}
              rightIcon={<ChevronRight />}
              disabled={!next}
              onClick={() => next && onSelect(next.id)}
            >
              Bài tiếp
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function DocumentView({ url, title }: { url: string | null; title: string }) {
  const src = resolveDocumentSource(url)
  if (!src) {
    return (
      <Card>
        <EmptyState icon={FileText} title="Tài liệu chưa được cập nhật" compact />
      </Card>
    )
  }
  return (
    <Card className="overflow-hidden">
      <iframe src={src} title={title} className="h-[70vh] w-full border-0" />
      <div className="flex justify-end border-t border-surface-line px-4 py-2.5">
        <a
          href={url ?? undefined}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Mở tài liệu trong tab mới
        </a>
      </div>
    </Card>
  )
}

function PlayerSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-80" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  )
}