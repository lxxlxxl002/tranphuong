import type { ReactNode } from 'react'
import { ClipboardList, Pencil, Trash2 } from 'lucide-react'
import { CourseCover } from '@/features/my-courses'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { AdminCourse } from '../../model/types'
import { PublishBadge } from './PublishBadge'

function OverlayButton({ label, danger, onClick, children }: { label: string; danger?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-ink-soft shadow-sm ring-1 ring-black/5 transition hover:bg-white',
        danger ? 'hover:text-rose-600' : 'hover:text-brand-600'
      )}
    >
      {children}
    </button>
  )
}

interface AdminCourseCardProps {
  course: AdminCourse
  canEdit: boolean
  canDelete: boolean
  onEdit: () => void
  onDelete: () => void
  onManage: () => void
}

export function AdminCourseCard({ course, canEdit, canDelete, onEdit, onDelete, onManage }: AdminCourseCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-line bg-white shadow-card transition hover:shadow-pop">
      <div className="relative">
        <CourseCover course={course} className="h-[180px]" />
        {(canEdit || canDelete) && (
          <div className="absolute right-3 top-3 flex gap-1.5">
            {canEdit && (
              <OverlayButton label="Chỉnh sửa" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </OverlayButton>
            )}
            {canDelete && (
              <OverlayButton label="Xóa" danger onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </OverlayButton>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div>
          <PublishBadge status={course.status} />
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold uppercase leading-5 text-ink" title={course.title}>
          {course.title}
        </h3>
        <p className="mt-1 text-xs text-ink-muted">
          {course.lessonCount} bài học · {course.questionCount} câu hỏi · {course.enrollmentCount} học viên
        </p>
        <Button className="mt-4" variant="outline" fullWidth leftIcon={<ClipboardList />} onClick={onManage}>
          Quản lý bài học
        </Button>
      </div>
    </article>
  )
}

export function AdminCourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-card">
      <Skeleton className="h-[180px] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}