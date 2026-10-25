import { useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, ListChecks, Plus, RefreshCw } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { SearchInput } from '@/shared/ui/SearchInput'
import { Select } from '@/shared/ui/Select'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useQuestionList } from '../../hooks/useQuestionList'
import { useQuestionMutation } from '../../hooks/useQuestionMutation'
import { TYPE_FILTER_OPTIONS } from '../../model/constants'
import type { Question } from '../../model/types'
import { QuestionItem } from '../components/QuestionItem'

export function QuestionTable({ courseId }: { courseId: string }) {
  const can = useCan()
  const list = useQuestionList(courseId)
  const m = useQuestionMutation(courseId)
  const [deleting, setDeleting] = useState<Question | null>(null)
  const { pagination: p } = list

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await m.deleteQuestion(deleting.id)
      setDeleting(null)
    } catch {
      /* toast đã hiển thị */
    }
  }

  if (list.isError) {
    return (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được câu hỏi"
          description={getErrorMessage(list.error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void list.refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          aria-label="Lọc loại câu hỏi"
          value={list.typeFilter}
          onChange={(e) => list.setTypeFilter(e.target.value)}
          options={TYPE_FILTER_OPTIONS}
          containerClassName="sm:w-52"
        />
        <SearchInput value={list.search} onChange={list.setQuestionSearch} placeholder="Tìm nội dung câu hỏi, đáp án..." className="w-full sm:w-80" />
      </div>

      {list.isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
      ) : list.items.length === 0 ? (
        <Card>
          <EmptyState
            icon={ListChecks}
            title={list.all.length === 0 ? 'Chưa có câu hỏi nào' : 'Không có câu hỏi phù hợp'}
            description={list.all.length === 0 ? 'Thêm từng câu hoặc nhập nhanh từ file Excel.' : 'Thử đổi loại câu hoặc từ khóa.'}
            action={
              list.all.length === 0 &&
              can('question-bank:create') && (
                <Button size="sm" leftIcon={<Plus />} onClick={list.openCreate}>
                  Thêm câu hỏi
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <>
          {list.items.map((q) => (
            <QuestionItem
              key={q.id}
              question={q}
              canEdit={can('question-bank:update')}
              canDelete={can('question-bank:delete')}
              onEdit={() => list.openEdit(q.id)}
              onDelete={() => setDeleting(q)}
            />
          ))}
          {p.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
              <span>
                Hiển thị {p.start}–{p.end} / {list.filteredCount} câu
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" leftIcon={<ChevronLeft />} disabled={!p.hasPrev} onClick={p.prev}>
                  Trước
                </Button>
                <span className="px-1 font-medium text-ink-soft">
                  {p.page}/{p.totalPages}
                </span>
                <Button size="sm" variant="secondary" rightIcon={<ChevronRight />} disabled={!p.hasNext} onClick={p.next}>
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Xóa câu hỏi?"
        message={deleting ? `Câu ${deleting.order} sẽ bị xóa khỏi ngân hàng. Bài làm đã nộp không bị ảnh hưởng.` : undefined}
        confirmText="Xóa câu hỏi"
        loading={m.isDeleting}
        onConfirm={confirmDelete}
      />
    </section>
  )
}